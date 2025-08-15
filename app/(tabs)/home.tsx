import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function CourseDetailScreen() {
  const router = useRouter();

  const handleHomePress = () => {
    router.push('/course-detail');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <ThemedText type="h2" style={styles.title}>코스 상세</ThemedText>
      </View>

      <View style={styles.content}>
        <ThemedText type="body1" style={styles.description}>
          선택한 코스의 상세 정보가 여기에 표시됩니다.
        </ThemedText>
        
        <TouchableOpacity style={styles.selectCourseButton} onPress={handleHomePress}>
          <ThemedText type="button1" style={styles.selectCourseButtonText}>
            코스 선택하기
          </ThemedText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.blackGray,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  homeButton: {
    padding: 12,
  },
  title: {
    color: Colors.white,
    marginLeft: 10,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 40,
  },
  selectCourseButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  selectCourseButtonText: {
    color: Colors.black,
    fontWeight: '600',
  },
});
