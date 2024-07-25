import React from "react"
import { useSubscription, gql } from "@apollo/client"

const ACTIVE_ORDERS_SUBSCRIPTION = gql`
  subscription {
    ActiveOrders {
      id
      orders {
        id
        user
        timestamp
        order_type
        amount
        asset
        price
        activeOrderRef_id
      }
    }
  }
`

function ActiveOrders() {
  const { data, loading, error } = useSubscription(ACTIVE_ORDERS_SUBSCRIPTION)

  console.log("Subscription Data:", data)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <div>
      {/* {data.activeOrders.orders.map((order) => (
        <div key={order.id}>
          <p>User: {order.user}</p>
          <p>Timestamp: {new Date(order.timestamp).toLocaleString()}</p>
          <p>Order Type: {order.order_type}</p>
          <p>Amount: {order.amount}</p>
          <p>Asset: {order.asset}</p>
          <p>Price: {order.price}</p>
        </div>
      ))} */}
    </div>
  )
}

export default ActiveOrders
