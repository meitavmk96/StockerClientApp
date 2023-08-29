import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../GlobalData/GlobalData';
import { useFocusEffect } from '@react-navigation/native';

import FCDetailedPushOrders from '../FunctionalComps/FCDetailedPushOrders';

export default function PushOrderPage(props) {

  const [status, setStatus] = useState(null);
  const [medsInOrderList, setMedsInOrderList] = useState([]);
  const [isChanged, setIsChanged] = useState(false);

  const { apiUrlPushOrder, depId } = useContext(GlobalContext);

  const { pushOrderId, pushOrdersList } = props.route.params;

  //----------------------GET Meds in push order---------------------
  useEffect(() => {
    fetch(apiUrlPushOrder + 'GetOrderDetails/orderId/' + `${pushOrderId}`, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json; charset=UTF-8',
        'Accept': 'application/json; charset=UTF-8',
      })
    })
      .then(result => {
        return result.json();
      })
      .then(
        (result) => {
          setMedsInOrderList(result);
          const order = pushOrdersList.find((order) => order.orderId === pushOrderId);
          setStatus(order.orderStatus);
        },
        (error) => {
          console.log("err get=", error);
        });
        return () => {
          setIsChanged(false);
        }
  }, [isChanged]);

  useFocusEffect(
    React.useCallback(() => {
      setIsChanged(true);
    }, []));


  return (
    <View style={styles.container}>
      <Text style={styles.title}>הזמנה מספר {pushOrderId}</Text>
      {status !== null && (
        <>
          <ScrollView>
            <FCDetailedPushOrders medsInOrderList={medsInOrderList} orderStatus={status}/>
          </ScrollView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 25,
    textAlign: 'center',
    marginBottom: 15,
    color: '#003D9A',
    marginTop: 60,
    textShadowColor: '#CCCCCC',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
});