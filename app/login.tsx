import Eclipse from '@/components/EclipseSVG'; //background Image
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import ThemedTextInput from '@/components/ThemedTextInput';
import GradientButton from '@/components/GradientButton';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, StyleSheet, TouchableOpacity, View } from 'react-native';
import { signInWithEmailAndPassword } from "firebase/auth";
import { SafeAreaView } from 'react-native-safe-area-context';
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
            console.log('로그인 실패:', error);
            Alert.alert('로그인 실패', 'ID 또는 비밀번호가 잘못되었습니다.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Eclipse/>
            <ThemedTextInput
                style={{marginBottom:15}}
                type="body1"
                placeholder="이메일"
                value={enteredId}
                onChangeText={setEnteredId}
            />

            <ThemedTextInput
                style={{marginBottom:15}}
                type="body1"
                placeholder="비밀번호"
                value={enteredPassword}
                onChangeText={setEnteredPassword}
                secureTextEntry={true}
            />
            <View style={styles.bottomBarContainer}>
                <TouchableOpacity>          
                    <ThemedText type="body1" style={{ color: Colors.white }}>
                        아이디 찾기
                    </ThemedText>
                </TouchableOpacity>
                <ThemedText type="body1" style={{ color: Colors.white }}>|</ThemedText>
                <TouchableOpacity>
                    <ThemedText type="body1" style={{ color: Colors.white }}>
                        비밀번호 재설정
                    </ThemedText>
                </TouchableOpacity>
                <ThemedText type="body1" style={{ color: Colors.white }}>|</ThemedText>
                <TouchableOpacity onPress={() => router.push('/signUpLocation')}>
                    <ThemedText type="body1" style={{ color: Colors.white }}>
                        회원가입
                    </ThemedText>
                </TouchableOpacity>
            </View>

            <View style={styles.buttonContainer}>
                <GradientButton
                    title="로그인"
                    onPress={handleLogin}
                />
            </View>
        

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#15151C',
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    bottomBarContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 15,
        alignItems: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        marginVertical: 10,
        color: '#fff',
    },
    buttonContainer: {
        height:68,
        marginTop: 30,
        zIndex: 1000,
    },
});