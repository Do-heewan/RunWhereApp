import { useState } from 'react';
import { Button, StyleSheet, TextInput, View, Alert, Text } from 'react-native';
import { useRouter } from 'expo-router';

export const fixedUser = {
  id: 'runwhere',
  password: '1234',
  name: 'RunWhere User',
  email: 'run@example.com',
};

export default function Login() {
  const [enteredId, setEnteredId] = useState('');
  const [enteredPassword, setEnteredPassword] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    if (
      enteredId === fixedUser.id &&
      enteredPassword === fixedUser.password
    ) {
      router.push('/home');
    } else {
      Alert.alert('Login Failed', 'Invalid ID or password');
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
        <Button title="Signup" onPress={() => {}} color="#2196F3" />
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