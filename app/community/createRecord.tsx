import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const CreateRecord = () => {
  const [reviewText, setReviewText] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);

  // Check if all fields are filled
  const isFormComplete = imageUri && reviewText.trim().length > 0 ;

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    if (!isFormComplete) {
      Alert.alert('알림', '모든 항목을 입력해주세요.');
      return;
    }
    
    Alert.alert('완료', '게시물이 작성되었습니다.');
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>작성하기</Text>
        </View>
        
        <View style={styles.headerRight} />
      </View>

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
              <Ionicons name="camera" size={32} color="#7C7C7C" />
              <Text style={styles.photoText}>사진추가</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Review Input */}
        <Text style={styles.sub1Text}>텍스트 후기</Text>
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

        {/* Bottom padding to ensure content doesn't get hidden behind floating button */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Floating Submit Button */}
      <TouchableOpacity 
        style={styles.floatingButton}
        onPress={handleSubmit}
        disabled={!isFormComplete}
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
    backgroundColor: '#1C1C1E',
  },
  
  // Header styles
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
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
    height: 40,
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
    backgroundColor: '#303034',
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
    color: '#7C7C7C', 
    fontFamily: 'Pretendard-Variable',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 22.4,
    letterSpacing: -0.32,
    marginTop: 8,
  },
  sub1Text: {
    color: '#FFF',
    fontFamily: 'Pretendard-Variable',
    fontSize: 18,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 27,
    marginBottom: 10,
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
    fontFamily: 'Pretendard-Regular',
  },
  charCount: {
    color: '#8E8E93',
    fontSize: 12,
    textAlign: 'right',
    marginTop: 5,
    fontFamily: 'Pretendard-Regular',
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
    shadowColor: '#000',
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

export default CreateRecord;
