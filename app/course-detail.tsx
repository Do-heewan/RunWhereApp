import CustomMarker from '@/components/CustomMarker';
import Eclipse from '@/components/EclipseSVG';
import GradientButton from '@/components/GradientButton';
import GradientPolyline from '@/components/GradientPolyline';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import Carousel from 'react-native-reanimated-carousel';

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

export default function HomeScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedMapIndex, setSelectedMapIndex] = useState<number | null>(null);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);

  // 원형 좌표 생성 함수
  const generateCircleCoordinates = (centerLat: number, centerLon: number, radius: number, points: number) => {
    const coordinates = [];
    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * 2 * Math.PI;
      const lat = centerLat + radius * Math.cos(angle);
      const lon = centerLon + radius * Math.sin(angle);
      coordinates.push({ latitude: lat, longitude: lon });
    }
    return coordinates;
  };

  // 테스트용 경로 데이터 생성
  const createTestRoutes = (): Route[] => {
    return [
      {
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
      },
      {
        id: "route_2",
        name: "중간 원형 코스",
        difficulty: "medium",
        coordinates: generateCircleCoordinates(37.522000, 127.035000, 0.005, 20),
        distance: 3.2,
        duration: 19,
      },
      {
        id: "route_3",
        name: "큰 원형 코스",
        difficulty: "hard",
        coordinates: generateCircleCoordinates(37.520000, 127.033000, 0.008, 25),
        distance: 5.1,
        duration: 31,
      },
      {
        id: "route_4",
        name: "작은 원형 코스",
        difficulty: "easy",
        coordinates: generateCircleCoordinates(37.523000, 127.037000, 0.003, 15),
        distance: 1.9,
        duration: 11,
      },
      {
        id: "route_5",
        name: "타원형 코스",
        difficulty: "medium",
        coordinates: generateCircleCoordinates(37.519000, 127.032000, 0.006, 22),
        distance: 3.8,
        duration: 23,
      },
    ];
  };

  // 경로 데이터 초기화
  useEffect(() => {
    const loadRoutes = () => {
      setLoading(true);
      try {
        // 테스트용 경로 데이터 생성
        const testRoutes = createTestRoutes();
        setRoutes(testRoutes);
        console.log('테스트 경로 로딩 완료:', testRoutes.length, '개');
      } catch (error) {
        console.error('경로 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRoutes();
  }, []);

  // 선택된 스타일 (기본값: aquarelle)
  const onSnapToItem = (index: number) => {
    setCurrentIndex(index);
  };

  const handleMapPress = (index: number) => {
    setSelectedMapIndex(selectedMapIndex === index ? null : index);
  };

  const handleBackPress = () => {
    router.push('/(tabs)/home');
  };

  const handleStartRunning = () => {
    console.log('선택된 맵:', selectedMapIndex);
    router.push('/running');
  };

  // 템플릿 리터럴을 사용해서 동적으로 URL 생성
  return (
    <SafeAreaView style={styles.container}>
      <Eclipse />
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="chevron-back" size={35} color="white" />
        </TouchableOpacity>
      </View>
      <ThemedText type="h2" style={{ color: Colors.white, alignSelf: 'center' }}>추천 러닝 코스</ThemedText>
      <ThemedText type="body2" style={{ color: Colors.white, alignSelf: 'center' }}>당신과 딱 맞는 {routes.length}가지 동선을 가져왔어요</ThemedText>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ThemedText type="body1" style={{ color: Colors.white }}>경로를 불러오는 중...</ThemedText>
        </View>
      ) : (
        <>
          <Carousel
            width={Dimensions.get('window').width}
            height={Dimensions.get('window').width}
            data={routes}
            mode="parallax"
            modeConfig={{
              parallaxScrollingScale: 0.9,
              parallaxScrollingOffset: 70,
            }}
            loop={false}
            onSnapToItem={onSnapToItem}
            renderItem={({ item, index }) => (
              <View style={styles.carouselItem}>
                <MapView
                  style={selectedMapIndex === index ? styles.selectedMap : styles.map}
                  mapType="standard"
                  initialRegion={{
                    latitude: item.coordinates[0]?.latitude || 37.5665,
                    longitude: item.coordinates[0]?.longitude || 126.9780,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02,
                  }}
                  onPress={() => handleMapPress(index)}
                >
                  {/* 시작점 마커 */}
                  <Marker
                    coordinate={item.coordinates[0]}
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
                      coordinates={item.coordinates}
                      strokeColor={Colors.gray2}
                      strokeWidth={5}
                      lineDashPattern={[1]}
                      zIndex={1}
                    />
                    
                    {/* 그라데이션 폴리라인 */}
                    <GradientPolyline
                      coordinates={item.coordinates}
                      strokeWidth={3}
                      colors={['#54F895', '#2AFBEA']}
                    />
                  
                </MapView>
              </View>
            )}
          />
          <View style={styles.indicatorContainer}>
            {routes.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  index === currentIndex && styles.activeIndicator,
                ]}
              />
            ))}
          </View>
        </>
      )}
             {selectedMapIndex === null ? (
         <View style={styles.globalOverlay}>
           <ThemedText type="button1" style={styles.overlayText}>
             마음에 드는 코스를 선택해보세요
           </ThemedText>
         </View>
       ) : (
         <GradientButton
           onPress={handleStartRunning}
           title="이 동선으로 뛸게요"
           style={styles.gradientButton}
           textStyle={styles.gradientButtonText}
         />
       )}
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15151C',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  map: {
    width: "100%",
    height: 400,
    borderRadius: 13,
  },
  selectedMap: {
    width: "100%",
    height: 400,
    // borderRadius: 13,
    borderWidth: 6,
    borderColor: Colors.primary,
  },
  header: {
    fontSize: 28,
    fontWeight: '600',
    color: '#54f895',
    marginBottom: 4,
  },
  carouselItem: {
    paddingHorizontal: 20,
    overflow: 'hidden',
  },
  headerContainer: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 12,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  indicator: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: Colors.gray4,
    marginHorizontal: 7.5,
  },
  activeIndicator: {
    backgroundColor: Colors.primary,
    width: 15,
    height: 15,
    borderRadius: 7.5,
  },
  globalOverlay: {
    alignSelf: 'center',
    width: 364,
    height: 68,
    position: 'absolute',
    bottom: 30,
    backgroundColor: Colors.gray4,
    borderRadius: 50,
    borderColor: '#d9d9d9af',
    borderWidth: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    zIndex: 9999,
  },
  globalOverlaySelected: {
    alignSelf: 'center',
    width: 364,
    height: 68,
    position: 'absolute',
    bottom: 30,
    backgroundColor: Colors.primary,
    borderRadius: 50,
    borderColor: '#d9d9d9af',
    borderWidth: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    zIndex: 9999,
  },
  overlayText: {
    color: Colors.gray2,
    textAlign: 'center',
  },
  overlayTextSelected: {
    color: Colors.gray1,
    textAlign: 'center',
  },
  gradientButton: {
    alignSelf: 'center',
    width: 364,
    height: 68,
    position: 'absolute',
    bottom: 30,
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    zIndex: 9999,
  },
  gradientButtonText: {
    color: '#1C1C1E',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  routeInfo: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 15,
    borderRadius: 10,
  },
});