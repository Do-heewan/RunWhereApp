// TapToDropPin.tsx
import React, { useRef, useState } from "react";
import { Button, StyleSheet, TextInput, View } from "react-native";
import MapView, { Camera, LatLng, MapPressEvent, Marker } from "react-native-maps";

export default function TapToDropPin(){
  const mapRef = useRef<MapView | null>(null);
  const [pin, setPin] = useState<LatLng | null>(null); // { latitude, longitude }

  const handlePress = (e: MapPressEvent) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    console.log("Tapped at:", latitude, longitude);

    const nextPin: LatLng = { latitude, longitude };
    setPin(nextPin);

    // 선택: 카메라를 해당 위치로 살짝 줌인하며 이동
    const camera: Partial<Camera> = {
      center: nextPin,
      zoom: 17, // Google provider에서 동작. iOS는 altitude 사용 가능
    };
    mapRef.current?.animateCamera(camera, { duration: 250 });
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="동네 이름" />
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 37.5665,
          longitude: 126.9780,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        onPress={handlePress} // ← 지도 탭 이벤트
      >
        {pin && <Marker coordinate={pin} title="여기에 마커!" />}
      </MapView>

      <View style={styles.fab}>
        <Button title="마커 지우기" onPress={() => setPin(null)} />
      </View>
      <Button title="다음" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: "100%", height: "60%" },
  fab: { position: "absolute", bottom: 24, left: 24, right: 24 },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    margin: 10,
  },
});
