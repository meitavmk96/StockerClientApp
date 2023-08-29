import { View, Image, TouchableOpacity, StyleSheet } from 'react-native'
import React, {useContext} from 'react'
import { useNavigation } from '@react-navigation/native';

import { GlobalContext } from '../GlobalData/GlobalData';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FCLogout() {

    const navigation = useNavigation();
    const { setDepId } = useContext(GlobalContext);

    const handleLogout = () => {
        try {
            // Clearing user information from AsyncStorage
            AsyncStorage.clear(() => {
              setDepId("");
              navigation.navigate('התחברות');
            });
          } catch (e) {
            // error clearing AsyncStorage
          }
    };

    return (
        <View>
            <TouchableOpacity onPress={() => handleLogout()}>
                <Image source={require("../Images/logout.png")} style={styles.Image} />
            </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
    Image: {
      width: 25,
      height: 25,
      marginTop:20,
      marginLeft:20,
    },
  });