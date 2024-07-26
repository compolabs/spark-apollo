import React, { useEffect, useState } from "react"
import { useSubscription, gql, useQuery } from "@apollo/client"

const ACTIVE_ORDERS_SUBSCRIPTION = gql`
  subscription (
    $limit: Int!
    $where: Order_bool_exp
    $priceOrder: order_by!
  ) {
    Order(limit: $limit, where: $where, order_by: { price: $priceOrder }) {
      id
      asset
      asset_type
      amount
      initial_amount
      order_type
      price
      status
      user
      timestamp
    }
  }
`

const ACTIVE_ORDERS_QUERY = gql`
  query (
    $limit: Int!
    $where: Order_bool_exp
    $priceOrder: order_by!
  ) {
    Order(limit: $limit, where: $where, order_by: { price: $priceOrder }) {
      id
      asset
      asset_type
      amount
      initial_amount
      order_type
      price
      status
      user
      timestamp
    }
  }
`

const handleOnComplete = (setter) => {
  setter(Date.now() - CURRENT_TIME);
}

const CURRENT_TIME = Date.now();

function ActiveOrders() {
  const [sellSubscriptionTime, setSellSubscriptionTime] = useState(null);
  const [buySubscriptionTime, setBuySubscriptionTime] = useState(null);
  const [sellQueryTime, setSellQueryTime] = useState(null);
  const [buyQueryTime, setBuyQueryTime] = useState(null);

  const { data: sellData } = useSubscription(ACTIVE_ORDERS_SUBSCRIPTION, {
    variables: {
      limit: 50,
      priceOrder: "asc",
      where: {
        asset: {_eq: "0xccceae45a7c23dcd4024f4083e959a0686a191694e76fa4fb76c449361ca01f7"},
        order_type: {_eq: "Sell"},
        status: {_eq: "Active"}
      },
    }
  })
  const { data: buyData } = useSubscription(ACTIVE_ORDERS_SUBSCRIPTION, {
    variables: {
      limit: 50,
      priceOrder: "desc",
      where: {
        asset: {_eq: "0xccceae45a7c23dcd4024f4083e959a0686a191694e76fa4fb76c449361ca01f7"},
        order_type: {_eq: "Buy"},
        status: {_eq: "Active"}
      },
    }
  })

  const { data: sellDataQuery } = useQuery(ACTIVE_ORDERS_QUERY, {
    variables: {
      limit: 50,
      priceOrder: "asc",
      where: {
        asset: {_eq: "0xccceae45a7c23dcd4024f4083e959a0686a191694e76fa4fb76c449361ca01f7"},
        order_type: {_eq: "Sell"},
        status: {_eq: "Active"}
      },
    }
  })
  const { data: buyDataQuery } = useQuery(ACTIVE_ORDERS_QUERY, {
    variables: {
      limit: 50,
      priceOrder: "desc",
      where: {
        asset: {_eq: "0xccceae45a7c23dcd4024f4083e959a0686a191694e76fa4fb76c449361ca01f7"},
        order_type: {_eq: "Buy"},
        status: {_eq: "Active"}
      },
    }
  })

  useEffect(() => {
    if (sellSubscriptionTime) return;
    sellData && handleOnComplete(setSellSubscriptionTime);
  }, [sellData, sellSubscriptionTime])

  useEffect(() => {
    if (buySubscriptionTime) return;
    buyData && handleOnComplete(setBuySubscriptionTime);
  }, [buyData, buySubscriptionTime])

  useEffect(() => {
    if (sellQueryTime) return;
    sellDataQuery && handleOnComplete(setSellQueryTime);
  }, [sellDataQuery, sellQueryTime])

  useEffect(() => {
    if (sellQueryTime) return;
    buyDataQuery && handleOnComplete(setBuyQueryTime);
  }, [buyDataQuery, sellQueryTime])

  console.log("Subscription Sell Data:", sellData)
  console.log("Subscription Buy Data:", buyData)

  console.log("Query Sell Data:", sellDataQuery)
  console.log("Query Buy Data:", buyDataQuery)

  return (
    <div>
      <p>Subscription Sell Time: {sellSubscriptionTime} ms</p>
      <p>Subscription Buy Time: {buySubscriptionTime} ms</p>
      <p>Query Sell Time: {sellQueryTime} ms</p>
      <p>Query Buy Time: {buyQueryTime} ms</p>
    </div>
  )
}

export default ActiveOrders
