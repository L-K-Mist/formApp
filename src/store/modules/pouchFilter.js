import _ from 'lodash'
import db from '@/api/pouchDB'

var docs = [];

function imageObj(linkString) {
    if (linkString == "" || linkString == null) {
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

function binarySearch(arr, docId) {
    var low = 0, high = arr.length, mid;
    while (low < high) {
        mid = (low + high) >>> 1; // faster version of Math.floor((low + high) / 2)
        arr[mid]._id < docId ? low = mid + 1 : high = mid
    }
    return low;
}

function onDeleted(id) {
    var index = binarySearch(docs, id);
    var doc = docs[index];
    if (doc && doc._id === id) {
        docs.splice(index, 1);
    }
}

function onUpdatedOrInserted(newDoc) {
    var index = binarySearch(docs, newDoc._id);
    var doc = docs[index];
    if (doc && doc._id === newDoc._id) { // update
        docs[index] = newDoc;
    } else { // insert
        docs.splice(index, 0, newDoc);
    }
}

function fetchInitialDocs() {
    return db.allDocs({ include_docs: true }).then(function (res) {
        docs = res.rows.map(function (row) { return row.doc; });
        console.log('TCL: -----------------------------------');
        console.log('TCL: fetchInitialDocs -> docs', docs);
        console.log('TCL: -----------------------------------');
        
        //renderDocs();
    });
}

function reactToChanges() {
    db.changes({ live: true, since: 'now', include_docs: true }).on('change', function (change) {
        if (change.deleted) {
            // change.id holds the deleted id
            onDeleted(change.id);
        } else { // updated/inserted
            // change.doc holds the new doc
            onUpdatedOrInserted(change.doc);
        }
        renderDocs();
    }).on('error', console.log.bind(console));
}

fetchInitialDocs()
  .then(reactToChanges)
  .catch(console.log.bind(console));

const state = {
    docs,
  rawMentorVisits: null,  
  commercialVisits: null,
  nonCommercialVisits: null,
  agriActivityFilter: null
};

const getters = {
    commercialVisits(state) {
        return state.commercialVisits
    },
    nonCommercialVisits(state) {
        return state.nonCommercialVisits
    },
    docs(state) {
        return state.docs
    }
}

const actions = {
  agriActivityFilter({ state }, payload) {
    state.agriActivityFilter = payload;
  },

  async receiveAllMentorVisits({ state, rootState, dispatch }) {
      if (rootState.csvMailroom.reportMonth !== null) {
          state.rawMentorVisits = await db.get(
              rootState.csvMailroom.reportMonth + "MentorVisits"
          );
          console.log('TCL: --------------------------------------------------------------------------------');
          console.log('TCL: asyncreceiveAllMentorVisits -> state.rawMentorVisits', state.rawMentorVisits.mentorVisits);
          console.log('TCL: --------------------------------------------------------------------------------');
          dispatch("removeDuplicates", state.rawMentorVisits.mentorVisits);
      } else {
          console.log("I don't know what month we're planning for")
      }
    
    // const fewerFields = state.rawMentorVisits.mentorVisits.map(function(row) {
    //     return {
    //         date: row.Date,
    //         memberId: row.Member_id,
    //         gps: row.GPS,
    //         gardenName: row["Garden Name"],
    //         photos: [
    //             // TODO give this same struct as imageIndex array
    //             imageObj(row.Picture1),
    //             imageObj(row.Picture2),
    //             imageObj(row.Picture3)
    //         ],
    //         name: row["First Name"] + " " + row["Last Name"],
    //         nationalId: row["SA ID Number"],
    //         farmingActivity: row["Farming Activity"],
    //         memberArea: row["Member Area"],
    //         mentor: row["username"]
    //     };
    // });
    // console.log('TCL: ------------------------------------------------------------');
    // console.log('TCL: asyncreceiveAllMentorVisits -> fewerFields', fewerFields);
    // console.log('TCL: ------------------------------------------------------------');
    // var dataFormatForDB = {
        //   _id: rootState.csvMailroom.reportMonth + "MentorVisits",
        //   mentorVisits: fewerFields
        // };
        // db.put(dataFormatForDB).then(response => console.log("dbResp", response));
    },
    
    removeDuplicates({ state, dispatch }, payload) {
      // This removes the entries with the same date, gps, and photos
      var noDuplicates = _.uniqBy(
        payload,
        x => x.date && x.gps && x.name
      );
      console.log("TCL: -------------------------------");
      console.log("TCL: noDuplicates", noDuplicates);
      console.log("TCL: -------------------------------");
      dispatch("splitByActivity", noDuplicates)
    },

    splitByActivity(
    {
      // activated by activity drop-down
      state
    },
    payload
  ) {
    // The `_.property` iteratee shorthand.
    // _.partition(users, { 'age': 1, 'active': false });
    var splitByActivity = _.partition(payload, { mentor: "sabu" });

    state.commercialVisits = splitByActivity[0];
    console.log('TCL: ---------------------------------------------------');
    console.log('TCL: state.commercialVisits', state.commercialVisits);
    console.log('TCL: ---------------------------------------------------');
    state.nonCommercialVisits = splitByActivity[1];
    console.log('TCL: ---------------------------------------------------------');
    console.log('TCL: state.nonCommercialVisits', state.nonCommercialVisits);
    console.log('TCL: ---------------------------------------------------------');


  },

  hasThreePhotos({ state }, payload) {
    var hasThreePhotos = payload.filter(
      row =>
        row.photos[0] !== "No Image" &&
        row.photos[1] !== "No Image" &&
        row.photos[2] !== "No Image"
    );
  },

  // connectImages({
  //     state
  // }, payload){

  // },
};

export default {
    state,
    getters,
    actions
}