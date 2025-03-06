import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text, Dimensions, ActivityIndicator } from 'react-native';
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDecay,
  clamp
} from 'react-native-reanimated';
import { GetMapData } from '../../utils/API Functions/GetMapData';
import { getItem, setItem } from '../../utils/AsyncStorage';

const MapViewer = () => {
  const [mapData, setMapData] = useState(null);
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const prevTranslationX = useSharedValue(0);
  const prevTranslationY = useSharedValue(0);
  const mapID = 801;
  
  const saveLocation = async(locationID) => {
    alert(`Location ${locationID} Pressed`)
    await setItem('localLocationChoice', locationID)
    console.log(await getItem('localLocationChoice'))
  }

  // Example buttons (x, y positions are relative to the map)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await GetMapData(mapID);
        if (result.success) {
          setMapData(result.data);
        } else {
          console.error('Error:', result.error);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    fetchData();
  }, []);

  let mapWidth = 0;
  let mapHeight = 0;
   if (!(mapData === null)) {
    mapWidth = mapData.mapWidth;
    mapHeight = mapData.mapHeight;
  }

  // Calculate boundaries for panning
  let minX = -mapWidth //+ SCREEN_WIDTH; // Left boundary
  let minY = -mapHeight //+ SCREEN_HEIGHT; // Top boundary
  let maxX = mapWidth; // Right boundary
  let maxY = mapHeight; // Bottom boundary

  // Pinch (Zoom) Gesture
  const pinchGesture = Gesture.Pinch().onUpdate((event) => {
    scale.value = event.scale;

    // Dynamically update the boundaries when zooming in or out
    const newWidth = mapWidth * scale.value;
    const newHeight = mapHeight * scale.value;

    minX = -newWidth;
    minY = -newHeight;
    maxX = newWidth;
    maxY = newHeight;
  });

  // Pan (Drag) Gesture with boundaries
  const panGesture = Gesture.Pan()
    .onStart(() => {
      prevTranslationX.value = translateX.value;
      prevTranslationY.value = translateY.value;
    })
    .onUpdate((event) => {
      // Restrict translation within boundaries
    const newTranslationX = prevTranslationX.value + event.translationX;
    const newTranslationY = prevTranslationY.value + event.translationY;

    // Dynamically update boundaries based on the current map scale
    const newWidth = mapWidth * scale.value;
    const newHeight = mapHeight * scale.value;

    const dynamicMinX = -newWidth;
    const dynamicMinY = -newHeight;
    const dynamicMaxX = newWidth;
    const dynamicMaxY = newHeight;

    // Restrict translation within boundaries
    translateX.value = clamp(newTranslationX, dynamicMinX, dynamicMaxY);
    translateY.value = clamp(newTranslationY, dynamicMinY, dynamicMaxX);
    })
    .onEnd((event) => {
      // Smooth decay for natural movement
      translateX.value = withDecay({
        velocity: event.velocityX,
        clamp: [minX, maxX],
      });
      translateY.value = withDecay({
        velocity: event.velocityY,
        clamp: [minY, maxY],
      });
    });

  // Combine gestures
  const combinedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

  // Apply transformations
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

    // Check if mapData is still loading
    if (mapData === null) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#00ff00" />
        </View>
      );
    }


  // const buttons = [
  //   { id: 1, x: 100, y: 200, label: 'A' },
  //   { id: 2, x: 250, y: 350, label: 'B' },
  // ];

  return (
    <GestureHandlerRootView>
    <View style={styles.container}>
      <GestureDetector gesture={combinedGesture}>
        <Animated.View style={[styles.mapContainer, animatedStyle]}>
            {/* Map Locations */}
              <Image
                key={0} // Ensure each child has a unique key
                source={{ uri: mapData.mapImage }}
                style={{
                  width: mapData.mapWidth,
                  height: mapData.mapHeight,
                }}
                resizeMode="contain"
              />

          {/* Map Locations */}
          {mapData.locations.map((loc) => (
            <TouchableOpacity
              key={loc.location}
              style={[
                styles.button,
                {
                  left: loc.xPos,
                  top: loc.yPos,
                },
              ]}
              onPress={() => saveLocation(loc.location)}
            >
              <Text style={styles.buttonText}>{loc.location}</Text>
            </TouchableOpacity>
          ))}

          {/* Player Tokens */}
            <View style={styles.circle} />
        </Animated.View>
      </GestureDetector>
    </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContainer: {
    position: 'relative',
  },
  button: {
    position: 'absolute',
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
    backgroundColor: "red",
  },
});

export default MapViewer;