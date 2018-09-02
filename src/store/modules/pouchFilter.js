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

}

const getters = {


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
    
    console.log('TCL: -----------------------------');
    console.log('TCL: fewerFields', fewerFields);
    console.log('TCL: -----------------------------');


    // This removes the entries with the same date, gps, and photos
    var noDuplicates = _.uniqBy(fewerFields, x => (x.date && x.gps && x.photos[0] && x.photos[1] && x.photos[2]));
    console.log('TCL: -------------------------------');
    console.log('TCL: noDuplicates', noDuplicates);
    console.log('TCL: -------------------------------');
    }

    var commercialVisits = _.where(noDuplicates, {mentor: sabu})
}

export default {
    state,
    getters,
    actions
}