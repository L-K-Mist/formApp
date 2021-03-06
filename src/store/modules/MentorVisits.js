import db from "@/api/pouchDB";
import _ from "lodash";
import { moment } from "moment";

function hasThreePhotos(array) {
  return array.filter(
    row =>
      row.photos[0] !== "No Image" &&
      row.photos[1] !== "No Image" &&
      row.photos[2] !== "No Image"
  );
}

function removeDuplicates(visitsArray) {
  //Function receives a visitsArray and returns a filtered array with the duplicates removed
  const _arr = [...visitsArray];
  // Donno if creating a string is preferred
  const isEqual = (a, b) =>
    a.date === b.date && a.gps === b.gps && a.name === b.name;
  const noDups = _arr.reduce((collection, obj) => {
    if (collection.findIndex(p => isEqual(p, obj)) < 0) {
      collection.push(obj);
    }
    return collection;
  }, []);
  return noDups;
}

function removeDuplicatesFilter(visitsArray) {
  //Function receives a visitsArray and returns a filtered array with the duplicates removed
  const _arr = [...visitsArray];
  const _filtered = _arr.filter((el, index, array) => {
    // Goes through the array/list of objects and creates a new list only of the el-ements where the code below returns true
    let count = 0;
    array.forEach(element => {
      // Take the element we have "in hand" that is: el and again iterate through the same array/list to see which other elements/objects of the list have the same date and gps and name as the item we looking for.
      if (
        el.date == element.date &&
        el.gps == element.gps &&
        el.name == element.name
      ) {
        count++; // If the above is true, increase the counter.  Of course the above "if" will be true at least once for every element checked <-- because it is an element of the array being checked.
      }
    });
    if (count > 1) {
      // If there's more than one of you, don't include this one.  So in essence we're telling the filter to keep only the last remaining occurrance with that date, gps, and name.
      return false;
    } else {
      return true; // You are the last of your kind...  you may proceed.
    }
  });

  return _filtered; // When all that filtering work is done return the filtered array.
}

function removeDuplicatesLodash(visitsArray) {
  return _.uniqBy(visitsArray, x => x.date && x.gps && x.name);
}

function connectPhotos(photoIndex, visitsArray) {
  var photoReport = [];
  visitsArray.forEach(function(row) {
    var combo = row.photos.map(visitPhoto => ({
      ...photoIndex.find(photoRow => visitPhoto.name == photoRow.name)
    }));
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
    photoReport.push(comboRow);
  });
  return photoReport;
}

const state = {
  mentorVisits: null,
  imageIndex: null,
  countMentorVisits: null,
  countGrowersVisited: null,
  commercialVisits: null,
  nonCommercialVisits: null,
  commercialThreePhotos: null,
  subsistenceThreePhotos: null,
  photoReport: null
};

const getters = {
  mentorVisits(state) {
    return state.mentorVisits;
  },
  countMentorVisits(state) {
    return state.countMentorVisits;
  },
  countGrowersVisited(state) {
    return state.countGrowersVisited;
  },
  commercialVisits(state) {
    return state.commercialVisits;
  },
  nonCommercialVisits(state) {
    return state.nonCommercialVisits;
  },
  commercialThreePhotos(state) {
    return state.commercialThreePhotos;
  },
  subsistenceThreePhotos(state) {
    return state.subsistenceThreePhotos;
  },
  photoReport(state) {
    return state.photoReport;
  }
};
/**TODO: REMOVE DUPLICATES 
 * Using underScore.js: 
 *     var arr = ['a','b','c','a','b']
    console.log('unique array is ',_.uniq(arr))
 * 
 */
const actions = {
  // If the file-name includes "mentorvisit" it is sent here
  // Must pivot to grouped months, then count each unique occurance of member id
  processImageIndex({ rootState, state, dispatch }, imageIndex) {
    state.imageIndex = imageIndex;

    db.put({
      _id: rootState.csvMailroom.reportMonth + "/MentorPhotos",
      fsImages: imageIndex
    })
      .then(response => {
        console.log("dbResp", response);
        // dispatch("connectImagesToVisits")
      })
      .catch(function(err) {
        console.log(err);
      });
  },

  async mentorVisits({ rootState, dispatch }, payload) {
    console.log("heres the payload", payload);
    // console.log('​state.reportMonth', rootState.csvMailroom.reportMonth);
    function givePhotosNameAndPath(linkString) {
      if (linkString == "") {
        return "No Image";
      } else {
        var path = linkString;
        var stringArray = linkString.match(/([^/])+/g);
        var name = stringArray[stringArray.length - 1];
        return {
          path,
          name
        };
      }
    }
    console.log("payload date is", payload[0].Date);
    console.log(
      "rootState.csvMailroom.reportMonth",
      rootState.csvMailroom.reportMonth
    );

    // console.log('payload length:', payload.length)
    // Filter to include only the month in question
    const dateFilter = payload.filter(
      entry =>
        entry.Date !== undefined &&
        entry.Date.includes(rootState.csvMailroom.reportMonth)
    );
    // console.log('TCL: dateFilter.length', dateFilter.length);

    console.log("​dateFilter", dateFilter);

    // Pull out only those columns we need
    const fieldMap = dateFilter.map(function(row) {
      return {
        date: row.Date,
        memberId: row.Member_id,
        gps: row.GPS,
        gardenName: row["Garden Name"],
        photos: [
          // TODO give this same struct as imageIndex array
          givePhotosNameAndPath(row.Picture1),
          givePhotosNameAndPath(row.Picture2),
          givePhotosNameAndPath(row.Picture3)
        ],
        name: row["First Name"] + " " + row["Last Name"],
        nationalId: row["SA ID Number"],
        farmingActivity: row["Farming Activity"],
        memberArea: row["Member Area"],
        mentor: row["username"]
      };
    });
    state.mentorVisits = fieldMap;
    console.log("state.mentorVisits", state.mentorVisits);

    var globalMonth = rootState.csvMailroom.reportMonth;
    var docName = globalMonth + "/MentorVisits";

    try {
      var doc = await db.upsert(docName, function(doc) {
        // using upsert lib from https://github.com/pouchdb/upsert#dbupsertdocid-difffunc--callback
        if (!doc.count) {
          doc.count = 0;
        }
        doc.count++;
        doc.data = fieldMap;
        return doc;
      });
    } catch (err) {
      console.log("TCL: }catch -> err", err);
    }

    // dispatch('splitByCommercial');

    // Effect a pivot that groups member id's per date as per https://stackoverflow.com/questions/40523257/how-do-i-pivot-an-array-of-objects-in-javascript

    var dateGrouped = [];

    fieldMap.forEach(function(a) {
      // Go through each object in the array and let "a" be the name for the stuff ...

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
    fieldMap.forEach(row => allMembers.push(row.memberId));
    var uniqueMembers = Array.from(new Set(allMembers)); // Not very readible (BAD Javascript! ) But creates a set of only unique elements.
    console.log("​uniqueMembers", uniqueMembers);
    state.countGrowersVisited = uniqueMembers.length;
  },
  splitByCommercial({ rootState, state, dispatch }) {
    var globalMonth = rootState.csvMailroom.reportMonth;
    var mentorVisits =
      rootState.pouchFilter.docsObj[globalMonth + "/MentorVisits"];
    console.log("TCL: -------------------------------");
    console.log("TCL: mentorVisits", mentorVisits);
    console.log("TCL: -------------------------------");
    // console.log('TCL: globalMonth + "/MentorVisits"', globalMonth + "/MentorVisits");
    // Commercial_more_than_1000sqm
    var commercialGardens = mentorVisits.data.filter(
      entry =>
        entry.farmingActivity !== undefined &&
        entry.farmingActivity == "Commercial_more_than_1000sqm"
    );
    console.log("​-----------------------");
    console.log("​commercial", commercialGardens);
    console.log("​-----------------------");

    state.commercialVisits = commercialGardens;

    var commercialThreePhotos = hasThreePhotos(commercialGardens);
    state.commercialThreePhotos = removeDuplicates(commercialThreePhotos);
    console.log("TCL: commercialThreePhotos", commercialThreePhotos);
    var subsistenceGardens = mentorVisits.data.filter(
      entry =>
        entry.farmingActivity !== undefined &&
        entry.farmingActivity !== "Commercial_more_than_1000sqm"
    );
    console.log("​-----------------------");
    console.log("subsistance", subsistenceGardens);
    console.log("​-----------------------");

    state.nonCommercialVisits = subsistenceGardens;
    var subsistenceThreePhotos = hasThreePhotos(subsistenceGardens);
    state.subsistenceThreePhotos = removeDuplicates(subsistenceThreePhotos);
    console.log("TCL: subsistenceThreePhotos", subsistenceThreePhotos);

    // .sort(function (obj1, obj2) {
    // return moment(obj1.date) - moment(obj2.date);
    // })
  },
  async connectPhotos({ rootState, state }) {
    var globalMonth = rootState.csvMailroom.reportMonth;
    var photoIndex =
      rootState.pouchFilter.docsObj[
        rootState.csvMailroom.reportMonth + "/MentorPhotos"
      ].fsImages; // TODO take out hardcoded date Make a better plan for date state
    state.commercialThreePhotos = connectPhotos(
      photoIndex,
      state.commercialThreePhotos
    );
    state.subsistenceThreePhotos = connectPhotos(
      photoIndex,
      state.subsistenceThreePhotos
    );
    console.log(
      "TCL: state.subsistenceThreePhotos",
      state.subsistenceThreePhotos
    );

    var docName = globalMonth + "/MentorVisits";

    try {
      var doc = await db.upsert(docName, function(doc) {
        // using upsert lib from https://github.com/pouchdb/upsert#dbupsertdocid-difffunc--callback
        if (!doc.count) {
          doc.count = 0;
        }
        doc.count++;
        doc.commercial = state.commercialThreePhotos;
        doc.nonCommercial = state.subsistenceThreePhotos;
        return doc;
      });
    } catch (err) {
      console.log("TCL: }catch -> err", err);
    }
    console.log("TCL: doc", doc);
  },
  photoReport({ state }, watchedVal) {
    state.photoReport = watchedVal;
  }
};

export default {
  state,
  getters,
  actions
};

/**
 * 
Hey peeps, I know it's Friday and all, but I'm having a real Javascript Phone-a-Friend moment.  I've got a Real-World array of objects and I want to remove semi-duplicates based on three fields.  As in: 

If there's an object with the same date, gps, and name as other objects keep only one - even if some other fields (particularly timestamp) are not the same, still keep just one.

The closest solutions I find look something like this one
```function removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
}```

But can't seem to wrap my head around checking for three props.
 */
