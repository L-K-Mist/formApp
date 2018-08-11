import db from '@/api/pouchDB'
import moment from "moment";


const state = {
    csvFile: null
};

const getters = {
    csvFile(state) {
        return state.csvFile
    }
}

const mutations = {
    csvFile(state, payload) {
        state.csvFile = payload
    },
}

const actions = {
    csvFile({
        state
    }, payload) {
        state.csvFile = payload;
    }
};

export default {
    state,
    getters,
    mutations,
    actions,
}