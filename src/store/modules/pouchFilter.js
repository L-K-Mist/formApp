import _ from 'lodash'
import db from '@/api/pouchDB'


// function imageObj(linkString) {
//     if (linkString == "" || linkString == null) {
//         return "No Image"
//     } else {
//         var path = linkString
//         var stringArray = linkString.match(/([^/])+/g);
//         var name = stringArray[stringArray.length - 1];
//         return {
//             path,
//             name
//         }
//     }
// }



// https://bl.ocks.org/nolanlawson/3e096160b848689f1058
var docs = [];

function binarySearch(arr, docId) {
    var low = 0,
        high = arr.length,
        mid;
    while (low < high) {
        mid = (low + high) >>> 1; // faster version of Math.floor((low + high) / 2)
        arr[mid]._id < docId ? low = mid + 1 : high = mid
    }
    return low;
}

function onDeleted(id) {
    var index = binarySearch(docs, id);
    var doc = docs[index];
    if (doc && doc._id === id) {
        docs.splice(index, 1);
    }
}

function onUpdatedOrInserted(newDoc) {
    var index = binarySearch(docs, newDoc._id);
    var doc = docs[index];
    if (doc && doc._id === newDoc._id) { // update
        docs[index] = newDoc;
    } else { // insert
        docs.splice(index, 0, newDoc);
    }
}

function arrayToObj(allDocs) {
    var obj = {}
    allDocs.forEach(element => {
        obj[element._id] = element

    });
    return obj
}

function fetchInitialDocs() {
    return db.allDocs({
        include_docs: true
    }).then(function (res) {
        docs = res.rows.map(function (row) {
            return row.doc;
        });
        state.docs = docs
        state.docsObj = arrayToObj(docs)
        console.log('TCL: fetchInitialDocs -> state.docsObj', state.docsObj);
        //renderDocs();
    });
}

function reactToChanges() {
    db.changes({
        live: true,
        since: 'now',
        include_docs: true
    }).on('change', function (change) {
        if (change.deleted) {
            // change.id holds the deleted id
            onDeleted(change.id);
        } else { // updated/inserted
            // change.doc holds the new doc
            onUpdatedOrInserted(change.doc);
        }
        state.docs = docs
        state.docsObj = arrayToObj(docs)
        console.log('TCL: reactToChanges -> state.docsObj', state.docsObj);
        // renderDocs();
    }).on('error', console.log.bind(console));
}

fetchInitialDocs()
    .then(reactToChanges)
    .catch(console.log.bind(console));

const state = {
    docsObj: {},
    docs: [],
    rawMentorVisits: null,
    agriActivityFilter: null
};

const getters = {
    docs(state) {
        return state.docs
    },
    docsObj(state) {
        return state.docsObj
    }
}

const actions = {
    agriActivityFilter({
        state,
        dispatch
    }, payload) {
        state.agriActivityFilter = payload;
        //dispatch("connectImagesToVisits")
    },

    async receiveAllMentorVisits({
        state,
        rootState,
        dispatch
    }) {
        if (rootState.csvMailroom.reportMonth !== null) {
            state.rawMentorVisits = await db.get(
                rootState.csvMailroom.reportMonth + "MentorVisits"
            );
            console.log('TCL: --------------------------------------------------------------------------------');
            console.log('TCL: asyncreceiveAllMentorVisits -> state.rawMentorVisits', state.rawMentorVisits.mentorVisits);
            console.log('TCL: --------------------------------------------------------------------------------');
            dispatch("removeDuplicates", state.rawMentorVisits.mentorVisits);
        } else {
            console.log("I don't know what month we're planning for")
        }
    },



    splitByActivity({
            // activated by activity drop-down
            state
        },
        payload
    ) {
        // The `_.property` iteratee shorthand.
        // _.partition(users, { 'age': 1, 'active': false });
        var splitByActivity = _.partition(payload, {
            mentor: "sabu"
        });

        state.commercialVisits = splitByActivity[0];
        console.log('TCL: ---------------------------------------------------');
        console.log('TCL: state.commercialVisits', state.commercialVisits);
        console.log('TCL: ---------------------------------------------------');
        state.nonCommercialVisits = splitByActivity[1];
        console.log('TCL: ---------------------------------------------------------');
        console.log('TCL: state.nonCommercialVisits', state.nonCommercialVisits);
        console.log('TCL: ---------------------------------------------------------');


    },



    // connectImages({
    //     state
    // }, payload){

    // },
};

export default {
    state,
    getters,
    actions
}