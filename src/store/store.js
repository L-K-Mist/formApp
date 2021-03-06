import Vue from 'vue'
import Vuex from 'vuex'
import Camera from './modules/camera'
import SeedlingSales from './modules/SeedlingSales'
import MentorVisits from './modules/MentorVisits'
import CropUpdates from './modules/CropUpdates'
import ProduceSales from './modules/ProduceSales'
import pouchFilter from './modules/pouchFilter'
import csvMailroom from './modules/csvMailroom'
import visitsMap from './modules/visitsMap'

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
    MentorVisits,
    CropUpdates,
    ProduceSales,
    pouchFilter,
    csvMailroom,
    visitsMap
  }
});