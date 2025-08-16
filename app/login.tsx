import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, StyleSheet, TextInput, View } from 'react-native';

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../backend/db/firebase";

export default function Login() {
  const [enteredId, setEnteredId] = useState('');
  const [enteredPassword, setEnteredPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    // 로그인 로직 구현
    try {
      const userCredential = await signInWithEmailAndPassword(auth, enteredId, enteredPassword);
      Alert.alert('로그인 성공!', `런웨어로 돌아오셨군요!, ${userCredential.user.email}`);
      router.push('/home');
    } catch (error) {
      console.error('로그인 실패:', error);
      Alert.alert('로그인 실패', 'ID 또는 비밀번호가 잘못되었습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Id"
        placeholderTextColor="#888"
        value={enteredId}
        onChangeText={setEnteredId}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        secureTextEntry
        value={enteredPassword}
        onChangeText={setEnteredPassword}
      />
      <View style={styles.buttonContainer}>
        <Button title="Login" onPress={handleLogin} color="#4CAF50" />
        <Button title="Signup" onPress={() => router.push('/signUp')} color="#2196F3" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#15151C',
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginVertical: 10,
    color: '#fff', 
  },
  buttonContainer: {
    marginTop: 20,
    gap: 10,
  },
});