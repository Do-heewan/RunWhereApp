import Eclipse from '../../components/EclipseSVG'; //background Image
import { ThemedText } from '../../components/ThemedText';
import { Colors } from '../../constants/Colors';
import CustomAlert from '@/components/CustomAlert';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { collection, doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../../backend/db/firebase';

const CreateRun = () => {

  type FlashRunEvent = {
    id: number;
    title: string;
    time: string;
    location: string;
    description: string;
    hashtags: string[];
    participants: number;
    maxParticipants: number;
    creator: {
      id: string;
      name: string;
    };
    startHour: number;
    startMinute: number;
    targetMinute: number;
    targetSecond: number;
    status: 'upcoming' | 'full' | 'past';
  };

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [loading, setLoading] = useState(false);
  const [maxParticipants, setMaxParticipants] = useState('');
  const [startHour, setStartHour] = useState('');
  const [startMinute, setStartMinute] = useState('');
  const [targetMinute, setTargetMinute] = useState('');
  const [targetSecond, setTargetSecond] = useState('');

  const isFormComplete =
  title.trim() &&
  description.trim() &&
  hashtags.trim() &&
  maxParticipants.trim() &&
  startHour.trim() &&
  startMinute.trim() &&
  targetMinute.trim() &&
  targetSecond.trim();

  // 채팅방 생성 함수
  async function createFlashRunChatRoom(item: FlashRunEvent) {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('오류', '사용자 정보가 없습니다.');
        return null;
      }

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.exists() ? userDoc.data() : null;
      const nickname = userData?.name || '';  

      await setDoc(doc(collection(db, 'flashRunChatsRooms'), String(item.id)), {
        id: item.id,
        title: item.title,
        createdAt: serverTimestamp(),
        creator: {
          id: user.uid,
          name: nickname,
        },
        organizer: [
          {
            id: user.uid,
            name: nickname,
          },
        ],
        messages: [], // 초기 메시지 배열
      });
      return String(item.id); // 채팅방 ID 반환
    } catch (error) {
      Alert.alert('오류', '채팅방 생성에 실패했습니다.');
      return null;
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Eclipse />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>번개런 작성하기</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Title Section */}
        <View style={styles.section}>
          <Text style={styles.label}>제목을 작성해주세요</Text>
          <Text style={styles.sublabel}>시간과 장소 포함이 되면 좋아요</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="오전 9시 유니스트 정문"
              placeholderTextColor="#ADADB2"
              maxLength={15}
              value={title}
              onChangeText={setTitle}
            />
            <Text style={styles.charCountInside}>{title.length}/15</Text>
          </View>
        </View>

        {/* Description Section */}
        <View style={styles.section}>
          <Text style={styles.label}>모집글을 작성해주세요</Text>
          <Text style={styles.sublabel}>간단하게 작성하면 보기 편할 거예요</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={[styles.input]}
              placeholder="오늘 오전 9시 유니스트 정문에서 만나 가볍게 뛸 사람 구합니다~"
              placeholderTextColor="#ADADB2"
              multiline
              maxLength={50}
              value={description}
              onChangeText={setDescription}
            />
            <Text style={styles.charCountInside}>{description.length}/50</Text>
          </View>
        </View>

        {/* Hashtags Section */}
        <View style={styles.section}>
          <Text style={styles.label}>해시태그를 작성해주세요</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="#천천히 #빠르게 #초보"
              placeholderTextColor="#ADADB2"
              maxLength={30}
              value={hashtags}
              onChangeText={setHashtags}
            />
            <Text style={styles.charCountInside}>{hashtags.length}/30</Text>
          </View>
        </View>

        {/* Participant Section */}
        <View style={styles.section}>
          <Text style={styles.label}>원하시는 인원수를 입력해주세요</Text>
          <View style={styles.participantInputWrapper}>
            <TextInput
              style={styles.participantInput}
              placeholder="5"
              placeholderTextColor="#ADADB2"
              keyboardType="numeric"
              maxLength={2}
              value={maxParticipants}
              onChangeText={setMaxParticipants}
            />
            <Text style={styles.participantUnit}>명</Text>
          </View>
        </View>

        {/* Running Start Time Section */}
        <View style={styles.section}>
          <Text style={styles.label}>러닝을 시작할 시간을 입력해주세요</Text>
          <View style={styles.timeInputRow}>
            <TextInput
              style={styles.timeInput}
              placeholder="20"
              placeholderTextColor="#8E8E93"
              keyboardType="numeric"
              maxLength={2}
              value={startHour}
              onChangeText={setStartHour}
            />
            <Text style={styles.unitText}>시</Text>
            <TextInput
              style={styles.timeInput}
              placeholder="30"
              placeholderTextColor="#8E8E93"
              keyboardType="numeric"
              maxLength={2}
              value={startMinute}
              onChangeText={setStartMinute}
            />
            <Text style={styles.unitText}>분</Text>
          </View>
        </View>

        {/* Target Pace Section */}
        <View style={styles.section}>
          <Text style={styles.label}>목표페이스를 입력해주세요</Text>
          <View style={styles.timeInputRow}>
            <TextInput
              style={styles.timeInput}
              placeholder="06"
              placeholderTextColor="#8E8E93"
              keyboardType="numeric"
              maxLength={2}
              value={targetMinute}
              onChangeText={setTargetMinute}
            />
            <Text style={styles.unitText}>분</Text>
            <TextInput
              style={styles.timeInput}
              placeholder="30"
              placeholderTextColor="#8E8E93"
              keyboardType="numeric"
              maxLength={2}
              value={targetSecond}
              onChangeText={setTargetSecond}
            />
            <Text style={styles.unitText}>초</Text>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </KeyboardAvoidingView>
    
      {/* Submit Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={async () => {
          if (!isFormComplete || loading) return;
          setLoading(true);
          try {
            const hashtagsArray = hashtags.split(' ').map(tag => tag.trim()).filter(tag => tag);

            const user = auth.currentUser;
            if (!user) {
              console.error('No user is currently logged in');
              return;
            }
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            const userData = userDoc.exists() ? userDoc.data() : null;
            const nickname = userData?.name || '';

            const event: FlashRunEvent = {
              id: Date.now(),
              title,
              description,
              hashtags: hashtagsArray,
              participants: 1,
              maxParticipants: Number(maxParticipants),
              time: `${startHour}:${startMinute}`,
              location: '', // You may want to add a location field
              creator: {
                name: nickname,
                id: user.uid,
              },
              startHour: Number(startHour),
              startMinute: Number(startMinute),
              targetMinute: Number(targetMinute),
              targetSecond: Number(targetSecond),
              status: 'upcoming',
            };

            await setDoc(doc(collection(db, 'flashRun'), String(event.id)), {
              ...event,
              createdAt: new Date(),
            });

            await createFlashRunChatRoom(event);

            alert('등록 완료!');
            router.back();
          } catch (error) {
            console.error('런 이벤트 저장 오류:', error);
            alert('저장에 실패했습니다. 다시 시도해주세요.');
          } finally {
            setLoading(false);
          }
        }}
        disabled={!isFormComplete || loading}
      >
        {isFormComplete ? (
          <LinearGradient
            colors={['#54f895', '#2afbea']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            <Text style={styles.submitTextActive}>번개런 올리기</Text>
          </LinearGradient>
        ) : (
          <View style={styles.grayButton}>
            <Text style={styles.submitTextInactive}>번개런 올리기</Text>
          </View>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1C1C1E' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  titleContainer: { flex: 1, alignItems: 'center' },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Pretendard Variable',
    fontWeight: '600',
  },
  // KeyboardAvoidingView style
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    padding: 30,
    paddingBottom: 10, // Extra padding for floating button
  },  
  section: { marginBottom: 30 },
  label: {
    fontFamily: 'Pretendard-SemiBold',
    color: '#FAFAF8',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  sublabel: {
    color: '#D9D9D9',
    fontSize: 16,
    marginBottom: 12,
    fontFamily: 'Pretendard-Regular',
  },
  inputWrapper: {
    marginTop:10,
    position: 'relative',
  },
  input: {
    backgroundColor: '#303034',
    borderRadius: 10,
    padding: 15,
    paddingRight: 60,
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Pretendard-Regular',
    width: 333,
    height:100,
    textAlignVertical: 'top',
  },
  charCountInside: {
    position: 'absolute',
    bottom: 8,
    right: 12,
    fontSize: 14,
    color: '#ADADB2',
    fontFamily: 'Pretendard-Regular',
  },
  bottomPadding: { height: 50 },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    height: 54,
    borderRadius: 27,
    overflow: 'hidden',
  },
  gradientButton: {
    flex: 1,
    width: 364,
    height: 68,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  grayButton: {
    flex: 1,
    width:364,
    height: 68,
    backgroundColor: '#7c7c7c',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  submitTextActive: {
    color: '#303034',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Pretendard Variable',
  },
  submitTextInactive: {
    color: '#D9D9D9',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Pretendard Variable',
  },

  participantInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantInput: {
    backgroundColor: '#303034',
    borderRadius: 10,
    width: 60,
    height: 40,
    textAlign: 'center',
    color: '#FAFAF8',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Pretendard-SemiBold',
    marginTop:15,
    marginRight: 12,
  },
  participantUnit: {
    color: '#FAFAF8',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Pretendard-SemiBold',
  },
  timeInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeInput: {
    backgroundColor: '#303034',
    borderRadius: 10,
    width: 65,
    height: 40,
    textAlign: 'center',
    color: '#FAFAF8',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Pretendard-SemiBold',
    marginTop:15,
    marginRight: 12,
  },
  unitText: {
    color: '#FAFAF8',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Pretendard-SemiBold',
    marginRight: 20,
  },
});

export default CreateRun;
 