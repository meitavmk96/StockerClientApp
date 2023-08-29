import React from 'react';
import { View, StyleSheet } from 'react-native';

import FCPullOrder from './FCPullOrder';

export default function FCPullOrders(props) {
  let pullOrdersStr;
  pullOrdersStr = props.PullOrdersList.map((pullOrder, key) => {
    return <FCPullOrder
      PullOrdersList={props.PullOrdersList}
      id={pullOrder.orderId}
      date={pullOrder.lastUpdate}
      nurseId={pullOrder.nurseId}
      nurseName={pullOrder.nurseName}
      pharmacistId={pullOrder.pharmacistId}
      pharmacistName={pullOrder.pharmacistName}
      orderStatus={pullOrder.orderStatus}
      key={key}// the mapping key is a unique value
    />;
  })

  return (
    <View style={styles.container}>
      {pullOrdersStr}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 90,
  },
});
