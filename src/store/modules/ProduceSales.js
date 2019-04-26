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

const actions = {
    produceSales({
        rootState,
        dispatch
    }, payload) {

        const dateFilter = payload.filter(
            entry =>
            entry.Date !== undefined && entry.Date.includes(rootState.csvMailroom.reportMonth)
        );

        const fieldMap = dateFilter.map(function (row) {
            return {
                date: row.Date,
                profileId: row["profile id"],
                paid: row["Total Paid"],
                unitType: row["Unit Type"],
                saleType: row["Sale Type"],
            };
        });

        const veggies = fieldMap.filter(
            entry => entry.saleType === "Vegetables"
        )

        state.vegSold = veggies.reduce(
            (total, row) => total + Number(row.paid), 0
        )

        const herbs = fieldMap.filter(
            entry => entry.saleType === "Herbs"
        )

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