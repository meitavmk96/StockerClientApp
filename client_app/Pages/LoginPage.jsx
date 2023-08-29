import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Linking, Modal } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RegisterForPushNotifications } from '../FunctionalComps/RegisterForPushNotifications';
import { GlobalContext } from '../GlobalData/GlobalData';
import FCAnimatedLogo from '../FunctionalComps/FCAnimatedLogo';

const phoneNumber = '04-3252532';

export default function LoginPage(props) {

  const apiUrlLogin = 'https://proj.ruppin.ac.il/cgroup36/prod/api/User/Login';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [testMessage, setTextMessage] = useState('');

  //----------------------------PUT TOKEN---------------------------------
  const { apiUrlPutToken } = useContext(GlobalContext);
  const createToken = (userId) => {
    RegisterForPushNotifications().then((token) => {
      console.log(token)
      fetch(apiUrlPutToken + "userId/" + `${userId}`, {
        method: 'PUT',
        body: JSON.stringify(token),
        headers: new Headers({
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json; charset=UTF-8',
        })
      })
        .then(res => {
          return res.json()
        })
        .then(
          (result) => {
          },
          (error) => {
            console.log("err get=", error);
          });
    })
  }

  //-----------------------------Phone Press Linking----------------------
  const handlePhonePress = () => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  //-------------------הפעלת הפו אחרי הצלחה של התחברות-------------------
  const { setDepId } = useContext(GlobalContext);

  const getDepID = () => {
    try {
      AsyncStorage.getItem('User', (err, result) => {
        if (result != null) {
          setDepId(JSON.parse(result).depId);
        }
      });
    } catch (e) {
      // error reading value
    }
  };

  //-------------------------------Login User-----------------------------
  const handleLogin = (e) => {

    e.preventDefault();//prevent submitting the form

    const LoginUser = { //יצירת אובייקט לפי השדות במחלקה
      Username: username,
      Password: password,
    };

    if (username && password) { //both fields are filled
      fetch(apiUrlLogin, {
        method: 'POST',
        body: JSON.stringify(LoginUser),
        headers: new Headers({
          'Content-type': 'application/json; charset=UTF-8',
          'Accept': 'application/json; charset=UTF-8',
        })
      })
        .then(response => {
          return response.json();
        })
        .then(
          (result) => {
            console.log(result);
            if (result.username != null) {
              if (result.jobType == 'N') {
                try {//Inserting user information into AsyncStorage
                  const userData = JSON.stringify(result)
                  AsyncStorage.setItem('User', userData, () => {
                    getDepID();
                    createToken(result.userId);
                    props.navigation.navigate('ראשי');
                  });
                } catch (e) {
                  // saving error
                }
              }
              else {
                setTextMessage("שגיאה, משתמש אינו אחות");
                setModalVisible(true);
              };
            }
            else {
              setTextMessage("שגיאה, משתמש לא קיים");
              setModalVisible(true);
            };
          },
          (error) => {
            console.log("error,", error);
          });
    }
    else {// one or both fields are empty
      setTextMessage("אנא מלא את כל השדות");
      setModalVisible(true);
    }
  }

  //-------------------------------Get Meds-----------------------------

  const { apiUrlMeds, setMeds, meds } = useContext(GlobalContext);

  useEffect(() => {
    fetch(apiUrlMeds, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json; charset=UTF-8',
        'Accept': 'application/json; charset=UTF-8',
      })
    })
      .then(res => {
        return res.json()
      })
      .then(
        (result) => {
          setMeds(result);
        },
        (error) => {
          console.log("err get=", error);
        });
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setUsername('');
      setPassword('');
    }, [])
  );//did unmount

  return (
    <View style={styles.container}>
      <FCAnimatedLogo></FCAnimatedLogo>
      <Text style={styles.title}>Stocker</Text>
      <TextInput
        style={styles.input}
        placeholder="שם משתמש"
        value={username}
        onChangeText={(text) => setUsername(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="סיסמה"
        secureTextEntry={true}
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>התחברות</Text>
      </TouchableOpacity>
      <Text style={styles.info}>לתקלות וליצירת משתמש חדש יש לפנות למחלקת מערכות מידע</Text>
      <TouchableOpacity onPress={handlePhonePress}>
        <Text style={styles.phoneNumber}>{phoneNumber}</Text>
      </TouchableOpacity>
      <View style={styles.centeredView}>
        <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => { this.setState({ modalVisible: !modalVisible }); }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{testMessage}</Text>
              <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>סגור</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginTop: 150,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    textAlign: 'center',
    marginBottom: 15,
    color: '#003D9A',
    marginTop: 20,
    textShadowColor: '#CCCCCC',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 5,
  },
  info: {
    fontSize: 12,
    marginTop: 30,
    color: '#003D9A',
  },
  phoneNumber: {
    fontSize: 12,
    color: '#00317D',
    textDecorationLine: 'underline',
  },
  input: {
    borderWidth: 1,
    borderColor: '#00317D',
    borderRadius: 5,
    padding: 10,
    width: '80%',
    marginBottom: 10,
    textAlign: 'right',
    color: '#00317D',
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#00317D',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalButton: {
    backgroundColor: '#00317D',
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
