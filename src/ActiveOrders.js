import React, { useEffect, useState } from "react"
import { useSubscription, gql, useQuery } from "@apollo/client"

const ORDER = `
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
`

const ACTIVE_ORDERS_SUBSCRIPTION = gql`
  subscription (
    $limit: Int!
    $where: Order_bool_exp
    $priceOrder: order_by!
  ) {
    ${ORDER}
  }
`

const ACTIVE_ORDERS_QUERY = gql`
  query (
    $limit: Int!
    $where: Order_bool_exp
    $priceOrder: order_by!
  ) {
    ${ORDER}
  }
`

const handleOnComplete = (setter) => {
  setter(Date.now() - CURRENT_TIME);
}

const CURRENT_TIME = Date.now();

const getVariables = (priceOrder, orderType) => ({
  limit: 50,
  priceOrder,
  where: {
    asset: { _eq: "0xccceae45a7c23dcd4024f4083e959a0686a191694e76fa4fb76c449361ca01f7" },
    order_type: { _eq: orderType },
    status: { _eq: "Active" }
  }
})

const useOrderSubscription = (orderType, priceOrder) => {
  const variables = getVariables(priceOrder, orderType)
  return useSubscription(ACTIVE_ORDERS_SUBSCRIPTION, { variables });
};

const useOrderQuery = (orderType, priceOrder) => {
  const variables = getVariables(priceOrder, orderType)
  return useQuery(ACTIVE_ORDERS_QUERY, { variables });
};

function ActiveOrders() {
  const [sellSubscriptionTime, setSellSubscriptionTime] = useState(null);
  const [buySubscriptionTime, setBuySubscriptionTime] = useState(null);
  const [sellQueryTime, setSellQueryTime] = useState(null);
  const [buyQueryTime, setBuyQueryTime] = useState(null);

  const { data: sellData } = useOrderSubscription("Sell", "asc");
  const { data: buyData } = useOrderSubscription("Buy", "desc");

  const { data: sellDataQuery } = useOrderQuery("Sell", "asc");
  const { data: buyDataQuery } = useOrderQuery("Buy", "desc");

  useEffect(() => {
    if (!sellSubscriptionTime && sellData) {
      handleOnComplete(setSellSubscriptionTime);
      console.log("Subscription Sell Data:", sellData);
    }
    if (!buySubscriptionTime && buyData) {
      handleOnComplete(setBuySubscriptionTime);
      console.log("Subscription Buy Data:", buyData);
    }
    if (!sellQueryTime && sellDataQuery) {
      handleOnComplete(setSellQueryTime);
      console.log("Query Sell Data:", sellDataQuery);

    }
    if (!buyQueryTime && buyDataQuery) {
      handleOnComplete(setBuyQueryTime);
      console.log("Query Buy Data:", buyDataQuery);
    }
  }, [sellData, buyData, sellDataQuery, buyDataQuery, sellSubscriptionTime, buySubscriptionTime, sellQueryTime, buyQueryTime]);

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
