import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { addDoc, collection } from 'firebase/firestore';
import React, { useState } from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { db } from '../backend/db/firebase';

const RunwearWrite = () => {
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(3);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
    if (!reviewText) {
      alert('모든 필드를 채워주세요.');
      return;
    }

    setLoading(true);

    try {
      const docRef = await addDoc(collection(db, 'runwearItem'), {
        id: Date.now(), // 간단한 고유값
        image: { uri: imageUri },
        likes: 0,
        rating,
        backgroundColor: '#2C2C2E', // 기본값, 필요시 변경
        review: reviewText,
        createdAt: new Date(),
      });
      console.log('리뷰가 성공적으로 저장되었습니다. ID:', docRef.id);
      alert('등록 완료!');
      // Reset form
      setReviewText('');
      setRating(3);
      setImageUri(null);
    } catch (error) {
      console.error('리뷰 저장 중 오류 발생:', error);
      alert('리뷰 저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { padding: 30 }]}>
      {/* Add Photo Section */}
      <TouchableOpacity style={styles.photoBox} onPress={pickImage}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.photo} />
        ) : (
          <Ionicons name="camera" size={32} color="#54f895" />
        )}
        <Text style={styles.photoText}>사진추가</Text>
      </TouchableOpacity>

      {/* Review Input */}
      <View style={styles.inputBox}>
        <TextInput
          style={styles.textInput}
          placeholder="후기를 작성해보세요.."
          placeholderTextColor="#8E8E93"
          multiline
          maxLength={100}
          value={reviewText}
          onChangeText={setReviewText}
        />
        <Text style={styles.charCount}>{reviewText.length}/100</Text>
      </View>

      {/* Rating Slider */}
    <View style={styles.sliderBox}>
      <Text style={styles.sliderLabel}>별점</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 10 }}>
        {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => setRating(star)}
          activeOpacity={0.7}
          style={{ marginHorizontal: 4 }}
        >
          <Ionicons
            name={star <= rating ? 'star' : 'star-outline'}
            size={32}
            color="#54f895"
          />
        </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.ratingValue}>{rating}점</Text>
    </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>작성완료</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    padding: 20,
  },
  photoBox: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#54f895',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginBottom: 10,
  },
  photoText: {
    color: '#54f895',
    fontSize: 16,
    fontWeight: '600',
  },
  inputBox: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  textInput: {
    color: '#FFFFFF',
    fontSize: 16,
    height: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    color: '#8E8E93',
    fontSize: 12,
    textAlign: 'right',
    marginTop: 5,
  },
  sliderBox: {
    marginBottom: 30,
  },
  sliderLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 10,
  },
  ratingValue: {
    color: '#54f895',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  submitButton: {
    backgroundColor: '#54f895',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
  },
  submitText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RunwearWrite;