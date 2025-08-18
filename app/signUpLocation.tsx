import GradientButton from "@/components/GradientButton";
import SignUpAppbar from "@/components/SignUpAppbar";
import { ThemedText } from "@/components/ThemedText";
import ThemedTextInput from "@/components/ThemedTextInput";
import { Colors } from "@/constants/Colors";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignUpLocation(){
  const router = useRouter();
  const params = useLocalSearchParams();
  const [location, setLocation] = useState("서초동");

  const handleCurrentLocation = () => {
    // 현재 위치로 찾기 기능 (나중에 구현) 카카오 api사용하면됨.
    console.log("현재 위치로 찾기");
  };

  const handleNext = () => {
    if (!location.trim()) {
      alert("동네를 입력하세요.");
      return;
    }
    
    router.push({
      pathname: '/signUp',
      params: {
        ...params,
        location,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <SignUpAppbar />
      
      {/* 검색 입력 필드 */}
      <View style={styles.searchContainer}>
        <ThemedTextInput
          type="body1"
          placeholder="동네 이름"
          value={location}
          onChangeText={setLocation}
          style={styles.searchInput}
        />
      </View>

      {/* 현재 위치로 찾기 버튼 */}
      <TouchableOpacity style={styles.currentLocationButton} onPress={handleCurrentLocation}>
        <ThemedText type="button1" style={{ color: Colors.white }}>
          현재위치로 찾기
        </ThemedText>
      </TouchableOpacity>

      {/* 근처 동네 섹션 */}
      <View style={styles.nearbySection}>
        <ThemedText type="sub1" style={{ color: Colors.white, marginBottom: 20 }}>
          근처 동네
        </ThemedText>
        
        {/* 동네 목록 */}
        {Array.from({ length: 9 }, (_, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.locationItem}
            onPress={() => setLocation("인천 연수구 송도 1동")}
          >
            <ThemedText type="body1" style={{ color: Colors.white }}>
              인천 연수구 송도 1동
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      {/* 하단 버튼 */}
      <View style={styles.buttonContainer}>
        <GradientButton 
          style={{height:68}}
          title="다음" 
          onPress={handleNext}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.blackGray,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  searchInput: {
    backgroundColor: Colors.gray1,
    borderRadius: 10,
  },
  currentLocationButton: {
    backgroundColor: Colors.primary,
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nearbySection: {
    paddingHorizontal: 20,
    marginTop: 40,
  },
  locationItem: {
    paddingVertical: 12,
  },
  buttonContainer: {
    height: 68,
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
});
