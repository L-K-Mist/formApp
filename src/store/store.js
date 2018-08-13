import Vue from 'vue'
import Vuex from 'vuex'
import Camera from './modules/camera'
import db from "@/api/pouchDB";
import SeedlingSales from './modules/SeedlingSales'
import MentorVisits from './modules/MentorVisits'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    showCameraDialog: false
  },
  getters: {
    showCameraDialog(state) {
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
      commit,
      state
    }, payload) {
      state.showCameraDialog = payload;
      console.log('​-----------------------------------------------');
      console.log('​state.showCameraDialog', state.showCameraDialog);
      console.log('​-----------------------------------------------');
    }
  },
  modules: {
    Camera,
    SeedlingSales,
    MentorVisits
  }
});