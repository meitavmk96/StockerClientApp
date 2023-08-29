import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import React, { useContext, useState, useEffect } from 'react';


import { GlobalContext } from '../GlobalData/GlobalData';
import FCNotifications from '../FunctionalComps/FCNotifications';

export default function NotificationPage() {

    const { apiUrlNotification } = useContext(GlobalContext);
    const [notifications, setNotifications] = useState(null);
   
    //----------------------GET Notification---------------------
    useEffect(() => {
        fetch(apiUrlNotification, {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json; charset=UTF-8',
                'Accept': 'application/json; charset=UTF-8',
            })
        })
            .then(res => {
                return res.json();
            })
            .then(
                (result) => {
                    setNotifications(result); //set the notifications of choosen dep to display
                },
                (error) => {
                    console.log("err get=", error);
                });
    }, []) // did mount

    return (
        <View style={styles.container}>
            <Text style={styles.title}>הודעות מבית מרקחת</Text>
            {notifications !== null && (
                <ScrollView>
                    <FCNotifications NotificationsList={notifications} />
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
});
