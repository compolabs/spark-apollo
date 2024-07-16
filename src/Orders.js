import React from "react"
import { useSubscription, gql } from "@apollo/client"

const ORDERS_SUBSCRIPTION_BUY = gql`
  subscription {
    Order(
      where: { status: { _eq: "Active" }, order_type: { _eq: "Buy" } }
      order_by: { price: desc }
    ) {
      id
      asset
      amount
      order_type
      price
      status
      user
      timestamp
    }
  }
`

const ORDERS_SUBSCRIPTION_SELL = gql`
  subscription {
    Order(
      where: { status: { _eq: "Active" }, order_type: { _eq: "Sell" } }
      order_by: { price: asc }
    ) {
      id
      asset
      amount
      order_type
      price
      status
      user
      timestamp
    }
  }
`

const Orders = () => {
  const {
    data: buyData,
    loading: buyLoading,
    error: buyError,
  } = useSubscription(ORDERS_SUBSCRIPTION_BUY)
  const {
    data: sellData,
    loading: sellLoading,
    error: sellError,
  } = useSubscription(ORDERS_SUBSCRIPTION_SELL)

  if (buyLoading || sellLoading) return <p>Loading...</p>
  if (buyError) return <p>Error: {buyError.message}</p>
  if (sellError) return <p>Error: {sellError.message}</p>

  const buyOrders = buyData.Order
  const sellOrders = sellData.Order

  return (
    <div>
      <h2>GraphQL Orders</h2>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <div>
          <h3>Buy Orders</h3>
          <ul>
            {buyOrders.map((order) => (
              <li key={order.id}>
                <p>Order ID: {order.id}</p>
                <p>Amount: {order.amount}</p>
                <p>Price: {order.price}</p>
                <p>Status: {order.status}</p>
                <p>Timestamp: {order.timestamp}</p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Sell Orders</h3>
          <ul>
            {sellOrders.map((order) => (
              <li key={order.id}>
                <p>Order ID: {order.id}</p>
                <p>Amount: {order.amount}</p>
                <p>Price: {order.price}</p>
                <p>Status: {order.status}</p>
                <p>Timestamp: {order.timestamp}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Orders
