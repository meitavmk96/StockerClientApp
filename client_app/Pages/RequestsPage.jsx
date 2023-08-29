import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import MyRequestsPage from './MyRequestsPage';
import OthersRequestsPage from './OthersRequestsPage';

export default function RequestsPage(props) {

  const { requiredPage } = props.route.params;

  const [showMy, setShowMy] = useState(true);
  const [selectedButton, setSelectedButton] = useState(0);
  const [isChanged, setIsChanged] = useState(false);

    useEffect(() => {
      if (requiredPage === 'others') {
        setShowMy(false);
        setSelectedButton(1);
      }
      else {
        setShowMy(true);
        setSelectedButton(0);
      }
    }, [requiredPage]);
  
    const handleButtonPress = (buttonNumber, buttonType) => {
      setSelectedButton(buttonNumber);
      if (buttonType === 'MyReq') {
        setShowMy(true);
      } else {
        setShowMy(false);
      }
    };

    useFocusEffect(
      React.useCallback(() => {
        setIsChanged(true);
        return () => {
        };
      }, []));
  
  const handleIsChanged = (state) => {
    setIsChanged(state);
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity style={[styles.button, selectedButton === 0 && styles.selectedButton]} onPress={() => handleButtonPress(0, 'MyReq')}>
          <Text style={[styles.buttonText, selectedButton === 0 && styles.selectedButtonText]}>בקשות שלי</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, selectedButton === 1 && styles.selectedButton]} onPress={() => handleButtonPress(1, 'OthersReq')}>
          <Text style={[styles.buttonText, selectedButton === 1 && styles.selectedButtonText]} >בקשות של אחרים</Text>
        </TouchableOpacity>
      </View>
      {showMy ? <MyRequestsPage isChanged={isChanged} handleIsChanged={handleIsChanged} /> : <OthersRequestsPage/>}

    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  button: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    margin: 0,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },

  selectedButton: {
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  buttonText: {
    color: '#00317D',
    fontSize: 16,
    textAlign: 'center',
  },
  selectedButtonText: {
    fontWeight: "bold",
    textShadowColor: '#CCCCCC',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
});