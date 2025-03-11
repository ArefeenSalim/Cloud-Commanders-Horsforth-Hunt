import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

const HorsforthMap = () => {
  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: 53.8436,  // Horsforth latitude
          longitude: -1.6374, // Horsforth longitude
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        customMapStyle={mapStyle} // Use SnazzyMaps style here
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: '100%', height: '100%' },
});

const mapStyle = [ /* Paste your SnazzyMaps JSON style here */ ];

export default HorsforthMap;
