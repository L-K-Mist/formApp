import db from '@/api/pouchDB'
import moment from 'moment'

const state = {
   mapData : null
}
const getters = {
    // photoReport(state) {
    //     return state.photoReport
    // }
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
  }
};
export default {
    state,
    getters,
    actions
}