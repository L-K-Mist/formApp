import {
    ApolloClient
} from 'apollo-client'
import {
    HttpLink
} from 'apollo-link-http'
import {
    setContext
} from 'apollo-link-context'
import {
    onError
} from "apollo-link-error";
import {
    InMemoryCache
} from 'apollo-cache-inmemory'

const httpLink = new HttpLink({ // Here, we create a new instance of httpLink with the URL ( http://localhost:4000/) of our GraphQL server.
    // uri: 'https://mirage-advanced-frdudlwdkj.now.sh/'
    uri: 'http://localhost:4001/'
})

const errorLink = onError(
    ({
        operation,
        response,
        graphQLErrors,
        networkError
    }) => {
        // temp to see what's wrong with signup
        if (graphQLErrors) {
            console.log("gqlError", {
                graphQLErrors
            });
        }
        if (networkError) console.log({
            networkError
        });
    }
);

const httpLinkAuth = setContext((_, { // Then we make use of the setContext object to create an httpLinkAuth that gets the user token from local storage and return the headers, which contain the Authorization header.
    headers
}) => {
    // get the authentication token from localstorage if it exists
    const token = localStorage.getItem('USER_TOKEN')

    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            Authorization: token ? `Bearer ${token}` : ''
        }
    }
})
var link = errorLink.concat(httpLink)
link = httpLinkAuth.concat(link)

// Next, we create an Apollo client using the httpLink and httpLinkAuth created above and specify we want an in-memory cache.
const apolloClient = new ApolloClient({
    link,
    cache: new InMemoryCache()
});

export default apolloClient