import Eclipse from '@/components/EclipseSVG';
import GradientButton from '@/components/GradientButton';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import MapView from 'react-native-maps';
import Carousel from 'react-native-reanimated-carousel';


export default function HomeScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedMapIndex, setSelectedMapIndex] = useState<number | null>(null);

  const urlList = [
    "aquarelle",
    "backdrop",
    "basic",
    "bright",
    "dataviz",
  ];
  // 선택된 스타일 (기본값: aquarelle)
  const [styleIndex, setStyleIndex] = useState(0);
  let url = `https://api.maptiler.com/maps/${urlList[styleIndex]}/{z}/{x}/{y}.png?key=zj59kKsjCm6jcyYTg7qQ`;
  const handleStyleChange = () => {
    setStyleIndex((prevIndex) => (prevIndex + 1) % urlList.length);
    url = `https://api.maptiler.com/maps/${urlList[styleIndex]}/{z}/{x}/{y}.png?key=zj59kKsjCm6jcyYTg7qQ`;
  };

  const onSnapToItem = (index: number) => {
    setCurrentIndex(index);
  };

  const handleMapPress = (index: number) => {
    setSelectedMapIndex(selectedMapIndex === index ? null : index);
  };

  const handleBackPress = () => {
    router.push('/(tabs)/home');
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
      <ThemedText type="body2" style={{ color: Colors.white, alignSelf: 'center' }}>당신과 딱 맞는 5가지 동선을 가져왔어요.</ThemedText>
      <Carousel
        width={Dimensions.get('window').width}
        height={Dimensions.get('window').width}
        data={urlList}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 70,
        }}
        onSnapToItem={onSnapToItem}
        renderItem={({ item, index }) => (
          <View style={styles.carouselItem}>
            <MapView
              style={selectedMapIndex === index ? styles.selectedMap : styles.map}
              mapType="none"
              initialRegion={{
                latitude: 37.5665,
                longitude: 126.9780,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              onPress={() => handleMapPress(index)}
            />
          </View>
        )}
      />
      <View style={styles.indicatorContainer}>
        {urlList.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              index === currentIndex && styles.activeIndicator,
            ]}
          />
        ))}
      </View>
             {selectedMapIndex === null ? (
         <View style={styles.globalOverlay}>
           <ThemedText type="button1" style={styles.overlayText}>
             마음에 드는 코스를 선택해보세요
           </ThemedText>
         </View>
       ) : (
         <GradientButton
           onPress={() => {
             console.log('선택된 맵:', selectedMapIndex);
             router.push('/(tabs)/home');
           }}
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
});