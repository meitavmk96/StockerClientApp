import { Text, View, StyleSheet, ScrollView} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { GlobalContext } from '../GlobalData/GlobalData';
import FCDateTime from '../FunctionalComps/FCDateTime';
import FCMedsInNorm from '../FunctionalComps/FCMedsInNorm';
import FCSearchBar from '../FunctionalComps/FCSearchBar ';

export default function NormPage(props) {

  const { depId, apiUrlGetNorm } = useContext(GlobalContext);
  const [medsInNorm, setMedsInNorm] = useState([]);
  const [isChanged, setIsChanged] = useState(false);
  const [updateTime, setUpdateTime] = useState('');
  const [clearSearch, setClearSearch] = useState(false);
  const [medsNormSearch, setMedsNormSearch] = useState([]);
 
  //----------------------GET Norm---------------------
  useEffect(() => {
    fetch(apiUrlGetNorm + 'depId/' + `${depId}`, {
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
          setMedsInNorm(result[0].medList);
          setUpdateTime(result[0].lastUpdate);
          setMedsNormSearch(result[0].medList);
        },
        (error) => {
          console.log("err get=", error);
        });
    return () => {
      setIsChanged(false);
    }
  }, [isChanged]);

  useFocusEffect(
    React.useCallback(() => {
      setIsChanged(true);
      setClearSearch(true);
    }, []));

  const handleSearch = (search) => {
    if (medsInNorm.length !== 0) {
      const filtered = medsInNorm.filter(item =>
        item.medName.toLowerCase().includes(search.toLowerCase())
      );
      setMedsNormSearch(filtered);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>תקן מחלקתי</Text>
      {updateTime !== '' && <View style={styles.updateTime}><FCDateTime date={updateTime} isNorm={true} /></View>}
      <View style={styles.row}>
        <View style={{ flex: 7 }}><FCSearchBar handleSearch={handleSearch} clearSearch={clearSearch} handleSetClearSearch={(state) => setClearSearch(state)} /></View>
      </View>
      <View style={styles.scrollViewContainer}>
        <ScrollView scrollEventThrottle={16}>
          <FCMedsInNorm ListMeds={medsNormSearch} isRequest={false} />
        </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: '#fff',
  },
  updateTime: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: 'center',
    marginBottom: 10,
    color: '#003D9A',
    marginTop: 20,
    textShadowColor: '#CCCCCC',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 5,
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
});