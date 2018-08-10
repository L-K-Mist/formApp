import Vue from 'vue'
import Vuex from 'vuex'
import csvImport from './csvImport'

const store = new Vuex.Store({
  modules: {
    csvImport
  }
})

export default store
