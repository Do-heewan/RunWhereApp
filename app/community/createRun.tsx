import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../backend/db/firebase';
import { router } from 'expo-router';
import Eclipse from '../../components/EclipseSVG';

const CreateRun = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [location, setLocation] = useState('');
  const [pace, setPace] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [loading, setLoading] = useState(false);

  const isFormComplete =
    title.trim() &&
    description.trim() &&
    hashtags.trim() &&
    location.trim() &&
    pace.trim();

  const handleSubmit = async () => {
    if (!isFormComplete) {
      alert('모든 필드를 채워주세요.');
      return;
    }

    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, 'runs'), {
        id: Date.now(),
        title,
        description,
        hashtags,
        location,
        pace,
        dateTime,
        createdAt: new Date(),
      });
      console.log('런 이벤트 저장 완료. ID:', docRef.id);
      alert('등록 완료!');
      router.back();
    } catch (error) {
      console.error('런 이벤트 저장 오류:', error);
      alert('저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Eclipse />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>러닝팀 작성하기</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Title Section */}
        <View style={styles.section}>
          <Text style={styles.label}>제목을 작성해주세요</Text>
          <Text style={styles.sublabel}>시간과 장소 포함이 되면 좋아요</Text>
          <TextInput
            style={styles.input}
            placeholder="오전 9시 유니스트 앞에"
            placeholderTextColor="#8E8E93"
            maxLength={30}
            value={title}
            onChangeText={setTitle}
          />
          <Text style={styles.charCount}>{title.length}/15</Text>
        </View>

        {/* Description Section */}
        <View style={styles.section}>
          <Text style={styles.label}>모집글을 작성해주세요</Text>
          <Text style={styles.sublabel}>간단하게 작성하면 보기 편할 거예요</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="오늘 같이 뛸 사람 구해요! 초보자도 괜찮고 편하게 달리실 분 구해요"
            placeholderTextColor="#8E8E93"
            multiline
            maxLength={100}
            value={description}
            onChangeText={setDescription}
          />
          <Text style={styles.charCount}>{description.length}/100</Text>
        </View>

        {/* Hashtags Section */}
        <View style={styles.section}>
          <Text style={styles.label}>해시태그를 작성해주세요</Text>
          <TextInput
            style={styles.input}
            placeholder="#러닝팀 #초보자환영 #주말"
            placeholderTextColor="#8E8E93"
            maxLength={50}
            value={hashtags}
            onChangeText={setHashtags}
          />
        </View>

        {/* Date/Time Section - Simple Text Input */}
        <View style={styles.section}>
          <Text style={styles.label}>날짜와 시간을 입력해주세요</Text>
          <TextInput
            style={styles.input}
            placeholder="예: 2025년 8월 15일 오전 9시"
            placeholderTextColor="#8E8E93"
            value={dateTime}
            onChangeText={setDateTime}
          />
        </View>

        {/* Location Section */}
        <View style={styles.section}>
          <Text style={styles.label}>장소를 입력해주세요</Text>
          <TextInput
            style={styles.input}
            placeholder="예: 한강공원"
            placeholderTextColor="#8E8E93"
            maxLength={50}
            value={location}
            onChangeText={setLocation}
          />
        </View>

        {/* Pace Section */}
        <View style={styles.section}>
          <Text style={styles.label}>페이스를 입력해주세요</Text>
          <TextInput
            style={styles.input}
            placeholder="예: 6분/km"
            placeholderTextColor="#8E8E93"
            maxLength={20}
            value={pace}
            onChangeText={setPace}
          />
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Submit Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={handleSubmit}
        disabled={!isFormComplete || loading}
      >
        {isFormComplete ? (
          <LinearGradient
            colors={['#54f895', '#2afbea']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            <Text style={styles.submitTextActive}>작성완료</Text>
          </LinearGradient>
        ) : (
          <View style={styles.grayButton}>
            <Text style={styles.submitTextInactive}>작성완료</Text>
          </View>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#1C1C1E' 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  backButton: { 
    width: 40, 
    height: 40, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  titleContainer: { 
    flex: 1, 
    alignItems: 'center' 
  },
  headerTitle: { 
    color: '#fff', 
    fontSize: 18, 
    fontFamily: 'Pretendard-SemiBold',
    fontWeight: '600'
  },
  headerRight: { 
    width: 40, 
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  scrollContent: { 
    padding: 20, 
    paddingBottom: 120 
  },
  section: {
    marginBottom: 24,
  },
  label: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    fontFamily: 'Pretendard-SemiBold',
  },
  sublabel: {
    color: '#8E8E93',
    fontSize: 14,
    marginBottom: 12,
    fontFamily: 'Pretendard-Regular',
  },
  input: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Pretendard-Regular',
    minHeight: 52,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    color: '#8E8E93',
    fontSize: 12,
    textAlign: 'right',
    marginTop: 8,
    fontFamily: 'Pretendard-Regular',
  },
  bottomPadding: { 
    height: 50 
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    height: 56,
    borderRadius: 28,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { 
      width: 0, 
      height: 4 
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  gradientButton: {
    flex: 1,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grayButton: {
    flex: 1,
    backgroundColor: '#6C6C70',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitTextActive: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Pretendard-SemiBold',
  },
  submitTextInactive: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Pretendard-SemiBold',
  },
});

export default CreateRun;
