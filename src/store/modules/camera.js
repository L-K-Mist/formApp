import db from '@/api/pouchDB'
import moment from "moment";


const state = {
  selectedPic: null,

  showConnectDialog: false,

};

const getters = {
  showConnectDialog(state) {
    return state.showConnectDialog
  },
  selectedPic(state) {
    return state.selectedPic
  }
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
  },
  selectPic({
    state
  }, payload) {
    state.selectedPic = payload
  }
};

export default {
  state,
  getters,
  mutations,
  actions,
}