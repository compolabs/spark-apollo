import React from "react"
import { ApolloProvider } from "@apollo/client"
import client from "./apolloClient"
import ActiveOrders from "./ActiveOrders"

function App() {
  return (
    <ApolloProvider client={client}>
      <React.StrictMode>
        <ActiveOrders />
      </React.StrictMode>
    </ApolloProvider>
  )
}

export default App
