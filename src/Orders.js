// src/Orders.js

import React, { useEffect } from "react"
import { useQuery, gql, useSubscription } from "@apollo/client"

const GET_ORDERS = gql`
  query GetOrders {
    Order {
      id
      asset
      amount
      asset_type
      order_type
      price
      status
      user
      timestamp
    }
  }
`

const ORDER_UPDATED = gql`
  subscription OnOrderUpdated {
    orderUpdated {
      id
      asset
      amount
      asset_type
      order_type
      price
      status
      user
      timestamp
    }
  }
`

const Orders = () => {
  const { loading, error, data, refetch } = useQuery(GET_ORDERS)
  const { data: subscriptionData } = useSubscription(ORDER_UPDATED)

  useEffect(() => {
    if (subscriptionData) {
      refetch()
    }
  }, [subscriptionData, refetch])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <div>
      <h2>Orders</h2>
      <ul>
        {data.Order.map((order) => (
          <li key={order.id}>
            <p>Asset: {order.asset}</p>
            <p>Amount: {order.amount}</p>
            <p>Type: {order.order_type}</p>
            <p>Price: {order.price}</p>
            <p>Status: {order.status}</p>
            <p>User: {order.user}</p>
            <p>Timestamp: {order.timestamp}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Orders
