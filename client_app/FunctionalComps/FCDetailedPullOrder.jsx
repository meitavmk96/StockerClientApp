
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@rneui/base';

export default function FCDetailedPullOrder(props) {
  
  const isOneOrder = props.medsInOrderList.length

  return (
    <View>
      <Card borderColor='#E1EAF9'>
        {props.isWaitingOrder === true && isOneOrder !== 1 && (
          <TouchableOpacity style={styles.CloseBTN} onPress={() => props.getId2Delete(props.id)}>
            <Ionicons name='close-outline' color='#003D9A' size={22} />
          </TouchableOpacity>
        )}

        <Text style={styles.cardTitle}><Text>{props.medName}</Text></Text>
        <Text style={styles.cardBody}>כמות שהוזמנה: <Text>{props.poQty}</Text></Text>

        {props.isWaitingOrder === false && (
          <View>
            <Text style={styles.cardBody}>כמות שסופקה: <Text>{props.supQty}</Text></Text>
          </View>
        )}
      </Card>
    </View>
  )
};

const styles = StyleSheet.create({
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#003D9A",
  },
  cardBody: {
    fontSize: 15,
    color: "#003D9A",
  },
  CloseBTN: {
    alignSelf: 'flex-start',
  },
});