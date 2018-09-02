import Papa from "papaparse";

const state = {
    filesReceived:[],
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
    reportMonth({
        state
    }, payload) {
        state.reportMonth = payload;
        state.gotMonth = true;
        console.log("​-------------------------------------");
        console.log("​state.reportMonth", state.reportMonth);
        console.log("​-------------------------------------");
    },
    prepareCSV({
        state,
        dispatch
    }, payload){

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

