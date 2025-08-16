import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { styles } from '@/styles/community.styles';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { arrayUnion, collection, doc, getDoc, getDocs, onSnapshot, orderBy, query, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  TouchableOpacity,
  View,
  Text
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db, auth } from '../../backend/db/firebase';
import Eclipse from '../../components/EclipseSVG';
import { FlashIcon, LikeIcon, LikeIconActive, StarIcon, StarIconActive } from '../../components/IconSVG';

type SneakerItem = {
  id: number
  image: { uri: string }
  likes: number
  rating: number
}

type ShareRecord = {
  id: number;
  image: { uri: string };
  user?: {
    name: string;
    avatar: string;
    location: string;
  };
  likes?: number;
  description?: string;
  timeLabel?: string;
}

type FlashRunEvent = {
  id: number;
  title: string;
  time: string;
  location: string;
  description: string;
  hashtags: string[];
  participants: number;
  maxParticipants: number;
  organizer: {
    name: string;
    id: string;
  }[];
  startHour: number;
  startMinute: number;
  targetMinute: number;
  targetSecond: number;
  status: 'upcoming' | 'full' | 'past';
  messages: string[];
};

// Add filter type
type FilterType = '최신순' | '임박순' | '페이스순'

const isPast24h = (iso: string) => {
  const ONE_DAY = 24 * 60 * 60 * 1000;
  return Date.now() - new Date(iso).getTime() > ONE_DAY;
};

// 좋아요 수 업데이트 함수
  async function updateSneakerLikes(itemId: number, newLikes: number) {
    // Firestore에서 해당 문서 찾기 (id 필드로)
    const q = query(collection(db, 'runwearItem'), orderBy('id', 'desc'));
    const snapshot = await getDocs(q);
    const docRef = snapshot.docs.find(doc => doc.data().id === itemId)?.ref;
    if (docRef) {
      await updateDoc(docRef, { likes: newLikes });
    }
  }

async function fetchUserPace(userId: string) {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const data = userSnap.data();
    return {
      paceMin: data.paceMin,
      paceSec: data.paceSec,
    };
  } else {
    throw new Error('User not found');
  }
}

/* ---------- COMMUNITY TABS ---------- */
const TABS = ['러닝템', '기록공유', '번개런'] as const
type TabKey = (typeof TABS)[number]

/* ---------- COMPONENT ---------- */
export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('러닝템');
  const [likedItems, setLikedItems] = useState<Set<number>>(new Set());
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('최신순');
  const [userPaceMin, setUserPaceMin] = useState<number | null>(null);
  const [userPaceSec, setUserPaceSec] = useState<number | null>(null);
  const [runwearList, setRunwearList] = useState<SneakerItem[]>([]);
  const [sharedRecordList, setSharedRecordList] = useState<ShareRecord[]>([]);
  const [flashRunList, setFlashRunList] = useState<FlashRunEvent[]>([]);

  useEffect(() => {
    async function fetchRunwear() {
      const q = query(collection(db, 'runwearItem'), orderBy('id', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map(doc => doc.data() as SneakerItem);
        setRunwearList(items);
      });

      return unsubscribe;
    }

    fetchRunwear();
  }, []);

  useEffect(() => {
    async function fetchSharedRecords() {
      const q = query(collection(db, 'sharedRecord'), orderBy('id', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map(doc => doc.data() as ShareRecord);
        setSharedRecordList(items);
      });

      return unsubscribe;
    }

    fetchSharedRecords();
  }, []);

  useEffect(() => {
    async function fetchFlashRuns() {
      const q = query(collection(db, 'flashRun'), orderBy('id', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map(doc => doc.data() as FlashRunEvent);
        setFlashRunList(items);
      });

      return unsubscribe;
    }

    fetchFlashRuns();
  }, []);


  type PaceInfo = { 
    label: string, 
    color: string 
  }

  function getPaceInfo(min: number, sec: number): PaceInfo {
    const pace = Number(min) + Number(sec) / 60;

    if (pace >= 3 && pace < 5) {
      return { label: '3-4', color: '#A7F5C6' }; // Light green
    } else if (pace >= 5 && pace < 7) {
      return { label: '5-6', color: '#41B5C4' }; // Teal
    } else if (pace >= 7 && pace < 9) {
      return { label: '7-8', color: '#9384B8' }; // Purple
    } else if (pace >= 9) {
      return { label: '9분 이상', color: '#00A762' }; // Dark green
    } else {
      return { label: '임의', color: '#A7E3F5' }; // Default gray
    }
  }

const getSortedFlashRunData = () => {
  const data = [...flashRunList];

  switch (selectedFilter) {
    case '최신순':
      return data.sort((a, b) => b.id - a.id); // Newest first

    case '임박순':
      return data.sort((a, b) => a.time.localeCompare(b.time)); // Sort by time string
    case '페이스순': {
      // Guard against null values
      if (userPaceMin === null || userPaceSec === null) {
        return data; // Return unfiltered data if pace isn't loaded yet
      }
      const userPace = getPaceInfo(userPaceMin, userPaceSec).label;

      return data.filter(item => {
        const itemPace = getPaceInfo(item.targetMinute, item.targetSecond).label;
        return itemPace === userPace;
      });
    }

    default:
      return data;
  }
};

  // Update dataByTab to use sorted data for 번개런
  const dataByTab: Record<TabKey, any[]> = {
    러닝템: runwearList,
    기록공유: sharedRecordList,
    번개런: getSortedFlashRunData(),
  };

  /* ---------- ADD BUTTON NAVIGATION ---------- */
  const handleAddButtonPress = () => {
    switch (activeTab) {
      case '러닝템':
        router.push('/community/createRunwear');
        break;
      case '기록공유':
        router.push('/community/createRecord');
        break;
      case '번개런':
        router.push('/community/createFlashRun');
        break;
      default:
        router.push('/community/createRunwear');
    }
  }

  /* --------------- RENDER HELPERS --------------- */

/* --------------- Runwear Tab --------------- */
  /* shoe-card for Runwear with staggered layout */
  const renderSneakerCard = (item: SneakerItem, index: number) => {
    const isLiked = likedItems.has(item.id)
    return (
      <TouchableOpacity onPress={() => router.push('/community/runwear')}
        key={item.id}
        style={[
          styles.card,
          { marginTop: index % 2 === 1 ? 20 : 0 }
        ]}
      >
        <View style={[styles.cardInner]}>
          <Image source={item.image} style={styles.shoeImg} resizeMode="cover" />
          <View style={styles.likeBox}>
            <TouchableOpacity onPress={() => toggleLike(item.id)}>
              <View style={styles.likeContent}>
                <ThemedText type="body2" style={[styles.likeTxt, { color: isLiked ? Colors.primary : Colors.gray4 }]}>
                  {item.likes.toString()}
                </ThemedText>
                {isLiked
                  ? <LikeIconActive width={18} height={17} />
                  : <LikeIcon width={18} height={17} color={Colors.gray4} />}
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.starRow}>{renderStars(item.rating)}</View>
      </TouchableOpacity>
    );
  };

  const renderStars = (rating: number) => (
    <View style={{ flexDirection: 'row' }}>
      {Array.from({ length: 5 }).map((_, index) => (
        <View key={index} style={{ marginRight: index < 4 ? 10 : 0 }}>
          {index < rating ? (
            <StarIconActive width={20} height={20} />
          ) : (
            <StarIcon width={20} height={20} color="#ADADB2" />
          )}
        </View>
      ))}
    </View>
  );

  const toggleLike = (itemId: number) => {
    setRunwearList(prev =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, likes: item.likes + (likedItems.has(itemId) ? -1 : 1) }
          : item
      ),
    );
    setLikedItems(prev => {
      const set = new Set(prev);
      set.has(itemId) ? set.delete(itemId) : set.add(itemId);
      return set;
    });
    const newLikes =
      runwearList.find(it => it.id === itemId)!.likes +
       (likedItems.has(itemId) ? -1 : 1);
    updateSneakerLikes(itemId, newLikes);      // keeps server in sync
  };


  /* --------------- 기록공유 Tab --------------- */
  const renderGalleryTile = (item: ShareRecord) => (
    <TouchableOpacity
      onPress={() => router.push({
        pathname: '/community/record',
        params: {
          recordId: item.id.toString() // Pass the record ID
        }
      })}
      key={item.id}
      style={styles.galleryTile}
    >
      <Image source={item.image} style={styles.galleryImg} />
    </TouchableOpacity>
  )

  /* --------------- 번개런 Tab --------------- */
  const renderFlashRunCard = (item: FlashRunEvent) => {
    const disabled = item.status === 'full';
    const { label, color } = getPaceInfo(item.targetMinute, item.targetSecond)
    return (
      <View key={item.id} style={styles.flashRunCard}>
        <View style={styles.flashRunHeader}>
          <View style={styles.flashRunTitleSection}>

            {/* pace */}
            <View style={[styles.flashRunPaceContainer, { backgroundColor: color }]}>
              <ThemedText type="body3" style={styles.flashRunPaceText}>
                페이스 {
                  label === '9분 이상' || label === '임의'
                    ? label.replace('분', '')
                    : `${label}분`
                }
              </ThemedText>
            </View>

            {/* title */}
            <ThemedText type="sub1" style={styles.flashRunTitle}>
              {item.title}
            </ThemedText>
          </View>

          {/* time */}
          <ThemedText type="body3" style={styles.flashRunTime}>
            {item.time}
          </ThemedText>
        </View>

        {/* description */}
        <ThemedText type="body2" style={styles.flashRunDescription}>
          {item.description}
        </ThemedText>

        {/* hashtags */}
        <View style={styles.hashRow}>
          {item.hashtags.map(tag => (
            <ThemedText type="body3" key={tag} style={styles.hashTag}>
              {tag}
            </ThemedText>
          ))}
        </View>

        {/* organizer */}
        {/* 사용자 정보 추가 이후    */}
        {/* <View style={styles.organizerSection}>
          <Image source={{ uri: item.organizer.avatar }} style={styles.organizerAvatar} />
          <View>
            <Text style={styles.organizerName}>{item.organizer.name}</Text>
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={14} color="#8E8E93" />
              <Text style={styles.locationText}>{item.location}</Text>
            </View>
          </View>
        </View> */}

        {/* join-button */}
        <TouchableOpacity
          disabled={disabled}
          activeOpacity={disabled ? 1 : 0.8}
          onPress={async () => {
            if (disabled) return;

            // 1. 채팅방 존재 여부 확인 (flashRunId로)
            const chatRoomsRef = collection(db, 'flashRunChatsRooms');
            const q = query(chatRoomsRef, where('id', '==', item.id));
            const snapshot = await getDocs(q);

            let chatRoomId: string | null = null;
            chatRoomId = snapshot.docs[0]?.id;
            if (!chatRoomId) return;

            // 2. 현재 로그인한 사용자 정보 가져오기
            const user = auth.currentUser;
            if (!user) {
              Alert.alert('로그인이 필요합니다.');
              return;
            }

            // 3. 채팅방 organizer 정보 가져오기
            const chatRoomRef = doc(db, 'flashRunChatsRooms', String(chatRoomId));
            const chatRoomSnap = await getDoc(chatRoomRef);
            let organizers = chatRoomSnap.data()?.organizer || [];

            // 4. 내 정보가 organizer에 있는지 확인
            const isParticipant = organizers.some((org: any) => org.id === user.uid);

            // 5. 참가자가 아니라면 organizer에 내 정보 추가
            if (!isParticipant) {
              // Firestore users 컬렉션에서 닉네임 가져오기
              const userDoc = await getDoc(doc(db, 'users', user.uid));
              const nickname = userDoc.exists() ? userDoc.data().name : '';

              await updateDoc(chatRoomRef, {
                organizer: arrayUnion({
                  id: user.uid,
                  name: nickname,
                }),
              });

              organizers = [...organizers, { id: user.uid, name: nickname }];
            }

            // 6. FlashRun 참가자 수 업데이트
            const flashRunRef = doc(db, 'flashRun', String(item.id));
            await updateDoc(flashRunRef, {
              participants: organizers.length,
            });

            // 7. 채팅방으로 이동
            router.push({
              pathname: '/community/flashRunChat',
              params: {
                chatRoomId,
                title: item.title,
                current: item.participants.toString(),
                max: item.maxParticipants.toString(),
              },
            });
          }}
        >
          <LinearGradient
            colors={
              item.status === 'full'
                ? ['#5E5E5E', '#808080']
                : ['#54f895', '#2afbea']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.joinButton}
          >
            <Text
              style={[
                styles.joinButtonText,
                item.status === 'full' ? styles.joinButtonTextFull : styles.joinButtonTextActive,
              ]}
            >
              {item.status === 'full'
                ? '정원마감'
                : `참가하기 (${item.participants}/${item.maxParticipants})`}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  };

    const LocationAndFilterSection = () => (
    <View style={styles.locationSection}>
      <View style={styles.locationInfo}>
         {/* Flash Icon and Location Text */}
        <FlashIcon width={34} height={34} />
        <ThemedText type="h2" style={styles.locationInfoText}>울산시 울주군</ThemedText>
      </View>

      {/* Filter Dropdown Button */}
      <TouchableOpacity
        style={styles.filterDropdownButton}
        onPress={() => setShowFilterDropdown(true)}
      >
        <Ionicons
          name={showFilterDropdown ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={Colors.gray2}
          style={{ marginRight: 8 }}
        />
        <ThemedText type="body3" style={styles.filterDropdownText}>
          {selectedFilter}
        </ThemedText>
      </TouchableOpacity>

       {/* ─── Dropdown overlay, rendered in a Modal ─── */}
      <Modal
        visible={showFilterDropdown}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFilterDropdown(false)}
      >
        <TouchableOpacity
          style={styles.modalBackDrop}
          activeOpacity={1}
          onPress={() => setShowFilterDropdown(false)}
        >
          <View style={styles.dropdownMenu}>
            {(['최신순', '임박순', '페이스순'] as FilterType[]).map(filter => (
              <TouchableOpacity
                key={filter}
                style={styles.dropdownItem}
                onPress={() => {
                  setSelectedFilter(filter)
                  setShowFilterDropdown(false)
                }}
              >
                <ThemedText type="body3" style={styles.dropdownItemText}>
                  {filter}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );

  /* pick correct renderer */
  const renderItem = (item: any, index: number) => {
    if (activeTab === '기록공유') return renderGalleryTile(item)
    if (activeTab === '번개런') return renderFlashRunCard(item)
    return renderSneakerCard(item, index)
  }

  /* --------------- UI --------------- */
  return (
    <SafeAreaView style={styles.container}>
      <Eclipse />
      <TouchableOpacity
        style={styles.addbutton}
        onPress={handleAddButtonPress}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={40} color="#fff" />
      </TouchableOpacity>
      <View style={styles.header}>
        <ThemedText type="h1" style={styles.title}>커뮤니티</ThemedText>
        <View style={styles.tabBar}>
          {TABS.map(tab => {
            const focused = tab === activeTab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.tabBtn, focused && styles.tabActive]}
                onPress={() => setActiveTab(tab)}
              >
                <ThemedText type="body2" style={focused ? styles.tabTxtActive : styles.tabTxt}>
                  {tab}
                </ThemedText>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
      {dataByTab[activeTab].length ? (
        <ScrollView
          style={styles.scrollArea}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            activeTab === '기록공유' ? styles.galleryGrid :
              activeTab === '번개런' ? styles.flashRunGrid : styles.cardGrid
          }
        >
          {activeTab === '번개런' && <LocationAndFilterSection />}
          {dataByTab[activeTab].map((item, index) => renderItem(item, index))}
          <View style={styles.bottomPadding} />
        </ScrollView>
      ) : (
        <View style={styles.emptyWrap}>
          <ThemedText type="body1" style={styles.emptyTxt}>
            아직 콘텐츠가 없습니다.
          </ThemedText>
        </View>
      )}
    </SafeAreaView>
  )
}
