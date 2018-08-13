const state = {
    mentorVisits: null,
    countMentorVisits: null
}

const getters = {

}

const actions = { // If the file-name includes "mentorvisit" it is sent here
    // Must pivot to grouped months, then count each unique occurance of member id
    mentorVisits({
        rootState,
        dispatch
    }, payload) {
        console.log('​payload', payload);
        console.log('​state.reportMonth', rootState.SeedlingSales.reportMonth);

        // Filter to include only the month in question
        const dateFilter = payload.filter(
            entry =>
            entry.Date !== undefined && entry.Date.includes(rootState.SeedlingSales.reportMonth)
        );
        console.log('​dateFilter', dateFilter);

        // Pull out only those columns we need
        const fieldMap = dateFilter.map(function (row) {
            return {
                date: row.Date,
                memberId: row.Member_id,
            };
        });
        console.log('​fieldMap', fieldMap);

        // Effect a pivot that groups member id's per date as per https://stackoverflow.com/questions/40523257/how-do-i-pivot-an-array-of-objects-in-javascript

        var dateGrouped = [];

        fieldMap.forEach(function (a) { // Go through each object in the array and let "a" be the name for the stuff ...

            // check if date is not in hash table
            if (!this[a.date]) {

                // if not, create new object with date and values array
                // and assign it with the date as hash to the hash table
                this[a.date] = {
                    date: a.date,
                    values: []
                };

                // add the new object to the result set, too
                dateGrouped.push(this[a.date]);
            }

            // create a new object with the other values and push it
            // to the array of the object of the hash table
            this[a.date].values.push(a.memberId);
        }, Object.create(null)); // Object.create creates an empty object without prototypes

        console.log(dateGrouped); // result of above: An array of objects grouped by date :)
        var uniquePerDay = []
        // Iterate through the dates and remove duplicates from the profile id's
        dateGrouped.forEach(function (object) { // go through each object inside dateGrouped Array and... 
            var unique = Array.from(new Set(object.values)) // create temporary (nested) variable with only unique values.  That means if there's an array of three id's on a given day, but one is repeated; it will now be an array with only two.
            // go through each value left in var unique and "post" them to the more public variable uniquePerDay.
            unique.forEach(function (element) {
                uniquePerDay.push(element)
            })
        })
        console.log('​uniquePerDay', uniquePerDay);

        state.countMentorVisits = uniquePerDay.length // The length of the array is basically the count of id's in the array.
    }
}

export default {
    state,
    getters,
    actions
}