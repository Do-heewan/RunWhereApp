import SignUpAppbar from '@/components/SignUpAppbar';
import { Colors } from '@/constants/Colors';
import { useRouter } from "expo-router";
import { useState } from "react";
import { Button, SafeAreaView, StyleSheet, TextInput, View } from "react-native";


export default function SignUp() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [gender, setGender] = useState("");
    const [birthday, setBirthday] = useState("");
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            {/* 상단 앱바 */}
            <SignUpAppbar />
            {/* 회원가입 폼 */}
            <View style={styles.content}>
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
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.blackGray,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 15,
        paddingLeft: 19,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        color: Colors.white,
        fontWeight: '600',
    },
    placeholder: {
        width: 40, // backButton과 동일한 너비로 균형 맞춤
    },
    content: {
        flex: 1,
        padding: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.gray2,
        backgroundColor: Colors.white,
        color: Colors.blackGray,
        padding: 15,
        marginBottom: 15,
        borderRadius: 8,
        fontSize: 16,
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