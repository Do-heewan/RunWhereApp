import { useLocalSearchParams, useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Button, View } from "react-native";
import { auth, db } from "../backend/db/firebase";

export default function SignUpFinal() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const getParam = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value ?? "";

  const email = getParam(params.email);
  const password = getParam(params.password);
  const name = getParam(params.name);
  const gender = getParam(params.gender);
  const birthday = getParam(params.birthday);
  const latitude = Number(getParam(params.latitude));
  const longitude = Number(getParam(params.longitude));

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        email: email,
        gender: gender,
        birthday: birthday,
        latitude: latitude,
        longitude: longitude,
      });
      router.replace("/login");
    } catch (e) {
      alert("회원가입 실패");
      router.replace("/login");
    }
  };

  return (
    <View>
      <Button title="회원가입 완료" onPress={handleSignUp} />
    </View>
  );
}