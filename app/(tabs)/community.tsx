import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient';
import { collection, doc, getDoc, getDocs, onSnapshot, orderBy, query, updateDoc, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import {
  Image,
  Text,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { db } from '../../backend/db/firebase'
import Eclipse from '../../components/EclipseSVG'
import { FlashIcon, LikeIcon, LikeIconActive, StarIcon, StarIconActive } from '../../components/IconSVG'
import GradientButton from '@/components/GradientButton'
import { ThemedText } from '@/components/ThemedText'
import { Colors } from '@/constants/Colors'

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
  id: number
  title: string
  time: string
  location: string
  description: string
  hashtags: string[]
  participants: number
  maxParticipants: number
  organizer: { name: string; avatar: string }
  startHour: number
  startMinute: number
  targetMinute: number
  targetSecond: number
  status: 'upcoming' | 'full' | 'past'
  messages: string[]
}
type FilterType = '최신순' | '임박순' | '페이스순'

const TAB_BAR_HEIGHT = 75
const TAB_BAR_BOTTOM = 10
const ADD_BUTTON_SPACING = 30
const TABS = ['러닝템', '기록공유', '번개런'] as const
type TabKey = (typeof TABS)[number]

// 좋아요 수 업데이트 함수
async function updateSneakerLikes(itemId: number, newLikes: number) {
  const q = query(collection(db, 'runwearItem'), orderBy('id', 'desc'))
  const snapshot = await getDocs(q)
  const docRef = snapshot.docs.find(doc => doc.data().id === itemId)?.ref
  if (docRef) {
    await updateDoc(docRef, { likes: newLikes })
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
/* ---------- COMPONENT ---------- */
export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('러닝템')
  const [likedItems, setLikedItems] = useState<Set<number>>(new Set())
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('최신순')
  const [userPaceMin, setUserPaceMin] = useState<number | null>(null)
  const [userPaceSec, setUserPaceSec] = useState<number | null>(null)
  const [runwearList, setRunwearList] = useState<SneakerItem[]>([])
  const [sharedRecordList, setSharedRecordList] = useState<ShareRecord[]>([])
  const [flashRunList, setFlashRunList] = useState<FlashRunEvent[]>([])

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'runwearItem'), orderBy('id', 'desc')),
      snapshot => setRunwearList(snapshot.docs.map(doc => doc.data() as SneakerItem))
    )
    return unsubscribe
  }, [])

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'sharedRecord'), orderBy('id', 'desc')),
      snapshot => setSharedRecordList(snapshot.docs.map(doc => doc.data() as ShareRecord))
    )
    return unsubscribe
  }, [])

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'flashRun'), orderBy('id', 'desc')),
      snapshot => setFlashRunList(snapshot.docs.map(doc => doc.data() as FlashRunEvent))
    )
    return unsubscribe
  }, [])

  type PaceInfo = { label: string, color: string }
  function getPaceInfo(min: number, sec: number): PaceInfo {
    const pace = Number(min) + Number(sec) / 60
    if (pace >= 3 && pace < 5) return { label: '3-4', color: Colors.primary }
    if (pace >= 5 && pace < 7) return { label: '5-6', color: Colors.gray2 }
    if (pace >= 7 && pace < 9) return { label: '7-8', color: Colors.gray3 }
    if (pace >= 9) return { label: '9이상', color: Colors.gray4 }
    return { label: '우사인볼트', color: Colors.red }
  }

  const getSortedFlashRunData = () => {
    const data = [...flashRunList]
    switch (selectedFilter) {
      case '최신순': return data.sort((a, b) => b.id - a.id)
      case '임박순': return data.sort((a, b) => a.time.localeCompare(b.time))
      case '페이스순': {
        if (userPaceMin === null || userPaceSec === null) return data
        const userPace = getPaceInfo(userPaceMin, userPaceSec).label
        return data.filter(item => getPaceInfo(item.targetMinute, item.targetSecond).label === userPace)
      }
      default: return data
    }
  }
  const dataByTab: Record<TabKey, any[]> = {
    러닝템: runwearList,
    기록공유: sharedRecordList,
    번개런: getSortedFlashRunData(),
  }

  const handleAddButtonPress = () => {
    switch (activeTab) {
      case '러닝템': router.push('/community/createRunwear'); break
      case '기록공유': router.push('/community/createRecord'); break
      case '번개런': router.push('/community/createFlashRun'); break
      default: router.push('/community/createRunwear')
    }
  }

  const renderStars = (rating: number) => (
    <View style={{ flexDirection: 'row' }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <View key={i} style={{ marginRight: i < 4 ? 10 : 0 }}>
          {i < rating
            ? <StarIconActive width={20} height={20} />
            : <StarIcon width={20} height={20} color={Colors.gray3} />}
        </View>
      ))}
    </View>
  )

  const toggleLike = (itemId: number) => {
    setRunwearList(prev =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, likes: item.likes + (likedItems.has(itemId) ? -1 : 1) }
          : item
      ),
    );
    setLikedItems(prev => {
      const set = new Set(prev)
      set.has(itemId) ? set.delete(itemId) : set.add(itemId)
      return set
    })
    const newLikes =
      runwearList.find(it => it.id === itemId)!.likes +
      (likedItems.has(itemId) ? -1 : 1)
    updateSneakerLikes(itemId, newLikes)
  }

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
    )
  }

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


  const renderFlashRunCard = (item: FlashRunEvent) => {
    const disabled = item.status === 'full';
    const { label, color } = getPaceInfo(item.targetMinute, item.targetSecond)
    return (
      <View key={item.id} style={styles.flashRunCard}>
        <View style={styles.flashRunHeader}>
          <View style={styles.flashRunTitleSection}>
            <View style={[styles.flashRunPaceContainer, { backgroundColor: color }]}>
              <ThemedText type="body3" style={styles.flashRunPaceText}>
                페이스 {label} 
              </ThemedText>
            </View>
            <ThemedText type="sub1" style={styles.flashRunTitle}>
              {item.title}
            </ThemedText>
          </View>
          <ThemedText type="body3" style={styles.flashRunTime}>
            {item.time}
          </ThemedText>
        </View>
        <ThemedText type="body2" style={styles.flashRunDescription}>
          {item.description}
        </ThemedText>
        <View style={styles.hashRow}>
          {item.hashtags.map(tag => (
            <ThemedText type="body3" key={tag} style={styles.hashTag}>
              {tag}
            </ThemedText>
          ))}
        </View>
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
    )
  }

  const renderItem = (item: any, index: number) => {
    if (activeTab === '기록공유') return renderGalleryTile(item)
    if (activeTab === '번개런') return renderFlashRunCard(item)
    return renderSneakerCard(item, index)
  }

  const LocationAndFilterSection = () => (
    <View style={styles.locationSection}>
      <View style={styles.locationInfo}>
        <FlashIcon width={34} height={34} />
        <ThemedText type="h2" style={styles.locationInfoText}>울산시 울주군</ThemedText>
      </View>
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
  )

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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.blackGray },
  header: { paddingHorizontal: 20, paddingBottom: 5 },
  title: { fontSize: 18, fontWeight: 'bold', color: Colors.white, textAlign: 'center', marginBottom: 20 },

  addbutton: {
    position: 'absolute',
    bottom: TAB_BAR_BOTTOM + TAB_BAR_HEIGHT + ADD_BUTTON_SPACING,
    right: 30,
    zIndex: 20,
    width: 60,
    height: 60,
    aspectRatio: 1,
    borderRadius: 35,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 7,
    elevation: 6,
  },
  tabBar: { flexDirection: 'row', borderRadius: 25 },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 25 },
  tabActive: { 
    backgroundColor: Colors.gray1 },
  tabTxt: { color: Colors.gray2, fontSize: 22, fontWeight: '600', textAlign: 'center' },
  tabTxtActive: { color: Colors.primary, fontSize: 22, fontWeight: '600', textAlign: 'center' },
  scrollArea: { flex: 1, paddingHorizontal: 10, paddingBottom: 20 },

  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  card: { width: '48%', marginBottom: 20 },
  cardInner: {
    borderRadius: 25,
    height: 130,
    position: 'relative',
    overflow: 'hidden', // Important: this ensures the image doesn't overflow the rounded corners
  },
  shoeImg: {
    position: 'absolute', // Ensures it fills the parent
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // Keeps aspect ratio and fills space
  },
  likeContent: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  likeBox: {
    position: 'absolute', 
    bottom: 8, 
    right: 8, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    paddingHorizontal: 10, 
    paddingVertical: 6, 
    borderRadius: 20, 
    backgroundColor: 'rgba(21, 21, 28, 0.50)', 
    minWidth: 50
  },
  
  likeTxt: { color: Colors.primary, fontSize: 16, fontWeight: '600', marginRight: 2 },
  starRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 10 },

  galleryGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 5, marginTop: 15 },
  galleryTile: { width: '32%', aspectRatio: 1, overflow: 'hidden', margin: 2 },
  galleryImg: { width: '100%', height: '100%', borderWidth: 1, borderColor: Colors.gray4, backgroundColor: Colors.gray2 },

  // FlashRun tab/grid
  flashRunGrid: { padding: 20, zIndex: 1 },

  flashRunCard: {
    backgroundColor: Colors.gray1,
    borderRadius: 25,
    padding: 16,
    marginBottom: 16,
    zIndex: 1,
    elevation: 2,
  },
  flashRunHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  flashRunTitleSection: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  flashRunTitle: { color: Colors.white, fontSize: 18, fontWeight: '600', marginLeft: 10 },
  flashRunTime: { color: Colors.gray2, fontSize: 12 },
  flashRunPaceContainer: { borderRadius: 12, paddingVertical: 6, paddingHorizontal: 10, justifyContent: 'center', alignSelf: 'flex-start', marginVertical: 4, flexShrink: 1 },
  flashRunPaceText: { color: Colors.blackGray, fontSize: 12, fontWeight: '600', textAlign: 'center' },
  flashRunDescription: { color: Colors.white, fontSize: 15, marginBottom: 16, lineHeight: 20 },
  hashRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
  hashTag: { color: Colors.primary, fontSize: 14, marginRight: 6 },

  joinButton: {
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinButtonActive: {
    color: Colors.primary,
  },
  joinButtonFull: {
   color: Colors.disableButton,
  },
  joinButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  joinButtonTextActive: { 
    color: Colors.blackGray 
  },
  joinButtonTextFull: { 
    color: Colors.gray3 
  },
  
  // Location/Filter section styles
  locationSection: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  locationInfo: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, flex: 1, marginRight: 12 },
  locationInfoText: { color: Colors.primary, fontSize: 24, fontWeight: '600' },
  filterDropdownButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, borderRadius: 10, minWidth: 26 },
  filterDropdownText: { alignItems: 'center', color: Colors.gray4, fontSize: 14, fontWeight: '500', marginRight: 6 },

  // Modal / dropdown menu styles
  modalBackDrop: { flex: 1, justifyContent: 'flex-start', alignItems: 'flex-end', paddingTop: 180, paddingRight: 25 },
  dropdownMenu: { alignItems: 'center', backgroundColor: Colors.gray3, borderRadius: 10, borderTopRightRadius: 0, borderColor: Colors.gray1, minWidth: 80, zIndex: 10000, elevation: 20 },
  dropdownItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.gray1 },
  dropdownItemText: { color: Colors.black, fontSize: 14 },

  emptyWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyTxt: { color: Colors.gray2, fontSize: 16 },

  bottomPadding: { height: 80 },
});
