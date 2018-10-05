import apollo from '@/apollo'
import gql from 'graphql-tag'

const state = {
    filteredFarmers: null,
    farmerFilterLoading: true
}

const getters = {
    filteredFarmers(state) {
        return state.filteredFarmers
    },
    farmerFilterLoading(state) {
        return state.farmerFilterLoading
    }
}

const actions = {
    async filterFarmers({
        state
    }, payload) {
        state.farmerFilterLoading = true
        const response = await apollo.query({ // The way to speak to gql database from vuex
            query: gql `
                query usersFilterByName($filter: String) {
                    usersFilterByName(filter: $filter) {
                        email
                        name
                        farmingActivities {
                            category
                            longDescription
                        }
                        personalDetails {
                            idSA
                            lastName
                            cell
                        }
                    }
                }
            `,
            variables: {
                filter: payload
            }
        })

        state.filteredFarmers = response.data.usersFilterByName
        console.log('TCL: state.filteredFarmers', state.filteredFarmers);

        state.farmerFilterLoading = false
    }
}

export default {
    state,
    getters,
    actions
}

/**
export const ME_QUERY = gql `
    query MeQuery {
        me {
            id
            name
            email
        }
    }
`


        async fetchMe({
            state
        }) {
            const response = await apollo.query({ // The way to speak to gql database from vuex
                query: ME_QUERY
            })
            console.log('TCL: response', response);
        }
 */