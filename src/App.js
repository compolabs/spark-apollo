import React from "react"
import { ApolloProvider } from "@apollo/client"
import client from "./apolloClient"
import Orders from "./Orders"

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <Orders />
      </div>
    </ApolloProvider>
  )
}

export default App
