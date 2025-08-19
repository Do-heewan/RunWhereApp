import { ThemedText } from '../../components/ThemedText';
import ThemedTextInput from '../../components/ThemedTextInput';
import { Colors } from '../../constants/Colors';
import CustomAlert from '@/components/CustomAlert';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { collection, doc, getDoc, getDocs,updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
 Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db, storage } from '../../backend/db/firebase';
import Eclipse from '../../components/EclipseSVG';
import { StarIcon, StarIconActive } from '../../components/IconSVG';



const EditRunwear = () => {
  const { id, description, rating: initialRating, imageUri } = useLocalSearchParams();
  const [reviewText, setReviewText] = useState(description as string || '');
  const [rating, setRating] = useState(parseInt(initialRating as string) || 0);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);


  // Check if all fields are filled
  const isFormComplete = reviewText.trim().length > 0 && rating > 0;

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

  const handleEdit = async () => {
  if (!profile) {
    alert('접근 권한이 없습니다. 다시 로그인해주세요.');
    return;
  }

  if (!reviewText || rating === 0) {
    alert('모든 필드를 채워주세요.');
    return;
  }

  setLoading(true);

  try {
    const snapshot = await getDocs(collection(db, 'runwearItem'));
    const docRef = snapshot.docs.find(doc => doc.data().id === parseInt(id as string))?.ref;

    if (docRef) {
      await updateDoc(docRef, {
        review: reviewText,
        rating,
      });
      alert('수정 완료!');
      router.back();
    } else {
      alert('해당 게시물을 찾을 수 없습니다.');
    }
  } catch (error) {
    console.error('수정 중 오류 발생:', error);
    alert('수정에 실패했습니다. 다시 시도해주세요.');
  } finally {
    setLoading(false);
  }
};

const handleDelete = () => {
    setShowDeleteAlert(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Eclipse />
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <ThemedText type="body2" style={styles.loadingText}>수정 중...</ThemedText>
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
          <ThemedText type="sub1" style={styles.headerTitle}>수정하기</ThemedText>
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
        {imageUri && (
        <View style={styles.photoBox}>
            <Image source={{ uri: imageUri as string }} style={styles.photo} />
        </View>
        )}

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
        <TouchableOpacity onPress={handleDelete}>
        <ThemedText type="sub1" style={styles.deleteButton}>삭제하기</ThemedText>
        </TouchableOpacity>
        {showDeleteAlert && (
        <CustomAlert
            visible={showDeleteAlert}
            onClose={() => setShowDeleteAlert(false)}
            onConfirm={async () => {
            setShowDeleteAlert(false);
            // TODO: Add actual delete logic here
            router.back();
            }}
            onCancel={() => setShowDeleteAlert(false)}
            title="게시물 삭제하기"
            message="정말로 게시물을 삭제하시겠습니까?"
            confirmText="삭제하기"
            cancelText="취소"
        />
        )}

        {/* Bottom padding to ensure content doesn't get hidden behind floating button */}
        <View style={styles.bottomPadding} />
      </ScrollView>
      </KeyboardAvoidingView>


      {/* Floating Edit Button */}
      <TouchableOpacity 
        style={styles.floatingButton}
        onPress={handleEdit}
        disabled={!isFormComplete}
      >
        {isFormComplete ? (
          <LinearGradient
            colors={[Colors.primary, '#2afbea']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            <ThemedText type="body2" style={styles.editTextActive}>수정완료</ThemedText>
          </LinearGradient>
        ) : (
          <View style={styles.disabledButton}>
            <ThemedText type="body2" style={styles.editTextInactive}>수정완료</ThemedText>
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
  deleteButton:{
    color: Colors.red,
    fontSize:18,
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
  editTextActive: {
    color: Colors.black,
    fontWeight: '600',
  },
  editTextInactive: {
    color: Colors.white,
    fontWeight: '600',
  },
});


export default EditRunwear;
