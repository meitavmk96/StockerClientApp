import React, { useState, useContext, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import { GlobalContext } from '../GlobalData/GlobalData';
import FCDepTypeList from '../FunctionalComps/FCDepTypeList';
import FCMedInput from '../FunctionalComps/FCMedInput';
import FCQuantityInput from '../FunctionalComps/FCQuantityInput';

export default function AddRequestPage(props) {

  const { apiUrlMedRequest, getUserData, DepTypes } = useContext(GlobalContext);

  const [selectedMedId, setSelectedMedId] = useState(null);
  const [Qty, setQty] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [textMessage, setTextMessage] = useState('');
  const [isSuccessModal, setIsSuccessModal] = useState(false);
  const [clearForm, setClearForm] = useState(false);

  const handleModalCloseAdd = () => {
    setModalVisible(false);
    setClearForm(true);
    if (isSuccessModal) {
      props.navigation.navigate('בקשות', { requiredPage: 'my' });
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setClearForm(true);
    }, []));

  const handleAddRequest = async () => {
    if (selectedMedId != null) {
      const SelectedDepTypes = DepTypes.filter(depType => depType.isChecked).map(depType => depType.name);
      const user = await getUserData();

      const request = {
        cUser: user.userId,
        cDep: user.depId,
        medId: selectedMedId,
        reqQty: Qty,
        depTypes: SelectedDepTypes,
      };

      //-------------------------------Post request----------------------------------
      fetch(apiUrlMedRequest, {
        method: 'POST',
        body: JSON.stringify(request),
        headers: new Headers({
          'Content-type': 'application/json; charset=UTF-8',
          'Accept': 'application/json; charset=UTF-8',
        })
      })
        .then(res => {
          return res;
        })
        .then((result) => {
          if (result.status >= 200 && result.status < 300) {
            result.text().then(text => {
              setIsSuccessModal(true);
              setTextMessage(text);
              setModalVisible(true);
            });
          } else if (result.status >= 400 && result.status <= 500) {
            result.text().then(text => {
              setIsSuccessModal(false);
              setTextMessage(text);
              setModalVisible(true);
            });
          }
        }, (error) => {
          console.log("err post=", error);
        });
    }
    else {
      setIsSuccessModal(false);
      setTextMessage('יש לבחור תרופה להוספה');
      setModalVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>יצירת בקשה</Text>
      <FCMedInput sendMedSelect={(medId) => setSelectedMedId(medId)} clearForm={clearForm} handleSetClearForm={(state) => setClearForm(state)} />
      <FCQuantityInput reqQty={1} sendQty={(Qty) => setQty(Qty)} clearForm={clearForm} handleSetClearForm={(state) => setClearForm(state)} />
      <FCDepTypeList/>
      <TouchableOpacity style={styles.button} onPress={() => handleAddRequest()}>
        <Text style={styles.buttonText}>אישור</Text>
      </TouchableOpacity>
      <View style={styles.centeredView}>
        <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => { this.setState({ modalVisible: !modalVisible }); }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{textMessage}</Text>
              <TouchableOpacity style={styles.button} onPress={handleModalCloseAdd}>
                <Text style={styles.buttonText}>סגור</Text>
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
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: 'center',
    marginBottom: 20,
    color: '#003D9A',
    marginTop: 20,
    textShadowColor: '#CCCCCC',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 5,
  },
  fields: {
    fontSize: 17,
    color: "#003D9A",
    width: 100,
    marginRight: 10,
    fontWeight: 'bold',
  },
  button: {
    width: 100,
    alignSelf: 'center',
    backgroundColor: '#003D9A',
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2, },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
