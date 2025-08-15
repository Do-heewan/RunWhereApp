import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface DustProps {
  concentration: number;
}

export default function Dust({ concentration }: DustProps) {
  // 미세먼지 등급 및 색상 결정
  const getDustInfo = (concentration: number) => {
    if (concentration >= 152) {
      return {
        grade: '매우나쁨',
        color: Colors.red, // 빨간색
      };
    } else if (concentration >= 110) {
      return {
        grade: '나쁨',
        color: '#A47A95', // 주황색
      };
    } else if (concentration >= 80) {
      return {
        grade: '보통',
        color: '#7A7FA4', // 노란색
      };
    } else if (concentration >= 25) {
      return {
        grade: '좋음',
        color: '#7AA4A1', // 초록색
      };
    } else {
      return {
        grade: '매우좋음',
        color: '#2196F3', // 파란색
      };
    }
  };

  const dustInfo = getDustInfo(concentration);

  return (
    <View style={styles.container}>
      <View style={[styles.circle, {backgroundColor: dustInfo.color}]}>
        <ThemedText type="sub1" style={{color: Colors.white}}>
          {concentration}
        </ThemedText>
      </View>
      <ThemedText type="h2" style={{color: Colors.white, marginLeft: 10}}>
        {dustInfo.grade}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    width: 35,
    height: 35,
    borderRadius: 37,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
