import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Image, SafeAreaView, ScrollView, StyleSheet,
  Text, TouchableOpacity, View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';


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
   image: { uri: string }; }

type FlashRunEvent = {
  id: number;
  title: string;
  time: string;
  location: string;
  description: string;      // NEW
  hashtags: string[];       // NEW
  participants: number;
  maxParticipants: number;
  organizer: {
    name: string;
    avatar: string;
  };
  status: 'upcoming' | 'full' | 'completed';
};

const runwearData: SneakerItem[] = [
  {
      id: 1,
      image: { uri: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/68e8fafa-5575-4c2d-9806-3c4ace2debe3/air-max-270-mens-shoes-KkLcGR.png' },
      likes: 15,
      rating: 4,
      backgroundColor: '#2C2C2E',
    },
    {
      id: 2,
      image: { uri: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/e777c881-5b62-4250-92a6-362967f54cca/air-force-1-07-mens-shoes-jBrhbr.png' },
      likes: 15,
      rating: 3,
      backgroundColor: '#E5E5EA',
    },
    {
      id: 3,
      image: { uri: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/b1bcbca4-e853-4df7-b329-5be3c61ee057/dunk-low-mens-shoes-DDDR8X.png' },
      likes: 7,
      rating: 5,
      backgroundColor: '#FFB3BA',
    },
    {
      id: 4,
      image: { uri: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/59c9d62b-2490-46ac-b0c1-691a8e0b8b27/air-jordan-1-low-mens-shoes-459b4T.png' },
      likes: 15,
      rating: 2,
      backgroundColor: '#FF8C42',
    },
    {
      id: 5,
      image: { uri: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/350e7f3a-979a-402b-9396-a8a998dd76ab/react-infinity-run-flyknit-3-mens-road-running-shoes-XhzpPH.png' },
      likes: 9,
      rating: 4,
      backgroundColor: '#9AFF9A',
    },
    {
      id: 6,
      image: { uri: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/9a8efb03-8eeb-4cb1-88b3-4292f4c8b255/zoom-freak-4-basketball-shoes-PJ6tM8.png' },
      likes: 8,
      rating: 3,
      backgroundColor: '#87CEEB',
    },
];

const flashRunData: FlashRunEvent[] = [
  {
    id: 1,
    title: '중산신 즐거운',
    time: '오늘 19:00',
    location: '한양대역 앞',
    description: '유니스트 앞에서 7시에 가볍게 뛸 사람 구합니다~',   // NEW
    hashtags: ['#친친런', '#가벼운런', '#런친이', '#번개런'],        // NEW
    participants: 3,
    maxParticipants: 5,
    organizer: {
      name: '러닝러버',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    },
    status: 'upcoming',
  },
  {
  id: 2,
  title: '한강 야경 러닝',
  time: '오늘 20:30',
  location: '뚝섬유원지역 3번 출구',
  description: '야경 보면서 천천히 5km 러닝할 분들 모여요!',
  hashtags: ['#야경런', '#힐링러닝', '#한강뷰', '#느긋하게'],
  participants: 4,
  maxParticipants: 8,
  organizer: {
    name: '야경러너',
    avatar: 'https://images.unsplash.com/photo-1502767089025-6572583495b4?w=100&h=100&fit=crop&crop=face',
  },
  status: 'upcoming',
},
{
  id: 3,
  title: '아침 러닝 번개',
  time: '내일 06:30',
  location: '서울숲 입구',
  description: '출근 전에 상쾌하게 뛰고 싶은 분들 함께해요!',
  hashtags: ['#모닝런', '#상쾌한하루', '#출근전운동', '#서울숲'],
  participants: 2,
  maxParticipants: 6,
  organizer: {
    name: '모닝러버',
    avatar: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=100&h=100&fit=crop&crop=face',
  },
  status: 'full',
}
];

/* 12 sample gallery photos */
const recordShareData: ShareRecord[] = [
  { id: 1,  image: { uri: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=400&fit=crop' } },
  { id: 2,  image: { uri: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop' } },
  { id: 3,  image: { uri: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=400&h=400&fit=crop' } },
  { id: 4,  image: { uri: 'https://images.unsplash.com/photo-1506629905607-45fa052d9597?w=400&h=400&fit=crop' } },
  { id: 5,  image: { uri: 'https://images.unsplash.com/photo-1485727749690-d091e8284ef3?w=400&h=400&fit=crop' } },
  { id: 6,  image: { uri: 'https://images.unsplash.com/photo-1594736797933-d0c4a154e47f?w=400&h=400&fit=crop' } },
  { id: 7,  image: { uri: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400&h=400&fit=crop' } },
  { id: 8,  image: { uri: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=400&fit=crop' } },
  { id: 9,  image: { uri: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop' } },
  { id: 10, image: { uri: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop' } },
  { id: 11, image: { uri: 'https://images.unsplash.com/photo-1448387473223-5c37445527e7?w=400&h=400&fit=crop' } },
  { id: 12, image: { uri: 'https://images.unsplash.com/photo-1594736797933-d0c4a154e47f?w=400&h=400&fit=crop' } },
];

/* ---------- TABS ---------- */
const TABS = ['Runwear', '기록공유', '번개런'] as const;
type TabKey = (typeof TABS)[number];

/* ---------- COMPONENT ---------- */
export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('Runwear');

  /* give each tab its dataset */
  const dataByTab: Record<TabKey, any[]> = {
    Runwear: runwearData,
    기록공유: recordShareData,
    번개런: flashRunData,
  };

  /* floating-button colour per tab */

  const fabColour: Record<TabKey, string> = {
    Runwear: '#54f895',
    기록공유: '#adadb2',
    번개런: '#5E5E5E',
  };

  /* --------------- RENDER HELPERS --------------- */
  const renderStars = (rating: number) =>
    Array.from({ length: 5 }).map((_, i) => (
      <Ionicons
        key={i}
        name="star"
        size={14}
        color={i < rating ? '#54f895' : '#3C3C43'}
        style={{ marginHorizontal: 1 }}
      />
    ));

  /* shoe-card for Runwear / 번개런 */
  const renderSneakerCard = (item: SneakerItem) => (
    <TouchableOpacity key={item.id} style={styles.card}>
      <View style={[styles.cardInner, { backgroundColor: item.backgroundColor }]}>
        <Image source={item.image} style={styles.shoeImg} resizeMode="contain" />
        <View style={styles.likeBox}>
          <Ionicons name="heart" size={14} color="#54f895" />
          <Text style={styles.likeTxt}>{item.likes}</Text>
        </View>
      </View>
      <View style={styles.starRow}>{renderStars(item.rating)}</View>
    </TouchableOpacity>
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

    {/* join-button (unchanged) */}
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
      <Image source={item.image} style={styles.galleryImg} />
    </TouchableOpacity>
  );

  /* pick correct renderer */
  const renderItem = (item: any) => {
    if (activeTab === '기록공유') return renderGalleryTile(item);
    if (activeTab === '번개런') return renderFlashRunCard(item);
    return renderSneakerCard(item);
  };

  /* --------------- UI --------------- */
  return (
    <SafeAreaView style={styles.container}>
      {/* Only show floating button for Runwear and 기록공유 tabs */}
      {(
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: fabColour[activeTab] }]}
          onPress={() => router.push('/runwearWrite')}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      )}

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
          {dataByTab[activeTab].map(renderItem)}
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
  container: { flex: 1, backgroundColor: '#1C1C1E' },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 15 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 20 },

  /* fab */
  fab: {
    position: 'absolute', bottom: 30, right: 30, zIndex: 20,
    borderRadius: 28, width: 56, height: 56,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3, shadowRadius: 4, elevation: 6,
  },

  /* tabs */
  tabBar: { flexDirection: 'row', backgroundColor: '#2C2C2E', borderRadius: 25, padding: 4 },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 20 },
  tabActive: { backgroundColor: '#54f895' },
  tabTxt: { color: '#8E8E93', fontSize: 16 },
  tabTxtActive: { color: '#000', fontWeight: '600', fontSize: 16 },

  /* card list (Runwear ) */
  scrollArea: { flex: 1 },
  cardGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', padding: 20 },
  card: { width: '48%', marginBottom: 20 },
  cardInner: { borderRadius: 20, padding: 15, height: 160, justifyContent: 'center', alignItems: 'center' },
  shoeImg: { width: 100, height: 80 },
  likeBox: {
    position: 'absolute', top: 15, right: 15, flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 15, paddingHorizontal: 6, paddingVertical: 3,
    alignItems: 'center',
  },
  likeTxt: { color: '#fff', fontSize: 12, marginLeft: 3, fontWeight: '600' },
  starRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 8 },

  /* gallery (기록공유) */
  galleryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', padding: 4 },
  galleryTile: { width: '32%', aspectRatio: 1, marginBottom: 4, borderRadius: 8, overflow: 'hidden' },
  galleryImg: { width: '100%', height: '100%' },

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
