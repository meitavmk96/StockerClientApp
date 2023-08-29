import { View, Text } from 'react-native'
import React from 'react'
import FCOthersRequest from './FCOthersRequest'

export default function FCOthersRequests(props) {

  const requestsStr = props.RequestsList.map((request, key) => {
    return <FCOthersRequest
      id={request.reqId}
      cdepName={request.depName}
      cDepId={request.cDepId}
      cNurseName={request.cNurseName}
      aDepId={request.aDep}
      date={request.reqDate}
      medName={request.medName}
      reqQty={request.reqQty}
      stcQty={request.stcQty}
      reqStatus={request.reqStatus}
      handleIsStatusChanged={props.handleIsStatusChanged}
      requestsList={props.RequestsList}
      key={request.reqId}
    />;
  })
  return (
    <View>
      {requestsStr}
    </View>
  )
}