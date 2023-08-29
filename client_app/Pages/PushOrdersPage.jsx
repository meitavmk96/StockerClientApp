import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React, { useContext, useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { GlobalContext } from '../GlobalData/GlobalData';
import FCPushOrders from '../FunctionalComps/FCPushOrders';
import FCSearchBar from '../FunctionalComps/FCSearchBar ';
import FCFilter from '../FunctionalComps/FCFilter';
import FCFilters from '../FunctionalComps/FCFilters';

export default function PushOrdersPage() {

  const { apiUrlPushOrder, depId } = useContext(GlobalContext);
  const [pushOrders, setPushOrders] = useState([]);
  const [PushOrdersSearch, setPushOrdersSearch] = useState([]);
  const [ShowStatusFilter, setShowStatusFilter] = useState('false');
  const [clearSearch, setClearSearch] = useState(false);

  //----------------------GET PushOrder---------------------
  useEffect(() => {
    fetch(apiUrlPushOrder + 'GetPushOrders/depId/' + `${depId}`, {
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
          setPushOrders(result);
          setPushOrdersSearch(result);
        },
        (error) => {
          console.log("err get=", error);
        });
  }, [])

  useFocusEffect(
    React.useCallback(() => {
      setClearSearch(true);
    }, []));

  const handleSearch = (search) => {
    if (pushOrders.length !== 0) {
      const filtered = pushOrders.filter(item =>
        item.pharmacistName.toLowerCase().includes(search.toLowerCase()) ||
        item.orderId.toString().toLowerCase().includes(search.toString().toLowerCase())
      );
      setPushOrdersSearch(filtered);
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
      const filtered = pushOrders.filter(item => SelectedFiltersArray.includes(item.orderStatus));
      setPushOrdersSearch(filtered);
    }
    else{
      setPushOrdersSearch(pushOrders);
    }
  };

  //useEffect hook to clear filters on unmount
  useFocusEffect(
    React.useCallback(() => {
      setShowStatusFilter('false');
      setPushOrdersSearch([]);
      return () => {
      };
    }, []));

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={{ flex: 7 }}><FCSearchBar handleSearch={handleSearch} clearSearch={clearSearch} handleSetClearSearch={(state) => setClearSearch(state)} /></View>
        <View style={{ flex: 1 }}><FCFilter HandleFilterPress={HandleFilterPress} /></View>
      </View>
      {ShowStatusFilter === 'true' && (
        <View style={[styles.row, { paddingHorizontal: 10 }]}>
          <FCFilters HandleSelectedFilters={HandleSelectedFilters} parent={'PushOrdersPage'} />
        </View>
      )}
      <View style={styles.scrollViewContainer}>
        <ScrollView scrollEventThrottle={16}>
          <FCPushOrders pushOrdersList={PushOrdersSearch} />
        </ScrollView>
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