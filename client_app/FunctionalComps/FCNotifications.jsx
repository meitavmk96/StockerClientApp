import { View, StyleSheet } from 'react-native';
import React from 'react';
import FCNotification from './FCNotification';

export default function FCNotifications(props) {

    let notificationsStr = props.NotificationsList.map((notification, key) => {
        return <FCNotification
            id={notification.msgId}
            pharmacistName={notification.pharmacistName}
            msg={notification.msg}
            date={notification.msgDate}
            key={notification.msgId}
        />;
    })

    return (
        <View style={styles.container}>
            {notificationsStr}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});