import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';

const MapPage = () => {
  const [ticketsModalVisible, setTicketsModalVisible] = useState(false);
  const [drXModalVisible, setDrXModalVisible] = useState(false);

  const handlePress1 = () => {
    setDrXModalVisible(true); // Show Dr X modal
  };

  const handlePress2 = () => {
    setTicketsModalVisible(true); // Show Tickets modal
  };

  const handleColorButtonPress = (color) => {
    console.log(`${color} button pressed`);
    setTicketsModalVisible(false); // Close the tickets modal
  };

  return (
    <View style={styles.container}>
      {/* Dr X Button (Left Side) */}
      <View style={styles.leftButtonContainer}>
        <TouchableOpacity style={styles.drXButton} onPress={handlePress1}>
          <Text style={styles.buttonText}>Dr X Movements      </Text>
        </TouchableOpacity>
      </View>

      {/* Tickets Button (Bottom Center) */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity style={styles.ticketsButton} onPress={handlePress2}>
          <Text style={styles.buttonText}>Tickets</Text>
        </TouchableOpacity>
      </View>

      {/* Dr X Modal (Grey Pop-up) */}
      <Modal
        transparent={true}
        visible={drXModalVisible}
        animationType="slide"
        onRequestClose={() => setDrXModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.drXModalContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setDrXModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Dr X Movements</Text>
          </View>
        </View>
      </Modal>

      {/* Tickets Modal (Blue Pop-up) */}
      <Modal
        transparent={true}
        visible={ticketsModalVisible}
        animationType="slide"
        onRequestClose={() => setTicketsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setTicketsModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Choose a ticket</Text>
            <TouchableOpacity
              style={[styles.colorButton, { backgroundColor: '#CDDBE7' }]}
              onPress={() => handleColorButtonPress('Blue')}
            >
              <Text style={styles.buttonText}>Blue</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.colorButton, { backgroundColor: '#FF474C' }]}
              onPress={() => handleColorButtonPress('Red')}
            >
              <Text style={styles.buttonText}>Red</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.colorButton, { backgroundColor: '#ADF802' }]}
              onPress={() => handleColorButtonPress('Green')}
            >
              <Text style={styles.buttonText}>Green</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    fontSize: 8,
    fontWeight: 'bold',
  },
  drXButton: {
    backgroundColor: '#ff7f7f', 
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: 50,
    alignItems: 'center',
  },
  ticketsButton: {
    backgroundColor: '#add8e6', 
    padding: 0,
    borderRadius: 10,
    marginVertical: 10,
    width: 150,
    alignItems: 'center',
  },
  leftButtonContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    flex: 1,
  },
  bottomButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drXModalContainer: {
    backgroundColor: 'grey', 
    padding: 20,
    borderRadius: 10,
    width: 200,
    height: 600,
    alignItems: 'center',
    position: 'relative', // Helps position the X button inside
  },
  ticketmodalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: 'center',
    position: 'relative', // Helps position the X button inside
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalContent: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: 'white',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'black',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  colorButton: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: 200,
    alignItems: 'center',
  },
});

export default MapPage;
