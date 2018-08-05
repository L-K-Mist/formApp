import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    showCameraDialog: false
  },
  getters: {
    showCameraDialog(state){
      return state.showCameraDialog
    }
  },
  // mutations: {
  //   showCameraDialog({
  //     state
  //   }, payload) {
  //     state.showCameraDialog = payload
  //   }
  // },
  actions: {
    showCameraDialog({
      commit, state
    }, payload) {
      state.showCameraDialog = payload;
      console.log('​-----------------------------------------------');
      console.log('​state.showCameraDialog', state.showCameraDialog);
      console.log('​-----------------------------------------------');
    }
  }
});
