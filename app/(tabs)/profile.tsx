<<<<<<< Updated upstream
// import React from 'react';
// import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// const menuItems = [
//   { label: '프로필', key: 'profile' },
//   { label: '러닝템', key: 'runwear' },
//   { label: '기록공유', key: 'record' },
//   { label: '번개런', key: 'flashrun' },
//   { label: '로그아웃', key: 'logout' },
// ];

// export default function ProfileMenu() {
=======
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
import { router } from 'expo-router';
import { signOut } from 'firebase/auth';
import { doc, getDoc, GeoPoint } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

import { auth, db } from '@/backend/db/firebase';
import { ThemedText } from '../../components/ThemedText';
import { Colors } from '../../constants/Colors';

// Type for StatItem props
type StatItemProps = {
  value: string | number | undefined;
  unit: string;
  label: string;
};
>>>>>>> Stashed changes

// StatItem component using ThemedText
const StatItem = ({ value, unit, label }: StatItemProps) => (
  <View style={styles.statItem}>
    <View style={{ flexDirection: 'row' }}>
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

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (!user) return;
      
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        setProfile({ uid: user.uid, ...userDoc.data() } as Profile);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert('로그아웃 되었습니다.');
      router.push('/login');
    } catch (error) {
      Alert.alert('오류', '로그아웃 중 문제가 발생했습니다.');
    }
  };

  const formatLocation = (location: GeoPoint | undefined) => {
    if (location) {
      return `Lat: ${location.latitude.toFixed(2)}, Lon: ${location.longitude.toFixed(2)}`;
    }
    return '지역 정보 없음';
  };

<<<<<<< Updated upstream
//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar barStyle="light-content" />
//       <ScrollView contentContainerStyle={styles.scrollViewContent}>
//         <View style={styles.header}>
//           <TouchableOpacity style={styles.chatButton}>
//             <Ionicons name="chatbubble-outline" size={24} color="#FFF" />
//             <View style={styles.chatBadge}>
//               <Text style={styles.chatBadgeText}>12</Text>
//             </View>
//           </TouchableOpacity>
//         </View>

//       {/* Profile Block */}
//       <View style={styles.profileBlock}>
//         <TouchableOpacity style={styles.menuButton}>
//           <Text style={styles.menuButtonText}>프로필</Text>
//         </TouchableOpacity>
//       </View>

//           <Text style={styles.username}>기록갱신러</Text>
//           <View style={styles.locationContainer}>
//             <Ionicons name="location-sharp" size={16} color="#A0A0A0" />
//             <Text style={styles.locationText}>울산시 울주군</Text>
//           </View>

//           <View style={styles.followStatsContainer}>
//             <View style={styles.followStat}>
//               <Text style={styles.followLabel}>팔로우</Text>
//               <Text style={styles.followValue}>28</Text>
//             </View>
//             <View style={styles.followStat}>
//               <Text style={styles.followLabel}>팔로잉</Text>
//               <Text style={styles.followValue}>14</Text>
//             </View>
//           </View>

//       {/* Post Menu Items */}
//       <View style={styles.menuRow}>
//         <TouchableOpacity style={styles.menuButton}>
//           <Text style={styles.menuButtonText}>러닝템</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.menuButton}>
//           <Text style={styles.menuButtonText}>기록공유</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.menuButton}>
//           <Text style={styles.menuButtonText}>번개런</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Logout */}
//       <View style={styles.logoutBlock}>
//         <TouchableOpacity style={styles.menuButton}>
//           <Text style={styles.menuButtonText}>로그아웃</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#1C1C1E', // Main background color
//   },
//   scrollViewContent: {
//     paddingBottom: 40,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     paddingHorizontal: 20,
//     paddingTop: 10,
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   chatButton: {
//     position: 'relative',
//   },
//   chatBadge: {
//     position: 'absolute',
//     top: -4,
//     right: -8,
//     backgroundColor: '#FF453A', // Red badge color
//     borderRadius: 8,
//     paddingHorizontal: 5,
//     paddingVertical: 1,
//     borderWidth: 1,
//     borderColor: '#1C1C1E',
//   },
//   chatBadgeText: {
//     color: '#FFF',
//     fontSize: 11,
//     fontWeight: 'bold',
//   },
//   profileCard: {
//     backgroundColor: '#2C2C2E', // Card background color
//     marginHorizontal: 16,
//     borderRadius: 20,
//     padding: 20,
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   profileImageContainer: {
//     position: 'relative',
//     marginBottom: 15,
//   },
//   profileImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     borderWidth: 2,
//     borderColor: '#3A3A3C',
//   },
//   editButton: {
//     position: 'absolute',
//     bottom: -5,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     borderRadius: 15,
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//   },
//   editButtonText: {
//     color: '#FFF',
//     fontSize: 12,
//   },
//   username: {
//     color: '#FFF',
//     fontSize: 24,
//     fontWeight: 'bold',
//   },
//   locationContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   locationText: {
//     color: '#A0A0A0',
//     fontSize: 14,
//     marginLeft: 5,
//   },
//   followStatsContainer: {
//     flexDirection: 'row',
//     marginTop: 20,
//   },
//   followStat: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginHorizontal: 15,
//   },
//   followLabel: {
//     color: '#A0A0A0',
//     fontSize: 14,
//     marginRight: 8,
//   },
//   followValue: {
//     color: '#FFF',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   statsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     width: '100%',
//     marginTop: 25,
//     paddingTop: 25,
//     borderTopWidth: 1,
//     borderTopColor: '#3A3A3C',
//   },
//   statItem: {
//     alignItems: 'center',
//   },
//   statValue: {
//     color: '#34D399', // Bright green color
//     fontSize: 28,
//     fontWeight: 'bold',
//   },
//   statUnit: {
//     color: '#34D399',
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginLeft: 2,
//     alignSelf: 'flex-end',
//     bottom: 4,
//   },
//   statLabel: {
//     color: '#A0A0A0',
//     fontSize: 12,
//     marginTop: 6,
//   },
//   section: {
//     marginTop: 30,
//     paddingHorizontal: 20,
//   },
//   sectionTitle: {
//     color: '#E5E5EA',
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 15,
//   },
//   activityButtonsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   activityButton: {
//     backgroundColor: '#34D399',
//     paddingVertical: 15,
//     borderRadius: 12,
//     alignItems: 'center',
//     flex: 1,
//     marginHorizontal: 5,
//   },
//   activityButtonText: {
//     color: '#000',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   awardCard: {
//     backgroundColor: '#2C2C2E',
//     borderRadius: 12,
//     padding: 15,
//   },
//   awardText: {
//     color: '#E5E5EA',
//     fontSize: 14,
//   },
// });

// export default ProfileScreen;
=======
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.profileCard}>
        <View style={styles.header}>
         <TouchableOpacity style={styles.chatContainer}>
            <Ionicons name="chatbubble-outline" size={24} color={Colors.dark.text} />
          </TouchableOpacity>
          <View style={styles.chatBadge}>
              <ThemedText style={styles.chatBadgeText}>1</ThemedText>
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
    header: { flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 20, paddingTop: 10, alignItems: 'center', marginBottom: 10 },
    chatContainer: { flexDirection: 'row', alignItems: 'center' },
    chatBadge: { backgroundColor: Colors.red, borderRadius: 8, paddingHorizontal: 5, paddingVertical: 1, marginLeft: 5 },
    chatBadgeText: { color: Colors.dark.text, fontSize: 11, fontWeight: 'bold' },
    profileCard: { backgroundColor: Colors.black, marginHorizontal: 16, borderRadius: 20, padding: 20, alignItems: 'center', marginTop: 20 },
    profileImageContainer: { position: 'relative', marginBottom: 15 },
    profileImage: { width: 50, height: 50, borderRadius: 50, borderWidth: 2, borderColor: Colors.gray1 },
    profileImageFallback: {
      width: 100,
      height: 100,
      borderRadius: 272,
      borderWidth: 2,
      borderColor: Colors.gray3,
      backgroundColor: Colors.gray2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    profileImageFallbackText: {
      color: Colors.dark.text,
      fontSize: 40,
      fontWeight: 'bold',
    },
    editButton: { position: 'absolute', bottom: -5, backgroundColor: 'rgba(0, 0, 0, 0.6)', borderRadius: 15, paddingVertical: 6, paddingHorizontal: 12 },
    editButtonText: { color: Colors.dark.text, fontSize: 12 },
    username: { color: Colors.dark.text, fontSize: 24, fontWeight: 'bold' },
    locationContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
    locationText: { color: Colors.dark.icon, fontSize: 14, marginLeft: 5 },
    followStatsContainer: { flexDirection: 'row', marginTop: 20 },
    followStat: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 15 },
    followLabel: { color: Colors.white, fontSize: 16, marginRight: 8 },
    followValue: { color: Colors.white, fontSize: 24, fontWeight: 'bold' },
    statsContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 5, paddingTop: 25},
    statItem: { alignItems: 'center', bottom: 4,height:50 },
    statValue: { color: Colors.primary, fontSize: 26, fontWeight: 'bold',marginLeft: 2,marginTop:5, bottom: 4 },
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
>>>>>>> Stashed changes
