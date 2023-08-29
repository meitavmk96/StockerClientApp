import { Text, View, StyleSheet, ScrollView } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { GlobalContext } from '../GlobalData/GlobalData';
import FCMedsInStock from '../FunctionalComps/FCMedsInStock';
import FCSearchBar from '../FunctionalComps/FCSearchBar ';

export default function StocksPage(props) {

    const { depId, apiUrlGetStock } = useContext(GlobalContext);
    const [medsInStock, setMedsInStock] = useState([]);
    const [isChanged, setIsChanged] = useState(false);
    const [clearSearch, setClearSearch] = useState(false);
    const [medsStockSearch, setMedsStockSearch] = useState([]);

    //----------------------GET Norm---------------------
    useEffect(() => {
        fetch(apiUrlGetStock + `${depId}`, {
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
                    setMedsInStock(result);
                    setMedsStockSearch(result);
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
        if (medsInStock.length !== 0) {
            const filtered = medsInStock.filter(item =>
                item.medName.toLowerCase().includes(search.toLowerCase())
            );
            setMedsStockSearch(filtered);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>מחסן מחלקתי</Text>
            <View style={styles.row}>
                <View style={{ flex: 7 }}><FCSearchBar handleSearch={handleSearch} clearSearch={clearSearch} handleSetClearSearch={(state) => setClearSearch(state)} /></View>
            </View>
            <View style={styles.scrollViewContainer}>
                <ScrollView scrollEventThrottle={16}>
                    <FCMedsInStock ListMeds={medsStockSearch} isRequest={false} />
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