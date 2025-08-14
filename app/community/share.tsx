import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LikeIcon, LikeIconActive } from '../../components/IconSVG';
import { SafeAreaView } from 'react-native-safe-area-context';
import Eclipse from '../../components/EclipseSVG';

/* ---------- TYPE ---------- */
type ShareRecordPost = {
  id: number;
  user: {
    name: string;
    avatar: string;
    location: string;
  };
  images: { uri: string }[];
  likes: number;
  description: string;
  timeAgo: string;
};

/* ---------- SAMPLE DATA ---------- */
const shareRecordPosts: ShareRecordPost[] = [
  {
    id: 1,
    user: {
      name: '기록왕철수',
      avatar:
        'https://images.unsplash.com/photo-1502767089025-6572583495b4?w=100&h=100&fit=crop&crop=face',
      location: '서울특별시 성동구',
    },
    images: [
      {
        uri: 'https://images.unsplash.com/photo-1594736797933-d0c4a154e47f?w=800&h=600&fit=crop',
      },
    ],
    likes: 76,
    description: '새벽 10 km 기록! 기분 최고🔥',
    timeAgo: '3시간 전',
  },
  {
    id: 2,
    user: {
      name: '기록왕철수',
      avatar:
        'https://images.unsplash.com/photo-1502767089025-6572583495b4?w=100&h=100&fit=crop&crop=face',
      location: '서울특별시 성동구',
    },
    images: [
      {
        uri: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a8e?w=800&h=600&fit=crop',
      },
    ],
    likes: 54,
    description: '저녁 러닝 5 km🏃‍♂️',
    timeAgo: '1일 전',
  },
];

/* ---------- COMPONENT ---------- */
export default function ShareRecordPage() {
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());

  const toggleLike = (postId: number) => {
    setLikedPosts(prev => {
      const next = new Set(prev);
      next.has(postId) ? next.delete(postId) : next.add(postId);
      return next;
    });
  };

  const renderPost = (post: ShareRecordPost) => {
    const isLiked = likedPosts.has(post.id);
    return (
      <View key={post.id} style={styles.postContainer}>
        {/* user header */}
        <View style={styles.userHeader}>
          <View style={styles.userInfo}>
            <Image source={{ uri: post.user.avatar }} style={styles.userAvatar} />
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{post.user.name}</Text>
              <View style={styles.locationRow}>
                <Ionicons name="location" size={12} color="#8E8E93" />
                <Text style={styles.userLocation}>{post.user.location}</Text>
              </View>
            </View>
          </View>
          <Text style={styles.timeAgo}>{post.timeAgo}</Text>
        </View>

        {/* main image */}
        <View style={styles.imageContainer}>
          <Image source={post.images[0]} style={styles.postImage} />

          {/* like overlay */}
          <View style={styles.likeOverlay}>
            <TouchableOpacity
              style={styles.likeButton}
              onPress={() => toggleLike(post.id)}
            >
              <Text
                style={[
                  styles.likeCount,
                  { color: isLiked ? '#54F895' : '#D9D9D9' },
                ]}
              >
                {post.likes}
              </Text>
              {isLiked ? (
                <LikeIconActive width={18} height={17} />
              ) : (
                <LikeIcon width={18} height={17} color="#D9D9D9" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* description */}
        <Text style={styles.description}>{post.description}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Eclipse />

      {/* header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>기록공유</Text>
        <View style={styles.headerRight} />
      </View>

      {/* post list */}
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {shareRecordPosts.map(renderPost)}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#15151C' },

  /* header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '600' },
  headerRight: { width: 40, height: 40 },

  /* list */
  scrollContainer: { flex: 1 },
  postContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },

  /* user header */
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  userAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  userDetails: { flex: 1 },
  userName: { color: '#fff', fontSize: 16, fontWeight: '600' },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  userLocation: { color: '#8E8E93', fontSize: 12, marginLeft: 4 },
  timeAgo: { color: '#8E8E93', fontSize: 12 },

  /* image + like */
  imageContainer: {
    position: 'relative',
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
  },
  postImage: { width: '100%', height: 300, backgroundColor: '#E5E5E5' },
  likeOverlay: { position: 'absolute', bottom: 12, right: 12 },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(21, 21, 28, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  likeCount: { fontSize: 14, fontWeight: '600', marginRight: 6 },

  /* description */
  description: { color: '#fff', fontSize: 16, lineHeight: 22 },
});
