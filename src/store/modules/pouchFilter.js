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
    nonCommercialVisits: null

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
    });
    

    // This removes the entries with the same date, gps, and photos
    var noDuplicates = _.uniqBy(fewerFields, x => (x.date && x.gps && x.photos[0] && x.photos[1] && x.photos[2]));
    console.log('TCL: -------------------------------');
    console.log('TCL: noDuplicates', noDuplicates);
    console.log('TCL: -------------------------------');

    // The `_.property` iteratee shorthand.
    // _.partition(users, { 'age': 1, 'active': false });
    var splitByActivity = _.partition(noDuplicates, {mentor: 'sabu'})

    state.commercialVisits = splitByActivity[0]
    state.nonCommercialVisits = splitByActivity[1]


    }


}

export default {
    state,
    getters,
    actions
}