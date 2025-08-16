import React from 'react';
import { View, ImageBackground, Text, StyleSheet } from 'react-native';

export default function RunImageWithWatermark() {
  return (
      <Text style={styles.watermark}>🏃‍♂️ RunTracker 5'30"/km</Text>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 300,
    justifyContent: 'flex-end',
  },
  watermark: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: 'bold',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
});