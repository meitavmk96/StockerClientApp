import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import React, { useContext, useState, useEffect, useRef } from 'react';
import { Icon } from '@rneui/themed';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { GlobalContext } from '../GlobalData/GlobalData';
import FCPullOrders from '../FunctionalComps/FCPullOrders';
import FCSearchBar from '../FunctionalComps/FCSearchBar ';
import FCFilter from '../FunctionalComps/FCFilter';
import FCFilters from '../FunctionalComps/FCFilters';

export default function PullOrdersPage(props) {
  const navigation = useNavigation();

  const { apiUrlPullOrder, depId } = useContext(GlobalContext);
  const [pullOrders, setPullOrders] = useState([]);
  const [PullOrdersSearch, setPullOrdersSearch] = useState([]);
  const [ShowStatusFilter, setShowStatusFilter] = useState('false');
  const [clearSearch, setClearSearch] = useState(false);

  //----------------------GET PullOrders---------------------
  useEffect(() => {
    fetch(apiUrlPullOrder + 'GetPullOrders/depId/' + `${depId}`, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json; charset=UTF-8',
        'Accept': 'application/json; charset=UTF-8',
      })
    })
      .then(result => {
        return result.json();
      })
      .then(
        (result) => {
          setPullOrders(result);
          setPullOrdersSearch(result);
          if (props.isChanged) {
            props.handleIsChanged(false);
          }
        },
        (error) => {
          console.log("err get=", error);
        });
  }, [props.isChanged])

  useFocusEffect(
    React.useCallback(() => {
      setClearSearch(true);
    }, []));

  const handleSearch = (search) => {
    if (pullOrders.length !== 0) {
      const filtered = pullOrders.filter(item =>
        item.nurseName.toLowerCase().includes(search.toLowerCase()) ||
        item.orderId.toString().toLowerCase().includes(search.toString().toLowerCase()) ||
        item.pharmacistName.toLowerCase().includes(search.toLowerCase())
      );
      setPullOrdersSearch(filtered);
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
      const filtered = pullOrders.filter(item => SelectedFiltersArray.includes(item.orderStatus));
      setPullOrdersSearch(filtered);
      console.log(PullOrdersSearch);
    }
    else {
      setPullOrdersSearch(pullOrders);
      console.log(PullOrdersSearch);
    }
  };

  //useEffect hook to clear filters on unmount
  useFocusEffect(
    React.useCallback(() => {
      setShowStatusFilter('false');
      setPullOrdersSearch([]);
      return () => {
      };
    }, []));

  //animation for add BTN to stick to screen while scroll
  const scrollY = useRef(new Animated.Value(0)).current;//set the current state of y axe value

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={{ flex: 7 }}><FCSearchBar handleSearch={handleSearch} clearSearch={clearSearch} handleSetClearSearch={(state) => setClearSearch(state)} /></View>
        <View style={{ flex: 1 }}><FCFilter HandleFilterPress={HandleFilterPress} /></View>
      </View>
      {ShowStatusFilter === 'true' && (
        <View style={[styles.row, { paddingHorizontal: 10 }]}>
          <FCFilters HandleSelectedFilters={HandleSelectedFilters} parent={'PullOrdersPage'} />
        </View>
      )}
      <View style={styles.scrollViewContainer}>
        <ScrollView scrollEventThrottle={16}>
          <FCPullOrders PullOrdersList={PullOrdersSearch} />
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
          <TouchableOpacity onPress={() => navigation.navigate('יצירת הזמנת משיכה')}>
            <Icon name='add' color='white' />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  )
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
  searchContainer: {
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
    marginTop: 20,
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


