import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'

export default function FCFilters(props) {
  const [selectedButtons, setSelectedButtons] = useState([]);

  const handleButtonPress = (buttonType) => {
    if (buttonType === 'W') {
      if (selectedButtons.includes('W') !== true) {
        setSelectedButtons([...selectedButtons, 'W']);
      }
      else {
        setSelectedButtons(selectedButtons.filter(button => button !== 'W'));
      }
    }
    if (buttonType === 'A') {
      if (selectedButtons.includes('A') !== true) {
        setSelectedButtons([...selectedButtons, 'A']);
      }
      else {
        setSelectedButtons(selectedButtons.filter(button => button !== 'A'));
      }
    }
    if (buttonType === 'T') {
      if (selectedButtons.includes('T') !== true) {
        setSelectedButtons([...selectedButtons, 'T']);
      }
      else {
        setSelectedButtons(selectedButtons.filter(button => button !== 'T'));
      }
    }
    if (buttonType === 'R') {
      if (selectedButtons.includes('R') !== true) {
        setSelectedButtons([...selectedButtons, 'R']);
      }
      else {
        setSelectedButtons(selectedButtons.filter(button => button !== 'R'));
      }
    }
    if (buttonType === 'I') {
      if (selectedButtons.includes('I') !== true) {
        setSelectedButtons([...selectedButtons, 'I']);
      }
      else {
        setSelectedButtons(selectedButtons.filter(button => button !== 'I'));
      }
    }
  };

  useEffect(() => {
    props.HandleSelectedFilters(selectedButtons);
  }, [selectedButtons]) // did update

  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {props.parent === 'MyRequestsPage' && (<>
          <TouchableOpacity style={[styles.button, selectedButtons.includes('W') && styles.selectedButton]} onPress={() => handleButtonPress('W')}>
            <Text style={[styles.buttonText, selectedButtons.includes('W') && styles.selectedButtonText]}>בהמתנה</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, selectedButtons.includes('A') && styles.selectedButton]} onPress={() => handleButtonPress('A')}>
            <Text style={[styles.buttonText, selectedButtons.includes('A') && styles.selectedButtonText]} >מאושר</Text>
          </TouchableOpacity>
        </>
        )}
        {props.parent === 'PullOrdersPage' && (<>
          <TouchableOpacity style={[styles.button, selectedButtons.includes('W') && styles.selectedButton]} onPress={() => handleButtonPress('W')}>
            <Text style={[styles.buttonText, selectedButtons.includes('W') && styles.selectedButtonText]}>בהמתנה</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, selectedButtons.includes('T') && styles.selectedButton]} onPress={() => handleButtonPress('T')}>
            <Text style={[styles.buttonText, selectedButtons.includes('T') && styles.selectedButtonText]} >בטיפול</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, selectedButtons.includes('I') && styles.selectedButton]} onPress={() => handleButtonPress('I')}>
            <Text style={[styles.buttonText, selectedButtons.includes('I') && styles.selectedButtonText]} >הונפק</Text>
          </TouchableOpacity>
        </>
        )}
        {props.parent === 'PushOrdersPage' && (<>
          <TouchableOpacity style={[styles.button, selectedButtons.includes('R') && styles.selectedButton]} onPress={() => handleButtonPress('R')}>
            <Text style={[styles.buttonText, selectedButtons.includes('R') && styles.selectedButtonText]}>שוריין</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, selectedButtons.includes('I') && styles.selectedButton]} onPress={() => handleButtonPress('I')}>
            <Text style={[styles.buttonText, selectedButtons.includes('I') && styles.selectedButtonText]} >הונפק</Text>
          </TouchableOpacity>
        </>
        )}
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  button: {
    backgroundColor: '#fff',
    borderColor: '#E1EAF9',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 14,
    color: '#868F97',
    textAlign: 'center',
  },
  selectedButton: {
    borderColor: '#527FA1',
  },
  selectedButtonText: {
    color: '#527FA1',
    fontWeight: 'bold'
  },
});