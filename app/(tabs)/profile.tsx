import { auth, db } from '@/backend/db/firebase';
import { router } from 'expo-router';
import { signOut } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


const menuItems = [
  { label: '프로필', key: 'profile' },
  { label: '러닝템', key: 'runwear' },
  { label: '기록공유', key: 'record' },
  { label: '번개런', key: 'flashrun' },
  { label: '로그아웃', key: 'logout' },
];

export default function ProfileMenu() {

  const [profile, setProfile] = useState<any>(null);
  const [runwearList, setRunwearList] = useState<any[]>([]);
  const [recordList, setRecordList] = useState<any[]>([]);
  const [flashRunList, setFlashRunList] = useState<any[]>([]);

  // 1. 프로필 정보 가져오기
  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) setProfile(userDoc.data());
    };
    fetchProfile();
  }, []);

  // 2. 내가 올린 러닝템/기록공유/번개런 가져오기
  useEffect(() => {
    if (!profile?.uid) return;

    // 러닝템
    getDocs(query(collection(db, 'runwearItem'), where('userId', '==', profile.uid)))
      .then(snapshot => setRunwearList(snapshot.docs.map(doc => doc.data())));

    // 기록공유
    getDocs(query(collection(db, 'sharedRecord'), where('userId', '==', profile.uid)))
      .then(snapshot => setRecordList(snapshot.docs.map(doc => doc.data())));

    // 번개런
    getDocs(query(collection(db, 'flashRun'), where('organizer', 'array-contains', { id: profile.uid })))
      .then(snapshot => setFlashRunList(snapshot.docs.map(doc => doc.data())));
  }, [profile]);

  // 로그아웃
  const handleLogout = async () => {
    await signOut(auth);
    Alert.alert('로그아웃 되었습니다.');
    // 라우터로 로그인 페이지 이동 등 추가
    router.push('/login');
    console.log('로그아웃 되었습니다.');
  };

  const getMyProfile = async () => {
    console.log('내 프로필 정보:', profile);
  }

  const getMyRunwear = async () => {
    console.log('내가 올린 러닝템:', runwearList);
  }

  const getMyRecord = async () => {
    console.log('내가 올린 기록공유:', recordList);
  }

  const getMyFlashRun = async () => {
    console.log('내가 올린 번개런:', flashRunList);
  }

  return (
    <View style={styles.root}>
      {/* Top Right "현재채팅중인" */}
      <View style={styles.topRow}>
        <View style={styles.spacer} />
        <View style={styles.chatActiveBox}>
          <Text style={styles.chatActiveText}>현재채팅중인</Text>
        </View>
      </View>

      {/* Profile Block */}
      <View style={styles.profileBlock}>
        <TouchableOpacity style={styles.menuButton} onPress={getMyProfile}>
          <Text style={styles.menuButtonText}>프로필</Text>
        </TouchableOpacity>
      </View>

      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>내가 올린 게시물</Text>
      </View>

      {/* Post Menu Items */}
      <View style={styles.menuRow}>
        <TouchableOpacity style={styles.menuButton} onPress={getMyRunwear}>
          <Text style={styles.menuButtonText}>러닝템</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton} onPress={getMyRecord}>
          <Text style={styles.menuButtonText}>기록공유</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton} onPress={getMyFlashRun}>
          <Text style={styles.menuButtonText}>번개런</Text>
        </TouchableOpacity>
      </View>

      {/* Logout */}
      <View style={styles.logoutBlock}>
        <TouchableOpacity style={styles.menuButton} onPress={handleLogout}>
          <Text style={styles.menuButtonText}>
            로그아웃
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#15151c',
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 24,
  },
  spacer: {
    flex: 1,
  },
  chatActiveBox: {
    backgroundColor: '#36363C',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  chatActiveText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  profileBlock: {
    alignItems: 'center',
    marginBottom: 48,
  },
  menuButton: {
    backgroundColor: '#36363C',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 12,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionHeader: {
    marginBottom: 24,
    marginLeft: 8,
  },
  sectionHeaderText: {
    color: '#E5E7EB',
    fontSize: 14,
    fontWeight: '600',
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 48,
  },
  logoutBlock: {
    alignItems: 'center',
    marginTop: 44,
  },
});
