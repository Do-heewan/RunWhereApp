import Eclipse from '../../components/EclipseSVG'; //background Image
import { ThemedText } from '../../components/ThemedText';
import ThemedTextInput from '../../components/ThemedTextInput';
import { Colors } from '../../constants/Colors';
import CustomAlert from '@/components/CustomAlert';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { addDoc, collection, doc, getDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db, storage } from '../../backend/db/firebase';
import { StarIcon, StarIconActive } from '../../components/IconSVG';


const CreateRunwear = () => {
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState<any>(null);


  // Check if all fields are filled
  const isFormComplete = imageUri && reviewText.trim().length > 0 && rating > 0;

  // 프로필 정보 가져오기
  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userDoc = await getDoc(doc(db, `users/${user.uid}`));
      if (userDoc.exists()) setProfile(userDoc.data());
    };

    fetchProfile();
  }, []);


  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });


    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };


  const handleSubmit = async () => {
    if (!profile) {
      alert('접근 권한이 없습니다. 다시 로그인해주세요.');
      return;
    }

   if (!reviewText || !imageUri) {
      alert('모든 필드를 채워주세요.');
      return;
    }

    setLoading(true);

    try {
      // 1. 이미지 firebase storage에 업로드
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const filename = `runwear/${Date.now()}_${Math.floor(Math.random()*10000)}.jpg`;
      const storageRef = ref(storage, filename);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);

      // 2. Firestore에 downloadURL 저장
      const docRef = await addDoc(collection(db, 'runwearItem'), {
        id: Date.now(), // 간단한 고유값
        image: { uri: downloadURL },
        likes: 0,
        rating,
        backgroundColor: '#2C2C2E', // 기본값, 필요시 변경
        review: reviewText,
        createdAt: new Date(),
        userId: profile.uid,
      });
      console.log('리뷰가 성공적으로 저장되었습니다. ID:', docRef.id);
      alert('등록 완료!');
      // Reset form
      setReviewText('');
      setRating(3);
      setImageUri(null);
      // 이전 페이지로 이동
      router.back();
    } catch (error) {
      console.error('리뷰 저장 중 오류 발생:', error);
      alert('리뷰 저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <Eclipse />
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <ThemedText type="body2" style={styles.loadingText}>업로드 중...</ThemedText>
        </View>
      )}


      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
          <ThemedText type="sub1" style={styles.headerTitle}>작성하기</ThemedText>
        </View>
        
        <View style={styles.headerRight} />
      </View>


      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Add Photo Section */}
        <TouchableOpacity style={styles.photoBox} onPress={pickImage}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.photo} />
          ) : (
            <>
              <Ionicons name="camera" size={32} color={Colors.gray2} />
              <ThemedText type="body2" style={styles.photoText}>사진추가</ThemedText>
            </>
          )}
        </TouchableOpacity>


        {/* Review Input */}
        <ThemedText type="sub1" style={styles.sub1Text}>텍스트 후기</ThemedText>
        <View style={styles.inputBox}>
          <ThemedTextInput
            style={styles.textInput}
            placeholder="후기를 작성해보세요.."
            placeholderTextColor="#8E8E93"
            multiline
            maxLength={100}
            value={reviewText}
            onChangeText={setReviewText}
          />
          <ThemedText type="body3" style={styles.charCount}>{reviewText.length}/100</ThemedText>
        </View>


        {/* Rating Slider */}
        <View style={styles.sliderBox}>
          <ThemedText type="sub1" style={styles.sub1Text}>별점</ThemedText>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 10 }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
                style={{ marginHorizontal: 4 }}
              >
                {star <= rating ? (
                  <StarIconActive width={40} height={40} />
                ) : (
                  <StarIcon width={40} height={40} color={Colors.gray3} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>


        {/* Bottom padding to ensure content doesn't get hidden behind floating button */}
        <View style={styles.bottomPadding} />
      </ScrollView>
      </KeyboardAvoidingView>


      {/* Floating Submit Button */}
      <TouchableOpacity 
        style={styles.floatingButton}
        onPress={handleSubmit}
        disabled={!isFormComplete}
      >
        {isFormComplete ? (
          <LinearGradient
            colors={[Colors.primary, '#2afbea']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            <ThemedText type="body2" style={styles.submitTextActive}>작성완료</ThemedText>
          </LinearGradient>
        ) : (
          <View style={styles.disabledButton}>
            <ThemedText type="body2" style={styles.submitTextInactive}>작성완료</ThemedText>
          </View>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.blackGray,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 12,
  },
  
  // Header styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray1,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
    height: 40,
  },
   // KeyboardAvoidingView style
  keyboardAvoidingView: {
    flex: 1,
  },
  // ScrollView styles
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 30,
    paddingBottom: 30, // Extra padding for floating button
  },
  bottomPadding: {
    height: 50, // Additional space at bottom
  },
  
  // Content styles
  photoBox: {
    height: 300,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: Colors.gray1,
    flexShrink: 0,
    alignSelf: 'stretch',
    marginBottom: 20,
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  photoText: {
    marginTop: 8,
  },
  sub1Text: {
    marginBottom: 10,
  },
  inputBox: {
    backgroundColor: Colors.gray1,
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  textInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    textAlign: 'right',
    marginTop: 5,
  },
  sliderBox: {
    marginBottom: 30,
  },
  // Floating button styles
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 320,
    height: 68,
    borderRadius: 30,
    elevation: 8,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  gradientButton: {
    flex: 1,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    flex: 1,
    backgroundColor: Colors.disableButton,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitTextActive: {
    color: Colors.black,
    fontWeight: '600',
  },
  submitTextInactive: {
    color: Colors.white,
    fontWeight: '600',
  },
});


export default CreateRunwear;
