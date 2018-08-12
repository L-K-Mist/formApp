import db from '@/api/pouchDB'
import moment from "moment";

// TODO delete unessecary fields or map only necessary ones
// https://stackoverflow.com/questions/24440403/returning-only-certain-properties-from-an-array-of-objects-in-javascript
// https://stackoverflow.com/questions/18133635/javascript-remove-attribute-for-all-objects-in-array

const state = {
    reportMonth: null,
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
    reportMonth({
        state
    }, payload) {
        state.reportMonth = payload
        console.log('​-------------------------------------');
        console.log('​state.reportMonth', state.reportMonth);
        console.log('​-------------------------------------');        
    },
    salesForm({
        state
    }, payload) {
        var count = 0
        const reportFields = payload.filter(entry => 
            entry.Date !== undefined && entry.Date.includes(state.reportMonth)
        );
        const reportLength = reportFields.length
        console.log('​---------------------------');
        console.log('​reportLength', reportLength);
        console.log('​---------------------------');
        
        // TODO iterate through and create new object with only the dates in question and fields required.
        // payload.forEach(function (item) {
        //     if(item.Date !== undefined && item.Date.includes(state.reportMonth)) {
        //         console.log('​---------------------');
        //         console.log('​item.Date', item.Date);
        //         console.log('​---------------------');
        //         count ++
        //     }
        // });
        
        state.salesForm = payload;
        // console.log('​-----------------------------------------');
        // console.log('​state.salesForm', state.salesForm);
        // console.log('​-----------------------------------------');
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