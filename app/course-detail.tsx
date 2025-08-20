import CustomMarker from '@/components/CustomMarker';
import Eclipse from '@/components/EclipseSVG';
import GradientButton from '@/components/GradientButton';
import GradientPolyline from '@/components/GradientPolyline';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
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
  const params = useLocalSearchParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedMapIndex, setSelectedMapIndex] = useState<number | null>(null);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef<any>(null);
  const isProgrammaticScroll = useRef(false);

  // home.tsx에서 전달받은 값들
  // const userLatitude = Number(params.latitude as string) || 35.5709;
  // const userLongitude = Number(params.longitude as string) || 129.1868;
  const userLatitude = 37.5665;
  const userLongitude = 126.9780; //서울

  // const userLatitude = 35.5709;
  // const userLongitude = 129.1868; //울산

  const userDistance = Number(params.distance as string) || 5;



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

  // 로컬 JSON 파일에서 경로 데이터 생성 (폴백용)
  const createLocalRoutes = (): Route[] => {
    try {
      // JSON 파일 로드
      const routesData = require('@/assets/routes/routes.json');
      console.log('JSON 파일 로드 성공:', routesData.routes.length, '개 경로');
      
      return routesData.routes.map((route: any, index: number) => {
        // coords 배열에서 좌표 추출 (경도가 첫 번째, 위도가 두 번째)
        const coordinates = route.coords.map((coord: number[]) => ({
          latitude: coord[1],  // 두 번째 값이 위도
          longitude: coord[0]  // 첫 번째 값이 경도
        }));
        
        // 난이도 결정 (score 기반)
        let difficulty = 'easy';
        if (route.score > 0.4) difficulty = 'hard';
        else if (route.score > 0.1) difficulty = 'medium';
        
        return {
          id: `route_${route.id}`,
          name: `${route.kind} 코스 ${route.id}`,
          difficulty: difficulty,
          coordinates: coordinates,
          distance: route.length_km,
          duration: Math.round(route.length_km * 6), // 6분/km 가정
        };
      });
    } catch (error) {
      console.error('JSON 파일 로드 실패:', error);
      
      // JSON 파일 로드 실패 시 사용자 위치 기반 하드코딩된 데이터 사용
      const radius = userDistance * 0.001; // 거리에 비례한 반지름
      return [
        {
          id: "route_1",
          name: "사용자 위치 기반 코스 1",
          difficulty: "easy",
          coordinates: generateCircleCoordinates(userLatitude, userLongitude, radius * 0.8, 20),
          distance: userDistance * 0.9,
          duration: Math.round(userDistance * 0.9 * 6),
        },
        {
          id: "route_2",
          name: "사용자 위치 기반 코스 2",
          difficulty: "medium",
          coordinates: generateCircleCoordinates(userLatitude, userLongitude, radius, 20),
          distance: userDistance,
          duration: Math.round(userDistance * 6),
        },
        {
          id: "route_3",
          name: "사용자 위치 기반 코스 3",
          difficulty: "hard",
          coordinates: generateCircleCoordinates(userLatitude, userLongitude, radius * 1.2, 25),
          distance: userDistance * 1.1,
          duration: Math.round(userDistance * 1.1 * 6),
        },
        {
          id: "route_4",
          name: "사용자 위치 기반 코스 4",
          difficulty: "easy",
          coordinates: generateCircleCoordinates(userLatitude, userLongitude, radius * 0.6, 15),
          distance: userDistance * 0.7,
          duration: Math.round(userDistance * 0.7 * 6),
        },
        {
          id: "route_5",
          name: "사용자 위치 기반 코스 5",
          difficulty: "medium",
          coordinates: generateCircleCoordinates(userLatitude, userLongitude, radius * 0.9, 22),
          distance: userDistance * 0.8,
          duration: Math.round(userDistance * 0.8 * 6),
        },
      ];
    }
  };

  // 경로 데이터 초기화
  useEffect(() => {
    const loadRoutes = async () => {
      setLoading(true);
      try {
        // 서버 API 요청
        console.log('서버 API 요청 시작...');
        console.log('사용자 위치:', userLatitude, userLongitude);
        console.log('사용자 요청 거리:', userDistance, 'km');
        
        const response = await fetch('https://runwhere-deploy-1.onrender.com/api/routes/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            mode: 'loop',
            target_km: userDistance,
            start: {
              lat: userLatitude,
              lon: userLongitude
            },
            count: 5
          }),
        });
        
        console.log('서버 응답 상태:', response.status);
        
        if (response.ok) {
          const serverData = await response.json();
          console.log('서버 응답 데이터:', serverData);
          console.log('서버 응답 데이터 타입:', typeof serverData);
          console.log('서버 응답 데이터 키들:', Object.keys(serverData || {}));
          
          // 서버 응답 구조 확인 및 안전한 처리
          let routesArray = null;
          
          // 다양한 응답 형식 처리
          if (serverData && Array.isArray(serverData)) {
            // 배열 형태로 직접 반환된 경우
            routesArray = serverData;
            console.log('서버에서 배열 형태로 응답 받음:', routesArray.length, '개');
          } else if (serverData && serverData.candidates && Array.isArray(serverData.candidates)) {
            // candidates 객체 안에 배열이 있는 경우 (실제 경로 데이터)
            routesArray = serverData.candidates;
            console.log('서버에서 candidates 객체로 응답 받음:', routesArray.length, '개');
          } else if (serverData && serverData.routes && Array.isArray(serverData.routes)) {
            // routes 객체 안에 배열이 있는 경우
            routesArray = serverData.routes;
            console.log('서버에서 routes 객체로 응답 받음:', routesArray.length, '개');
          } else if (serverData && serverData.data && Array.isArray(serverData.data)) {
            // data 객체 안에 배열이 있는 경우
            routesArray = serverData.data;
            console.log('서버에서 data 객체로 응답 받음:', routesArray.length, '개');
          }
          
          if (routesArray && routesArray.length > 0) {
            console.log('서버에서 받은 경로 데이터 사용:', routesArray.length, '개');
            
            // 서버 데이터를 Route 형식으로 변환
            const serverRoutes = routesArray.map((route: any, index: number) => {
              console.log(`경로 ${index + 1} 데이터:`, route);
              console.log(`경로 ${index + 1} 전체 속성:`, Object.keys(route));
              
              // coords 배열 확인 및 안전한 처리
              let coordinates = [];
              if (route.coords && Array.isArray(route.coords)) {
                coordinates = route.coords.map((coord: number[]) => ({
                  latitude: coord[1] || 0,  // 두 번째 값이 위도
                  longitude: coord[0] || 0  // 첫 번째 값이 경도
                }));
                console.log(`경로 ${index + 1} coords 개수:`, route.coords.length);
              } else if (route.coordinates && Array.isArray(route.coordinates)) {
                coordinates = route.coordinates.map((coord: any) => ({
                  latitude: coord.latitude || coord.lat || 0,
                  longitude: coord.longitude || coord.lng || 0
                }));
              } else {
                console.log(`경로 ${index + 1}에 coords 데이터가 없습니다.`);
              }
              
              // 난이도 결정 (score 기반)
              let difficulty = 'easy';
              if (route.score > 0.4) difficulty = 'hard';
              else if (route.score > 0.1) difficulty = 'medium';
              
              return {
                id: `route_${route.idx || route.id || index + 1}`,
                name: `${route.kind || '러닝'} 코스 ${route.idx || route.id || index + 1}`,
                difficulty: difficulty,
                coordinates: coordinates,
                distance: route.length_km || route.distance || 5,
                duration: Math.round((route.length_km || route.distance || 5) * 6), // 6분/km 가정
              };
            });
            
            setRoutes(serverRoutes);
            console.log('서버에서 받은 경로 로딩 완료:', serverRoutes.length, '개');
          } else {
            console.log('서버에서 유효한 경로 데이터가 없어서 로컬 데이터 사용');
            console.log('서버 응답 전체:', JSON.stringify(serverData, null, 2));
            const localRoutes = createLocalRoutes();
            setRoutes(localRoutes);
          }
        } else {
          console.error('서버 응답 오류:', response.status, response.statusText);
          
          // 서버 오류일 때 응답 본문 확인
          try {
            const errorText = await response.text();
            console.error('서버 오류 응답 본문:', errorText);
          } catch (e) {
            console.error('응답 본문 읽기 실패:', e);
          }
          
          // 서버 오류 시 로컬 데이터 사용
          console.log('서버 오류로 로컬 데이터 사용');
          const localRoutes = createLocalRoutes();
          setRoutes(localRoutes);
        }
      } catch (error) {
        console.error('API 요청 실패:', error);
        // 네트워크 오류 시 로컬 데이터 사용
        const localRoutes = createLocalRoutes();
        setRoutes(localRoutes);
      } finally {
        setLoading(false);
      }
    };

    loadRoutes();
  }, []);

  // 캐러셀 아이템 변경 시 호출 (사용자 스와이프만 처리)
  const onSnapToItem = (index: number) => {
    if (!isProgrammaticScroll.current) {
      setCurrentIndex(index);
    }
  };

  // 이전 버튼 클릭
  const handlePrevious = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      isProgrammaticScroll.current = true;
      setCurrentIndex(newIndex);
      carouselRef.current?.scrollTo({ index: newIndex, animated: true });
      setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, 100);
    }
  };

  // 다음 버튼 클릭
  const handleNext = () => {
    if (currentIndex < routes.length - 1) {
      const newIndex = currentIndex + 1;
      isProgrammaticScroll.current = true;
      setCurrentIndex(newIndex);
      carouselRef.current?.scrollTo({ index: newIndex, animated: true });
      setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, 100);
    }
  };

  // 인디케이터 클릭
  const handleIndicatorPress = (index: number) => {
    isProgrammaticScroll.current = true;
    setCurrentIndex(index);
    carouselRef.current?.scrollTo({ index: index, animated: true });
    setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 100);
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
      ) : routes.length > 0 ? (
        <>
          <Carousel
            ref={carouselRef}
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
                    latitude: item.coordinates[0]?.latitude || userLatitude,
                    longitude: item.coordinates[0]?.longitude || userLongitude,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02,
                  }}
                  onPress={() => handleMapPress(index)}
                  showsUserLocation={true}
                  showsMyLocationButton={true}
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
                  <Polyline
                    coordinates={item.coordinates}
                    strokeColor={Colors.gray2}
                    strokeWidth={5}
                    lineDashPattern={[1]}
                    zIndex={1}
                  />
                  
                  <GradientPolyline
                    coordinates={item.coordinates}
                    strokeWidth={3}
                    colors={['#54F895', '#2AFBEA']}
                  />
                </MapView>
              </View>
            )}
          />
          
          {/* 인디케이터 */}
          <View style={styles.indicatorContainer}>
            {routes.map((_, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.indicator,
                  index === currentIndex && styles.activeIndicator,
                ]}
                onPress={() => handleIndicatorPress(index)}
                activeOpacity={0.7}
              />
            ))}
          </View>
          
          {/* 컨트롤 버튼 */}
          <View style={styles.controlBar}>
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={handlePrevious}
              disabled={currentIndex === 0}
            >
              <Ionicons 
                name="chevron-back" 
                size={24} 
                color={currentIndex === 0 ? Colors.gray3 : Colors.white} 
              />
            </TouchableOpacity>
            
            <View style={styles.distanceContainer}>
              <ThemedText type="h2" style={styles.distanceText}>
                {routes[currentIndex]?.distance?.toFixed(1) || '0.0'}km
              </ThemedText>
            </View>
            
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={handleNext}
              disabled={currentIndex === routes.length - 1}
            >
              <Ionicons 
                name="chevron-forward" 
                size={24} 
                color={currentIndex === routes.length - 1 ? Colors.gray3 : Colors.white} 
              />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.loadingContainer}>
          <ThemedText type="body1" style={{ color: Colors.white }}>경로를 찾을 수 없습니다.</ThemedText>
        </View>
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
  controlBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 10,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.gray4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  distanceContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  distanceText: {
    color: Colors.primary,
    fontSize: 20,
    fontWeight: '600',
  },
});