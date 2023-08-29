import { Text, StyleSheet, View } from 'react-native';
import React, { useEffect } from 'react';
import { Card } from '@rneui/base';

export default function FCDetailedPushOrder(props) {

    return (
        <Card style={styles.container} borderColor="#E1EAF9">
            <Text style={styles.title}>{props.medName}</Text>
            <Text style={styles.body}>כמות ששוריינה: {props.poQty}</Text>
            {props.orderStatus === "I" && (
                <>
                    <Text style={styles.body}>כמות שהונפקה: {props.supQty}</Text>
                </>
            )}
        </Card>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        marginBottom: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
        color: "#003D9A",
        flexDirection: 'row',
    },
    body: {
        marginVertical: 10,
        color: "#003D9A",
    },
});