import { View, Text } from 'react-native';
import React from 'react';

import FCMedInStock from './FCMedInStock';

export default function FCMedsInStock(props) {
    const MedsStockStr = props.ListMeds.map((medStock, key) => {
        return <FCMedInStock
            id={medStock.medId}
            stcQty={medStock.stcQty}
            medName={medStock.medName}
            key={medStock.medId}
            isRequest={props.isRequest}
            getId2Delete={() => props.SendId2Remove(medStock.medId)}
        />;
    })

    return (
        <View>
            {MedsStockStr}
        </View>
    )
}