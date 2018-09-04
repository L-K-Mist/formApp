import Papa from "papaparse";
import db from "@/api/pouchDB"


//initialise reportMonth from value in db
db.get('global/reportMonth').then(function (doc) {
    state.reportMonth = doc.month
}).catch(function (err) {
    console.log("Have you selected a month yet Paula? That's basically what this error means. \n", err);
});

const state = {
    filesReceived: [],
    reportMonth: null,
}

const getters = {
    reportMonth(state) {
        return state.reportMonth
    },
    filesReceived(state) {
        return state.filesReceived
    },
}

const actions = {
    async reportMonth({
        state
    }, payload) {
        state.reportMonth = payload; // change the reportMonth via user interaction with datepicker

        db.upsert('global/reportMonth', function (doc) { // using upsert lib from https://github.com/pouchdb/upsert#dbupsertdocid-difffunc--callback
            if (!doc.count) {
                doc.count = 0;
            }
            doc.count++;
            doc.month = state.reportMonth
            return doc;
        }).then(function (res) {
            console.log('TCL: res', res);

            // success, res is {rev: '1-xxx', updated: true, id: 'myDocId'}
        }).catch(function (err) {
            console.log('TCL: err', err);
            // error
        });


        // db.get('global/reportMonth').then(function (doc) {
        //     if (!doc.updatedCount) {
        //         doc.updatedCount = 0;
        //     }
        //     doc.updatedCount++;
        //     return db.put(doc);
        // }).catch(console.log.bind(console));


        // var put = db.put({
        //         _id: 'global/reportMonth',
        //         someText: state.reportMonth
        //     })
        //     .then(function () {
        //         return db.get('global/reportMonth');
        //     });

        // console.log('TCL: put', put);


        // console.log("​-------------------------------------");
        // console.log("​state.reportMonth", state.reportMonth);
        // console.log("​-------------------------------------");
    },
    prepareCSV({
        state,
        dispatch
    }, payload) {

        Papa.parse(payload.result, {
            header: true,
            complete(results) {
                if (payload.fileToLoad.name.includes("salesforms")) {
                    dispatch("salesForm", results.data);
                    console.log("​complete -> fileToLoad.name", payload.fileToLoad.name);
                    state.filesReceived.push({
                        name: "Seedling Sales",
                        month: state.reportMonth
                    })
                } else if (payload.fileToLoad.name.includes("mentorvisit")) {
                    dispatch("mentorVisits", results.data);
                    state.filesReceived.push({
                        name: "Mentor Visits",
                        month: state.reportMonth
                    })
                } else if (payload.fileToLoad.name.includes("cropupdate")) {
                    dispatch("cropsCaptured", results.data);
                    state.filesReceived.push({
                        name: "Crop Update",
                        month: state.reportMonth
                    })
                } else if (payload.fileToLoad.name.includes("producesales")) {
                    dispatch("produceSales", results.data);
                    state.filesReceived.push({
                        name: "Produce Sales",
                        month: state.reportMonth
                    })
                }


                //   console.log('complete', results)
                // that.doc = JSON.stringify(results.data, null, 2)
            },
            error(errors) {
                console.log("error", errors);
            }

        })
    },
};

export default {
    actions,
    state,
    getters
}