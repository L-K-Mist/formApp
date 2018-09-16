import db from '@/api/pouchDB'
import _ from 'lodash'
import {
    moment
} from 'moment';


// TODO Sometime: move these functions to a helpers file in helpers folder

async function findAttachment(docName, fileName) {
    try {
        var blobOrBuffer = await db.getAttachment(docName, fileName);
        return blobOrBuffer
    } catch (err) {
        console.log(err);
    }
}



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

const actions = { // If the file-name includes "mentorvisit" it is sent here
        // Must pivot to grouped months, then count each unique occurance of member id
        mentorVisits({
            rootState,
            dispatch
        }, payload) {
                      // console.log('​state.reportMonth', rootState.csvMailroom.reportMonth);
                      function imageObj(linkString) {
                        if (linkString == "") {
                          return "No Image";
                        } else {
                          var path = linkString;
                          var stringArray = linkString.match(/([^/])+/g);
                          var name = stringArray[stringArray.length - 1];
                          return { path, name };
                        }
                      }
                      console.log("payload length:", payload.length);
                      // Filter to include only the month in question
                      const dateFilter = payload.filter(entry => entry.Date !== undefined && entry.Date.includes(rootState.csvMailroom.reportMonth));
                      console.log("TCL: dateFilter.length", dateFilter.length);

                      // console.log('​dateFilter', dateFilter);

                      // Pull out only those columns we need
                      const fieldMap = dateFilter.map(
                        function(row) {
                          return {
                            date: row.Date,
                            memberId: row.Member_id,
                            gps: row.GPS,
                            gardenName: row["Garden Name"],
                            photos: [
                              imageObj(row.Picture1),
                              imageObj(row.Picture2),
                              imageObj(row.Picture3)
                            ],
                            name:
                              row["First Name"] +
                              " " +
                              row["Last Name"],
                            nationalId: row["SA ID Number"],
                            farmingActivity:
                              row["Farming Activity"],
                            memberArea: row["Member Area"],
                            mentor: row["username"]
                          };
                        }
                      );
                      state.mentorVisits = fieldMap;

                      var globalMonth = rootState.pouchFilter.docsObj["global/reportMonth"].month;
                      console.log("TCL: globalMonth", globalMonth);

                      var dataFormatForDB = { _id: globalMonth + "/MentorVisits", mentorVisits: fieldMap };


                      db.upsert(dataFormatForDB._id, function(doc){
                          if (!doc.count) {
                              doc.count = 0;
                          }
                          doc.count++;
                          doc.data = fieldMap
                          return doc
                      }).then(
                        response => {
                          console.log("dbResp", response); 
                        }
                      ).catch(function(err){
                      console.log('TCL: -------------');
                      console.log('TCL: err', err);
                      console.log('TCL: -------------');
                          
                      })
                      _.delay(() => { // a bit hackey. TODO make this properly async, not hacky
                          dispatch("splitByCommercial");
                        }, 500, "later");
                      // => Logs 'later' after one second.

                      // Effect a pivot that groups member id's per date as per https://stackoverflow.com/questions/40523257/how-do-i-pivot-an-array-of-objects-in-javascript

                      var dateGrouped = [];

                      fieldMap.forEach(function(a) {
                        // Go through each object in the array and let "a" be the name for the stuff ...

                        // check if date is not in hash table
                        if (!this[a.date]) {
                          // if not, create new object with date and values array
                          // and assign it with the date as hash to the hash table
                          this[a.date] = { date: a.date, values: [] };

                          // add the new object to the result set, too
                          dateGrouped.push(this[a.date]);
                        }

                        // create a new object with the other values and push it
                        // to the array of the object of the hash table
                        this[a.date].values.push(a.memberId); // if I chose I could push an object in here with any fields I want arranged by date.
                      }, Object.create(null)); // Object.create creates an empty object without prototypes

                      console.log(dateGrouped); // result of above: An array of objects grouped by date :)
                      var uniquePerDay = [];
                      // Iterate through the dates and remove duplicates from the profile id's
                      dateGrouped.forEach(function(object) {
                        // go through each object inside dateGrouped Array and...
                        var unique = Array.from(new Set(object.values)); // create temporary (nested) variable with only unique values.  That means if there's an array of three id's on a given day, but one is repeated; it will now be an array with only two.
                        // go through each value left in var unique and "post" them to the more public variable uniquePerDay.
                        unique.forEach(function(element) {
                          uniquePerDay.push(element);
                        });
                      });
                      // console.log('​uniquePerDay', uniquePerDay);

                      state.countMentorVisits = uniquePerDay.length; // The length of the array is basically the count of id's in the array.

                      var allMembers = []; // as we iterate through the fieldMap, we'll push just the member Id's here.
                      fieldMap.forEach(row =>
                        allMembers.push(row.memberId)
                      );
                      var uniqueMembers = Array.from(new Set(allMembers)); // Not very readible (BAD Javascript! ) But creates a set of only unique elements.
                      console.log("​uniqueMembers", uniqueMembers);
                      state.countGrowersVisited = uniqueMembers.length;
                    },
        splitByCommercial({
            rootState,
            state,
            dispatch
        }) {
            var reportMonth = rootState.csvMailroom.reportMonth;
            var docName = reportMonth + "/MentorVisits"
            //initialise reportMonth from value in db

            db.get(docName).then(function (doc) {
                console.log('TCL: -----------------------');
                console.log('TCL: doc.data', doc.data);
                console.log('TCL: -----------------------');
                var mentorVisits = doc.data
                
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
            }).catch(function (err) {
                console.log(err);
            });



            // .sort(function (obj1, obj2) {
            // return moment(obj1.date) - moment(obj2.date);
            // })
        },
        async saveMentorPhotos({
            rootState,
            state
        }, fromMentorVisitPics) {

            var attachments = fromMentorVisitPics;
            console.log('TCL: attachments', attachments);

            function arrayToObj(attachmentsArray) { // Turn attachments array of attachement-objects into attachment-objects nested in attachments object (how PouchDB wants it's attachements)
                var obj = {}
                attachmentsArray.forEach(element => {
                  obj[element.fileName] = { content_type: "image/jpeg", data: element.blob };
                });
                return obj
            }
            var attachmentsObj = arrayToObj(attachments)
            console.log('TCL: attachmentsObj', attachmentsObj);

            // TODO next nearly there just gotta turn this below to propper style
            try {
                var doc = {
                    "_id": "doc",
                    "title": "Legendary Hearts",
                    "_attachments": {
                        "att.txt": {
                            "content_type": "text/plain",
                            "data": new Blob(
                                ["And she's hooked to the silver screen"], {
                                    type: 'text/plain'
                                })
                        },
                        "att2.txt": {
                            "content_type": "text/plain",
                            "data": new Blob(
                                ["But the film is a saddening bore"], {
                                    type: 'text/plain'
                                })
                        },
                        "att3.txt": {
                            "content_type": "text/plain",
                            "data": new Blob(
                                ["For she's lived it ten times or more"], {
                                    type: 'text/plain'
                                })
                        }
                    }
                };
                var result = await db.put(doc);
            } catch (err) {
                console.log(err);
            }



            // db.get('MentorImagesCollection', {
            //     attachments: true
            // }).then(function (result) {
            //     console.log('TCL: result._rev,', result._rev, );
            //     return db.putAttachment(

            //         'allMentorImages', // TODO Sometime: String Interpolation
            //         attachment.fileName,
            //         result._rev,
            //         attachment.blob,
            //         'image/jpeg'
            //     );
            // }).then(function (result) {
            //     console.log('TCL: result', result);

            // }).catch(function (err) {
            //     console.log(err)
            // })

            // try {
            //     console.log('fromMentorVisitPics.forEach triggered inside try block')
            //     // var holderDoc = await db.put({
            //     //     _id: 'MentorImagesCollection',
            //     //     _attachments: {

            //     //     }
            //     // })
            //     // console.log('TCL: holderDoc', holderDoc);

            //     var doc = await db.get('MentorImagesCollection', {
            //         attachments: true
            //     })
            //     var result = doc => {}

            //     console.log('TCL: doc', doc);

            //     var result = await db.putAttachment(
            //         'allMentorImages', // TODO Sometime: String Interpolation
            //         [attachment.fileName],
            //         doc._rev,
            //         attachment.blob,
            //         'image/jpeg'
            //     );
            //     console.log('TCL: result', result);
            // } catch (err) {
            //     console.log(err);
            // }

        //}

        // var attachments = fromMentorVisitPics.map(function (blob) {
        //     return {
        //         [blob.fileName]: {
        //             "content_type": "image/jpeg",
        //             "data": blob.blob
        //         }
        //     }
        // })

        // async function saveAttachments(docName, fileName, blob, type) {

        // }

    },
    /**
     * 
     * TODO SOON: rewrite this so that instead of taking two arrays and correlating based on imageName, 
     * instead we iterate through - for example Commercial - and in each row, for each of the three images, we add a new attribute.
     * This attribute is called blob.  The blob is added to the image-attributes by way of db.getAttachment.
     */
    connectPhotos({  // 
        rootState,
        state
    }) {
        var reportMonth = rootState.csvMailroom.reportMonth
        var docName = reportMonth + "/photos"


 
        state.commercialThreePhotos = connectPhotos(photoIndex, state.commercialThreePhotos)
        state.subsistenceThreePhotos = connectPhotos(photoIndex, state.subsistenceThreePhotos)
        console.log('TCL: state.subsistenceThreePhotos', state.subsistenceThreePhotos);

        async function fetchBlob(docName, photoName) {
            db.getAttachment(docName, photoName).then(function(res){
            console.log('TCL: --------------------------');
            console.log('TCL: fetchBlob -> res', res);
            console.log('TCL: --------------------------');
            }).catch(function(err) {
            console.log('TCL: --------------------------');
            console.log('TCL: fetchBlob -> err', err);
            console.log('TCL: --------------------------'); 
            })
        }

        async function connectPhotos(photoIndex, visitsArray) {
            var photoReport = []
            for(const row of visitsArray) {
                var combo = []
                for (const photo of visitsArray.photos) {
                   var blob = fetchBlob(docName, photo.name)
                   combo.push(blob)
                }
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
            }
            return photoReport
        }


        var dataFormatForDB = {
            _id: globalMonth + "/PhotoVisits",
            commercial: state.commercialThreePhotos,
            nonCommercial: state.subsistenceThreePhotos
        }
        db.put(dataFormatForDB).then(response => {
            console.log("dbResp", response)
        }).catch(err => console.log(err))



    },
    OLD_connectPhotos({
        rootState,
        state
    }) {
        var photoIndex = rootState.pouchFilter.docsObj['2018-08/MentorPhotos'].fsImages // TODO take out hardcoded date Make a better plan for date state
        state.commercialThreePhotos = connectPhotos(photoIndex, state.commercialThreePhotos)
        state.subsistenceThreePhotos = connectPhotos(photoIndex, state.subsistenceThreePhotos)
        console.log('TCL: state.subsistenceThreePhotos', state.subsistenceThreePhotos);
        var globalMonth = rootState.csvMailroom.reportMonth


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