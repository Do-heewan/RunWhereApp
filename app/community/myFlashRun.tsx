import { auth, db } from '@/backend/db/firebase';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Eclipse from '../../components/EclipseSVG'; //background Image
import { ThemedText } from '../../components/ThemedText';
import { Colors } from '../../constants/Colors';

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
};

type FilterType = '최신순' | '임박순' | '페이스순';

export default function MyFlashRun() {
  const [rooms, setRooms] = useState<FlashRunEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyRooms = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setRooms([]);
          setLoading(false);
          return;
        }

        const snapshot = await getDocs(collection(db, 'flashRunChatsRooms'));
        const allRooms: FlashRunEvent[] = snapshot.docs.map(doc => {
          const data: any = doc.data();
          return {
            id: data.id ?? Number(doc.id),
            title: data.title ?? '',
            time: data.time ?? '',
            location: data.location ?? '',
            description: data.description ?? '',
            hashtags: data.hashtags ?? [],
            participants: data.participants ?? 0,
            maxParticipants: data.maxParticipants ?? 0,
            organizer: data.organizer ?? [],
            startHour: data.startHour ?? 0,
            startMinute: data.startMinute ?? 0,
            targetMinute: data.targetMinute ?? 0,
            targetSecond: data.targetSecond ?? 0,
            status: data.status ?? 'upcoming',
          } as FlashRunEvent;
        });

        // 서버에 organizer가 배열로 저장되어 있으므로 클라이언트에서 필터링
        const myRooms = allRooms.filter(r =>
          Array.isArray(r.organizer) && r.organizer.some(org => org.id === user.uid)
        );

        setRooms(myRooms);
      } catch (error) {
        console.error('내가 만든 번개런 불러오기 실패:', error);
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMyRooms();
  }, []);

  const openChat = (room: FlashRunEvent) => {
    router.push({
      pathname: '/community/flashRunChat',
      params: {
        id: room.id,
        title: room.title ?? '',
      },
    });
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

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.emptyWrap}>
            <ThemedText type="body1" style={styles.emptyTxt}>로딩 중...</ThemedText>
          </View>
        ) : rooms.length === 0 ? (
          <View style={styles.emptyWrap}>
            <ThemedText type="body1" style={styles.emptyTxt}>운영중인 채팅방이 없습니다.</ThemedText>
          </View>
        ) : (
          rooms.map(room => (
            <TouchableOpacity key={room.id} style={styles.roomCard} onPress={() => openChat(room)}>
              <View style={styles.roomLeft}>
              </View>
              <View style={styles.roomBody}>
                <ThemedText type="sub1" style={styles.roomTitle}>{room.title}</ThemedText>
                <View style={styles.roomMeta}>
                  <ThemedText type="body3" style={styles.metaText}>운영자</ThemedText>
                  <ThemedText type="body3" style={styles.metaText}>·</ThemedText>
                  <ThemedText type="body3" style={styles.metaText}>{room.participants ?? 0}명</ThemedText>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.blackGray },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.gray1 },
  headerTitle: { color: Colors.white, fontSize: 18, fontWeight: '600' },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  scrollArea: { flex: 1 },
  listContainer: { padding: 16 },
  roomCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.gray1, padding: 12, borderRadius: 12, marginBottom: 12 },
  roomLeft: { marginRight: 12 },
  roomImage: { width: 56, height: 56, borderRadius: 12, backgroundColor: Colors.gray4 },
  roomAvatarPlaceholder: { width: 56, height: 56, borderRadius: 12, backgroundColor: Colors.gray2, justifyContent: 'center', alignItems: 'center' },
  avatarInitial: { color: Colors.white, fontSize: 18, fontWeight: '600' },
  roomBody: { flex: 1 },
  roomTitle: { color: Colors.white, fontSize: 16, fontWeight: '600', marginBottom: 4 },
  roomLastMsg: { color: Colors.gray2, fontSize: 13, marginBottom: 6 },
  roomMeta: { flexDirection: 'row', alignItems: 'center' },
  metaText: { color: Colors.gray3, fontSize: 12, marginRight: 6 },
  emptyWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 40 },
  emptyTxt: { color: Colors.gray2, fontSize: 16 },
});
