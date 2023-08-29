import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';

import { GlobalContext } from '../GlobalData/GlobalData';
import FCLogout from '../FunctionalComps/FCLogout';

export default function HomePage() {

  const { getUserData } = useContext(GlobalContext);

  const [requiredOrderPage, setRequiredOrderPage] = useState('');
  const [requiredRequestPage, setRequiedRequestPage] = useState('');
  const [isHeadNurse, setIsHeadNurse] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    if (requiredOrderPage) {
      navigation.navigate('הזמנות', { requiredPage: requiredOrderPage });
    }
    if (requiredRequestPage) {
      navigation.navigate('בקשות', { requiredPage: requiredRequestPage });
    }
  }, [requiredOrderPage, requiredRequestPage]);

  useFocusEffect(
    React.useCallback(() => {
      setRequiredOrderPage('');
      setRequiedRequestPage('');
      GetIfHeadNurse();
      return () => {
        // Clean up the effect when the screen goes out of focus
      };
    }, [])
  );

  const GetIfHeadNurse = async () => {
    const user = await getUserData();
    if (user.position == 'head nurse') {
      setIsHeadNurse(true);
    }
}

return (
  <View style={styles.container}>
    <View >
      <FCLogout />
      <Text style={styles.title}>Stocker</Text>
    </View>
    <ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('יצירת בקשה')}>
          <Image source={require("../Images/question.png")} style={styles.buttonImage} />
          <Text style={styles.buttonText}>יצירת בקשה</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("יצירת הזמנת משיכה")}>
          <Image source={require("../Images/order.png")} style={styles.buttonImage} />
          <Text style={styles.buttonText}>יצירת הזמנה</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => { setRequiedRequestPage('my'); }}>
          <Image source={require("../Images/take.png")} style={styles.buttonImage} />
          <Text style={styles.buttonText}>בקשות המחלקה שלי</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => { setRequiedRequestPage('others'); }}>
          <Image source={require("../Images/give.png")} style={styles.buttonImage} />
          <Text style={styles.buttonText}>בקשות מחלקות אחרות</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => { setRequiredOrderPage('pull'); }}>
          <Image source={require("../Images/pull.png")} style={styles.buttonImage} />
          <Text style={styles.buttonText}>הזמנות משיכה</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => { setRequiredOrderPage('push'); }}>
          <Image source={require("../Images/push.png")} style={styles.buttonImage} />
          <Text style={styles.buttonText}>הזמנות דחיפה</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => { navigation.navigate('צפייה בתקן'); }}>
          <Image source={require("../Images/validity.png")} style={styles.buttonImage} />
          <Text style={styles.buttonText}>תקן המחלקה</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => { navigation.navigate('יצירת בקשה לשינוי תקן'); }}>
          <Image source={require("../Images/chat.png")} style={styles.buttonImage} />
          <Text style={styles.buttonText}>בקשה לשינוי תקן</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => { navigation.navigate('צפייה במחסן'); }}>
          <Image source={require("../Images/factory.png")} style={styles.buttonImage} />
          <Text style={styles.buttonText}>מחסן המחלקה</Text>
        </TouchableOpacity>
        {!isHeadNurse && (
          <>
            <TouchableOpacity style={styles.button} onPress={() => { navigation.navigate('הודעות'); }}>
              <Image source={require("../Images/email.png")} style={styles.buttonImage} />
              <Text style={styles.buttonText}>הודעות</Text>
            </TouchableOpacity>
          </>
        )}
        {isHeadNurse && (
          <>
            <TouchableOpacity style={styles.button} onPress={() => { navigation.navigate('עדכון המחסן'); }}>
              <Image source={require("../Images/production.png")} style={styles.buttonImage} />
              <Text style={styles.buttonText}>עדכון המחסן</Text>
            </TouchableOpacity>
          </>
        )}

      </View>
    </ScrollView>
  </View>
)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    textAlign: 'center',
    color: '#003D9A',
    marginTop: 5,
    textShadowColor: '#CCCCCC',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    margin: 10,
    width: 150,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.7,
    shadowRadius: 5,
    elevation: 8,
  },
  buttonText: {
    color: '#00317D',
    fontSize: 16,
    textAlign: 'center',
    textShadowColor: '#CCCCCC',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  buttonImage: {
    width: 40,
    height: 40,
  },
});