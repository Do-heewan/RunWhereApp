import CustomMarker from '@/components/CustomMarker';
import GradientButton from '@/components/GradientButton';
import GradientPolyline from '@/components/GradientPolyline';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

// 경로 데이터 타입 정의
interface Route {
  id: string;
  name: string;
  difficulty: string;
  coordinates: Array<{
    latitude: number;
    longitude: number;
  }>;
  distance: number; // km
  duration: number; // minutes
}

export default function RunningScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);
  
  // 선택된 경로 데이터 (실제로는 서버에서 받아올 데이터)
  const selectedRoute: Route = {
    id: "route_1",
    name: "강남 러닝 코스",
    difficulty: "easy",
    coordinates: [
      { latitude: 37.521021, longitude: 127.034989 },
      { latitude: 37.521259, longitude: 127.035735 },
      { latitude: 37.520696, longitude: 127.036015 },
      { latitude: 37.520879, longitude: 127.036624 },
      { latitude: 37.520327, longitude: 127.036910 },
      { latitude: 37.520184, longitude: 127.037251 },
      { latitude: 37.520276, longitude: 127.037616 },
      { latitude: 37.520295, longitude: 127.037694 },
      { latitude: 37.519752, longitude: 127.037903 },
      { latitude: 37.519205, longitude: 127.038105 },
      { latitude: 37.519296, longitude: 127.038515 },
      { latitude: 37.519422, longitude: 127.039007 },
      { latitude: 37.519495, longitude: 127.039374 },
      { latitude: 37.519493, longitude: 127.039461 },
      { latitude: 37.519408, longitude: 127.039969 },
      { latitude: 37.519362, longitude: 127.040237 },
      { latitude: 37.519300, longitude: 127.040609 },
      { latitude: 37.519232, longitude: 127.041009 },
      { latitude: 37.519174, longitude: 127.041357 },
      { latitude: 37.519080, longitude: 127.041914 },
      { latitude: 37.519005, longitude: 127.042359 },
      { latitude: 37.518517, longitude: 127.042240 },
      { latitude: 37.518637, longitude: 127.042903 },
      { latitude: 37.518287, longitude: 127.042977 },
      { latitude: 37.517985, longitude: 127.043065 },
      { latitude: 37.517994, longitude: 127.043120 },
      { latitude: 37.517828, longitude: 127.043159 },
      { latitude: 37.517823, longitude: 127.043123 },
      { latitude: 37.517191, longitude: 127.043294 },
      { latitude: 37.517417, longitude: 127.044645 },
      { latitude: 37.516889, longitude: 127.044781 },
      { latitude: 37.515739, longitude: 127.045043 },
      { latitude: 37.515391, longitude: 127.045172 },
      { latitude: 37.515068, longitude: 127.045321 },
      { latitude: 37.514541, longitude: 127.045569 },
      { latitude: 37.514056, longitude: 127.045794 },
      { latitude: 37.513758, longitude: 127.045928 },
      { latitude: 37.512487, longitude: 127.046515 },
      { latitude: 37.512176, longitude: 127.047063 },
      { latitude: 37.511925, longitude: 127.047442 },
      { latitude: 37.512058, longitude: 127.047920 },
      { latitude: 37.512173, longitude: 127.048335 },
      { latitude: 37.512562, longitude: 127.048152 },
      { latitude: 37.512895, longitude: 127.047995 },
      { latitude: 37.512680, longitude: 127.047252 },
      { latitude: 37.513154, longitude: 127.047034 },
      { latitude: 37.513059, longitude: 127.046695 },
      { latitude: 37.513861, longitude: 127.046294 },
      { latitude: 37.513758, longitude: 127.045928 },
      { latitude: 37.513737, longitude: 127.045853 },
      { latitude: 37.513546, longitude: 127.045206 },
      { latitude: 37.513447, longitude: 127.044858 },
      { latitude: 37.513416, longitude: 127.044750 },
      { latitude: 37.513336, longitude: 127.044476 },
      { latitude: 37.514631, longitude: 127.043883 },
      { latitude: 37.515087, longitude: 127.043651 },
      { latitude: 37.515534, longitude: 127.043562 },
      { latitude: 37.516165, longitude: 127.043492 },
      { latitude: 37.516649, longitude: 127.043427 },
      { latitude: 37.517191, longitude: 127.043294 },
      { latitude: 37.516945, longitude: 127.041956 },
      { latitude: 37.517591, longitude: 127.041788 },
      { latitude: 37.517756, longitude: 127.041749 },
      { latitude: 37.518395, longitude: 127.041565 },
      { latitude: 37.518245, longitude: 127.040734 },
      { latitude: 37.518169, longitude: 127.040310 },
      { latitude: 37.518097, longitude: 127.039913 },
      { latitude: 37.518018, longitude: 127.039495 },
      { latitude: 37.517932, longitude: 127.039038 },
      { latitude: 37.517794, longitude: 127.038551 },
      { latitude: 37.518251, longitude: 127.038393 },
      { latitude: 37.518717, longitude: 127.038223 },
      { latitude: 37.518629, longitude: 127.037820 },
      { latitude: 37.519096, longitude: 127.037643 },
      { latitude: 37.519654, longitude: 127.037439 },
      { latitude: 37.520184, longitude: 127.037251 },
      { latitude: 37.520026, longitude: 127.036552 },
      { latitude: 37.519844, longitude: 127.035748 },
      { latitude: 37.520494, longitude: 127.035622 },
      { latitude: 37.520675, longitude: 127.035598 },
      { latitude: 37.521167, longitude: 127.035533 },
      { latitude: 37.520879, longitude: 127.034624 },
      { latitude: 37.521445, longitude: 127.034340 },
      { latitude: 37.521259, longitude: 127.033735 },
      { latitude: 37.521021, longitude: 127.034989 },
    ],
    distance: 4.8,
    duration: 29,
  };

  const handleCompletePress = () => {
    console.log('러닝 완료!');
    setShowCompletionPopup(true);
  };

  const closeCompletionPopup = () => {
    setShowCompletionPopup(false);
    router.push('/(tabs)/home');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 전체 화면 맵 */}
      <MapView
        style={styles.map}
        mapType="standard"
        initialRegion={{
          latitude: selectedRoute.coordinates[0]?.latitude || 37.5665,
          longitude: selectedRoute.coordinates[0]?.longitude || 126.9780,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        {/* 시작점 마커 */}
        <Marker
          coordinate={selectedRoute.coordinates[0]}
          anchor={{ x: 0.5, y: 1 }}
        >
          <CustomMarker 
            color={Colors.blackGray}
            size={36}
            label='출발'
            labelColor={Colors.white}
            labelFontSize={10}
          />
        </Marker>
        
        {/* 경로 폴리라인 */}
        {/* 테두리 폴리라인 */}
        <Polyline
          coordinates={selectedRoute.coordinates}
          strokeColor={Colors.gray2}
          strokeWidth={5}
          lineDashPattern={[1]}
          zIndex={1}
        />
        
        {/* 그라데이션 폴리라인 */}
        <GradientPolyline
          coordinates={selectedRoute.coordinates}
          strokeWidth={3}
          colors={['#54F895', '#2AFBEA']}
        />
      </MapView>

      {/* 하단 완료 버튼 */}
      <View style={styles.buttonContainer}>
        <GradientButton
          onPress={handleCompletePress}
          title="오늘 러닝 완료!"
          style={styles.completeButton}
          textStyle={styles.completeButtonText}
        />
      </View>

      {/* 러닝 완료 팝업 */}
      {showCompletionPopup && (
        <View style={styles.popupOverlay}>
          <View style={styles.popupContainer}>
            {/* 상단 태그 */}
            <View style={styles.popupTag}>
              <ThemedText type="body2" style={styles.popupTagText}># 이미지</ThemedText>
            </View>
            
            {/* 스마트워치 이미지 */}
            <View style={styles.watchImageContainer}>
              <View style={styles.smartwatch}>
                <View style={styles.watchScreen}>
                  <ThemedText type="h1" style={styles.heartIcon}>❤️</ThemedText>
                </View>
              </View>
            </View>
            
            {/* 축하 메시지 */}
            <View style={styles.messageContainer}>
              <ThemedText type="h2" style={styles.congratulationText}>
                오늘 러닝 수고했어요!
              </ThemedText>
              <ThemedText type="body1" style={styles.encouragementText}>
                오늘도 해낸 당신 정말 멋져요!
              </ThemedText>
            </View>
            
            {/* 확인 버튼 */}
            <TouchableOpacity style={styles.confirmButton} onPress={closeCompletionPopup}>
              <LinearGradient
                colors={['#54F895', '#2AFBEA']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientConfirmButton}
              >
                <ThemedText type="button1" style={styles.confirmButtonText}>
                  확인했어요
                </ThemedText>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.blackGray,
  },
  map: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
  completeButton: {
    height: 60,
    borderRadius: 30,
  },
  completeButtonText: {
    color: Colors.blackGray,
    fontSize: 18,
    fontWeight: '600',
  },
  // 팝업 스타일
  popupOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  popupContainer: {
    backgroundColor: Colors.blackGray,
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 20,
    alignItems: 'center',
    minWidth: 300,
  },
  popupTag: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 16,
  },
  popupTagText: {
    color: Colors.white,
    fontSize: 12,
  },
  watchImageContainer: {
    borderWidth: 2,
    borderColor: '#8B5CF6',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  smartwatch: {
    width: 80,
    height: 80,
    backgroundColor: '#1F2937',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#54F895',
  },
  watchScreen: {
    width: 60,
    height: 60,
    backgroundColor: '#54F895',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartIcon: {
    // fontSize는 Text 컴포넌트에서만 사용 가능하므로 제거
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  congratulationText: {
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  encouragementText: {
    color: Colors.white,
    textAlign: 'center',
  },
  confirmButton: {
    width: '100%',
    height: 50,
    borderRadius: 25,
  },
  gradientConfirmButton: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButtonText: {
    color: Colors.blackGray,
    fontWeight: '600',
  },
});
