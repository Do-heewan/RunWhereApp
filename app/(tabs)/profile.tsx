import { auth, db } from '@/backend/db/firebase';
import { ChatNotificationIcon } from '@/components/IconSVG';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { signOut } from 'firebase/auth';
import { GeoPoint, collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '../../components/ThemedText';
import { Colors } from '../../constants/Colors';


// Type for StatItem props
type StatItemProps = {
  value: string | number | undefined;
  unit: string;
  label: string;
};


// StatItem component using ThemedText
const StatItem = ({ value, unit, label }: StatItemProps) => (
  <View style={styles.statItem}>
    <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
     <ThemedText style={styles.statValue}>
      {`${value || 0} ${unit}`}
    </ThemedText>
    </View>
    <ThemedText style={styles.statLabel}>{label}</ThemedText>
  </View>
);


// Type for the user's profile
type Profile = {
  uid: string;
  name: string;
  location: GeoPoint;
  profileImageUrl?: string;
  followers?: string[];
  following?: string[];
  avgPace?: string;
  avgDistance?: string;
  monthlyDistance?: string;
};


export default function ProfileScreen() {
  const [profile, setProfile] = useState<Profile | null>(null);
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

  const formatLocation = (location: GeoPoint | undefined) => {
    if (location) {
      return `Lat: ${location.latitude.toFixed(2)}, Lon: ${location.longitude.toFixed(2)}`;
    }
    return '지역 정보 없음';
  };


  return (
      <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.profileCard}>
        <View style={styles.header}>
            <TouchableOpacity style={styles.chatButton}>
              <ChatNotificationIcon />
            </TouchableOpacity>
            <View style={styles.chatJoined}>
              <ThemedText style={styles.chatJoinedText}>1</ThemedText>
            </View>
        </View>
          <View style={styles.profileImageContainer}>
            {profile?.profileImageUrl ? (
              <Image
                source={{ uri: profile.profileImageUrl }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profileImageFallback}>
                <ThemedText style={styles.profileImageFallbackText}>
                  {profile?.name?.charAt(0).toUpperCase() || '철'}
                </ThemedText>
              </View>
            )}
            <TouchableOpacity style={styles.editButton}>
              <ThemedText style={styles.editButtonText}>편집하기</ThemedText>
            </TouchableOpacity>
          </View>


          <ThemedText style={styles.username}>{profile?.name || '기록갱신러'}</ThemedText>
          <View style={styles.locationContainer}>
            <Ionicons name="location-sharp" size={16} color={Colors.dark.icon} />
            <ThemedText style={styles.locationText}>{formatLocation(profile?.location)}</ThemedText>
          </View>


          <View style={styles.followStatsContainer}>
            <View style={styles.followStat}>
              <ThemedText style={styles.followLabel}>팔로우</ThemedText>
              <ThemedText style={styles.followValue}>{profile?.followers?.length || 28}</ThemedText>
            </View>
            <View style={styles.followStat}>
              <ThemedText style={styles.followLabel}>팔로잉</ThemedText>
              <ThemedText style={styles.followValue}>{profile?.following?.length || 14}</ThemedText>
            </View>
          </View>


          <View style={styles.statsContainer}>
            <StatItem value={profile?.avgPace} unit="분" label="평균 페이스" />
            <StatItem value={profile?.avgDistance} unit="km" label="평균 거리" />
            <StatItem value={profile?.monthlyDistance} unit="km" label="이번 달 누적 거리" />
          </View>
        </View>


        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>최근 활동 보기</ThemedText>
          <View style={styles.activityButtonsContainer}>
             <TouchableOpacity style={styles.activityButton} onPress={() => router.push('/community/myRunwear')}>
               <ThemedText style={styles.activityButtonText}>러닝템</ThemedText>
             </TouchableOpacity>
             <TouchableOpacity style={styles.activityButton} onPress={() => router.push('/community/myRecord')}>
               <ThemedText style={styles.activityButtonText}>기록공유</ThemedText>
             </TouchableOpacity>
             <TouchableOpacity style={styles.activityButton} onPress={() => router.push('/community/myFlashRun')}>
               <ThemedText style={styles.activityButtonText}>번개런</ThemedText>
             </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>수상이력</ThemedText>
          <View style={styles.awardCard}>
            <ThemedText style={styles.awardText}>· 2024 서울국제마라톤 – 하프코스 남자부 2위 (기록 1시간 42분 15초)</ThemedText>
          </View>
        </View>


        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <ThemedText style={styles.logoutButtonText}>로그아웃</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: Colors.gray1 },
    scrollViewContent: { paddingBottom: 60 },
    header: { 
      width: '100%',
      flexDirection: 'row', 
      justifyContent: 'flex-end', 
      alignItems: 'center', 
      paddingHorizontal: 20, 
      paddingTop: 10, 
      marginBottom: 10 
    },
    chatButton: {},
    chatJoined: {
      marginLeft: 8,
    },
    chatJoinedText: { color: Colors.red, fontSize: 18, fontWeight: 'bold'},
    profileCard: { backgroundColor: Colors.black, marginHorizontal: 16, borderRadius: 20, padding: 20, alignItems: 'center', marginTop: 20 },
    profileImageContainer: { position: 'relative', marginBottom: 15 },
    profileImage: { width: 85, height: 85, borderRadius: 50, borderWidth: 2, borderColor: Colors.gray1 },
    profileImageFallback: {
      width: 85,
      height: 85,
      borderRadius: 50,
      borderWidth: 2,
      borderColor: Colors.gray3,
      backgroundColor: Colors.gray2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    profileImageFallbackText: {
      color: Colors.white,
      fontSize: 40,
      fontWeight: 'bold',
    },
    editButton: { position: 'absolute', bottom: -10, backgroundColor: 'rgba(0, 0, 0, 0.6)', borderRadius: 15, paddingVertical: 6, paddingHorizontal: 12 },
    editButtonText: { color: Colors.dark.text, fontSize: 12 },
    username: { color: Colors.dark.text, fontSize: 24, fontWeight: 'bold' },
    locationContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
    locationText: { color: Colors.dark.icon, fontSize: 14, marginLeft: 5 },
    followStatsContainer: { flexDirection: 'row', marginTop: 20 },
    followStat: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 15 },
    followLabel: { color: Colors.white, fontSize: 16, marginRight: 8 },
    followValue: { color: Colors.white, fontSize: 24, fontWeight: 'bold' },
    statsContainer: { 
      flexDirection: 'row', 
      justifyContent: 'space-around', 
      width: '100%', 
      marginTop: 5, 
      paddingTop: 25,
      alignItems: 'flex-end', 
    },
    statItem: {
      alignItems: 'center',
      flex: 1,
      paddingVertical: 10,
    },

    statValue: { 
      color: Colors.primary, 
      fontSize: 32, 
      fontWeight: 'bold',
      //Add these properties to prevent text clipping on Android
      includeFontPadding: false,
      lineHeight: 38, // A value slightly larger than fontSize
    },    
    statLabel: { color: Colors.white, fontSize: 12, marginTop: 6 },
    section: { marginTop: 30, paddingHorizontal: 20 },
    sectionTitle: { color: Colors.dark.text, fontSize: 16, fontWeight: '600', marginBottom: 10 },
    activityButtonsContainer: { flexDirection: 'row', justifyContent: 'space-between' },
    activityButton: { backgroundColor: Colors.primary, paddingVertical: 15, borderRadius: 20, alignItems: 'center', flex: 1, marginHorizontal: 5,width:115, height:80 },
    activityButtonText: { color: Colors.gray1, fontSize: 16,marginTop:14 },
    awardCard: { backgroundColor: Colors.gray2, borderRadius: 20, padding: 15 },
    awardText: { color: Colors.dark.text, fontSize: 14 },
    logoutButton: { marginTop: 20, marginHorizontal: 20, paddingVertical: 1 },
    logoutButtonText: { color: '#E77C7C', fontSize: 18},
});