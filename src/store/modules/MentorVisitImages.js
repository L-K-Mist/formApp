import db from '@/api/pouchDB'

const state = {
    imageIndex: []
}

const actions = {
    processImageIndex({
        rootState,
        state,
        dispatch
    }, imageIndex) {
        state.imageIndex = imageIndex

        db.put({
            _id: rootState.SeedlingSales.reportMonth + "MentorPhotos",
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
         // let result = appointments.map(a => ({...patients.find(p => a.patientId === p.patientId), ...a}));
        var mentorVisits = await db.get(rootState.SeedlingSales.reportMonth + "MentorVisits")
        var mentorPhotos = await db.get(rootState.SeedlingSales.reportMonth + "MentorPhotos")

        
        
        // TODO SOLUTION: Think I need a forEach first bacause it's not the whole array I'm iterating  but each photos array in photoVisits, that needs to find it's photo.
            
                
                
 
        var photoVisits = mentorVisits.mentorVisits // visits with all three photos (note: count starts at [0])
        .filter(row => (row.photos[0] !== "No Image" && row.photos[1] !== "No Image" && row.photos[2] !== "No Image"))
        
        console.log('​-------------------------');
        console.log('​photoVisits', photoVisits);
        console.log('​-------------------------');
         // let result = appointments.map(a => ({...patients.find(p => a.patientId === p.patientId), ...a}));

         console.log(mentorPhotos.fsImages)

        photoVisits.forEach(function(row){
            var combo = row.photos.map(visitPhoto => ({
                ...mentorPhotos.fsImages.find(photoRow => visitPhoto.name == photoRow.name)
            }))
            console.log('​-------------');
            console.log('​combo', combo);
            console.log('​-------------');
            photoVisits.photos = combo
            
        })
        console.log('​-------------------------');
        console.log('​photoVisits', photoVisits);
        console.log('​-------------------------');
        
    }        
}    
export default {
    state,
    // getters,
    actions
}