import db from '@/api/pouchDB'
import moment from "moment";


const state = {
    csvFileAsJSON: null
};

const getters = {
    csvFileAsJSON(state) {
        return state.csvFileAsJSON
    }
}

// const mutations = {
//     csvFileAsJSON(state, payload) {
//         state.csvFileAsJSON = payload
//     },
// }

const actions = {
    csvFileAsJSON({
        state
    }, payload) {
        state.csvFileAsJSON = payload;
        console.log('​-----------------------------------------');
        console.log('​state.csvFileAsJSON', state.csvFileAsJSON);
        console.log('​-----------------------------------------');
    }
};

export default {
    state,
    getters,
    // mutations,
    actions,
}