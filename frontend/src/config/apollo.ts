import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink } from '@apollo/client';

const httpLink = createHttpLink({
  uri: 'http://localhost:5001/graphql',
});

const loggerLink = new ApolloLink((operation, forward) => {
  console.log('GraphQL Request:', {
    operationName: operation.operationName,
    variables: operation.variables,
    query: operation.query
  });

  return forward(operation).map((response) => {
    console.log('GraphQL Response:', response);
    return response;
  });
});

export const client = new ApolloClient({
  link: ApolloLink.from([loggerLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    mutate: {
      errorPolicy: 'all'
    }
  }
});
