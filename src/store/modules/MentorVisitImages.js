import db from '@/api/pouchDB'
import moment from 'moment'

const state = {
    imageIndex: [],
    // photoReport: null
}
const getters = {
    // photoReport(state) {
    //     return state.photoReport
    // }
};
const actions = {
    processImageIndex({
        rootState,
        state,
        dispatch
    }, imageIndex) {
        state.imageIndex = imageIndex

        db.put({
            _id: rootState.csvMailroom.reportMonth + "/MentorPhotos",
            fsImages: imageIndex
        }).then(response => {
            console.log("dbResp", response)
            // dispatch("connectImagesToVisits")
        }).catch(function (err) {
            console.log(err);
        })
    },
    async connectImagesToVisits({
        rootState,
        state,
        dispatch
    }) {
        // rootState.csvMailroom.reportMonth = "2018-07"; // Hardcoded for now to avoid re-setting each time during dev-cycles.


        // let result = appointments.map(a => ({...patients.find(p => a.patientId === p.patientId), ...a}));
        var mentorVisits = await db.get(rootState.csvMailroom.reportMonth + "/MentorVisits")
        var mentorPhotos = await db.get(rootState.csvMailroom.reportMonth + "/MentorPhotos")


        // TODO SOLUTION: Think I need a forEach first bacause it's not the whole array I'm iterating  but each photos array in photoVisits, that needs to find it's photo.




        var photoVisits = mentorVisits.mentorVisits // visits with all three photos (note: count starts at [0])
            .filter(row => (row.photos[0] !== "No Image" && row.photos[1] !== "No Image" && row.photos[2] !== "No Image"))

        console.log('​-------------------------');
        console.log('​photoVisits', photoVisits);
        console.log('​-------------------------');
        // let result = appointments.map(a => ({...patients.find(p => a.patientId === p.patientId), ...a}));

        console.log(mentorPhotos.fsImages)
        var photoReport = []
        photoVisits.forEach(function (row) {
            var combo = row.photos.map(visitPhoto => ({
                ...mentorPhotos.fsImages.find(photoRow => visitPhoto.name == photoRow.name)
            }))
            var comboRow = {
                date: row.date,
                memberId: row.memberId,
                gps: row.gps,
                gardenName: row.gardenName,
                name: row.name,
                nationalId: row.nationalId,
                farmingActivity: row.farmingActivity,
                memberArea: row.memberArea,
                photos: combo
            };
            photoReport.push(comboRow)
        })
        photoReport.sort(function (obj1, obj2) {
            return moment(obj1.date) - moment(obj2.date);
        })

        state.photoReport = photoReport
        console.log("​-------------------------");
        console.log('photoReport', state.photoReport);
        console.log('​-------------------------');

        db.put({
            _id: rootState.csvMailroom.reportMonth + "PhotoReport_before",
            photo: state.imageIndex
        }).then(response => {
            console.log("dbResp", response)
            // dispatch("connectImagesToVisits")
        }).catch(function (err) {
            console.log(err);
        })
    }
}
export default {
    state,
    getters,
    actions
}