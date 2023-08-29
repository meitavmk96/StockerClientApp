import { View, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import React, { useContext, useRef, useEffect, useState } from 'react';
import { Icon } from '@rneui/themed';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import * as Notifications from "expo-notifications";

import { GlobalContext } from '../GlobalData/GlobalData';
import FCMyRequests from '../FunctionalComps/FCMyRequests';
import FCSearchBar from '../FunctionalComps/FCSearchBar ';
import FCFilter from '../FunctionalComps/FCFilter';
import FCFilters from '../FunctionalComps/FCFilters';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function MyRequestsPage(props) {
  const navigation = useNavigation();

  const { apiUrlMedRequest, depId, myMedReqs, setMyMedReqs } = useContext(GlobalContext);
  const [ReqsSearch, setReqsSearch] = useState([]);
  const [ShowStatusFilter, setShowStatusFilter] = useState('false');
  const [clearSearch, setClearSearch] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch(apiUrlMedRequest + 'RequestsMine/' + `${depId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json; charset=UTF-8',
        }
      });
      const result = await res.json();
      setMyMedReqs(result); // set the requests of chosen dep to display
      setReqsSearch(result);
      /* 
      if (props.isChanged) {
        props.handleIsChanged(false);
      }
      */
    } catch (error) {
      console.log("err post=", error);
    }
  };

  //----------------------GET Requests details ---------------------
  useEffect(() => {
    fetch(apiUrlMedRequest + 'RequestsMine/' + `${depId}`, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json; charset=UTF-8',
        'Accept': 'application/json; charset=UTF-8',
      })
    })
      .then(res => {
        return res.json()
      })
      .then(
        (result) => {
          setMyMedReqs(result); //set the requests of choosen dep to display
          setReqsSearch(result);
          if (props.isChanged) {
            props.handleIsChanged(false);
          }
        },
        (error) => {
          console.log("err post=", error);
        });
  }, [props.isChanged]) // did update

  useFocusEffect(
    React.useCallback(() => {
      setClearSearch(true);
    }, []));

  const handleSearch = (search) => {
    if (myMedReqs.length !== 0) {
      const filtered = myMedReqs.filter(item => {
        if (item.aNurseName.toLowerCase() === "user user") {
          return item.medName.toLowerCase().includes(search.toLowerCase()) ||
            item.cNurseName.toLowerCase().includes(search.toLowerCase());
        } else {
          return item.medName.toLowerCase().includes(search.toLowerCase()) ||
            item.cNurseName.toLowerCase().includes(search.toLowerCase()) ||
            item.aNurseName.toLowerCase().includes(search.toLowerCase());
        }
      });
      setReqsSearch(filtered);
    }
  };

  const HandleFilterPress = () => {
    if (ShowStatusFilter === 'false') {
      setShowStatusFilter('true');
    }
    else {
      setShowStatusFilter('false');
    }
  };

  const HandleSelectedFilters = (SelectedFiltersArray) => {
    if (SelectedFiltersArray.length !== 0) {
      const filtered = myMedReqs.filter(item => SelectedFiltersArray.includes(item.reqStatus));
      setReqsSearch(filtered);
    }
    else {
      setReqsSearch(myMedReqs);
    }
  };

  //useEffect hook to clear filters on unmount
  useFocusEffect(
    React.useCallback(() => {
      setShowStatusFilter('false');
      setReqsSearch([]);
      return () => {
      };
    }, []));


  //animation for add BTN to stick to screen while scroll
  const scrollY = useRef(new Animated.Value(0)).current;//set the current state of y axe value

  //----------------------GET Notification---------------------
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      console.log("Notification Received");
      setNotification(notification);
      console.log(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(async (response) => {
      console.log("Notification Response Received");
      const { data } = response.notification.request.content;
      const requestId = data.requestId;
      await fetchData(); // Call fetchData and wait for it to complete
      const ReqDeps = [];
      console.log(requestId);
      console.log(myMedReqs);
      navigation.navigate('צפייה בפרטי בקשה', { requestId, myMedReqs, ReqDeps });
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={{ flex: 7 }}><FCSearchBar handleSearch={handleSearch} clearSearch={clearSearch} handleSetClearSearch={(state) => setClearSearch(state)} /></View>
        <View style={{ flex: 1 }}><FCFilter HandleFilterPress={HandleFilterPress} /></View>
      </View>
      {ShowStatusFilter === 'true' && (
        <View style={[styles.row, { paddingHorizontal: 10 }]}>
          <FCFilters HandleSelectedFilters={HandleSelectedFilters} parent={'MyRequestsPage'} />
        </View>
      )}
      <View style={styles.scrollViewContainer}>
        <ScrollView scrollEventThrottle={16}>
          <FCMyRequests RequestsList={ReqsSearch} isDetailedRequest={false} />
        </ScrollView>
        <Animated.View
          style={[styles.AddBTN, {
            transform: [{
              translateY: scrollY.interpolate({
                inputRange: [0, 100],
                outputRange: [0, 100],
                extrapolate: 'clamp'
              })
            }]
          }]}>
          <TouchableOpacity onPress={() => navigation.navigate('יצירת בקשה')}>
            <Icon name='add' color='white' />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  scrollViewContainer: {
    flex: 1,
    position: 'relative',
  },
  title: {
    fontSize: 25,
    textAlign: 'center',
    marginBottom: 15,
    color: '#003D9A',
    marginTop: 0,
  },
  AddBTN: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#003D9A',
    borderRadius: 100,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});