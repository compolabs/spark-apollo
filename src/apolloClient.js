import { GraphQLWsLink } from "@apollo/client/link/subscriptions"
import { createClient } from "graphql-ws"

import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  split,
} from "@apollo/client";

import { getMainDefinition } from "@apollo/client/utilities";

const BASE_URL = 'localhost:8080/v1/graphql';

const wsLink = new GraphQLWsLink(
  createClient({
    url: `ws://${BASE_URL}`,
  })
)

const httpLink = new HttpLink({
  uri: `http://${BASE_URL}`,
});


const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

export default client
