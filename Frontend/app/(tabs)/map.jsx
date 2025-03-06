import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const MapPage = () => {
  const handlePress1 = () => {
    console.log('Button 1 Pressed');
  };

  const handlePress2 = () => {
    console.log('Button 2 Pressed');
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftButtonContainer}>
        <TouchableOpacity style={styles.drXButton} onPress={handlePress1}>
          <Text style={styles.buttonText}>Dr X movements</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity style={styles.ticketsButton} onPress={handlePress2}>
          <Text style={styles.buttonText}>Tickets</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#000000',
    fontSize: 5,
    fontWeight: 'bold',
  },
  drXButton: {
    backgroundColor: '#ff7f7f', // Red color for "Dr X movements" button
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: 50,
    alignItems: 'center',
  },
  ticketsButton: {
    backgroundColor: '#add8e6', // Blue color for "Tickets" button
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: 50,
    alignItems: 'center',
  },
  leftButtonContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    flex: 1, // This makes the container take up all available space vertically
  },
  bottomButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
});

export default MapPage;

