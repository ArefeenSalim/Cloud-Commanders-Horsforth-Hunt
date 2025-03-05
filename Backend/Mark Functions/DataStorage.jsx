// Functions is used for data storage whilst app is in use

import {AsyncStorage} from 'react-native';

StoreData = async (key, value) => {
    try {
      await AsyncStorage.setItem(
        key,
        value,
      );
    } catch (e) {
      // Error saving data
      console.error(e);
    }
  };

RetrieveData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      // We have data!!
      console.log(value);
    }
  } catch (e) {
    // Error retrieving data
    console.error(e);
  }
};