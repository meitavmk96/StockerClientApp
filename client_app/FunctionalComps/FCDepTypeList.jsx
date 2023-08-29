import { View, Text, StyleSheet, FlatList } from 'react-native';
import Checkbox from 'expo-checkbox';
import React, { useState, useContext, useEffect } from 'react';
import { GlobalContext } from '../GlobalData/GlobalData';
import { useFocusEffect } from '@react-navigation/native';

export default function FCDepTypeList(props) {

    //-----------------------------Dep Type List------------------------------------
    const [isChecked, setChecked] = useState(null); //Send to all deps checkBox status (init value is checked)
    const { DepTypes, setDepTypes } = useContext(GlobalContext);

/*     useEffect(() => {
        console.log('ReqDeps', props.ReqDeps);
        if (props.ReqDeps !== undefined) {
          setDepTypes(props.ReqDeps);
        }
      }, []); */

    /*     const setInitDeps = (Deps) => {
            setDepTypes(Deps);
            console.log('here', DepTypes)
        }; */

    const handleChange = (ChosenDepName) => { //A specific dep type checkbox is checked
        let temp = DepTypes.map((DepType) => { //find the Chosen Dep and add to temp array
            if (ChosenDepName === DepType.name) {
                return { ...DepType, isChecked: !DepType.isChecked };
            }
            return DepType;
        });
        setDepTypes(temp);//set the depTypes array for temp
    };

    useEffect(() => {
        console.log('DepTypes:', DepTypes);
        if (DepTypes.every((item) => item.isChecked === true)) {
            setChecked(true);
        }
        else {
            setChecked(false);
        }
    }, [DepTypes]);

    useFocusEffect(
        React.useCallback(() => {
            setChecked(true); // Reset the isChecked state to its initial value
            const initDepTypes = DepTypes.map((depType) => ({// Reset the isChecked state of DepTypes to their initial value -> true
                ...depType,
                isChecked: true,
            }));
            setDepTypes(initDepTypes);

            return () => {
                // Clean up the effect when the screen goes out of focus
            };
        }, [])
    );

    return (
        <View>
            <View style={styles.row}>
                <Checkbox style={styles.CB} color={isChecked ? '#003D9A' : undefined} value={isChecked} onValueChange={setChecked} />
                <Text style={styles.CB_txt}>שלח לכל המחלקות</Text>
            </View >
            <View style={styles.depsCB}>
                {!isChecked && <FlatList //when Send to all deps checkBox status is false (unchecked) show all checkboxs options
                    data={DepTypes}
                    renderItem={({ item }) => (
                        <View style={styles.row}>
                            <Checkbox style={styles.CB} color={item.isChecked ? '#003D9A' : undefined} value={item.isChecked} onValueChange={() => handleChange(item.name)} />
                            <Text style={styles.CB_txt}>{item.name}</Text>
                        </View>
                    )}
                />}
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