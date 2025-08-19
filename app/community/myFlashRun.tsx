import Eclipse from '../../components/EclipseSVG'; //background Image
import { ThemedText } from '../../components/ThemedText';
import ThemedTextInput from '../../components/ThemedTextInput';
import { Colors } from '../../constants/Colors';
import CustomAlert from '@/components/CustomAlert';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../../backend/db/firebase'; 
import { FlashIcon } from '../../components/IconSVG'; 

// Type definitions
type FlashRunEvent = {
  id: number;
  title: string;
  time: string;
  location: string;
  description: string;
  hashtags: string[];
  participants: number;
  maxParticipants: number;
  organizer: { name: string; id: string }[];
  startHour: number;
  startMinute: number;
  targetMinute: number;
  targetSecond: number;
  status: 'upcoming' | 'full' | 'past';
  messages: string[];
};

type FilterType = '최신순' | '임박순' | '페이스순';

export default function MyFlashRun() {
  const [flashRunList, setFlashRunList] = useState<FlashRunEvent[]>([]);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('최신순');
  const [userPaceMin, setUserPaceMin] = useState<number | null>(null);
  const [userPaceSec, setUserPaceSec] = useState<number | null>(null);

  // Fetch user's pace for filtering
  useEffect(() => {
    async function fetchUserPace(userId: string) {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        setUserPaceMin(data.paceMin);
        setUserPaceSec(data.paceSec);
      }
    }
    const user = auth.currentUser;
    if (user) fetchUserPace(user.uid);
  }, []);

  // Fetch Flash Run events from Firestore
  useEffect(() => {
    const q = query(collection(db, 'flashRun'), orderBy('id', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => doc.data() as FlashRunEvent);
      setFlashRunList(items);
    });
    return () => unsubscribe();
  }, []);

  // Helper function to categorize pace
  function getPaceInfo(min: number, sec: number): { label: string; color: string } {
    const pace = Number(min) + Number(sec) / 60;
    if (pace >= 3 && pace < 5) return { label: '3-4', color: '#A7F5C6' };
    if (pace >= 5 && pace < 7) return { label: '5-6', color: '#41B5C4' };
    if (pace >= 7 && pace < 9) return { label: '7-8', color: '#9384B8' };
    if (pace >= 9) return { label: '9분 이상', color: '#00A762' };
    return { label: '임의', color: '#A7E3F5' };
  }

  // Sort and filter data
  const getSortedFlashRunData = () => {
    const user = auth.currentUser;
    if (!user) return [];

    let data = flashRunList.filter(item => item.organizer.some(org => org.id === user.uid));

    switch (selectedFilter) {
      case '최신순':
        return data.sort((a, b) => b.id - a.id);
      case '임박순':
        return data.sort((a, b) => a.time.localeCompare(b.time));
      case '페이스순':
        if (userPaceMin === null || userPaceSec === null) return data;
        const userPaceLabel = getPaceInfo(userPaceMin, userPaceSec).label;
        return data.filter(item => getPaceInfo(item.targetMinute, item.targetSecond).label === userPaceLabel);
      default:
        return data;
    }
  };

  const sortedData = getSortedFlashRunData();

  const handleEditPress = (item: FlashRunEvent) => {
    router.push({
      pathname: '/community/editFlashRun',
      params: { flashRunId: item.id.toString() },
    });
  };

  const renderFlashRunCard = (item: FlashRunEvent) => {
    const { label, color } = getPaceInfo(item.targetMinute, item.targetSecond);
    return (
      <View key={item.id} style={styles.flashRunCard}>
        <View style={styles.flashRunHeader}>
          <View style={styles.flashRunTitleSection}>
            <View style={[styles.flashRunPaceContainer, { backgroundColor: color }]}>
              <ThemedText type="body3" style={styles.flashRunPaceText}>페이스 {label.replace('분', '')}</ThemedText>
            </View>
            <ThemedText type="sub1" style={styles.flashRunTitle}>{item.title}</ThemedText>
          </View>
          <ThemedText type="body3" style={styles.flashRunTime}>{item.time}</ThemedText>
        </View>
        <ThemedText type="body2" style={styles.flashRunDescription}>{item.description}</ThemedText>
        <View style={styles.hashRow}>
          {item.hashtags.map(tag => <ThemedText type="body3" key={tag} style={styles.hashTag}>{tag}</ThemedText>)}
        </View>
        <TouchableOpacity activeOpacity={0.8} onPress={() => handleEditPress(item)}>
          <LinearGradient colors={['#54f895', '#2afbea']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.editButton}>
            <Text style={styles.editButtonTextActive}>수정하기</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Eclipse />
       <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <ThemedText type="h2" style={styles.headerTitle}>내가 만든 번개런</ThemedText>
        <View style={styles.backButton} />
      </View>
      {sortedData.length > 0 ? (
        <ScrollView style={styles.scrollArea} contentContainerStyle={styles.flashRunGrid} showsVerticalScrollIndicator={false}>
          {sortedData.map(item => renderFlashRunCard(item))}
        </ScrollView>
      ) : (
        <View style={styles.emptyWrap}>
          <ThemedText type="body1" style={styles.emptyTxt}>내가 만든 번개런이 없습니다.</ThemedText>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.blackGray },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: Colors.gray1 },
    headerTitle: { color: Colors.white, fontSize: 18, fontWeight: '600' },
    backButton: { padding: 10 },
    scrollArea: { flex: 1 },
    flashRunGrid: { padding: 20 },
    flashRunCard: { backgroundColor: Colors.gray1, borderRadius: 25, padding: 16, marginBottom: 16 },
    flashRunHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
    flashRunTitleSection: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    flashRunTitle: { color: Colors.white, fontSize: 18, fontWeight: '600', marginLeft: 10 },
    flashRunTime: { color: Colors.gray2, fontSize: 12 },
    flashRunPaceContainer: { borderRadius: 12, paddingVertical: 6, paddingHorizontal: 10, alignSelf: 'flex-start' },
    flashRunPaceText: { color: Colors.blackGray, fontSize: 12, fontWeight: '600' },
    flashRunDescription: { color: Colors.white, fontSize: 15, marginBottom: 16, lineHeight: 20 },
    hashRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
    hashTag: { color: Colors.primary, fontSize: 14, marginRight: 6 },
    editButton: { borderRadius: 30, paddingVertical: 18, marginTop: 12, alignItems: 'center' },
    editButtonTextActive: { color: Colors.blackGray, fontSize: 16, fontWeight: '700' },
    emptyWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyTxt: { color: Colors.gray2, fontSize: 16 },
});
