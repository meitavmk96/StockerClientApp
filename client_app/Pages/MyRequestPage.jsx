import { View, Text, StyleSheet } from 'react-native';
//import React from 'react';
import React, { useEffect } from 'react';
import FCMyRequests from '../FunctionalComps/FCMyRequests';

export default function MyRequestPage(props) {

  const { requestId, requestsList, ReqDeps } = props.route.params;

  useEffect(() => {
    console.log("ReqDeps:", ReqDeps);
  }, []);

  let request = requestsList.filter((item) => item.reqId === requestId);//get the request item to read 

  return (
    <View style={styles.container}>
      <FCMyRequests RequestsList={request} isDetailedRequest={true} ReqDeps={ReqDeps} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
});