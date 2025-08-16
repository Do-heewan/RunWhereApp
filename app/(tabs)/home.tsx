import DistanceChips from '@/components/DistanceChips';
import Eclipse from '@/components/EclipseSVG';
import { ThemedText } from '@/components/ThemedText';
import WeatherBar from '@/components/WeatherBar/WeatherBar';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

export default function CourseDetailScreen() {
  const router = useRouter();
  const [selectedDistance, setSelectedDistance] = useState<{ id: string; label: string; value: [number, number] } | null>(null);

  const handleHomePress = () => {
    router.push('/course-detail');
  };

  const handleDistanceChange = (item: { id: string; label: string; value: [number, number] }) => {
    setSelectedDistance(item);
  };
  useEffect(() => {
    
  }, []); 
  return (
    <SafeAreaView style={styles.container}>
      <Eclipse />
      {/* 현재 위도, 경도값이 고정되어있는데, 처음에 회원가입할때 위치 정보를 저장해놓았다가 쓰는 것이 좋을 듯함. 매번 api 호출 해야하는건 좋지 않음. */}
      <WeatherBar latitude={36.911111} longitude={127.111111} />
      <View style={{
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 30,
        marginTop: 38,
      }}>
        <TouchableOpacity>
          <Ionicons name="chevron-back" size={35} color={Colors.primary} />
        </TouchableOpacity>
        <ThemedText type="h2" style={{color: Colors.primary}}>울산시 울주군 러닝동</ThemedText>
      </View>
      <View style={{alignItems: 'center', position: 'relative'}}>
        {/* SVG 배경 */}
        <Svg 
          width={247} 
          height={247} 
          viewBox="0 0 217 217" 
          fill="none"
          style={{position: 'absolute', zIndex: 1}}
        >
          <Circle cx="106.978" cy="107.625" r="74.0423" transform="rotate(14.9362 106.978 107.625)" fill="#54F895" fillOpacity="0.1"/>
          <Circle cx="107.568" cy="107.823" r="63.583" transform="rotate(14.9362 107.568 107.823)" fill="#54F895" fillOpacity="0.1"/>
          <Circle cx="108.084" cy="108.083" r="88.3066" transform="rotate(14.9362 108.084 108.083)" fill="#54F895" fillOpacity="0.1"/>
        </Svg>
        
        {/* 신발 이미지 (앞쪽) */}
        <Image 
          source={require('@/assets/images/shoe.png')}
          style={{width: 247, height: 247, zIndex: 2}}
          resizeMode="contain"
        />
      </View>
      <ThemedText type="h2" style={{color: Colors.white, alignSelf: 'center'}}>오늘 몇km 목표이신가요?</ThemedText>
      <ThemedText type="body2" style={{color: Colors.gray4,marginTop:5,alignSelf:'center'}}>당신에게 딱 맞는 러닝 코스를 추천해드릴게요</ThemedText>
      <DistanceChips onChange={handleDistanceChange} initialId="" />
      
      
      
      <View style={{marginTop: 60}}>
        {selectedDistance ? (
          <TouchableOpacity style={styles.CourseButton} onPress={handleHomePress}>
            <LinearGradient
              colors={['#54F895', '#2AFBEA']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              <ThemedText type="button1" style={{color:Colors.blackGray}}>
                러닝 코스 추천 받기
              </ThemedText>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.selectCourseButton} onPress={handleHomePress}>
            <ThemedText type="button1" style={{color:Colors.gray4}}>
              러닝 코스 추천 받기
            </ThemedText>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.blackGray,
    paddingBottom: 50,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  homeButton: {
    padding: 12,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 40,
  },
  CourseButton: {
    width: 250,
    height: 68,
    borderRadius: 30,
    alignSelf: 'center',
  },
  selectCourseButton: {
    width: 250,
    height: 68,
    backgroundColor: Colors.gray2,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  selectCourseButtonText: {
    color: Colors.gray4,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientButton: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientButtonText: {
    color: Colors.black,
    fontWeight: '600',
  },
});
