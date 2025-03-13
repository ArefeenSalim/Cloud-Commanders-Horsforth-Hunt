import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const app = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>YOUR COLOUR</Text>
      <Text style={styles.text2}>Colour</Text>
      <Text style={styles.text3}>Waiting for the host to start...............</Text>
    </View>
    
  )
}

export default app

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
    width: '100%',
    height: '100%',
    marginHorizontal: 'auto',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  text: {
    fontSize: 70,
    textAlign: 'center',
    color: '#dddd91',
  },
  text2: {
    fontSize: 70,
    textAlign: 'center',
    color: '#dddd91',
  },
  text3: {
    fontSize: 20,
    color: '#dddd91',
    textAlign: 'center',
  }
})
