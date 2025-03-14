import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, Alert, Platform, FlatList, ActivityIndicator } from 'react-native'
import { useRouter, Link } from "expo-router";
import React, { useState, useEffect } from 'react';
import { getMaps } from '../../utils/API Functions/GetMap'
import { setItem, clear } from '../../utils/AsyncStorage'

export default function LobbyCodePage() {
  const router = useRouter(); // Get router instance
  const [text, setText] = useState('');
  const [gameDuration, setGameDuration] = useState('short')
  const [mapFlag, setMapFlag] = useState(null);
  const [maps, setMaps] = useState(false);

  // Hook call to begin loading the maps from the database
  useEffect(() => {
    const fetchMap = async () => {
      const mapData = await getMaps()
      setMaps(mapData.data)
    }
    fetchMap();
  }, [])

  // Used for saving the selected map for use in creating the game
  const handleSelectMap = async (map) => {
    try {
      // Save selected map data to AsyncStorage
      await setItem('targetMap', JSON.stringify(map.mapId));
      setMapFlag(true);
    } catch (error) {
      console.error('Error saving selected map:', error);
    }
  };


  // For looping through maps in the database and giving back selectable maps within the flexList
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.mapItem}
      onPress={() => handleSelectMap(item)}
    >
      <Text style={styles.mapIdText}>{item.mapName}</Text>
      <Image source={{ uri: item.mapThumb }} style={styles.thumbnail} />
    </TouchableOpacity>
  );

  // Used to return back to the home/index page
  const goBack = async () => {
    await clear()
    router.navigate('/')
  }

  // Used to alterate between game lengths
  const changeduration = async () => {
    if (gameDuration === 'short') {
      await setGameDuration('long')
    } else {
      await setGameDuration('short')
    }
  }

  // Function for processing the inputted data, then saving them with setItem so they can be used to create the game on the username_page
  const becomeHost = async (lobbyName) => {
    console.log("Become Host Triggered")
    if (lobbyName === "" && (Platform.OS == 'android' || Platform.OS == 'ios')) {
      Alert.alert('Error', 'Input Lobby Code');
    } else if (!mapFlag) {
      Alert.alert('Need to select a map.')
    }
    else if (lobbyName != null || lobbyName != undefined) {
      await setItem('lobbyName', lobbyName)
      await setItem('isHost', true);
      await setItem('localGameDuration', gameDuration);
      router.navigate('/username_page');
    };
  }


  return (

    <View style={{ flex: 1, justifyContent: "center", backgroundColor: 'black', alignItems: "center" }}>
      <View style={{ marginBottom: 10, marginTop: 50 }}>
        <Text style={styles.lobbyText}>Enter Lobby Name Here:</Text>
        <TextInput
          style={styles.textBox}
          placeholder=""
          value={text}
          onChangeText={(newText) => setText(newText)} />
      </View>

      {/* A if check to see if maps has loaded, if not then it will display an activity indicator */}
      {!maps ? (
        <ActivityIndicator size="large" color="#FFFFFF" />
      ) : (
        <View style={[styles.mapContainer]}>
          <FlatList
            data={maps}
            renderItem={renderItem}
            keyExtractor={(item) => item.mapId.toString()}
            ListHeaderComponent={<Text style={{ marginBottom: 10, fontSize: 24 }}>Select a Map</Text>}
            contentContainerStyle={styles.contentContainer}
          />
        </View>
      )}
      <View style={styles.container}>
        <TouchableOpacity onPress={() => becomeHost(text)} style={styles.JoinButton}>
          <Text style={styles.joinButtonText}>Create Game</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.JoinButton} onPress={() => changeduration()}>
          <Text style={styles.joinButtonText}>Duration: {String(gameDuration).charAt(0).toUpperCase() + String(gameDuration).slice(1)}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.backButton} onPress={goBack}><Text style={styles.text2}>{"<--------"}</Text></TouchableOpacity>
    </View>
  );
}



const styles = StyleSheet.create({
  scroll: { flex: 1 },
  backButton: {
    backgroundColor: '#9977ff',
    borderRadius: 5,


    width: 100,
    height: 40,
    position: 'absolute',
    top: 10,
    left: 10,
  },
  text2: {
    margin: 'auto',
    fontWeight: 'bold',
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 10,
    marginBottom: 10,
  },
  mapContainer: {
    backgroundColor: '#DDDD91',
    display: 'flex',
    minHeight: 100,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginBottom: 10,
  },
  contentContainer: {
    paddingVertical: 20,       // Space above and below list items
    alignItems: 'center',      // Centers items horizontally
    justifyContent: 'center',  // Centers items vertically if content doesn't fill screen
  },
  JoinButton: {
    backgroundColor: '#DDDD91',
    paddingVertical: 15,
    paddingHorizontal: 40,
    paddingTop: 30,
    width: 210,
    height: 150,
    borderRadius: 50,

  },
  joinButtonText: {
    fontSize: 26,
    marginTop: 20,
    marginLeft: 4,
  },
  lobbyText: {
    marginBottom: 20,
    fontSize: 30,
    fontStyle: 'bold',
    color: '#DDDD91',
  },
  textBox: {
    backgroundColor: '#DDDD91',
    marginBottom: 100,
    width: 300,
    height: 90,
    fontSize: 30,
  },
  thumbnail: {
    width: 100,
    height: 100,
  }
})


