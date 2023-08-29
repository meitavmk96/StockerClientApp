import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import PushOrdersPage from './PushOrdersPage';
import PullOrdersPage from './PullOrdersPage';
import { useEffect } from 'react';

export default function OrdersPage(props) {

  const { requiredPage } = props.route.params;

  const [showPull, setShowPull] = useState();
  const [selectedButton, setSelectedButton] = useState();
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    if (requiredPage === 'pull') {
      setShowPull(true);
      setSelectedButton(0);
    }
    else {
      setShowPull(false);
      setSelectedButton(1);
    }
  }, [requiredPage]);

  const handleButtonPress = (buttonNumber, buttonType) => {
    setSelectedButton(buttonNumber);
    if (buttonType === 'Pull') {
      setShowPull(true);
    } else {
      setShowPull(false);
    }
  };

   useFocusEffect(
    React.useCallback(() => {
      setIsChanged(true);
      return () => {
      };
    }, []));

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity style={[styles.button, selectedButton === 0 && styles.selectedButton]} onPress={() => handleButtonPress(0, 'Pull')}>
          <Text style={[styles.buttonText, selectedButton === 0 && styles.selectedButtonText]}>משיכה</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, selectedButton === 1 && styles.selectedButton]} onPress={() => handleButtonPress(1, 'Push')}>
          <Text style={[styles.buttonText, selectedButton === 1 && styles.selectedButtonText]} >דחיפה</Text>
        </TouchableOpacity>
      </View>
      {showPull ? <PullOrdersPage isChanged={isChanged} handleIsChanged={(state) => setIsChanged(state)} /> : <PushOrdersPage />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    borderBottomWidth: 2,
    borderBottomColor: '#F5F5F5',
  },
  selectedButton: {
    borderBottomWidth: 2,
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