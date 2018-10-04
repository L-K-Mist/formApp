import apollo from '@/apollo'
import gql from 'graphql-tag'

const state = {
    filteredFarmers: null
}

const getters = {
    filteredFarmers(state) {
        return state.filteredFarmers
    }
}

const actions = {
    async filterFarmers({
        state
    }, payload) {
        const response = await apollo.query({ // The way to speak to gql database from vuex
            query: gql `
                query usersFilterByName($filter: String) {
                    usersFilterByName(filter: $filter) {
                        email
                        name
                    }
                }
            `,
            variables: {
                filter: payload
            }
        })
        console.log('TCL: response', response.data.usersFilterByName);
        state.filteredFarmers = response.data.usersFilterByName
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