
import React from 'react';
import { View, StyleSheet } from 'react-native';

import FCPushOrder from './FCPushOrder';

export default function FCPushOrders(props) {
  let pushOrdersStr;
  pushOrdersStr = props.pushOrdersList.map((pushOrder, key) => {
    return <FCPushOrder
      id={pushOrder.orderId}
      date={pushOrder.orderDate}
      lastUpdate={pushOrder.lastUpdate}
      pharmacistId={pushOrder.pharmacistId}
      pharmacistName={pushOrder.pharmacistName}
      orderStatus={pushOrder.orderStatus}
      pushOrdersList={props.pushOrdersList}
      key={pushOrder.orderId}
    />;
  })

  return (
    <View style={styles.container}>
      {pushOrdersStr}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 90,
  },
});
