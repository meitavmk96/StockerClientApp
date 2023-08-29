import { View } from 'react-native';
import React from 'react';

import FCDetailedPullOrder from './FCDetailedPullOrder';

export default function FCDetailedPullOrders(props) {
    let medsInOrderPullStr = props.medsInOrderList.map((med, key) => {
        return <FCDetailedPullOrder
            id={med.medId}
            medName={med.medName}
            poQty={med.poQty}
            supQty={med.supQty}
            isWaitingOrder={props.isWaitingOrder}
            //pullOrder={props.pullOrder}
            medsInOrderList={props.medsInOrderList}
            getId2Delete={() => props.SendId2Remove(med.medId)}
            key={med.medId}
        />;
    })

    return (
        <View>
            {medsInOrderPullStr}
        </View>
    )
}