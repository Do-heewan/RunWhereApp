import { Button, StyleSheet, TextInput, View } from "react-native";

export default function SignUpRunning() {
  return (
    <View>
        <TextInput style={styles.input} placeholder="평균 km" />
        <TextInput style={styles.input} placeholder="페이스" />
        <TextInput style={styles.input} placeholder="숨김 여부" />
        <Button title="다음" />
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