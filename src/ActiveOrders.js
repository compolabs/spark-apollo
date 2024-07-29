import React, { useEffect, useState } from "react"
import { gql } from "@apollo/client"
import client from "./apolloClient"

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

const getVariables = (priceOrder, orderType) => ({
  limit: 50,
  priceOrder,
  where: {
    asset: { _eq: "0xccceae45a7c23dcd4024f4083e959a0686a191694e76fa4fb76c449361ca01f7" },
    order_type: { _eq: orderType },
    status: { _eq: "Active" }
  }
})

const calculateAverageTime = (times) => {
  return times.reduce((a, b) => a + b, 0) / times.length;
};

const calculateMaxTime = (times) => {
  return Math.max(...times);
};

const pause = (time) => {
  return new Promise((resolve) => setTimeout(() => resolve(1), time));
}

const subscribeWithPromise = (orderType, priceOrder) => {
  return new Promise((resolve) => {
    const subscription = client.subscribe({
      query: ACTIVE_ORDERS_SUBSCRIPTION,
      variables: getVariables(priceOrder, orderType),
      fetchPolicy: "no-cache",
    }).subscribe({
      next: ({ data }) => {
        subscription.unsubscribe();
        resolve({ data })
      },
    })
  })
}

const useOrderSubscriptionWithTiming = (orderType, priceOrder, setTime) => {
  useEffect(() => {
    const times = [];
    const fetchData = async () => {
      for (let i = 0; i < MAX_REQUESTS; i++) {
        const startTime = Date.now();
        const { data } = await subscribeWithPromise(orderType, priceOrder)
        if (data) {
          const endTime = Date.now();
          times.push(endTime - startTime);
        }

        await pause(1_000) // Wait 1 sec between requests
      }
      setTime({
        avg: calculateAverageTime(times),
        max: calculateMaxTime(times)
      });
    };
    fetchData();
  }, [orderType, priceOrder, setTime]);
};

const useOrderQueryWithTiming = (orderType, priceOrder, setTime) => {
  useEffect(() => {
    const times = [];
    const fetchData = async () => {
      for (let i = 0; i < MAX_REQUESTS; i++) {
        const startTime = Date.now();
        const { data } = await client.query({
          query: ACTIVE_ORDERS_QUERY,
          variables: getVariables(priceOrder, orderType),
          fetchPolicy: "no-cache",
        });
        if (data) {
          const endTime = Date.now();
          times.push(endTime - startTime);
        }

        await pause(1_000) // Wait 1 sec between requests
      }
      setTime({
        avg: calculateAverageTime(times),
        max: calculateMaxTime(times)
      });
    };
    fetchData();
  }, [orderType, priceOrder, setTime]);
};

const BENCHMARK_DATA = { avg: 0, max: 0 };

const MAX_REQUESTS = 30;

function ActiveOrders() {
  const [sellSubscriptionTime, setSellSubscriptionTime] = useState(BENCHMARK_DATA);
  const [buySubscriptionTime, setBuySubscriptionTime] = useState(BENCHMARK_DATA);

  const [sellQueryTime, setSellQueryTime] = useState(BENCHMARK_DATA);
  const [buyQueryTime, setBuyQueryTime] = useState(BENCHMARK_DATA);

  useOrderSubscriptionWithTiming("Sell", "asc", setSellSubscriptionTime);
  useOrderSubscriptionWithTiming("Buy", "desc", setBuySubscriptionTime);

  useOrderQueryWithTiming("Sell", "asc", setSellQueryTime);
  useOrderQueryWithTiming("Buy", "desc", setBuyQueryTime);

  const completedMessage = sellQueryTime.avg && buyQueryTime.avg
    && sellSubscriptionTime.avg && buySubscriptionTime.avg
      ? 'Completed'
      : 'Working...'

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
      <p>Status: {completedMessage}</p>
      <p>Requests Amount: {MAX_REQUESTS}</p>
      <p>Subscription Sell Time: {sellSubscriptionTime.avg} ms | Max Time: {sellSubscriptionTime.max} ms</p>
      <p>Subscription Buy Time: {buySubscriptionTime.avg} ms | Max Time: {buySubscriptionTime.max} ms</p>
      <p>Query Sell Time: {sellQueryTime.avg} ms | Max Time: {sellQueryTime.max} ms</p>
      <p>Query Buy Time: {buyQueryTime.avg} ms | Max Time: {buyQueryTime.max} ms</p>
    </div>
  )
}

export default ActiveOrders
