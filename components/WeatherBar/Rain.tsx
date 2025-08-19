import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

interface RainProps {
  precipitation: number;
}

export default function Rain({ precipitation }: RainProps) {
  const getRainIcon = (precipitation: number) => {
    if (precipitation >= 4) { return require('@/assets/images/rain_big.png'); }
    else { return require('@/assets/images/rain.png'); }
  };

  const rainIcon = getRainIcon(precipitation);

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Image source={rainIcon} style={styles.icon} />
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
