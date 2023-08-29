import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useContext } from 'react';
import { Card } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';

import { GlobalContext } from '../GlobalData/GlobalData';

export default function FCMedInOrder(props) {

  const { meds } = useContext(GlobalContext);
  let selectedMed = meds.find((med) => med.medId === props.medId);//get the order item to read 

  return (
    <View>
      <Card borderColor='#E1EAF9' >
        <TouchableOpacity style={styles.CloseBTN} onPress={() => props.getId2Delete(props.medId)}>
          <Ionicons name='close-outline' color='#003D9A' size={22} />
        </TouchableOpacity>
        <View>
          <View style={styles.row}>
            <Text style={styles.cardText}>שם תרופה: </Text>
            <Text style={styles.cardText}>{selectedMed.medName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cardText}>כמות: </Text>
            <Text style={styles.cardText}>{props.poQty}</Text>
          </View>
        </View>
      </Card>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  cardText: {
    marginVertical: 2,
    fontSize: 15,
    color: "#003D9A",
  },
  CloseBTN: {
    alignSelf: 'flex-start',
  },
});