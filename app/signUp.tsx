import { useRouter } from "expo-router";
import { useState } from "react";
import { Button, StyleSheet, TextInput, View } from "react-native";


export default function SignUp() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [gender, setGender] = useState("");
  const [birthday, setBirthday] = useState("");

  const router = useRouter();

  return (
    <View>
      <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <TextInput style={styles.input} placeholder="Password Confirm" value={passwordConfirm} onChangeText={setPasswordConfirm} secureTextEntry />
      <TextInput style={styles.input} placeholder="Gender" value={gender} onChangeText={setGender} />
      <TextInput style={styles.input} placeholder="Birthday" value={birthday} onChangeText={setBirthday} />
      <Button onPress={() =>
        router.push({
          pathname: '/signUpLocation',
          params: {
            name,
            email,
            password,
            gender,
            birthday,
          },
        })
      } title="다음" 
      />
    </View>
  );
}           

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "gray",
    backgroundColor: "white",
    color: "black",
    padding: 10,
    margin: 10,
  },
});

/*

동네조회를 먼저하고 -> 필수정보 입력

- 이름
- 이메일
- 휴대폰 인증
- 패스워드
- 패스워드 확인
- 성별
- 생년월일
- 동네 조회 (지도 표기)
- 평균 km, 페이스 정보 수집
    - 숨김 여부 조사
*/