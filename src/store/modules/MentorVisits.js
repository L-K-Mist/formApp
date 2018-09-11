import db from '@/api/pouchDB'
import _ from 'lodash'
import {
    moment
} from 'moment';

function hasThreePhotos(array) {
    return array.filter(
        row =>
        row.photos[0] !== "No Image" &&
        row.photos[1] !== "No Image" &&
        row.photos[2] !== "No Image"
    );
}

function removeDuplicates(visitsArray) {
    return _.uniqBy(
        visitsArray,
        x => x.date && x.gps && x.name
    );
}

function connectPhotos(photoIndex, visitsArray) {
    var photoReport = []
    visitsArray.forEach(function (row) {
        var combo = row.photos.map(visitPhoto => ({
            ...photoIndex.find(photoRow => visitPhoto.name == photoRow.name)
        }))
        var comboRow = {
            date: row.date,
            memberId: row.memberId,
            gps: row.gps,
            gardenName: row.gardenName,
            name: row.name,
            nationalId: row.nationalId,
            farmingActivity: row.farmingActivity,
            memberArea: row.memberArea,
            photos: combo
        };
        photoReport.push(comboRow)
    })
    return photoReport
}

const state = {
    mentorVisits: null,
    countMentorVisits: null,
    countGrowersVisited: null,
    commercialVisits: null,
    nonCommercialVisits: null,
    commercialThreePhotos: null,
    subsistenceThreePhotos: null,
    photoReport: null,
}

const getters = {
    mentorVisits(state) {
        return state.mentorVisits
    },
    countMentorVisits(state) {
        return state.countMentorVisits
    },
    countGrowersVisited(state) {
        return state.countGrowersVisited
    },
    commercialVisits(state) {
        return state.commercialVisits
    },
    nonCommercialVisits(state) {
        return state.nonCommercialVisits
    },
    commercialThreePhotos(state) {
        return state.commercialThreePhotos
    },
    subsistenceThreePhotos(state) {
        return state.subsistenceThreePhotos
    },
    photoReport(state) {
        return state.photoReport
    },
}
/**TODO: REMOVE DUPLICATES 
 * Using underScore.js: 
 *     var arr = ['a','b','c','a','b']
    console.log('unique array is ',_.uniq(arr))
 * 
 */
const actions = { // If the file-name includes "mentorvisit" it is sent here
    // Must pivot to grouped months, then count each unique occurance of member id
    mentorVisits({
        rootState,
        dispatch
    }, payload) {
        // console.log('​state.reportMonth', rootState.csvMailroom.reportMonth);
        function imageObj(linkString) {
            if (linkString == "") {
                return "No Image"
            } else {
                var path = linkString
                var stringArray = linkString.match(/([^/])+/g);
                var name = stringArray[stringArray.length - 1];
                return {
                    path,
                    name
                }
            }
        }
        console.log('payload length:', payload.length)
        // Filter to include only the month in question
        const dateFilter = payload.filter(
            entry =>
            entry.Date !== undefined && entry.Date.includes(rootState.csvMailroom.reportMonth)
        );
        console.log('TCL: dateFilter.length', dateFilter.length);


        // console.log('​dateFilter', dateFilter);

        // Pull out only those columns we need
        const fieldMap = dateFilter.map(function (row) {

            return {
                date: row.Date,
                memberId: row.Member_id,
                gps: row.GPS,
                gardenName: row['Garden Name'],
                photos: [ // TODO give this same struct as imageIndex array
                    imageObj(row.Picture1),
                    imageObj(row.Picture2),
                    imageObj(row.Picture3),
                ],
                name: row['First Name'] + ' ' + row['Last Name'],
                nationalId: row['SA ID Number'],
                farmingActivity: row['Farming Activity'],
                memberArea: row['Member Area'],
                mentor: row['username']
            };
        });
        state.mentorVisits = fieldMap

        var globalMonth = rootState.pouchFilter.docsObj['global/reportMonth'].month
        console.log('TCL: globalMonth', globalMonth);

        var dataFormatForDB = {
            _id: globalMonth + "/MentorVisits",
            mentorVisits: fieldMap
        }
        db.put(dataFormatForDB).then(response => {
                console.log("dbResp", response)
            }

        )
        _.delay(() => {
            dispatch('splitByCommercial');
        }, 500, 'later');
        // => Logs 'later' after one second.

        // Effect a pivot that groups member id's per date as per https://stackoverflow.com/questions/40523257/how-do-i-pivot-an-array-of-objects-in-javascript

        var dateGrouped = [];

        fieldMap.forEach(function (a) { // Go through each object in the array and let "a" be the name for the stuff ...

            // check if date is not in hash table
            if (!this[a.date]) {

                // if not, create new object with date and values array
                // and assign it with the date as hash to the hash table
                this[a.date] = {
                    date: a.date,
                    values: []
                };



                // add the new object to the result set, too
                dateGrouped.push(this[a.date]);
            }

            // create a new object with the other values and push it
            // to the array of the object of the hash table
            this[a.date].values.push(a.memberId); // if I chose I could push an object in here with any fields I want arranged by date.
        }, Object.create(null)); // Object.create creates an empty object without prototypes

        console.log(dateGrouped); // result of above: An array of objects grouped by date :)
        var uniquePerDay = []
        // Iterate through the dates and remove duplicates from the profile id's
        dateGrouped.forEach(function (object) { // go through each object inside dateGrouped Array and... 
            var unique = Array.from(new Set(object.values)) // create temporary (nested) variable with only unique values.  That means if there's an array of three id's on a given day, but one is repeated; it will now be an array with only two.
            // go through each value left in var unique and "post" them to the more public variable uniquePerDay.
            unique.forEach(function (element) {
                uniquePerDay.push(element)
            })
        })
        // console.log('​uniquePerDay', uniquePerDay);

        state.countMentorVisits = uniquePerDay.length // The length of the array is basically the count of id's in the array.

        var allMembers = [] // as we iterate through the fieldMap, we'll push just the member Id's here.
        fieldMap.forEach(row => allMembers.push(row.memberId))
        var uniqueMembers = Array.from(new Set(allMembers)) // Not very readible (BAD Javascript! ) But creates a set of only unique elements.
        console.log('​uniqueMembers', uniqueMembers);
        state.countGrowersVisited = uniqueMembers.length


    },
    splitByCommercial({
        rootState,
        state,
        dispatch
    }) {
        var globalMonth = rootState.pouchFilter.docsObj['global/reportMonth'].month
        var mentorVisits = rootState.pouchFilter.docsObj[globalMonth + "/MentorVisits"].mentorVisits
        console.log('TCL: -------------------------------');
        console.log('TCL: mentorVisits', mentorVisits);
        console.log('TCL: -------------------------------');
        // console.log('TCL: globalMonth + "/MentorVisits"', globalMonth + "/MentorVisits");
        // Commercial_more_than_1000sqm
        var commercialGardens = mentorVisits.filter(
            entry =>
            entry.farmingActivity !== undefined && entry.farmingActivity == 'Commercial_more_than_1000sqm'
        )
        console.log('​-----------------------');
        console.log('​commercial', commercialGardens);
        console.log('​-----------------------');

        state.commercialVisits = commercialGardens

        var commercialThreePhotos = hasThreePhotos(commercialGardens)
        state.commercialThreePhotos = removeDuplicates(commercialThreePhotos)
        console.log('TCL: commercialThreePhotos', commercialThreePhotos);
        var subsistenceGardens = mentorVisits.filter(
            entry =>
            entry.farmingActivity !== undefined && entry.farmingActivity !== 'Commercial_more_than_1000sqm'
        )
        console.log('​-----------------------');
        console.log('subsistance', subsistenceGardens);
        console.log('​-----------------------');

        state.nonCommercialVisits = subsistenceGardens
        var subsistenceThreePhotos = hasThreePhotos(subsistenceGardens)
        state.subsistenceThreePhotos = removeDuplicates(subsistenceThreePhotos)
        console.log('TCL: subsistenceThreePhotos', subsistenceThreePhotos);


        // .sort(function (obj1, obj2) {
        // return moment(obj1.date) - moment(obj2.date);
        // })
    },
    connectPhotos({
        rootState,
        state
    }) {
        var photoIndex = rootState.pouchFilter.docsObj['2018-08/MentorPhotos'].fsImages // TODO take out hardcoded date Make a better plan for date state
        state.commercialThreePhotos = connectPhotos(photoIndex, state.commercialThreePhotos)
        state.subsistenceThreePhotos = connectPhotos(photoIndex, state.subsistenceThreePhotos)
        console.log('TCL: state.subsistenceThreePhotos', state.subsistenceThreePhotos);
        var globalMonth = rootState.pouchFilter.docsObj['global/reportMonth'].month


        var dataFormatForDB = {
            _id: globalMonth + "/PhotoVisits",
            commercial: state.commercialThreePhotos,
            nonCommercial: state.subsistenceThreePhotos
        }
        db.put(dataFormatForDB).then(response => {
            console.log("dbResp", response)
        }).catch(err => console.log(err))



    },
    photoReport({
        state
    }, watchedVal) {
        state.photoReport = watchedVal
    }
}

export default {
    state,
    getters,
    actions
}