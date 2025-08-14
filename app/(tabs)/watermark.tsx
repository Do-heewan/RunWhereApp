import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface WatermarkProps {
  appName?: string;
  date?: string;
  time?: string;
  stats?: {
    steps?: number;
    calories?: number;
    duration?: string;
    distance?: string;
  };
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  style?: any;
}

const SimpleWatermark: React.FC<WatermarkProps> = ({
  appName = 'RunWhere',
  date = '2025-08-13',
  time = '08:22 PM',
  stats = {
    steps: 0,
    calories: 0,
    duration: '00:00',
    distance: '0m'
  },
  position = 'top-left',
  style
}) => {
  const getPositionStyle = () => {
    switch (position) {
      case 'top-right':
        return { top: 20, right: 20 };
      case 'bottom-left':
        return { bottom: 20, left: 20 };
      case 'bottom-right':
        return { bottom: 20, right: 20 };
      case 'center':
        return { 
          top: '50%', 
          left: '50%', 
          transform: [{ translateX: -100 }, { translateY: -100 }] 
        };
      default: // top-left
        return { top: 20, left: 20 };
    }
  };

  return (
    <View style={[styles.watermarkContainer, getPositionStyle(), style]}>
      {/* Header with App Name and DateTime */}
      <View style={styles.header}>
        <Text style={styles.appName}>🏃 {appName}</Text>
        <Text style={styles.dateTime}>{date} {time}</Text>
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statRow}>
          <Ionicons name="footsteps" size={16} color="#fff" />
          <Text style={styles.statText}>{stats.steps} 걸음</Text>
        </View>
        
        <View style={styles.statRow}>
          <Ionicons name="flame" size={16} color="#fff" />
          <Text style={styles.statText}>{stats.calories}kcal</Text>
        </View>
        
        <View style={styles.statRow}>
          <Ionicons name="time" size={16} color="#fff" />
          <Text style={styles.statText}>{stats.duration}</Text>
        </View>
        
        <View style={styles.statRow}>
          <Ionicons name="navigate" size={16} color="#fff" />
          <Text style={styles.statText}>{stats.distance}</Text>
        </View>
      </View>
    </View>
  );
};

// Alternative minimal version
export const MinimalWatermark: React.FC<{ appName?: string; date?: string }> = ({
  appName = 'RunWhere',
  date = '2025-08-13'
}) => (
  <View style={styles.minimalContainer}>
    <Text style={styles.minimalText}>📱 {appName} • {date}</Text>
  </View>
);

const styles = StyleSheet.create({
  watermarkContainer: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    padding: 12,
    minWidth: 200,
  },
  header: {
    marginBottom: 8,
  },
  appName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  dateTime: {
    color: '#ccc',
    fontSize: 12,
  },
  statsContainer: {
    gap: 4,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  minimalContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  minimalText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default SimpleWatermark;
