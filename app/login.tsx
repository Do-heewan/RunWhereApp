import { Button, StyleSheet, TextInput, View } from "react-native";

export default function Login() {
  return (
    <View>
        <TextInput style={styles.input} placeholder="Id" />
        <TextInput style={styles.input} placeholder="Password" />
        <Button title="Login" />
        <Button title="Signup" />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    margin: 10,
  }
});