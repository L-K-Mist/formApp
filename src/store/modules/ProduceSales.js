const state = {
    vegSold: null,
    herbsSold: null,
    fruitSold: null,
    honeySold: null,
}

const getters = {
    vegSold(state) {
        return state.vegSold
    },
    herbsSold(state) {
        return state.herbsSold
    },
    fruitSold(state) {
        return state.fruitSold
    },
    honeySold(state) {
        return state.honeySold
    },
}

const actions = { // If the file-name includes "mentorvisit" it is sent here
    // Must pivot to grouped months, then count each unique occurance of member id
    produceSales({
        rootState,
        dispatch
    }, payload) {
        // console.log('​payload', payload);
        // console.log('​state.reportMonth', rootState.csvMailroom.reportMonth);

        // Filter to include only the month in question
        const dateFilter = payload.filter(
            entry =>
            entry.Date !== undefined && entry.Date.includes(rootState.csvMailroom.reportMonth)
        );
        // console.log('​dateFilter', dateFilter);



        /**
         * In July, produce was supplied to Shops and some veggie boxes were distributed to a few areas in and around Durban.Farmers supplied 1002 kg and generated an income of about R10 900.
         */

        // Pull out only those columns we need
        const fieldMap = dateFilter.map(function (row) {
            return {
                date: row.Date,
                profileId: row["profile id"],
                paid: row["Total Paid"],
                unitType: row["Unit Type"],
                saleType: row["Sale Type"],
            };
        });
        // console.log('​fieldMap', fieldMap);

        const veggies = fieldMap.filter(
            entry => entry.saleType === "Vegetables"
        )
        // console.log('​veggies', veggies);

        state.vegSold = veggies.reduce(
            (total, row) => total + Number(row.paid), 0
        )
        // console.log('​vegSold', vegSold);

        const herbs = fieldMap.filter(
            entry => entry.saleType === "Herbs"
        )
        // console.log('​herbs', herbs);

        state.herbsSold = herbs.reduce(
            (total, row) => total + Number(row.paid), 0
        )
        const fruit = fieldMap.filter(
            entry => entry.saleType === "Fruit"
        )

        state.fruitSold = fruit.reduce(
            (total, row) => total + Number(row.paid), 0
        )

        const honey = fieldMap.filter(
            entry => entry.saleType === "Honey"
        )

        state.honeySold = honey.reduce(
            (total, row) => total + Number(row.paid), 0
        )
        console.log('sales ', state);
    },
    growersVisited({
        state,
        dispatch
    }, fieldMap) {
        var allMembers = [] // as we iterate through the fieldMap, we'll push just the member Id's here.
        fieldMap.forEach(row => allMembers.push(row.memberId))
        var uniqueMembers = Array.from(new Set(allMembers)) // Not very readible (BAD Javascript! ) But creates a set of only unique elements.
        // console.log('​uniqueMembers', uniqueMembers);
        state.countGrowersVisited = uniqueMembers.length
    }
}

export default {
    state,
    getters,
    actions
}