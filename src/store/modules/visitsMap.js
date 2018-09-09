import db from '@/api/pouchDB'
import moment from 'moment'

const state = {
   mapData : null,
   showMap: false
}
const getters = {
    mapData(state) {
        return state.mapData
    },
    showMap(state) {
        return state.showMap
    },
};
const actions = {
  mapReportData({ rootState, state, dispatch }, reportData) {
  console.log('TCL: --------------------------------------------');
  console.log('TCL: mapReportData -> reportData', reportData);
  console.log('TCL: --------------------------------------------');
    var goodGPS = reportData.map(function(row){
        var newGPS = row.gps.split(", ")
        return { 
            person: row.name,
            garden: row.gardenName, 
            area: row.memberArea,
            gps: newGPS
        };
    }).filter(function(row){
        return row.gps.length > 1  // Only show those rows that actually have a gps
    })
    console.log('TCL: --------------------------------------');
    console.log('TCL: mapReportData -> goodGPS', goodGPS);
    console.log('TCL: --------------------------------------');
    state.mapData = goodGPS 
    state.showMap = true
  }
};
export default {
    state,
    getters,
    actions
}