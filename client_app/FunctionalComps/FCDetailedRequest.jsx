import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState, useContext, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

import { GlobalContext } from '../GlobalData/GlobalData';

import FCQuantityInput from './FCQuantityInput';
import FCMedInput from './FCMedInput';
import FCDateTime from './FCDateTime';
import FCstaticDepTypeList from './FCstaticDepTypeList';

export default function FCDetailedRequest(props) {

  const navigation = useNavigation();

  const { depId, apiUrlMedRequest, DepTypes } = useContext(GlobalContext);

  const [Qty, setQty] = useState(props.reqQty);
  const [selectedMedId, setSelectedMedId] = useState(null);
  const [clearForm, setClearForm] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [textMessage, setTextMessage] = useState('');
  const [isSuccessModal, setIsSuccessModal] = useState(false);
  const [isUpdateAllowed, setIsUpdateAllowed] = useState(false);

  const handleSetClearForm = (state) => {
    setClearForm(state);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    if (isSuccessModal) {
      setClearForm(true);
      setIsUpdateAllowed(false);
      navigation.navigate('בקשות');
    }
  };

  const GetQtyFromInput = (Qty) => {
    setQty(Qty);
    setIsUpdateAllowed(true);
  }

  const handleSelectMed = (medId) => {
    setSelectedMedId(medId);
    setIsUpdateAllowed(true);
  };

  //עדכון העברה
  const handleUpdateRequest = () => {

    const SelectedDepTypes = DepTypes.filter(depType => depType.isChecked).map(depType => depType.name);

    const MedRequest = { //יצירת אובייקט לפי השדות במחלקה
      "reqId": props.id,
      "cUser": props.cNurseId,
      "aUser": props.aNurseId,
      "cDep": depId,
      "aDep": props.aDepId,
      "medId": selectedMedId ? selectedMedId : props.medId,
      "reqQty": Qty,
      "reqStatus": props.reqStatus,
      "reqDate": props.date
    };

    const dataToSend = {
      medRequest: MedRequest,
      depTypes: SelectedDepTypes
    };

    //-------------------------------PUT medReqs------------------------------------
    if (isUpdateAllowed === true) {
      fetch(apiUrlMedRequest + "WaitingReq/" + `${props.id}`, {
        method: 'PUT',
        body: JSON.stringify(dataToSend),
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
      alert('יש לבצע שינויים בבקשה על מנת לעדכן')
    }
  };

  //מחיקת בקשה
  const handleDeleteRequest = (idToDelete) => {
    //-------------------------------Delete medReqs------------------------------------
    fetch(apiUrlMedRequest + `${idToDelete}`, {
      method: 'DELETE',
      headers: new Headers({
        'Content-type': 'application/json; charset=UTF-8',
        'Accept': 'application/json; charset=UTF-8',
      })
    })
      .then(res => {
        return res.json()
      })
      .then(
        (result) => {
          if (result) {
            setIsSuccessModal(true);
            setTextMessage('הבקשה נמחקה בהצלחה');
            setModalVisible(true);
          }
          else {
            setIsSuccessModal(false);
            setTextMessage("יש בעיה בשרת");
            setModalVisible(true);
          };
        },
        (error) => {
          console.log("err delete=", error);
        });
  };

  //אישור העברה
  const handleApproveRequest = () => {
    fetch(apiUrlMedRequest + "TransportRe/" + `${props.id}` + "/kind/A", {
      method: 'PUT',
      headers: new Headers({
        'Content-type': 'application/json; charset=UTF-8',
        'Accept': 'application/json; charset=UTF-8',
      })
    })
      .then(res => {
        return res;
      })
      .then((result) => {
        if (result) {
          setIsSuccessModal(true);
          setTextMessage('הבקשה הועברה בהצלחה');
          setModalVisible(true);
        }
        else {
          setIsSuccessModal(false);
          setTextMessage("יש בעיה בשרת");
          setModalVisible(true);
        };
      }, (error) => {
        console.log("err put=", error);
      });
  };

  //ביטול העברה
  const handleCancelRequest = () => {
    fetch(apiUrlMedRequest + "TransportRe/" + `${props.id}` + "/kind/C", {
      method: 'PUT',
      headers: new Headers({
        'Content-type': 'application/json; charset=UTF-8',
        'Accept': 'application/json; charset=UTF-8',
      })
    })
      .then(res => {
        return res;
      })
      .then((result) => {
        if (result) {
          setIsSuccessModal(true);
          setTextMessage('הבקשה בוטלה בהצלחה');
          setModalVisible(true);
        }
        else {
          setIsSuccessModal(false);
          setTextMessage("יש בעיה בשרת");
          setModalVisible(true);
        };
      }, (error) => {
        console.log("err put=", error);
      });
  };

  return (
    <View style={styles.container}>
      {/* ----------------------------------שורת סטטוס ותאריך-------------------------- */}
      <View style={{ ...styles.row, marginBottom: 40 }}>
        <View ><FCDateTime date={props.date} /></View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {props.reqStatus === 'A' && (
            <>
              <Text style={{ color: '#5D9C59' }}>מאושר</Text>
            </>
          )}
          {props.reqStatus === 'W' && (
            <>
              <Text style={{ color: '#DF2E38' }}>בהמתנה</Text>
            </>
          )}
          {props.reqStatus === 'D' && <Text>נדחה</Text>}
        </View>
      </View>

      {/* --------------------------------------תוכן וכפתורים------------------------------ */}
      {props.reqStatus === 'A' && (
        <>
          <Text style={styles.title}>{props.medName}</Text>
          <Text style={styles.body}><Text>כמות: </Text>{props.reqQty}</Text>
          <Text style={styles.body}><Text>שם יוצר ההזמנה: </Text>{props.cNurseName}</Text>
          <Text style={styles.body}><Text>שם המחלקה שאישרה: </Text>{props.aDepName}</Text>
          <View style={styles.row}>
            <TouchableOpacity style={[styles.button, { backgroundColor: '#5D9C59' }]} onPress={() => handleApproveRequest()}>
              <Text style={styles.buttonText}>אישור העברה</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, { backgroundColor: '#CF2933' }]} onPress={() => handleCancelRequest()}>
              <Text style={styles.buttonText}>ביטול העברה</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      {props.reqStatus === 'W' && (
        <>
          <Text style={{ ...styles.body, fontSize: 17 }}><Text style={{ fontSize: 17 }} >שם יוצר ההזמנה: </Text>{props.cNurseName}</Text>
          <View style={styles.body}><FCMedInput medName={props.medName} sendMedSelect={handleSelectMed} clearForm={clearForm} handleSetClearForm={handleSetClearForm} /></View>
          <View style={styles.body}><FCQuantityInput reqQty={props.reqQty} sendQty={GetQtyFromInput} /></View>
          <View style={styles.body}><FCstaticDepTypeList ReqDeps={props.ReqDeps} /></View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity style={[styles.button, { backgroundColor: '#5D9C59', flex: 1 }]} onPress={() => handleUpdateRequest()}>
              <Text style={styles.buttonText}>עדכון</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, { backgroundColor: '#CF2933', flex: 1 }]} onPress={() => handleDeleteRequest(props.id)}>
              <Text style={styles.buttonText} >מחיקת בקשה</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      <View style={styles.centeredView}>
        <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => { this.setState({ modalVisible: !modalVisible }); }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{textMessage}</Text>
              <TouchableOpacity style={styles.button} onPress={handleModalClose}>
                <Text style={styles.buttonText}>סגור</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#003D9A",
  },
  body: {
    marginVertical: 10,
    color: "#003D9A",
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
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
  button: {
    backgroundColor: '#00317D',
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
