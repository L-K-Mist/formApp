import _ from 'lodash'

function imageObj(linkString) {
    if (linkString == "" || linkString == null) {
        return "No Image"
    } else {
        var path = linkString
        var stringArray = linkString.match(/([^/])+/g);
        var name = stringArray[stringArray.length - 1];
        return {
            path,
            name
        }
    }
}


const state = {
    commercialVisits: null,
    nonCommercialVisits: null,
    

}

const getters = {
    commercialVisits(state) {
        return state.commercialVisits
    },
    nonCommercialVisits(state) {
        return state.nonCommercialVisits
    }
}

const actions = {
    receiveAllMentorVisits({
        state, dispatch
    }, rawData) {


    const fewerFields = rawData.map(function (row) {
        
        return {
            date: row.Date,
            memberId: row.Member_id,
            gps: row.GPS,
            gardenName: row['Garden Name'],
            photos:
            [ // TODO give this same struct as imageIndex array
                imageObj(row.Picture1),
                imageObj(row.Picture2),
                imageObj(row.Picture3),
            ],
            name: row['First Name'] + ' ' + row['Last Name'],
            nationalId: row['SA ID Number'],
            farmingActivity: row['Farming Activity'],
            memberArea: row['Member Area'],
            mentor: row['username']
        };

    var dataFormatForDB = { 
        _id: rootState.csvMailroom.reportMonth + "MentorVisits", 
        mentorVisits: fewerFields
    };
    db.put(dataFormatForDB).then(response => console.log("dbResp", response))
  
    });
    },

    splitByActivity({ // activated by activity drop-down
        state
    }, payload){
        // The `_.property` iteratee shorthand.
        // _.partition(users, { 'age': 1, 'active': false });
        var splitByActivity = _.partition(noDuplicates, {mentor: 'sabu'})
    
        state.commercialVisits = splitByActivity[0]
        state.nonCommercialVisits = splitByActivity[1]
    },

    hasThreePhotos({
        state
    }, payload){
        var hasThreePhotos = payload.filter(row => row.photos[0] !== "No Image" && row.photos[1] !== "No Image" && row.photos[2] !== "No Image");
    },

    connectImages({
        state
    }, payload){
        
    },
    removeDuplicates({
        state, dispatch
    }, payload) {

        // This removes the entries with the same date, gps, and photos
        var noDuplicates = _.uniqBy(payload, x => (x.date && x.gps && x.photos[0] && x.photos[1] && x.photos[2]));
        console.log('TCL: -------------------------------');
        console.log('TCL: noDuplicates', noDuplicates);
        console.log('TCL: -------------------------------');
    }
}

export default {
    state,
    getters,
    actions
}