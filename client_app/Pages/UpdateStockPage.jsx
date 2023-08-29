import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Animated, Modal, Date } from 'react-native';
import React, { useContext, useRef, useEffect, useState } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Icon } from '@rneui/themed';

import { GlobalContext } from '../GlobalData/GlobalData';
import FCMedsInStock from '../FunctionalComps/FCMedsInStock';
import FCSearchBar from '../FunctionalComps/FCSearchBar ';
import FCMedInput from '../FunctionalComps/FCMedInput';
import FCQuantityInput from '../FunctionalComps/FCQuantityInput';

export default function UpdateStockPage(props) {
  const navigation = useNavigation();

  const { depId, apiUrlGetStock, meds, setMedsInStockUpdate, medsInStockUpdate } = useContext(GlobalContext);

  const [medsInStock, setMedsInStock] = useState([]);
  const [medsStockSearch, setMedsStockSearch] = useState([]);//מערך לרנדור 

  const [isChanged, setIsChanged] = useState(false);
  const [clearSearch, setClearSearch] = useState(false);

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
          setMedsInStockUpdate(result);
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
      setMedsStockSearch(medsInStock);
    }, []));

  const handleSearch = (search) => {
    const filteredMedIds = medsInStockUpdate.filter((item) => item.stcQty !== 0);

    const filtermedsInStock = medsInStock.filter((item1) =>
      filteredMedIds.some((item2) => item1.medId === item2.medId)
    );

    if (filtermedsInStock.length !== 0) {
      const filtered = filtermedsInStock.filter(item =>
        item.medName.toLowerCase().includes(search.toLowerCase())
      );
      setMedsStockSearch(filtered);
    }
  };

  //הוספת תרופה למחסן
  const AddMedToStock = () => {
    if (selectedMedId === null) {
      setIsMovePage(false);
      setTextMessage('יש לבחור תרופה');
      setModalVisible(true);
    }
    else if (medsInStockUpdate.find((med) => med.medId === selectedMedId && med.stcQty === 0)) {
      const med = meds.find((med) => med.medId === selectedMedId)
      const index = medsInStockUpdate.findIndex(item => item.medId === selectedMedId);

      const medToChange = {
        medId: selectedMedId,
        stcQty: Qty,
        medName: med.medName
      };
      medsInStockUpdate[index] = medToChange;
      setMedsInStockUpdate(medsInStockUpdate);

      setMedsStockSearch(medsInStock => [...medsInStock, medToChange]);//כדי לרנדר למסך
      setIsModalAddVisible(false);
    }
    else if (medsInStockUpdate.find((med) => med.medId === selectedMedId)) {
      setIsMovePage(false);
      setTextMessage('תרופה זו כבר קיימת במחסן');
      setModalVisible(true);
      setClearForm(true);
    }
    else {//do update

      const med = meds.find((med) => med.medId === selectedMedId)

      const medToAdd = {
        medId: selectedMedId,
        stcQty: Qty,
        medName: med.medName
      };

      setMedsStockSearch(medsInStock => [...medsInStock, medToAdd]);//כדי לרנדר למסך
      setMedsInStockUpdate(medsInStockUpdate => [...medsInStockUpdate, medToAdd]);
      setIsModalAddVisible(false);
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    if (isMovePage) {
      navigation.navigate("צפייה במחסן");
    }
  };

  //מחיקה תרופה במחסן
  const RemoveMedFromList = (Id2Remove) => {

    const MedRemoveForRender = medsStockSearch.filter((med) => med.medId !== Id2Remove);//הורדת התרופה מהרנדור
    setMedsStockSearch(MedRemoveForRender);

    //שינוי הכמות של התרופה ל0 בשביל לשלוח לשרת
    const med = meds.find((med) => med.medId === Id2Remove)
    const index = medsInStockUpdate.findIndex(item => item.medId === Id2Remove);

    const medToChange = {
      medId: Id2Remove,
      stcQty: 0,
      medName: med.medName
    };

    medsInStockUpdate[index] = medToChange;
    setMedsInStockUpdate(medsInStockUpdate);
  };

  //ביטול בקשה שינוי מחסן
  const handleDeleteStockUpdate = () => {
    setMedsStockSearch(medsInStock);
    const MedInStockUpdate = medsInStock.map(item => {
      return {
        medId: item.medId,
        stcQty: item.stcQty,
        medName: item.medName
      };
    });
    setMedsInStockUpdate(MedInStockUpdate);
    navigation.navigate("צפייה במחסן");
  };

  //שמירת השינוים במחסן 
  const handleSendStockUpdate = () => {

    const StockUpdate = {
      medsInStockUpdate: medsInStockUpdate
    };

    console.log(StockUpdate,1);

    fetch(apiUrlGetStock + 'UpdateNurse/depId/' + `${depId}`, {
      method: 'PUT',
      body: JSON.stringify(StockUpdate),
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
            setTextMessage("המחסן עודכן בהצלחה");
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
      <Text style={styles.title}>עדכון מחסן מחלקתי</Text>
      <View style={styles.row}>
        <View style={{ flex: 7 }}><FCSearchBar handleSearch={handleSearch} clearSearch={clearSearch} handleSetClearSearch={(state) => setClearSearch(state)} /></View>
      </View>
      <View style={styles.scrollViewContainer}>
        <ScrollView scrollEventThrottle={16}>
          <FCMedsInStock ListMeds={medsStockSearch} isRequest={true} SendId2Remove={RemoveMedFromList} />
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
        <TouchableOpacity style={[styles.button, { backgroundColor: '#5D9C59' }]} onPress={() => handleSendStockUpdate()}>
          <Text style={styles.buttonText}>עדכון המחסן</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#CF2933' }]} onPress={() => handleDeleteStockUpdate()}>
          <Text style={styles.buttonText} >ביטול העדכון</Text>
        </TouchableOpacity>
      </View>


      {/*  ----------MODAL Add Med-------- */}
      <Modal visible={isModalAddVisible} animationType="slide" transparent={true} onRequestClose={() => setIsModalAddVisible(false)}>
          <View style={styles.modalView}>
            <FCMedInput sendMedSelect={(medId) => setSelectedMedId(medId)} clearForm={clearForm} handleSetClearForm={(state) => setClearForm(state)} />
            <FCQuantityInput reqQty={1} sendQty={(Qty) => setQty(Qty)} clearForm={clearForm} handleSetClearForm={(state) => setClearForm(state)} />
            <View style={styles.row}>
              <TouchableOpacity style={[styles.button, { backgroundColor: '#5D9C59' }]} onPress={AddMedToStock}>
                <Text style={styles.buttonText}>הוספה</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, { backgroundColor: '#CF2933' }]} onPress={() => setIsModalAddVisible(false)}>
                <Text style={styles.buttonText}>ביטול</Text>
              </TouchableOpacity>
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
