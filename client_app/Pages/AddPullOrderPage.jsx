import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal } from 'react-native';
import React, { useState, useContext, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Icon, Card } from 'react-native-elements';
import { GlobalContext } from '../GlobalData/GlobalData';

import FCMedsInOrder from '../FunctionalComps/FCMedsInOrder';
import FCMedInput from '../FunctionalComps/FCMedInput';
import FCQuantityInput from '../FunctionalComps/FCQuantityInput';


export default function AddPullOrderPage(props) {

    const { apiUrlPullOrder, getUserData } = useContext(GlobalContext);

    const [selectedMedId, setSelectedMedId] = useState(null);
    const [Qty, setQty] = useState(1);
    const [medsOrderList, setMedsOrderList] = useState([]);
    const [clearForm, setClearForm] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
    const [textMessage, setTextMessage] = useState('');
    const [isSuccessModal, setIsSuccessModal] = useState(false);

    const handleModalClose = () => {
        setModalVisible(false);
        if (isSuccessModal) {
            props.navigation.navigate('הזמנות', { requiredPage: 'pull' });
        }
    };

    const DeleteMedFromOrder = (medId2Delete) => {
        setMedsOrderList(medsOrderList.filter((med) => med.medId !== medId2Delete));
    }

    const AddMed2Order = () => {
        if (selectedMedId != null) {
            let existingMed = medsOrderList.find(med => med.medId === selectedMedId);
            if (!existingMed) { //If the selected medication wasn't added to order already, add med to order list     
                const medInOrder = {
                    medId: selectedMedId,
                    poQty: Qty,
                    supQty: 0,
                    mazNum: ""
                }
                setMedsOrderList([...medsOrderList, medInOrder]);
                setQty(1);
            }
            else {
                setIsSuccessModal(false);
                setTextMessage('תרופה זו כבר קיימת בהזמנה');
                setModalVisible(true);
            }
            setClearForm(true);
        }
        else {
            setIsSuccessModal(false);
            setTextMessage('יש לבחור תרופה להוספה');
            setModalVisible(true);
        }
    };

    const handleAddPullOrder = async () => {

        const user = await getUserData();
        const currentDate = new Date();
        const pullOrder = {
            orderId: 0,
            depId: user.depId,
            pUser: 0,
            reportNum: "",
            status: "W",
            orderDate: currentDate,
            lastUpdate: currentDate,
            medList: medsOrderList,
            nUser: user.userId
        };

        //-------------------------------Post pullOrder----------------------------------
        fetch(apiUrlPullOrder, {
            method: 'POST',
            body: JSON.stringify(pullOrder),
            headers: new Headers({
                'Content-type': 'application/json; charset=UTF-8',
                'Accept': 'application/json; charset=UTF-8',
            })
        })
            .then(res => {
                return res.json();
            })
            .then((result) => {
                if (result) {
                    setMedsOrderList([]);
                    setIsSuccessModal(true);
                    setTextMessage("הזמנה התווספה בהצלחה");
                    setModalVisible(true);
                }
                else {
                    setIsSuccessModal(false);
                    setTextMessage("שגיאה, יש בעיה בשרת");
                    setModalVisible(true);
                }
            }, (error) => {
                console.log("err post=", error);
            });
    };

    useFocusEffect(
        React.useCallback(() => {
          setMedsOrderList([]); // Update medsOrderList to an empty array
          setClearForm(true);
        }, [])
      );//did unmount

    return (
        <View style={styles.container}>
            <Text style={styles.title}>יצירת הזמנה:</Text>
            <Card borderColor='#E1EAF9'>
                <FCMedInput sendMedSelect={(medId) => setSelectedMedId(medId)} clearForm={clearForm} handleSetClearForm={(state) => setClearForm(state)} />
                <FCQuantityInput reqQty={1} sendQty={(Qty) => setQty(Qty)} clearForm={clearForm} handleSetClearForm={(state) => setClearForm(state)} />
                <TouchableOpacity style={styles.AddBTN} onPress={() => AddMed2Order()}>
                    <Icon name='add' color='white' />
                </TouchableOpacity>
            </Card>
            {medsOrderList.length > 0 && (
                <View>
                    <View>
                        <Text style={styles.subTitle}>פירוט הזמנה:</Text>
                        <ScrollView style={styles.ScrollView}>
                            <FCMedsInOrder medsOrderList={medsOrderList} SendId2Delete={DeleteMedFromOrder} />
                        </ScrollView>
                    </View>
                    <View>
                        <TouchableOpacity style={styles.sendBTN} onPress={() => handleAddPullOrder()}>
                            <Text style={styles.BTNtext}>שליחה</Text>
                        </TouchableOpacity>
                    </View>
                </View>
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
    ScrollView: {
        height: 320,
    },
    subTitle: {
        fontSize: 18,
        textAlign: 'center',
        color: '#003D9A',
        marginTop: 30,
    },
    AddBTN: {
        borderRadius: 100,
        backgroundColor: '#003D9A',
        height: 30,
        width: 30,
        bottom: 0,
        marginBottom: 5,
        marginTop: 5,
        alignSelf: 'center',
        justifyContent: 'center',
    },
    sendBTN: {
        backgroundColor: '#00317D',
        padding: 10,
        borderRadius: 5,
        width: '30%',
        alignSelf: 'center',
    },
    BTNtext: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
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
