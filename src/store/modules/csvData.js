import db from '@/api/pouchDB'
import moment from "moment";

// TODO delete unessecary fields or map only necessary ones
// https://stackoverflow.com/questions/24440403/returning-only-certain-properties-from-an-array-of-objects-in-javascript
// https://stackoverflow.com/questions/18133635/javascript-remove-attribute-for-all-objects-in-array

const state = {
  salesForm: null,
  mentorVisit: null
};

const getters = {
    salesForm(state) {
    return state.salesForm;
    },
    mentorVisit(state) {
        return state.mentorVisit;
    },
};

// const mutations = {
//     salesForm(state, payload) {
//         state.salesForm = payload
//     },
// }

const actions = {
    salesForm({
        state
    }, payload) {
        var count = 0
        // TODO iterate through and create new object with only the dates in question and fields required.
        // TODO take away hardcoded date once monthpicker is used
        payload.forEach(function (item) {
            if(item.Date !== undefined && item.Date.includes("2018-07")) {
                console.log('​---------------------');
                console.log('​item.Date', item.Date);
                console.log('​---------------------');
                count ++
            }
        });
        
        state.salesForm = payload;
        console.log('​-----------------------------------------');
        console.log('​state.salesForm', state.salesForm);
        console.log('​-----------------------------------------');
    },
    mentorVisit({
        state
    }, payload) {
        state.mentorVisit = payload;
        console.log('​---------------------------------------');
        console.log('​state.mentorVisit', state.mentorVisit);
        console.log('​---------------------------------------');

    },
};

export default {
    state,
    getters,
    // mutations,
    actions,
}