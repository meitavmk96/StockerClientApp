import React from 'react';
import { View, StyleSheet } from 'react-native';

import FCDetailedRequest from './FCDetailedRequest';
import FCMyRequest from './FCMyRequest';

export default function FCMyRequests(props) {
    let requestsStr;
    if (props.isDetailedRequest === true) {
        requestsStr = props.RequestsList.map((request, key) => {
            return <FCDetailedRequest
                id={request.reqId}
                date={request.reqDate}
                medId={request.medId}
                medName={request.medName}
                cNurseId={request.cUserId}
                cNurseName={request.cNurseName}
                aDepId={request.aDepId}
                aDepName={request.aDepName}
                aNurseId={request.aUserId}
                aNurseName={request.aNurseName}
                reqQty={request.reqQty}
                reqStatus={request.reqStatus}
                requestsList={props.RequestsList}
                ReqDeps={props.ReqDeps}
                key={request.reqId}
            />;
        })
    }
    else {
        requestsStr = props.RequestsList.map((request, key) => {
            return <FCMyRequest
                id={request.reqId}
                date={request.reqDate}
                medId={request.medId}
                medName={request.medName}
                cNurseId={request.cUserId}
                cNurseName={request.cNurseName}
                aDepId={request.aDepId}
                aDepName={request.aDepName}
                aNurseId={request.aUserId}
                reqQty={request.reqQty}
                reqStatus={request.reqStatus}
                requestsList={props.RequestsList}
                key={request.reqId}
            />;
        })
    }


    return (
        <View style={styles.container}>
            {requestsStr}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      marginBottom: 90,
    },
  });