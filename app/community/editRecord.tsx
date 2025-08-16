import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Eclipse from '../../components/EclipseSVG';
<Eclipse />


const LoadingScreen = () => {
  return (
    <LinearGradient
      colors={['#000000', '#1a1a1a']} // 👈 Customize your gradient colors
      style={styles.gradient}
    >
      <View style={styles.container}>
        <Text style={styles.text}>로딩중...</Text> {/* "Loading..." in Korean */}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 18,
  },
});

export default LoadingScreen;