const state = {
    cropsRecorded: null,
    totalArea: null,
    totalKg: null,
    totalValue: null,
    altTotalValue: null
}


const getters = {
    cropsRecorded(state) {
        return state.cropsRecorded
    },
    totalArea(state) {
        return state.totalArea
    },
    totalKg(state) {
        return state.totalKg
    },
    totalValue(state) {
        return state.totalValue
    },

}

/**Crop Update  (memcropupdate_export)
#m2 x 4.5 (to get est. yield in kg) x R10 (to get R value of crops captured) */

const actions = { // If the file-name includes "mentorvisit" it is sent here
    // Must pivot to grouped months, then count each unique occurance of member id
    cropsCaptured({
        rootState,
        dispatch
    }, payload) {
        // console.log('​payload', payload);
        // console.log('​state.reportMonth', rootState.csvMailroom.reportMonth);

        const fieldMap = payload.map(function (row) {
            var date = row["created at"]
            var memberId = row.Member_id
            var squareMeters = Number(row["Square Meters"]) // Square Meters
            var yieldKg = squareMeters * 4.5
            var cropValue = yieldKg * 10
            return {
                date: (String(date).split("T"))[0], // dense line that splits the string into two strings in an array and then keeps only the first string
                memberId,
                squareMeters,
                yieldKg,
                cropValue
            };
        });
        // console.log('​fieldMap', fieldMap);
        // Filter to include only the month in question
        const dateFilter = fieldMap.filter(
            entry =>
            entry.date !== undefined && entry.date.includes(rootState.csvMailroom.reportMonth)
        );
        // console.log('​dateFilter', dateFilter);
// 
        var cropsRecorded = dateFilter.length
        // console.log('​visitsCount', cropsRecorded);

        var totalArea = dateFilter.reduce((total, entry) => total + entry.squareMeters, 0) / 10000
        totalArea = totalArea.toFixed(2)

        // console.log('​totalArea', totalArea);

        var totalKg = dateFilter.reduce((total, entry) => total + entry.yieldKg, 0)
        // console.log('​totalKg', totalKg);


        var totalValue = dateFilter.reduce((total, entry) => total + entry.cropValue, 0)
        // console.log('​totalValue', totalValue);

        var altTotalValue = totalKg * 10
        // console.log('​altTotalValue', altTotalValue);

        state.cropsRecorded = cropsRecorded
        state.totalArea = totalArea
        state.totalKg = totalKg
        state.totalValue = totalValue
    },

}

export default {
    state,
    getters,
    actions
}