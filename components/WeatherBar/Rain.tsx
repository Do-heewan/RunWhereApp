import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

interface RainProps {
  precipitation: number;
}

export default function Rain({ precipitation }: RainProps) {
  const renderIcon = () => {
    if (precipitation === 0) {
      // 강수량이 0일 때 해 아이콘 표시
      return (
        <Ionicons 
          name="sunny" 
          size={32} 
          color={Colors.primary} 
        />
      );
    } else if (precipitation >= 4) {
      // 강수량이 4mm 이상일 때 큰 비 아이콘
      return (
        <Image 
          source={require('@/assets/images/rain_big.png')} 
          style={styles.icon} 
        />
      );
    } else {
      // 강수량이 1-3mm일 때 작은 비 아이콘
      return (
        <Image 
          source={require('@/assets/images/rain.png')} 
          style={styles.icon} 
        />
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {renderIcon()}
      </View>
      <ThemedText type="h2" style={{color: Colors.white, marginLeft: 5}}>
        {precipitation === 0 ? '--' : Math.round(precipitation) + 'mm'}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexDirection: 'row', 
    alignItems: 'center', 
  },
  iconContainer: {
    width: 45, 
    height: 40, 
    padding: 3,
    justifyContent: 'center', 
    alignItems: 'center',
  },
  icon: { 
    width: '100%', 
    height: '100%', 
    resizeMode: 'contain', 
  },
});
