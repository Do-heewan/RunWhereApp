import GradientButton from '@/components/GradientButton';
import SignUpAppbar from '@/components/SignUpAppbar';
import { ThemedText } from '@/components/ThemedText';
import ThemedTextInput from '@/components/ThemedTextInput';
import { Colors } from '@/constants/Colors';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignUpRunning() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [nickname, setNickname] = useState("런웨어");
  const [paceMinutes, setPaceMinutes] = useState("06");
  const [paceSeconds, setPaceSeconds] = useState("30");
  const [dontKnowPace, setDontKnowPace] = useState(false);
  const [showPaceInProfile, setShowPaceInProfile] = useState<boolean | null>(null);

  // 숫자만 입력 가능하도록 필터링하는 함수
  const handlePaceChange = (text: string, setter: (value: string) => void) => {
    const numericText = text.replace(/[^0-9]/g, '');
    if (numericText.length <= 2) {
      setter(numericText);
    }
  };

  // 모든 필수 입력이 완료되었는지 확인
  const isFormComplete = nickname.trim() !== "" && 
                        paceMinutes.trim() !== "" && 
                        paceSeconds.trim() !== "" && 
                        showPaceInProfile !== null;

  const handleNext = () => {
    router.push({
      pathname: '/signUpFinal',
      params: {
        ...params,
        nickname,
        paceMinutes,
        paceSeconds,
        dontKnowPace: dontKnowPace.toString(),
        showPaceInProfile: showPaceInProfile?.toString() || '',
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 앱바 */}
      <SignUpAppbar />

      {/* 회원가입 폼 */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 닉네임 입력 */}
        <ThemedText type="sub1" style={{ color: Colors.white, marginBottom: 10 }}>닉네임을 설정해주세요</ThemedText>
        <ThemedTextInput
          type="body1"
          placeholder="닉네임을 입력하세요"
          value={nickname}
          onChangeText={setNickname}
        />

        {/* 평균 페이스 입력 */}
        <ThemedText type="sub1" style={{ color: Colors.white, marginBottom: 10, marginTop: 30 }}>평균 페이스를 입력해주세요</ThemedText>
        <ThemedText type="body3" style={{ color: Colors.gray4, marginBottom: 15 }}>
          페이스는 1km를 뛸 때 걸리는 시간을 의미해요
        </ThemedText>
        
        <View style={styles.paceContainer}>
          <View style={styles.paceInputContainer}>
            <ThemedTextInput
              type="body1"
              placeholder="06"
              value={paceMinutes}
              onChangeText={(text) => handlePaceChange(text, setPaceMinutes)}
              style={styles.paceInput}
              keyboardType="numeric"
              maxLength={2}
            />
            <ThemedText type="body1" style={{ color: Colors.white}}>분</ThemedText>
          </View>
          
          <View style={styles.paceInputContainer}>
            <ThemedTextInput
              type="body1"
              placeholder="30"
              value={paceSeconds}
              onChangeText={(text) => handlePaceChange(text, setPaceSeconds)}
              style={styles.paceInput}
              keyboardType="numeric"
              maxLength={2}
            />
            <ThemedText type="body1" style={{ color: Colors.white}}>초</ThemedText>
          </View>
        </View>

        {/* 페이스 모르겠어요 체크박스 */}
        <TouchableOpacity 
          style={styles.checkboxContainer} 
          onPress={() => setDontKnowPace(!dontKnowPace)}
        >
          <View style={[styles.checkbox, dontKnowPace && styles.checkboxChecked]}>
            {dontKnowPace && (
              <ThemedText type="body1" style={{ color: Colors.blackGray }}>✓</ThemedText>
            )}
          </View>
          <ThemedText type="body1" style={{ color: Colors.white, marginLeft: 10 }}>
            제 평균 페이스를 잘 모르겠어요!
          </ThemedText>
        </TouchableOpacity>

        {/* 프로필 표시 여부 */}
        <ThemedText type="sub1" style={{ color: Colors.white, marginBottom: 10, marginTop: 30 }}>
          평균페이스를 프로필에 나타내도 될까요?
        </ThemedText>
        <ThemedText type="body3" style={{ color: Colors.gray4, marginBottom: 15 }}>
          서로의 페이스를 잘 알아볼 수 있어요
        </ThemedText>
        
        <View style={styles.profileButtonsContainer}>
          <TouchableOpacity 
            style={[
              styles.profileButton, 
              showPaceInProfile === true && styles.profileButtonSelected
            ]}
            onPress={() => setShowPaceInProfile(true)}
          >
            <ThemedText 
              type="body1" 
              style={{ 
                color: showPaceInProfile === true ? Colors.blackGray : Colors.white 
              }}
            >
              네, 상관없어요
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.profileButton, 
              showPaceInProfile === false && styles.profileButtonSelected
            ]}
            onPress={() => setShowPaceInProfile(false)}
          >
            <ThemedText 
              type="body1" 
              style={{ 
                color: showPaceInProfile === false ? Colors.blackGray : Colors.white 
              }}
            >
              아니요
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* 스크롤 영역 하단에 여백 추가 */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* 절대 위치 버튼 */}
      <View style={styles.buttonContainer}>
        {isFormComplete ? (
          <GradientButton 
            style={{ height: 68 }}
            title="회원가입 완료" 
            onPress={handleNext}
          />
        ) : (
          <View style={styles.disabledButton}>
            <ThemedText type="button1" style={{ color: Colors.gray4 }}>
              회원가입 완료
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
  paceContainer: {
    flexDirection: 'row',
    gap: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  paceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap:18,
  },
  paceInput: {
    width: 65,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: Colors.gray2,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  profileButtonsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  profileButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.gray1,
    backgroundColor: Colors.gray1,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  profileButtonSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  buttonContainer: {
    height: 68,
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