import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Button, StyleSheet, TextInput, View } from "react-native";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../backend/db/firebase";

export default function SignUp() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [gender, setGender] = useState("");
  const [birthday, setBirthday] = useState("");

  const router = useRouter();

  const handleSignUp = async () => {
    // 회원가입 로직 구현
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("회원가입 성공", userCredential);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        email,
        gender,
        birthday,
      });
      router.push("/home");
    } catch (error) {
      Alert.alert("회원가입 실패", "회원가입에 실패했습니다. 다시 시도해주세요.", error.message);
    } finally {
      setName("");
      setEmail("");
      setPassword("");
      setPasswordConfirm("");
      setGender("");
      setBirthday("");
      Alert.alert("회원가입 완료", "런웨어에 오신 것을 환영합니다.");
    }
  };

  return (
    <View>
      <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <TextInput style={styles.input} placeholder="Password Confirm" value={passwordConfirm} onChangeText={setPasswordConfirm} secureTextEntry />
      <TextInput style={styles.input} placeholder="Gender" value={gender} onChangeText={setGender} />
      <TextInput style={styles.input} placeholder="Birthday" value={birthday} onChangeText={setBirthday} />
      <Button onPress={handleSignUp} title="다음" />
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