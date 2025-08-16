import { useLocalSearchParams, useRouter } from "expo-router";
import { Button, StyleSheet, TextInput, View } from "react-native";

export default function SignUpRunning() {

  const router = useRouter();
  const params = useLocalSearchParams();

  const handleNext = () => {
    // 회원가입 페이지로 정보 전달 (예: 서버로 전송 또는 Firestore 저장)
    // params에 기존 값 + pin의 위경도 추가
    router.push({
      pathname: '/signUpFinal', // 예시: 최종 회원가입 처리 페이지
      params: {
        ...params,
      },
    });
  };

  return (
    <View>
        <TextInput style={styles.input} placeholder="평균 km" />
        <TextInput style={styles.input} placeholder="페이스" />
        <TextInput style={styles.input} placeholder="숨김 여부" />
        <Button title="다음" onPress={handleNext} />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    margin: 10,
  },
});