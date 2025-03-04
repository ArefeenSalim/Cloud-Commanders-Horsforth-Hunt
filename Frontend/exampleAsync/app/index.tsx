// import { Text, View } from "react-native";

// export default function Index() {
//   return (
//     <View
//       style={{
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <Text>Edit app/index.tsx to edit this screen.</Text>
//     </View>
//   );
// }

import React, { useState, useEffect } from 'react';
import { SafeAreaView, TextInput, Button, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [storedValue, setStoredValue] = useState<string>('');

  useEffect(() => {
    const loadStoredValue = async () => {
      try {
        const value = await AsyncStorage.getItem('key');
        if (value !== null) {
          setStoredValue(value);
        }
      } catch (error) {
        console.log('Error loading stored value', error);
      }
    };

    loadStoredValue();
  }, []);

  const saveValue = async () => {
    try {
      await AsyncStorage.setItem('key', input);
      setStoredValue(input);
    } catch (error) {
      console.log('Error saving value', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        value={input}
        onChangeText={setInput}
        placeholder="Enter some text"
      />
      <Button title="Save" onPress={saveValue} />
      <Text style={styles.text}>Stored value: {storedValue}</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
  },
});

export default App;

