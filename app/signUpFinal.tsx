import { auth, db } from "@/backend/db/firebase";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { router, useLocalSearchParams } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";

export default function SignUpFinal() {
  const params = useLocalSearchParams();
  const email = params.email as string;
  const password = params.password as string;
  const name = params.name as string;
  const gender = params.gender as string;
  const birthday = params.birthday as string;
  const latitude = Number(params.latitude);
  const longitude = Number(params.longitude);
  const phone = params.phone as string;
  const phoneCode = params.phoneCode as string;
  const nickname = params.nickname as string;
  const paceMinutes = Number(params.paceMinutes);
  const paceSeconds = Number(params.paceSeconds);
  const dontKnowPace = params.dontKnowPace as string;
  const showPaceInProfile = params.showPaceInProfile as string;

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, `users/${user.uid}`), {
        uid: user.uid,
        name: name,
        email: email,
        gender: gender,
        birthday: birthday,
        phone: phone,
        phoneCode: phoneCode,
        nickname: nickname,
        paceMinutes: paceMinutes,
        paceSeconds: paceSeconds,
        dontKnowPace: dontKnowPace,
        showPaceInProfile: showPaceInProfile,
        location: {
          latitude: latitude,
          longitude: longitude,
        },
      });
      router.replace("/login");
    } catch (e) {
      alert("회원가입 실패");
      router.replace("/login");
    }
  };
  
  // 모든 회원가입 정보를 console.log로 출력
  React.useEffect(() => {
    console.log("=== 회원가입 완료 정보 ===");
    console.log("Location:", location);
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Gender:", gender);
    console.log("Birthday:", birthday);
    console.log("Phone:", phone);
    console.log("PhoneCode:", phoneCode);
    console.log("Nickname:", nickname);
    console.log("PaceMinutes:", paceMinutes);
    console.log("PaceSeconds:", paceSeconds);
    console.log("DontKnowPace:", dontKnowPace);
    console.log("ShowPaceInProfile:", showPaceInProfile);
    console.log("==========================");
  }, [params]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="h1" style={{ color: Colors.white, textAlign: 'center', marginBottom: 20 }}>
          회원가입 완료!
        </ThemedText>
        <ThemedText type="body1" style={{ color: Colors.white, textAlign: 'center' }}>
          모든 정보가 성공적으로 전달되었습니다.
        </ThemedText>
        <ThemedText type="body2" style={{ color: Colors.gray4, textAlign: 'center', marginTop: 10 }}>
          콘솔에서 전달된 정보를 확인하세요.
        </ThemedText>
        <ThemedText
          type="button1"
          onPress={() => {
            handleSignUp();
            router.replace("/login");
          }}
          style={{
            marginTop: 30,
            paddingVertical: 12,
            paddingHorizontal: 24,
            backgroundColor: Colors.primary,
            color: Colors.white,
            borderRadius: 8,
            textAlign: 'center',
            overflow: 'hidden',
          }}
        >
          로그인 페이지로 이동
        </ThemedText>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.blackGray,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
});