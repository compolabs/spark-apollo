// src/App.js

import React from "react"
import { ApolloProvider } from "@apollo/client"
import client from "./apolloClient"
import Orders from "./Orders"

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <h1>GraphQL Orders</h1>
        <Orders />
      </div>
    </ApolloProvider>
  )
}

export default App
