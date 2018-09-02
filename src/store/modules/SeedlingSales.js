import db from '@/api/pouchDB'
import moment from "moment";
import {
  totalmem
} from 'os';

// TODO delete unessecary fields or map only necessary ones
// https://stackoverflow.com/questions/24440403/returning-only-certain-properties-from-an-array-of-objects-in-javascript
// https://stackoverflow.com/questions/18133635/javascript-remove-attribute-for-all-objects-in-array

const state = {
  // docsReceived: [], depricate

  salesForm: null,
  // mentorVisit: null, depricate
  seedlingSum: null,
  supportedGrowersCount: null,
  plantedArea: null,
  cropYield: null,
  cropValue: null
};

const getters = {

  seedlingSum(state) {
    return state.seedlingSum
  },
  supportedGrowersCount(state) {
    return state.supportedGrowersCount
  },
  salesForm(state) {
    return state.salesForm;
  },
  plantedArea(state) {
    return state.plantedArea;
  },
  cropYield(state) {
    return state.cropYield;
  },
  cropValue(state) {
    return state.cropValue;
  },
};


const actions = {
  /**
 * Below is a rough formula I use to estimate yields/values from seedlings/M2/ kgs.

Seedling Sale (memsalesformfull_export)
#seedlings /12 (to get m2) x 4.5 (to get est. yield in kg) x R10 (to get R value of seedling if successfully grown)



Produce Purchases (memproducesalefull_export)
This has no formula as these capture kg and R value as actuals not estimates.  But will start updating this form to catch up to July/Aug 2018 - but is usable as is right now to set up I think.

Mentor Visit  (memmentorvisitfull_export)
This has no data other than it's a proof that he was there - as pics and gps were captured - so only need to extract no. of visits in any given month (taken from main form (not in-line activity form).

Hope this helps.  Enjoy your day with fam.
 */


  salesForm({
    state,
    rootState,
    dispatch
  }, allSales) {
  // // // console.log('TCL: -----------------------');
  // // // console.log('TCL: allSales', allSales);
  // // // console.log('TCL: -----------------------');
    
    // Takes the JSON of the csv and simplifies it to the essentials
    const dateFilter = allSales.filter(
      entry =>
        entry.Date !== undefined && entry.Date.includes(rootState.csvMailroom.reportMonth)
    );
    console.log('​salesForm -> dateFilter', dateFilter);


    const fieldMap = dateFilter.map(function (row) {
      return {
        date: row.Date,
        seedlingsDistributed: Number(row["Total Recieved"], 10),
        gardenId: row.Garden_id,
        profileId: row["profile id"],
        memberUid: row["Member UID"]
      };
    });

    // console.log("​-------------------");
    // console.log("​fieldMap", fieldMap);
    // console.log("​-------------------");

    state.salesForm = fieldMap;
    // console.log("​-----------------------------------------");
    // console.log("​state.salesForm", state.salesForm);
    // console.log("​-----------------------------------------");
    
    dispatch("seedlingsSold", fieldMap);
    dispatch("supportedGrowersCount", fieldMap);
  },

  seedlingsSold({
    state,
    dispatch
  }, payload) {
    state.seedlingSum = payload.reduce(
      (total, row) => total + row.seedlingsDistributed,
      0
    );
    dispatch("plantedArea", state.seedlingSum)

    console.log("​-------------------------");
    console.log("​seedlingSum", state.seedlingSum);
    console.log("​-------------------------");

  },
  supportedGrowersCount({
    state
  }, payload) {
    var growerArray = payload.map(row => row.profileId);
    var uniqueItems = Array.from(new Set(growerArray));
    var uniqueItemsCount = uniqueItems.length;
    console.log("​-----------------------------------");
    console.log("​uniqueItemsCount", uniqueItemsCount);
    console.log("​-----------------------------------");
    state.supportedGrowersCount = uniqueItemsCount;
  },
  plantedArea({
    state
  }, payload) {
    state.plantedArea = Math.round(payload / 12)

    state.cropYield = (state.plantedArea * 4.5 / 1000).toFixed(2)

    state.cropValue = Math.round(state.cropYield * 10)
    console.log('​---------------------------------');
    console.log('​state.cropValue', state.cropValue);
    console.log('​---------------------------------');

  }
  /**
   * Seedling Sale (memsalesformfull_export)
#seedlings /12 (to get m2) x 4.5 (to get est. yield in kg) x R10 (to get R value of seedling if successfully grown)
   */
};

export default {
  state,
  getters,
  // mutations,
  actions,
}