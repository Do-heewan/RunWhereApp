import GradientButton from '@/components/GradientButton';
import SignUpAppbar from '@/components/SignUpAppbar';
import { ThemedText } from '@/components/ThemedText';
import ThemedTextInput from '@/components/ThemedTextInput';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";


export default function SignUp() {
    const router = useRouter();
    const params = useLocalSearchParams();

    const [name, setName] = useState("");
    const [emailUsername, setEmailUsername] = useState("runwhere");
    const [emailDomain, setEmailDomain] = useState("");
    const [showDomainDropdown, setShowDomainDropdown] = useState(false);
    const [isCustomDomain, setIsCustomDomain] = useState(true);
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [gender, setGender] = useState<string | null>(null);
    const [birthday, setBirthday] = useState("");
    const [phone, setPhone] = useState("");
    const [phoneCode, setPhoneCode] = useState("");

    // 전화번호 형식 검증 함수
    const validatePhoneNumber = (phoneNumber: string) => {
        // 010-1234-5678 형식 검증
        const phoneRegex = /^010-\d{4}-\d{4}$/;
        return phoneRegex.test(phoneNumber);
    };

    // 전화번호 에러 상태
    const [phoneError, setPhoneError] = useState(false);

    // 전화번호 변경 핸들러
    const handlePhoneChange = (text: string) => {
        setPhone(text);
        if (text.trim() !== "") {
            setPhoneError(!validatePhoneNumber(text));
        } else {
            setPhoneError(false);
        }
    };

    // 모든 필수 입력이 완료되었는지 확인
    const isFormComplete = name.trim() !== "" && 
                          emailUsername.trim() !== "" && 
                          emailDomain.trim() !== "" && 
                          password.trim() !== "" && 
                          gender !== null && 
                          birthday.trim() !== "" && 
                          phone.trim() !== "" && 
                          phoneCode.trim() !== "" &&
                          !phoneError;

    return (
        <SafeAreaView style={styles.container}>
            {/* 상단 앱바 */}
            <SignUpAppbar />

            {/* 회원가입 폼 */}
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <ThemedText type="sub1" style={{ color: Colors.white, marginBottom: 10 }}>이름</ThemedText>
                <ThemedTextInput
                    type="body1"
                    placeholder="이름을 입력하세요"
                    value={name}
                    onChangeText={setName}
                />

                <ThemedText type="sub1" style={{ color: Colors.white, marginBottom: 10, marginTop: 30 }}>이메일</ThemedText>
                <View style={styles.emailContainer}>
                    <ThemedTextInput
                        type="body1"
                        placeholder="이메일"
                        value={emailUsername}
                        onChangeText={setEmailUsername}
                        style={styles.emailUsernameInput}
                    />
                    <ThemedText type="body1" style={{ color: Colors.white, marginLeft: 5, marginRight: 5 }}>@</ThemedText>
                    <View style={styles.emailDomainContainer}>
                        
                        
                        <ThemedTextInput
                            type="body1"
                            placeholder="도메인을 입력하세요"
                            value={emailDomain}
                            onChangeText={setEmailDomain}
                            style={[styles.emailDomainInput]}
                        />
                        <TouchableOpacity 
                            style={styles.domainSelectButton}
                            onPress={() => setShowDomainDropdown(!showDomainDropdown)}
                        >
                            <Ionicons 
                                name={showDomainDropdown ? "chevron-up" : "chevron-down"} 
                                size={24} 
                                color={Colors.gray3} 
                            />
                        </TouchableOpacity>
                        
                        {showDomainDropdown && (
                            <View style={styles.dropdownContainer}>
                                <TouchableOpacity 
                                    style={styles.dropdownItem}
                                    onPress={() => {
                                        setEmailDomain("naver.com");
                                        setShowDomainDropdown(false);
                                        setIsCustomDomain(false);
                                    }}
                                >
                                    <ThemedText type="body1" style={{ color: Colors.white }}>naver.com</ThemedText>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={styles.dropdownItem}
                                    onPress={() => {
                                        setEmailDomain("gmail.com");
                                        setShowDomainDropdown(false);
                                        setIsCustomDomain(false);
                                    }}
                                >
                                    <ThemedText type="body1" style={{ color: Colors.white }}>gmail.com</ThemedText>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={styles.dropdownItem}
                                    onPress={() => {
                                        setIsCustomDomain(true);
                                        setShowDomainDropdown(false);
                                        setEmailDomain("");
                                    }}
                                >
                                    <ThemedText type="body1" style={{ color: Colors.white }}>직접입력</ThemedText>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>

                <ThemedText type="sub1" style={{ color: Colors.white, marginBottom: 10, marginTop: 30 }}>비밀번호</ThemedText>
                <ThemedTextInput
                    type="body1"
                    placeholder="비밀번호를 입력하세요"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <ThemedText type="body3" style={{ color: Colors.gray4, marginTop: 5 }}>****를 포함해주세요</ThemedText>

                             <ThemedText type="sub1" style={{ color: Colors.white, marginBottom: 10, marginTop: 30 }}>성별을 선택해주세요</ThemedText>
             <View style={styles.genderButtonsContainer}>
                 <TouchableOpacity 
                     style={[
                         styles.genderButton, 
                         gender === '남성' && styles.genderButtonSelected
                     ]}
                     onPress={() => setGender('남성')}
                 >
                     <ThemedText 
                         type="body1" 
                         style={{ 
                             color: gender === '남성' ? Colors.gray1 : Colors.white 
                         }}
                     >
                         남성
                     </ThemedText>
                 </TouchableOpacity>
                 
                 <TouchableOpacity 
                     style={[
                         styles.genderButton, 
                         gender === '여성' && styles.genderButtonSelected
                     ]}
                     onPress={() => setGender('여성')}
                 >
                     <ThemedText 
                         type="body1" 
                         style={{ 
                             color: gender === '여성' ? Colors.gray1 : Colors.white 
                         }}
                     >
                         여성
                     </ThemedText>
                 </TouchableOpacity>
             </View>

                <ThemedText type="sub1" style={{ color: Colors.white, marginBottom: 10,marginTop:30 }}>휴대폰 번호</ThemedText>
                <ThemedTextInput
                    type="body1"
                    placeholder="통신사 선택"
                    value={birthday}
                    onChangeText={setBirthday}
                />
                <View style={{flexDirection:'row',gap:10,marginTop:10,marginBottom:10}}>
                    <ThemedTextInput
                        style={{flex:1}}
                        type="body1"
                        placeholder="010-1234-5678"
                        value={phone}
                        onChangeText={handlePhoneChange}
                        hasError={phoneError}
                    />
                    <ThemedTextInput
                        type="body1"    
                        placeholder="인증번호 받기"
                        value={phoneCode}
                        onChangeText={setPhoneCode}
                    />
                </View>
                
                {/* 스크롤 영역 하단에 여백 추가 */}
                <View style={{ height: 100 }} />
            </ScrollView>
            
            {/* 절대 위치 버튼 */}
            <View style={styles.buttonContainer}>
                {isFormComplete ? (
                    <GradientButton 
                        style={{height:68}}
                        title="이제 한 단계 남았어요!" 
                        onPress={() => {
                            router.push({
                                pathname: '/signUpRunning',
                                params: {
                                    ...params,
                                    name,
                                    email: `${emailUsername}@${emailDomain}`,
                                    password,
                                    gender,
                                    birthday,
                                    phone,
                                    phoneCode,
                                },
                            });
                        }} 
                    />
                ) : (
                    <View style={styles.disabledButton}>
                        <ThemedText type="button1" style={{ color: Colors.gray4 }}>
                            이제 한 단계 남았어요!
                        </ThemedText>
                    </View>
                )}
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
         paddingHorizontal: 20,
     },
     genderButtonsContainer: {
         flexDirection: 'row',
         gap: 18,
         justifyContent: 'center',
         alignItems: 'center',
     },
     genderButton: {
         width: 150,
         height: 50,
         borderWidth: 1,
         borderColor: Colors.gray1,
         backgroundColor: Colors.gray1,
         borderRadius: 10,
         justifyContent: 'center',
         alignItems: 'center',
     },
     genderButtonSelected: {
         backgroundColor: Colors.primary,
         borderColor: Colors.primary,
     },
     emailContainer: {
         flexDirection: 'row',
         alignItems: 'center',
         marginBottom: 20,
         
     },
     emailUsernameInput: {
         flex: 1,
         maxWidth: '45%',
     },
     emailDomainContainer: {
         flex: 1,
         marginLeft: 0,
         position: 'relative',
         flexDirection: 'row',
         alignItems: 'center',
         maxWidth: '45%',
         gap: 0,
     },
     emailDomainInput: {
         flex: 1,
     },
     domainSelectButton: {
         justifyContent: 'center',
         alignItems: 'center',
         width: 24,
         height: 24,
     },
     dropdownContainer: {
         position: 'absolute',
         top: '100%',
         left: 0,
         backgroundColor: Colors.gray1,
         borderRadius: 10,
         borderWidth: 1,
         borderColor: Colors.gray2,
         zIndex: 1000,
         marginTop: 5,
         minWidth: 120,
     },
     dropdownItem: {
         paddingVertical: 12,
         paddingHorizontal: 20,
         borderBottomWidth: 1,
         borderBottomColor: Colors.gray2,
         minWidth: 120,
     },
     buttonContainer: {
         height:68,
         position: 'absolute',
         bottom: 0,
         left: 20,
         right: 20,
         zIndex: 1000,
     },
     disabledButton: {
         height: 68,
         backgroundColor: Colors.gray2,
         borderRadius: 50,
         justifyContent: 'center',
         alignItems: 'center',
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