import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  uri: "http://localhost:5001/graphql",
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',  // Don't cache, always fetch from network
      nextFetchPolicy: 'network-only'
    },
    query: {
      fetchPolicy: 'network-only'
    },
    mutate: {
      fetchPolicy: 'no-cache'
    }
  }
});
