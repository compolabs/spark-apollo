// src/apolloClient.js

import { ApolloClient, InMemoryCache } from "@apollo/client"
import { GraphQLWsLink } from "@apollo/client/link/subscriptions"
import { createClient } from "graphql-ws"

const wsLink = new GraphQLWsLink(
  createClient({
    url: "ws://localhost:8080/v1/graphql",
  })
)

const client = new ApolloClient({
  link: wsLink,
  cache: new InMemoryCache(),
})

export default client
