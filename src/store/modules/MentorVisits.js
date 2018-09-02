import db from '@/api/pouchDB'

const state = {
    mentorVisits: null,
    commercialGardens: null,
    subsistenceGardens: null,
    countMentorVisits: null,
    countGrowersVisited: null,
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
    }
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
        console.log('​state.reportMonth', rootState.SeedlingSales.reportMonth);
        dispatch('receiveAllMentorVisits', payload)
        function imageObj(linkString) {
            if(linkString == "") {
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

        // Filter to include only the month in question
        const dateFilter = payload.filter(
            entry =>
            entry.Date !== undefined && entry.Date.includes(rootState.SeedlingSales.reportMonth)
        );
        console.log('​dateFilter', dateFilter);

        // Pull out only those columns we need
        const fieldMap = dateFilter.map(function (row) {
            
            return {
                date: row.Date,
                memberId: row.Member_id,
                gps: row.GPS,
                gardenName: row['Garden Name'],
                photos: 
                [ // TODO give this same struct as imageIndex array
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

        var commercialGardens = fieldMap.filter(
            entry =>
            entry.mentor !== undefined && entry.mentor == 'sabu'
        )
        console.log('​-----------------------');
        console.log('​commercial', commercialGardens);
        console.log('​-----------------------');

        state.commercialGardens = commercialGardens

        var subsistenceGardens = fieldMap.filter(
            entry =>
                entry.mentor !== undefined && entry.mentor == 'gabriel'
        )
        console.log('​-----------------------');
        console.log('subsistance', subsistenceGardens);
        console.log('​-----------------------');

        state.subsistenceGardens = subsistenceGardens

        var dataFormatForDB = {
            _id: rootState.SeedlingSales.reportMonth + "MentorVisits",
            mentorVisits: fieldMap
        }
        db.put(dataFormatForDB).then(response => console.log("dbResp", response))


        dispatch("growersVisited", fieldMap) // Send the fieldMap data to the action-function that must work out how many growers were visited, while this action-function carries on crunching down to number of mentorvisits in the month.

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
            this[a.date].values.push(a.memberId);  // if I chose I could push an object in here with any fields I want arranged by date.
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
        console.log('​uniquePerDay', uniquePerDay);

        state.countMentorVisits = uniquePerDay.length // The length of the array is basically the count of id's in the array.
    },
    growersVisited({
        state,
        dispatch
    }, fieldMap) {
        var allMembers = [] // as we iterate through the fieldMap, we'll push just the member Id's here.
        fieldMap.forEach(row => allMembers.push(row.memberId))
        var uniqueMembers = Array.from(new Set(allMembers)) // Not very readible (BAD Javascript! ) But creates a set of only unique elements.
        console.log('​uniqueMembers', uniqueMembers);
        state.countGrowersVisited = uniqueMembers.length
    }
}

export default {
    state,
    getters,
    actions
}