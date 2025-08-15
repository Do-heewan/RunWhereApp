import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { collection, doc, getDoc, getDocs, onSnapshot, orderBy, query, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../../backend/db/firebase';
import Eclipse from '../../components/EclipseSVG';
import { FlashIcon, LikeIcon, LikeIconActive, StarIcon, StarIconActive } from '../../components/IconSVG';


/* ---------- DATA ---------- */
type SneakerItem = {
  id: number;
  image: { uri: string };
  likes: number;
  rating: number;
  backgroundColor: string;
};

type ShareRecord = {
  id: number;
  image: { uri: string };
};

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
    avatar: string;
  };
  startHour: number;
  startMinute: number;
  targetMinute: number;
  targetSecond: number;
  status: 'upcoming' | 'full' | 'past';
  messages: string[];
};

// Add filter type
type FilterType = '최신순' | '임박순' | '페이스순';

const TAB_BAR_HEIGHT = 75;
const TAB_BAR_BOTTOM = 10;
const ADD_BUTTON_SPACING = 30;

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


/* ---------- TABS ---------- */
const TABS = ['러닝템', '기록공유', '번개런'] as const;
type TabKey = (typeof TABS)[number];

/* ---------- COMPONENT ---------- */
export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('러닝템');
  const [selectedLocation, setSelectedLocation] = useState('위치 감지 중...');
  const [likedItems, setLikedItems] = useState<Set<number>>(new Set());
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('최신순');
  const [userPaceMin, setUserPaceMin] = useState<number | null>(null);
  const [userPaceSec, setUserPaceSec] = useState<number | null>(null);


  // Location detection - only get 동 (district/subregion)
  const getCurrentLocation = async () => {
    try {
      setSelectedLocation('위치 감지 중...');
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('권한 필요', '위치 권한이 필요합니다.');
        setSelectedLocation('위치 권한 없음');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      let addresses = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (addresses.length > 0) {
        const address = addresses[0];
        // Extract only 동 information
        const dong = address.subregion || address.district || address.name || '';
        setSelectedLocation(dong || '위치 불명');
      } else {
        setSelectedLocation('위치 불명');
      }
    } catch (error) {
      console.error('Location error:', error);
      setSelectedLocation('위치 감지 실패');
      Alert.alert('오류', '위치를 가져올 수 없습니다.');
    }
  }

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

  // Get current location on component mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  type PaceInfo = {
  label: string;
  color: string;
};

function getPaceInfo(min: number, sec: number): PaceInfo {
  const pace = Number(min) + Number(sec) / 60;

  if (pace >= 3 && pace < 5) {
    return { label: '3-4', color: '#A7F5C6' }; // Light green
  } else if (pace >= 5 && pace < 7) {
    return { label: '5-6', color: '#41B5C4' }; // Teal
  } else if (pace >= 7 && pace < 9) {
    return { label: '7-8', color: '#9384B8' }; // Purple
  } else if (pace >= 9) {
    return { label: '9이상', color: '#00A762' }; // Dark green
  } else {
    return { label: '우사인볼트', color: '#d9d9d9' }; // Default gray
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
  };

  /* --------------- RENDER HELPERS --------------- */
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


  /* shoe-card for Runwear with staggered layout */
  const renderSneakerCard = (item: SneakerItem, index: number) => {
    const isLiked = likedItems.has(item.id);
    
    return (
      <TouchableOpacity onPress={() => router.push('/community/runwear')}
        key={item.id} 
        style={[
          styles.card, 
          { marginTop: index % 2 === 1 ? 20 : 0 }
        ]}
      >
        <View style={[styles.cardInner, { backgroundColor: item.backgroundColor }]}>
          <Image source={item.image} style={styles.shoeImg} resizeMode="contain" />
          <View style={styles.likeBox}>
            <TouchableOpacity onPress={() => toggleLike(item.id)}>
              <View style={styles.likeContent}>
                <Text style={[styles.likeTxt, { color: isLiked ? '#54F895' : '#D9D9D9' }]}>
                  {isLiked ? item.likes : item.likes}
                </Text>
                {isLiked ? (
                  <LikeIconActive width={18} height={17} />
                ) : (
                  <LikeIcon width={18} height={17} color="#D9D9D9" />
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.starRow}>{renderStars(item.rating)}</View>
      </TouchableOpacity>
    );
  };

  
/* ---------------- Location / Filter section ---------------- */
const LocationAndFilterSection = () => (
    <View style={styles.locationSection}>
      {/* Flash Icon and Location Text */}
      <View style={styles.locationInfo}>
        <FlashIcon width={34} height={34}/>
        <Text style={styles.locationInfoText}>울산시 울주군</Text>
      </View>

      {/* Filter Dropdown Button */}
      <TouchableOpacity
        style={styles.filterDropdownButton}
        onPress={() => setShowFilterDropdown(true)}
      >
        <Ionicons
          name={showFilterDropdown ? 'chevron-up' : 'chevron-down'}
          size={18}
          color="#8E8E93"
          style={{ marginRight: 8 }}
        />
        <Text style={styles.filterDropdownText}>{selectedFilter}</Text>
      </TouchableOpacity>

    {/* ─── REAL overlay, rendered in a Modal ─── */}
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
                setSelectedFilter(filter);
                setShowFilterDropdown(false);
              }}
            >
              <Text style={styles.dropdownItemText}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  </View>
);

  // Flash run event card renderer
  const renderFlashRunCard = (item: FlashRunEvent) => {
    const disabled = item.status === 'full'; 
    const { label, color } = getPaceInfo(item.targetMinute, item.targetSecond);

    return (   
      <View key={item.id} style={styles.flashRunCard}>
        {/* header */}
        <View style={styles.flashRunHeader}>
          <View style={styles.flashRunTitleSection}>
      
            <View style={[styles.flashRunPaceContainer, { backgroundColor: color }]}>
              <Text style={styles.flashRunPaceText}>페이스 {label} 분</Text>
            </View>


            <Text style={styles.flashRunTitle}>{item.title}</Text>
          </View>
          <Text style={styles.flashRunTime}>{item.time}</Text>
        </View>

        {/* description */}
        <Text style={styles.flashRunDescription}>{item.description}</Text>

        {/* hashtags */}
        <View style={styles.hashRow}>
          {item.hashtags.map(tag => (
            <Text key={tag} style={styles.hashTag}>
              {tag}
            </Text>
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
        <View>
          <TouchableOpacity
            disabled={disabled}
            activeOpacity={disabled ? 1 : 0.8}
            onPress={async () => {
              if (disabled) return;
              
              // 1. 채팅방 존재 여부 확인 (flashRunId로)
              const chatRoomsRef = collection(db, 'flashRunChatsRooms');
              const q = query(chatRoomsRef,
                where('id', '==', item.id)
              );
              const snapshot = await getDocs(q);

              let chatRoomId: string | null = null;
              chatRoomId = snapshot.docs[0].id;

              if (chatRoomId) {
                router.push({
                  pathname: '/community/flashRunChat',
                  params: {
                    chatRoomId,
                    current: item.participants.toString(),
                    max: item.maxParticipants.toString(),
                  },
                });
              }
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
      </View>
    );
  };

  /* pure-image tile for 기록공유 */
  const renderGalleryTile = (item: ShareRecord) => (
    <TouchableOpacity onPress={() => router.push('/community/record')}
      key={item.id} style={styles.galleryTile}>
      <Image source={item.image} style={styles.galleryImg} />
    </TouchableOpacity>
  );

  /* pick correct renderer */
  const renderItem = (item: any, index: number) => {
    if (activeTab === '기록공유') return renderGalleryTile(item);
    if (activeTab === '번개런') return renderFlashRunCard(item);
    return renderSneakerCard(item, index);
  };

  /* --------------- UI --------------- */
  return (
      <SafeAreaView style={styles.container}>
      <Eclipse /> {/* Background effect */}
      <TouchableOpacity
        style={styles.addbutton}
        onPress={handleAddButtonPress}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={40} color="#fff" />
      </TouchableOpacity>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>커뮤니티</Text>
        <View style={styles.tabBar}>
          {TABS.map(tab => {
            const focused = tab === activeTab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.tabBtn, focused && styles.tabActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={focused ? styles.tabTxtActive : styles.tabTxt}>
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Content */}
      {dataByTab[activeTab].length ? (
        <ScrollView
          style={styles.scrollArea}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            activeTab === '기록공유' ? styles.galleryGrid : 
            activeTab === '번개런' ? styles.flashRunGrid : styles.cardGrid
          }
        >
          {/* Show location filter only for 번개런 tab */}
          {activeTab === '번개런' && <LocationAndFilterSection />}
          {dataByTab[activeTab].map((item, index) => renderItem(item, index))}
          {/* Bottom padding to ensure content doesn't get hidden behind floating button */}
          <View style={styles.bottomPadding} />
        </ScrollView>
      ) : (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTxt}>아직 콘텐츠가 없습니다.</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#15151C' },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 5 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 20 },
  bottomPadding: {
    height: 80,
  },

  /* add button colour */
  addbutton: {
    position: 'absolute',
    bottom: TAB_BAR_BOTTOM + TAB_BAR_HEIGHT + ADD_BUTTON_SPACING,
    right: 30,
    zIndex: 20,
    width: 60,
    height: 60,
    aspectRatio: 1,
    borderRadius: 35,
    backgroundColor: 'rgba(84, 248, 149, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.20)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 7,
    elevation: 6,
  },

  /* tabs */
  tabBar: { flexDirection: 'row', borderRadius: 25},
  tabBtn: { flex: 1, paddingVertical: 5, alignItems: 'center', borderRadius: 25 },
  tabActive: {
    backgroundColor: '#303034',
  },
  tabTxt: { 
    color: '#7C7C7C',
    textAlign: 'center',
    fontFamily: 'Pretendard Variable',
    fontSize: 22,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 30,
    letterSpacing: -0.44,
  },
  tabTxtActive: {
    color: '#54F895',
    textAlign: 'center',
    fontFamily: 'Pretendard Variable',
    fontSize: 22,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 30,
    letterSpacing: -0.44,
  },

  /* card list (Runwear) - Updated for staggered layout */
  scrollArea: { flex: 1 },
  cardGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  card: { 
    width: '48%', 
    marginBottom: 20,
  },
  cardInner: { 
    borderRadius: 20, 
    padding: 15, 
    height: 130, 
    justifyContent: 'center', 
    alignItems: 'center',
    position: 'relative',
  },
  shoeImg: { 
    width: 100, 
    height: 100,
    resizeMode: 'contain',
  },
  likeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  likeBox: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 50,
    backgroundColor: 'rgba(21, 21, 28, 0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    minWidth: 50,
  },

  likeTxt: {
    color: '#54F895',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 2,
  },
  starRow: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginTop: 10,
  },

  /* gallery (기록공유) */
  galleryGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 5, marginTop:15 },
  galleryTile: { width: '32%', aspectRatio: 1, overflow: 'hidden', margin: 2 },
  galleryImg: { 
    width: '100%', 
    height: '100%',
    borderWidth: 1,
    borderColor: '#D9D9D9', 
    backgroundColor: 'lightgray',
  },

  /* Flash Run Styles */
  flashRunGrid: { 
    padding: 20,
    zIndex: 1, // Add this - lower z-index
  },
  flashRunCard: {
    backgroundColor: '#303034',
    borderRadius: 25,
    padding: 16,
    marginBottom: 16,
    zIndex: 1, // Add this - keep cards behind dropdown
    elevation: 2, // Lower elevation for Android
  },

  flashRunHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  flashRunTitleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flashRunTitle: {
    color: '#FAFAF8',
    fontFamily: 'Pretendard Variable',
    fontSize: 18,
    fontWeight: 600,
    marginLeft: 10,
  },
  flashRunTime: {
    color: '#8E8E93',
    fontSize: 12,
  },
flashRunPaceContainer: {
  borderRadius: 12,
  paddingVertical: 6,
  paddingHorizontal: 10,
  justifyContent: 'center',
  alignSelf: 'flex-start',
  marginVertical: 4,
  flexShrink: 1, // allow shrinking to fit content
},

flashRunPaceText: {
  color: '#15151C',
  fontSize: 12,
  fontWeight: '600',
  textAlign: 'center',
},
  flashRunDescription: {
    color: '#FAFAF8',
    fontSize: 15,
    fontFamily: 'Pretendard Variable',
    marginBottom: 16,
    lineHeight: 20,
  },
  organizerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  organizerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  organizerName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  locationText: {
    color: '#8E8E93',
    fontSize: 12,
    marginLeft: 4,
  },
  joinButton: {
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  joinButtonActive: {
    backgroundColor: '#54f895',
  },
  joinButtonFull: {
    backgroundColor: '#3C3C43',
  },
  joinButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  joinButtonTextActive: {
    color: '#000',
  },
  joinButtonTextFull: {
    color: '#000',
  },
  hashRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
  hashTag: {
    color: '#54f895',
    fontSize: 14,
    marginRight: 6,
  },

  /* Location and Filter Section */
  locationSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    marginRight: 12,
  },
  locationInfoText: {
    color: '#54F895', // React Native doesn't support CSS variables
    fontFamily: 'Pretendard Variable',
    fontSize: 24,
    fontStyle: 'normal',
    lineHeight: 33.6, // 140% of 24px
    letterSpacing: -0.48,
  },

  /* Filter Dropdown */
  modalBackDrop: {
  flex: 1,
  justifyContent: 'flex-start',
  alignItems: 'flex-end',           // right-align menu
  paddingTop: 180,                  // distance from top of screen to button
  paddingRight: 25,                 // align with button’s right edge
},

  filterDropdownContainer: {
    position: 'relative',
    zIndex: 999, // Same high z-index
  },
  filterDropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: 10,
    minWidth: 26,
    zIndex: 999, // Same high z-index

  },
  filterDropdownText: {
    alignItems: 'center',
    color: '#D9D9D9',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 6,
  },
  dropdownMenu: {
    alignItems: 'center', // Center horizontally
    backgroundColor: '#adadb2',
    borderRadius: 10,
    borderTopRightRadius: 0, // Only top-right corner rounded
    borderColor: '#3C3C3E',
    minWidth: 80,
    zIndex: 10000,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#3C3C3E',
  },
  dropdownItemText: {
    color: '#000',
    fontSize: 14,
  },
  dropdownItemTextActive: {
    color: '#fff',
  },
  
  /* empty */
  emptyWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyTxt: { color: '#8E8E93', fontSize: 16 },
});