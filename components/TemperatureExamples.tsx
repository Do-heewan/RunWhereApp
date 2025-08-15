import { Colors } from '@/constants/Colors';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function TemperatureExamples() {
  const temperature = 23;

  return (
    <View style={styles.container}>
      {/* 방법 1: 유니코드 문자 사용 (권장) */}
      <Text style={styles.tempText}>{temperature}°C</Text>
      
      {/* 방법 2: HTML 엔티티 사용 */}
      <Text style={styles.tempText}>{temperature}&deg;C</Text>
      
      {/* 방법 3: 직접 유니코드 번호 사용 */}
      <Text style={styles.tempText}>{temperature}{'\u00B0'}C</Text>
      
      {/* 방법 4: 온도 기호만 별도 스타일링 */}
      <Text style={styles.tempText}>
        {temperature}<Text style={styles.degreeSymbol}>°</Text>C
      </Text>
      
      {/* 방법 5: 소수점 포함 */}
      <Text style={styles.tempText}>{temperature.toFixed(1)}°C</Text>
      
      {/* 방법 6: 음수 온도 */}
      <Text style={styles.tempText}>-{temperature}°C</Text>
      
      {/* 방법 7: 온도 범위 */}
      <Text style={styles.tempText}>{temperature}°C ~ {temperature + 5}°C</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: Colors.blackGray,
  },
  tempText: {
    fontSize: 18,
    color: Colors.white,
    marginVertical: 5,
  },
  degreeSymbol: {
    fontSize: 16,
    color: Colors.primary,
  },
});
