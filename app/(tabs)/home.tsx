import Eclipse from '@/components/EclipseSVG';
import { ThemedText } from '@/components/ThemedText';
import WeatherBar from '@/components/WeatherBar/WeatherBar';
import { Colors } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Keyboard, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

export default function CourseDetailScreen() {
  const router = useRouter();
  const [distanceInput, setDistanceInput] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
    name: string;
  } | null>(null);
  const [showLocationSelector, setShowLocationSelector] = useState(false);

  // 도시 데이터 정의
  const cities = [
    { name: '서울 시내', latitude: 37.5665, longitude: 126.9780 },
    { name: '울산', latitude: 35.5384, longitude: 129.3114 },
    { name: '부산', latitude: 35.1796, longitude: 129.0756 },
  ];

  const handleHomePress = () => {
    if (selectedLocation && distanceInput.trim() !== "" && distanceInput.trim() !== "00" && distanceInput.trim() !== "0") {
      router.push({
        pathname: '/course-detail',
        params: {
          latitude: selectedLocation.latitude.toString(),
          longitude: selectedLocation.longitude.toString(),
          distance: distanceInput,
        },
      });
    }
  };

  const handleDistanceChange = (text: string) => {
    // 숫자만 입력 가능하도록 필터링
    const numericText = text.replace(/[^0-9]/g, '');
    setDistanceInput(numericText);
  };

  // 도시 선택 토글
  const toggleLocationSelector = () => {
    setShowLocationSelector(!showLocationSelector);
  };

  // 도시 선택
  const selectCity = (city: { name: string; latitude: number; longitude: number }) => {
    setSelectedLocation(city);
    setShowLocationSelector(false);
  };

  // 초기 위치 설정 (서울로 기본 설정)
  useEffect(() => {
    setSelectedLocation(cities[0]);
  }, []); 

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <Eclipse />
        {/* 현재 위도, 경도값이 고정되어있는데, 처음에 회원가입할때 위치 정보를 저장해놓았다가 쓰는 것이 좋을 듯함. 매번 api 호출 해야하는건 좋지 않음. */}
        <View style={styles.headerContainer}>
          {selectedLocation && (
            <WeatherBar 
              latitude={selectedLocation.latitude} 
              longitude={selectedLocation.longitude} 
            />
          )}
        </View>     
        <View style={{
          justifyContent: 'center',
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: 30,
          marginTop: 10,
        }}>
          <ThemedText type="h2" style={{color: Colors.primary}}>
            {selectedLocation ? selectedLocation.name : '위치를 선택해주세요'}
          </ThemedText>
          <TouchableOpacity
            onPress={toggleLocationSelector}
            style={{ marginLeft: 10 }}
          >
            <Image source={require('@/assets/images/autorenew.png')} style={{ width: 35, height: 35 }} />
          </TouchableOpacity>
        </View>
        
        {/* 도시 선택 드롭다운 */}
        {showLocationSelector && (
          <View style={styles.locationSelector}>
            {cities.map((city, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.cityOption,
                  selectedLocation?.name === city.name && styles.selectedCityOption
                ]}
                onPress={() => selectCity(city)}
              >
                <ThemedText 
                  type="body1" 
                  style={[
                    styles.cityText,
                    selectedLocation?.name === city.name && styles.selectedCityText
                  ]}
                >
                  {city.name}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        )}
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
        
        {/* 거리 입력 TextInput */}
        <View style={styles.distanceInputContainer}>
          <TextInput
            style={styles.distanceInput}
            value={distanceInput}
            onChangeText={handleDistanceChange}
            placeholder="00"
            placeholderTextColor={Colors.gray4}
            keyboardType="numeric"
            maxLength={2}
          />
          <ThemedText type="sub1" style={{color: Colors.white, marginLeft: 10}}>km</ThemedText>
        </View>
        
        <View style={{marginTop: 60}}>
          {distanceInput.trim() !== "" && distanceInput.trim() !== "00" && distanceInput.trim() !== "0" ? (
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
            <TouchableOpacity style={styles.selectCourseButton} onPress={handleHomePress} disabled={true}>
              <ThemedText type="button1" style={{color:Colors.gray4}}>
                러닝 코스 추천 받기
              </ThemedText>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    flex: 1,
    backgroundColor: Colors.blackGray,
    paddingBottom: 50,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 12,
    marginVertical: 12,
    paddingTop: 10,
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
  distanceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginHorizontal: 20,
  },
  distanceInput: {
    borderRadius: 20,
    width: 122,
    height: 72,
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: Colors.blackGray,
  },
  locationSelector: {
    marginHorizontal: 30,
    marginTop: 10,
    backgroundColor: Colors.gray2,
    borderRadius: 10,
    padding: 10,
  },
  cityOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedCityOption: {
    backgroundColor: Colors.primary,
  },
  cityText: {
    color: Colors.white,
    textAlign: 'center',
  },
  selectedCityText: {
    color: Colors.blackGray,
    fontWeight: '600',
  },
});
