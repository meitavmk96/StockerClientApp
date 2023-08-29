import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { format } from 'date-fns';

export default function FCDateTime(props) {

    const date = props.date.split(' ')[0];//סידור פורמט התאריך
    const formattedDate = format(new Date(date), 'dd/MM/yyyy');
    const time = props.date.substring(11, 16);//שליפת השעה

    const dateTimeStyle = [styles.DateTime];

    if (props.isNorm) {
        // Add additional styles for the 'isNorm' case
        dateTimeStyle.push(styles.DateTimeNorm);
    }

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={dateTimeStyle}>{time}</Text>
            <Text style={dateTimeStyle}> {formattedDate}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    DateTime: {
        fontSize: 14,
        color: "#003D9A",
        marginRight: 10,
        alignItems: 'center',
    },
    DateTimeNorm: {
        color: '#95A5AF', 
    },
});