import { View, Text, StyleSheet, FlatList } from 'react-native';
import Checkbox from 'expo-checkbox';
import React, { useState, useContext, useEffect } from 'react';
import { GlobalContext } from '../GlobalData/GlobalData';
import { useFocusEffect } from '@react-navigation/native';


export default function FCstaticDepTypeList(props) {

    //-----------------------------Dep Type List------------------------------------
    const [isChecked, setChecked] = useState(null); //Send to all deps checkBox status (init value is checked)
    const [selectedDepTypes, setSelectedDepTypes] = useState(props.ReqDeps);

    useFocusEffect(
        React.useCallback(() => {
            setSelectedDepTypes(props.ReqDeps); // Reset the isChecked state to its initial value
            return () => {
                // Clean up the effect when the screen goes out of focus
            };
        }, [])
    );

    return (
        <View>
          <View style={styles.row}>
            <Checkbox
              style={styles.CB}
              color={isChecked ? '#003D9A' : undefined}
              value={isChecked}
              disabled={true}
            />
            <Text style={styles.CB_txt}>שלח לכל המחלקות</Text>
          </View>
          <View style={styles.depsCB}>
            {!isChecked && (
              <FlatList
                data={selectedDepTypes}
                renderItem={({ item }) => (
                  <View style={styles.row}>
                    <Checkbox
                      style={styles.CB}
                      color={item.isChecked ? '#003D9A' : undefined}
                      value={item.isChecked}
                      disabled={true}
                    />
                    <Text style={styles.CB_txt}>{item.name}</Text>
                  </View>
                )}
              />
            )}
          </View>
        </View>
      );
    }
const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
    },
    CB: {
        marginRight: 5,
    },
    AllRow: {
        flexDirection: 'row',
    },
    CB_txt: {
        fontSize: 16,
        color: '#003D9A'
    },
    depsCB: {
        marginLeft: 25,
        marginTop: 10,
    },

});