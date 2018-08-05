import db from '@/api/pouchDB'
import moment from "moment";


const state = {
  showConnectDialog: false,
  heaterLeft: {
    name: "Left Inlet",
    targetTemp: 60,
    actualTemp: 25,
    fanOn: false
  },
  rawActualTemps: [],
  rawTargetTemps: [], // TODO flesh out below
  rawSwitchStates: [] // TODO flesh out below
};

const getters = {
  showConnectDialog(state) {
    return state.showConnectDialog
  },
}

const mutations = {
  showConnectDialog(state, payload) {
    state.showConnectDialog = payload
  },
}

const actions = {
  // General Or Combined Actions
  //=====================================
  showConnectDialog({ commit }, payload) {
    commit("showConnectDialog", payload);
  },
  captureImage({
    state
  }, payload) {
    state.imageBlob = payload
    // console.log('​---------------------------------');
    // console.log('​state.imageBlob', state.imageBlob);
    // console.log('​---------------------------------');
    state.imageUrl = URL.createObjectURL(payload);
  }
};

export default {
  state,
  getters,
  mutations,
  actions,
}