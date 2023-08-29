import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { Card } from '@rneui/base';
import { useNavigation } from '@react-navigation/native';

import FCDateTime from './FCDateTime';

export default function FCPullOrder(props) {//gets the props of the pull order

  const navigation = useNavigation();

  const handleCardPress = () => {
    navigation.navigate("צפייה בפרטי הזמנת משיכה", { pullOrderId: props.id, PullOrdersList: props.PullOrdersList});
  };

  return (
    <Card style={styles.cardContainer} borderColor="#E1EAF9">
      <View style={styles.row}>
        <FCDateTime date={props.date} />
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {props.orderStatus === 'I' && (
            <>
              <Text style={{ color: '#5D9C59' }}>הונפק</Text>
            </>
          )}
          {props.orderStatus === 'W' && (
            <>
              <Text style={{ color: '#DF2E38' }}>בהמתנה</Text>
            </>
          )}
          {props.orderStatus === 'T' && (
            <>
              <Text style={{ color: '#FFC300' }}>מועבר</Text>
            </>
          )}
        </View>
      </View>
      <Text style={styles.cardTitle}>הזמנה מספר {props.id}</Text>
      <Text style={styles.cardBody}>שם יוצר ההזמנה: {props.nurseName}</Text>

      {props.pharmacistName != 'user user' && <Text style={styles.cardBody}><Text>רוקח אחראי : </Text>{props.pharmacistName}</Text>}

      <TouchableOpacity onPress={() => handleCardPress()}>
        <Text style={styles.readMore}>קרא עוד...</Text>
      </TouchableOpacity>
    </Card>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    width: "60%",
    padding: 10,
    marginBottom: 10,
    borderRadius: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#003D9A",
  },
  cardBody: {
    marginVertical: 10,
    fontSize: 15,
    color: "#003D9A",
  },
  readMore: {
    color: '#54A9FF',
    textAlign: "right",
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
});