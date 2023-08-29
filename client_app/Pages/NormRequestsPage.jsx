import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Animated, Modal, Date } from 'react-native';
import React, { useContext, useRef, useEffect, useState } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Icon } from '@rneui/themed';

import { GlobalContext } from '../GlobalData/GlobalData';
import FCDateTime from '../FunctionalComps/FCDateTime';
import FCMedsInNorm from '../FunctionalComps/FCMedsInNorm';
import FCSearchBar from '../FunctionalComps/FCSearchBar ';
import FCMedInput from '../FunctionalComps/FCMedInput';
import FCQuantityInput from '../FunctionalComps/FCQuantityInput';

export default function NormRequestsPage(props) {
  const navigation = useNavigation();

  const { depId, apiUrlGetNorm, apiUrlGetNormReq, meds, getUserData, setMedsInNormReq, medsInNormReq } = useContext(GlobalContext);

  const [medsInNorm, setMedsInNorm] = useState([]);
  const [medsNormSearch, setMedsNormSearch] = useState([]);//מערך לרנדור 
  const [isChanged, setIsChanged] = useState(false);
  const [updateTime, setUpdateTime] = useState('');
  const [clearSearch, setClearSearch] = useState(false);
  const [normId, setNormId] = useState([]);


  const [isModalAddVisible, setIsModalAddVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [textMessage, setTextMessage] = useState('');
  const [isMovePage, setIsMovePage] = useState(false);
  const [clearForm, setClearForm] = useState(false);

  const [selectedMedId, setSelectedMedId] = useState(null);
  const [Qty, setQty] = useState(1);

  //animation for add BTN to stick to screen while scroll
  const scrollY = useRef(new Animated.Value(0)).current;//set the current state of y axe value

  //----------------------GET Norm---------------------
  useEffect(() => {
    fetch(apiUrlGetNorm + 'depId/' + `${depId}`, {
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
          setMedsInNorm(result[0].medList);
          const MedInNormReq = result[0].medList.map(item => {
            return {
              medId: item.medId,
              reqQty: item.normQty,
              medName: item.medName
            };
          });
          setMedsInNormReq(MedInNormReq);
          setMedsNormSearch(result[0].medList);
          setNormId(result[0].normId);
          setUpdateTime(result[0].lastUpdate);
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
      setMedsNormSearch(medsInNorm);
    }, []));

  const handleSearch = (search) => {
    const filteredMedIds = medsInNormReq.filter((item) => item.reqQty !== 0);

    const filtermedsInNorm = medsInNorm.filter((item1) =>
      filteredMedIds.some((item2) => item1.medId === item2.medId)
    );

    if (filtermedsInNorm.length !== 0) {
      const filtered = filtermedsInNorm.filter(item =>
        item.medName.toLowerCase().includes(search.toLowerCase())
      );
      setMedsNormSearch(filtered);
    }
  };

  //הוספת תרופה לבקשה לשינוי תקן
  const AddMedToNormReq = () => {
    if (selectedMedId === null) {
      setIsMovePage(false);
      setTextMessage('יש לבחור תרופה');
      setModalVisible(true);
    }
    else if (medsInNormReq.find((med) => med.medId === selectedMedId && med.reqQty === 0)) {
      const med = meds.find((med) => med.medId === selectedMedId)
      const index = medsInNormReq.findIndex(item => item.medId === selectedMedId);

      const medToChange = {
        medId: selectedMedId,
        reqQty: Qty,
        medName: med.medName
      };
      medsInNormReq[index] = medToChange;
      setMedsInNormReq(medsInNormReq);

      const medToAddRender = {
        medId: selectedMedId,
        normQty: Qty,
        medName: med.medName
      };
      setMedsNormSearch(medsInNorm => [...medsInNorm, medToAddRender]);//כדי לרנדר למסך
      setIsModalAddVisible(false);
    }
    else if (medsInNormReq.find((med) => med.medId === selectedMedId)) {
      setIsMovePage(false);
      setTextMessage('תרופה זו כבר קיימת בהזמנה');
      setModalVisible(true);
      setClearForm(true);
    }
    else {//do update

      const med = meds.find((med) => med.medId === selectedMedId)
      const medToAdd = {
        medId: selectedMedId,
        reqQty: Qty,
        medName: med.medName
      };

      const medToAddRender = {
        medId: selectedMedId,
        normQty: Qty,
        medName: med.medName
      };

      setMedsNormSearch(medsInNorm => [...medsInNorm, medToAddRender]);//כדי לרנדר למסך
      setMedsInNormReq(medsInNormReq => [...medsInNormReq, medToAdd]);
      setIsModalAddVisible(false);
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    if (isMovePage) {
      navigation.navigate("צפייה בתקן");
    }
  };

  //מחיקה תרופה לבקשה לשינוי תקן
  const RemoveMedFromList = (Id2Remove) => {

    const MedRemoveForRender = medsNormSearch.filter((med) => med.medId !== Id2Remove);//הורדת התרופה מהרנדור
    setMedsNormSearch(MedRemoveForRender);

    //שינוי הכמות של התרופה ל0 בשביל לשלוח לשרת
    const med = meds.find((med) => med.medId === Id2Remove)
    const index = medsInNormReq.findIndex(item => item.medId === Id2Remove);

    const medToChange = {
      medId: Id2Remove,
      reqQty: 0,
      medName: med.medName
    };
    medsInNormReq[index] = medToChange;
    setMedsInNormReq(medsInNormReq);
  };

  //ביטול בקשה לשינוי תקן
  const handleDeleteNormReq = () => {
    setMedsNormSearch(medsInNorm);
    const MedInNormReq = medsInNorm.map(item => {
      return {
        medId: item.medId,
        reqQty: item.normQty,
        medName: item.medName
      };
    });
    setMedsInNormReq(MedInNormReq);
    navigation.navigate("צפייה בתקן");
  };

  //שליחת בקשה לשינוי תקן
  const handleSendNormReq = async () => {
    const user = await getUserData();

    const normReq = {
      reqId: 0,
      normId: normId,
      reqDate: "2023-05-18T21:44:48.658Z",
      userId: user.userId,
      reqStatus: "string",
      depId: 0,
      depName: "string",
      fullName: "string",
      position: "string",
      medReqList: medsInNormReq
    };

    fetch(apiUrlGetNormReq, {
      method: 'POST',
      body: JSON.stringify(normReq),
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
          if (result) {
            setIsMovePage(true);
            setTextMessage("הבקשה נשלחה בהצלחה");
            setModalVisible(true);
          }
        },
        (error) => {
          console.log("err put=", error);
        });
    setIsModalAddVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>תקן מחלקתי</Text>
      {updateTime !== '' && <View style={styles.updateTime}><FCDateTime date={updateTime} isNorm={true} /></View>}
      <View style={styles.row}>
        <View style={{ flex: 7 }}><FCSearchBar handleSearch={handleSearch} clearSearch={clearSearch} handleSetClearSearch={(state) => setClearSearch(state)} /></View>
      </View>
      <View style={styles.scrollViewContainer}>
        <ScrollView scrollEventThrottle={16}>
          <FCMedsInNorm ListMeds={medsNormSearch} isRequest={true} SendId2Remove={RemoveMedFromList} />
        </ScrollView>
        <Animated.View
          style={[styles.AddBTN, {
            transform: [{
              translateY: scrollY.interpolate({
                inputRange: [0, 100],
                outputRange: [0, 100],
                extrapolate: 'clamp'
              })
            }]
          }]}>
          <TouchableOpacity onPress={() => setIsModalAddVisible(true)}>
            <Icon name='add' color='white' />
          </TouchableOpacity>
        </Animated.View>
      </View>
      <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#5D9C59' }]} onPress={() => handleSendNormReq()}>
          <Text style={styles.buttonText}>שליחת בקשה</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#CF2933' }]} onPress={() => handleDeleteNormReq()}>
          <Text style={styles.buttonText} >ביטול בקשה</Text>
        </TouchableOpacity>
      </View>

      {/*  ----------MODAL Add Med-------- */}
      <Modal visible={isModalAddVisible} animationType="slide" transparent={true} onRequestClose={() => setIsModalAddVisible(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <FCMedInput sendMedSelect={(medId) => setSelectedMedId(medId)} clearForm={clearForm} handleSetClearForm={(state) => setClearForm(state)} />
            <FCQuantityInput reqQty={1} sendQty={(Qty) => setQty(Qty)} clearForm={clearForm} handleSetClearForm={(state) => setClearForm(state)} />
            <View style={styles.row}>
              <TouchableOpacity style={[styles.button, { backgroundColor: '#5D9C59' }]} onPress={AddMedToNormReq}>
                <Text style={styles.buttonText}>הוספה</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, { backgroundColor: '#CF2933' }]} onPress={() => setIsModalAddVisible(false)}>
                <Text style={styles.buttonText}>ביטול</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/*  ----------MODAL Note-------- */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => { this.setState({ modalVisible: !modalVisible }); }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{textMessage}</Text>
            <TouchableOpacity style={styles.modalButton} onPress={handleModalClose}>
              <Text style={styles.buttonText}>סגור</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: '#fff',
  },
  updateTime:{
    justifyContent: 'center',
    alignItems: 'center',
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
  button: {
    flex: 1,
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
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#00317D',
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
  AddBTN: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#003D9A',
    borderRadius: 100,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
