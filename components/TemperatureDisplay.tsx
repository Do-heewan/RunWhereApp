import { Colors } from '@/constants/Colors';
import React from 'react';
import { StyleSheet, Text } from 'react-native';

interface TemperatureDisplayProps {
  temperature: number;
  style?: any;
}

export default function TemperatureDisplay({ temperature, style }: TemperatureDisplayProps) {
  return (
    <Text style={[styles.temperature, style]}>
      {temperature}°C
    </Text>
  );
}

const styles = StyleSheet.create({
  temperature: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.white,
  },
});
