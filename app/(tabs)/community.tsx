import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
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
import { db, auth } from '../../backend/db/firebase'; // Added auth import
import Eclipse from '../../components/EclipseSVG';
import { FlashIcon, LikeIcon, LikeIconActive, StarIcon, StarIconActive } from '../../components/IconSVG';
import { ThemedText } from '@/components/ThemedText';
import { styles } from '@/styles/community.styles';

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
    id: string;
  }[];
  startHour: number;
  startMinute: number;
  targetMinute: number;
  targetSecond: number;
  status: 'upcoming' | 'full' | 'past';
  messages: string[];
};

const TABS = ['러닝템', '기록공유', '번개런'] as const;
type TabKey = (typeof TABS)[number];

type FilterType = '최신순' | '임박순' | '페이스순';

type PaceInfo = {
  label: string;
  color: string;
};

// 좋아요 수 업데이트 함수
async function updateSneakerLikes(itemId: number, newLikes: number) {
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

/* ---------- COMPONENT ---------- */
export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('러닝템');
  const [selectedLocation, setSelectedLocation] = useState('위치 감지 중...');
  const [likedItems, setLikedItems] = useState<Set<number>>(new Set());
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('최신순');
  const [userPaceMin, setUserPaceMin] = useState<number | null>(null);
  const [userPaceSec, setUserPaceSec] = useState<number | null>(null);
  const [runwearList, setRunwearList] = useState<SneakerItem[]>([]);
  const [sharedRecordList, setSharedRecordList] = useState<ShareRecord[]>([]);
  const [flashRunList, setFlashRunList] = useState<FlashRunEvent[]>([]);

  // Get current location
  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('권한 필요', '위치 권한이 필요합니다.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      let addresses = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (addresses.length > 0) {
        const address = addresses[0];
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
  };

  const getSortedFlashRunData = () => {
    const data = [...flashRunList];

    switch (selectedFilter) {
      case '최신순':
        return data.sort((a, b) => b.id - a.id);

      case '임박순':
        return data.sort((a, b) => a.time.localeCompare(b.time));

      case '페이스순': {
        if (userPaceMin === null || userPaceSec === null) {
          return data;
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

  // Data by tab
  const dataByTab: Record<TabKey, any[]> = {
    러닝템: runwearList,
    기록공유: sharedRecordList,
    번개런: getSortedFlashRunData(),
  };

  // Firebase listeners
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'runwearItem'), orderBy('id', 'desc')),
      snapshot => setRunwearList(snapshot.docs.map(doc => doc.data() as SneakerItem))
    );
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'sharedRecord'), orderBy('id', 'desc')),
      snapshot => setSharedRecordList(snapshot.docs.map(doc => doc.data() as ShareRecord))
    );
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'flashRun'), orderBy('id', 'desc')),
      snapshot => setFlashRunList(snapshot.docs.map(doc => doc.data() as FlashRunEvent))
    );
    return unsubscribe;
  }, []);

  // Get current location on component mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

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

    updateSneakerLikes(itemId, newLikes);
  };

  /* shoe-card for Runwear with staggered layout */
  const renderSneakerCard = (item: SneakerItem, index: number) => {
    const isLiked = likedItems.has(item.id);
    
    return (
      <TouchableOpacity 
        onPress={() => router.push('/community/runwear')}
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
                  {item.likes}
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

        {/* join-button */}
        <View>
          <TouchableOpacity
            disabled={disabled}
            activeOpacity={disabled ? 1 : 0.8}
            onPress={async () => {
              if (disabled) return;
              
              // 1. 채팅방 존재 여부 확인
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
                  : `참가하기 (${item.participants}/${item.maxParticipants})`
                }
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  /* pure-image tile for 기록공유 */
  const renderGalleryTile = (item: ShareRecord) => (
    <TouchableOpacity 
      onPress={() => router.push('/community/record')}
      key={item.id} 
      style={styles.galleryTile}
    >
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
}
