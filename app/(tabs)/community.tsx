import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Image, SafeAreaView, ScrollView, StyleSheet,
  Text, TouchableOpacity, View,
} from 'react-native';
import { LikeIcon, LikeIconActive, StarIcon, StarIconActive } from '../../components/IconSVG';

import { collection, getDocs, orderBy, query, updateDoc } from 'firebase/firestore';
import { db } from '../../backend/db/firebase';

/* ---------- DATA ---------- */

type SneakerItem = {
  id: number;
  review: string;
  likes: number;
  rating: number;
  backgroundColor: string;
  image: { uri: string };
  createdAt: Date;
};

type ShareRecord = {
  id: number;
  image: { uri: string };
  createdAt: Date;
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
    avatar: string;
  };
  status: 'upcoming' | 'full' | 'completed';
};

/* ---------- TABS ---------- */
const TABS = ['런웨어', '기록공유', '번개런'] as const;
type TabKey = (typeof TABS)[number];

/* ---------- COMPONENT ---------- */
export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('런웨어');
  const [selectedLocation, setSelectedLocation] = useState('울산시 울주군');
  const [likedItems, setLikedItems] = useState<Set<number>>(new Set());

  const [runwearList, setRunwearList] = useState<any[]>([]);
  const [sharedRecordList, setSharedRecordList] = useState<any[]>([]);
  const [flashRunList, setFlashRunList] = useState<any[]>([]);

  // Firestore에서 runwear 데이터 불러오기
  useEffect(() => {
    async function fetchRunwear() {
      const q = query(collection(db, 'runwearItem'), orderBy('id', 'desc'));
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map(doc => doc.data());
      setRunwearList(items);
    }
    fetchRunwear();
  }, []);

  // Firestore에서 sharedRecord 데이터 불러오기
  useEffect(() => {
    async function fetchRecordShare() {
      const q = query(collection(db, 'sharedRecord'), orderBy('id', 'desc'));
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map(doc => doc.data());
      setSharedRecordList(items);
    }
    fetchRecordShare();
  }, []);

  // Firestore에서 flashRun 데이터 불러오기
  useEffect(() => {
    async function fetchFlashRun() {
      const q = query(collection(db, 'flashRun'), orderBy('id', 'desc'));
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map(doc => doc.data());
      setFlashRunList(items);
    }
    fetchFlashRun();
  }, []);

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

  /* give each tab its dataset */
  const dataByTab: Record<TabKey, any[]> = {
    런웨어: runwearList,
    기록공유: sharedRecordList,
    번개런: flashRunList,
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
    setLikedItems(prev => {
      const newSet = new Set(prev);
      const item = runwearList.find(item => item.id === itemId);

      if (!item) return prev;

      let newLikes = item.likes;
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
        newLikes--;
      } else {
        newSet.add(itemId);
        newLikes++;
      }
      updateSneakerLikes(itemId, newLikes);
      return newSet;
    });
  };

  /* shoe-card for Runwear with staggered layout */
  const renderSneakerCard = (item: SneakerItem, index: number) => {
    const isLiked = likedItems.has(item.id);
    
    return (
      <TouchableOpacity 
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
                {isLiked ? item.likes + 1 : item.likes}
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

  /* Location and Filter Section for Flash Run */
  const LocationAndFilterSection = () => (
    <View style={styles.locationFilterContainer}>
      <View style={styles.locationSection}>
        <TouchableOpacity style={styles.locationButton}>
          <Ionicons name="location" size={16} color="#54f895" />
          <Text style={styles.locationButtonText}>{selectedLocation}</Text>
          <Ionicons name="chevron-down" size={16} color="#54f895" />
        </TouchableOpacity>
      </View>
    </View>
  );

  // Flash run event card renderer
  const renderFlashRunCard = (item: FlashRunEvent) => (
    <TouchableOpacity key={item.id} style={styles.flashRunCard}>
      {/* header */}
      <View style={styles.flashRunHeader}>
        <View style={styles.flashRunTitleSection}>
          <Ionicons name="flash" size={20} color="#54f895" />
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
      <View style={styles.organizerSection}>
        <Image source={{ uri: item.organizer.avatar }} style={styles.organizerAvatar} />
        <View>
          <Text style={styles.organizerName}>{item.organizer.name}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color="#8E8E93" />
            <Text style={styles.locationText}>{item.location}</Text>
          </View>
        </View>
      </View>

      {/* join-button */}
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
  );

  /* pure-image tile for 기록공유 */
  const renderGalleryTile = (item: ShareRecord) => (
    <TouchableOpacity key={item.id} style={styles.galleryTile}>
      <Image source={{ uri: item.image.url }} style={styles.galleryImg} />
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
      {/* add button */}
      <TouchableOpacity
        style={styles.addbutton}
        onPress={() => router.push('/runwearWrite')}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color="#fff" />
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
        </ScrollView>
      ) : (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTxt}>아직 콘텐츠가 없습니다.</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#15151C' },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 15 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 20 },

  /* add button colour */
  addbutton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    zIndex: 20,
    width: 60,
    height: 60,
    aspectRatio: 1,
    borderRadius: 35,
    backgroundColor: 'rgba(84, 248, 149, 0.80)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.20)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 7,
    elevation: 6,
  },

  /* tabs */
  tabBar: { flexDirection: 'row', borderRadius: 25, padding: 4 },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 25 },
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
    textAlign: 'center' as const,
    fontFamily: 'Pretendard Variable',
    fontSize: 22,
    fontStyle: 'normal' as const,
    fontWeight: 600,
  },

  /* Location and Filter Section */
  locationFilterContainer: {
    marginBottom: 20,
  },
  locationSection: {
    marginBottom: 16,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  locationButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginHorizontal: 6,
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
  gap: 3, // if unsupported, use marginRight on Text
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
  galleryGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 4 },
  galleryTile: { width: '32%', aspectRatio: 1, overflow: 'hidden', margin: 2 },
  galleryImg: { 
    width: '100%', 
    height: '100%',
    borderWidth: 1,
    borderColor: '#D9D9D9', 
    backgroundColor: 'lightgray',
    borderRadius: 8,
  },

  /* Flash Run Styles */
  flashRunGrid: { padding: 20 },
  flashRunCard: {
    backgroundColor: '#2C2C2E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
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
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  flashRunTime: {
    color: '#8E8E93',
    fontSize: 12,
  },
  flashRunDescription: {
    color: '#fff',
    fontSize: 14,
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
    fontSize: 12,
    marginRight: 6,
    marginTop: 2,
  },
  
  /* empty */
  emptyWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyTxt: { color: '#8E8E93', fontSize: 16 },
});
