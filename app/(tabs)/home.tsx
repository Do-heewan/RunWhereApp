import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import MapView, { UrlTile } from 'react-native-maps';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Welcome Back 👋</Text>
      <Text style={styles.subtext}>Ready for your next walk?</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today's Distance</Text>
        <Text style={styles.cardValue}>3.2 km</Text>
      </View>

      {/* <View style={styles.card}>
        <Text style={styles.cardTitle}>Steps Taken</Text>
        <Text style={styles.cardValue}>4,876</Text>
      </View> */}
      <MapView
        style={styles.map}
        mapType="none"
        initialRegion={{
          latitude: 37.5665,
          longitude: 126.9780,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <UrlTile
          urlTemplate="https://api.maptiler.com/maps/aquarelle/{z}/{x}/{y}.png?key=zj59kKsjCm6jcyYTg7qQ"
          zIndex={-1}
        />
      </MapView>
      {/* Add more cards or components here */}
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  map: {
    width: "100%",
    height: 400,
  },
  header: {
    fontSize: 28,
    fontWeight: '600',
    color: '#54f895',
    marginBottom: 4,
  },
  subtext: {
    fontSize: 16,
    color: '#D9D9D9',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#54f895',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 16,
    color: '#D9D9D9',
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#54f895',
  },
});