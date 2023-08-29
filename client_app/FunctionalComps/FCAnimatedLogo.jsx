import React from 'react'
import { Animated, Image, View, StyleSheet } from 'react-native';

const AnimatedImage = Animated.createAnimatedComponent(Image);
const animatedValue = new Animated.Value(0);

export default function FCAnimatedLogo() {

  Animated.timing(animatedValue, {
    toValue: 1,
    duration: 1000,
    useNativeDriver: true
  }).start();

  return (
    <View>
      <AnimatedImage
        source={require('../Images/logo.png')}
        style={styles.logo}
      />
    </View>
  )
}
const styles = StyleSheet.create({
  logo: {
    transform: [
      {
        rotate: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg']
        })
      }
    ],
    width: 86,
    height: 80,
  },
});