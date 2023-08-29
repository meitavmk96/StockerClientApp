import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Card } from '@rneui/base';

import FCDateTime from './FCDateTime';

export default function FCNotification(props) {

  return (
    <Card style={styles.cardContainer} borderColor="#E1EAF9">
      <FCDateTime date={props.date} />
      <Text style={styles.cardTitle}>{props.msg}</Text>
      <Text style={styles.cardBody}>{props.pharmacistName}</Text>
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
      textAlign: "center",
      marginBottom: 10,
      color: "#003D9A",
    },
    cardBody: {
      marginVertical: 10,
      fontSize: 14,
      color: "#003D9A",
     },
});
