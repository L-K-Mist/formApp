import _ from 'lodash'
import db from '@/api/pouchDB'

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



const state = {
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
    }
}

const actions = {
  agriActivityFilter({ state }, payload) {
    state.agriActivityFilter = payload;
  },

  async receiveAllMentorVisits({ state, rootState, dispatch }) {
    state.rawMentorVisits = await db.get(
        rootState.csvMailroom.reportMonth + "MentorVisits"
    );
    console.log('TCL: --------------------------------------------------------------------------------');
    console.log('TCL: asyncreceiveAllMentorVisits -> state.rawMentorVisits', state.rawMentorVisits.mentorVisits);
    console.log('TCL: --------------------------------------------------------------------------------');
    
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
    dispatch("removeDuplicates", state.rawMentorVisits.mentorVisits);
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