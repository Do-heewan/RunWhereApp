import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Image, ScrollView, StyleSheet,
  TouchableOpacity, View,
} from 'react-native';
import { LikeIcon, LikeIconActive, StarIcon, StarIconActive } from '../../components/IconSVG';
import { SafeAreaView } from 'react-native-safe-area-context';
import Eclipse from '../../components/EclipseSVG';
import { Colors } from '@/constants/Colors';
import { ThemedText } from '@/components/ThemedText';
import { collection, onSnapshot, orderBy, query, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../../backend/db/firebase';

// Updated type to match database structure
type SneakerItem = {
  id: number;
  image: { uri: string };
  likes: number;
  rating: number;
  backgroundColor: string;
  user?: {
    name: string;
    avatar: string;
    location: string;
  };
  description?: string;
  timeAgo?: string;
};

async function updateSneakerLikes(itemId: number, newLikes: number) {
  const q = query(collection(db, 'runwearItem'), orderBy('id', 'desc'));
  const snapshot = await getDocs(q);
  const docRef = snapshot.docs.find(doc => doc.data().id === itemId)?.ref;
  if (docRef) {
    await updateDoc(docRef, { likes: newLikes });
  }
}

export default function RunwearPage() {
  const [sneakerPosts, setSneakerPosts] = useState<SneakerItem[]>([]);
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'runwearItem'), orderBy('id', 'desc')),
      snapshot =>
        setSneakerPosts(snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            ...data,
            likes: typeof data.likes === 'number' ? data.likes : 0,
          } as SneakerItem;
        }))
    );
    return unsubscribe;
  }, []);


  const toggleLike = async (postId: number) => {
    // Calculate like action BEFORE updating likedPosts
    const isCurrentlyLiked = likedPosts.has(postId);
    const likeDelta = isCurrentlyLiked ? -1 : 1;

    // Update the local like state
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (isCurrentlyLiked) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });

    // Update local SneakerPosts state with new like count
    setSneakerPosts(prev =>
      prev.map(item =>
        item.id === postId
          ? { ...item, likes: (typeof item.likes === 'number' ? item.likes : 0) + likeDelta }
          : item
      )
    );

    // Find the item in current state
    const item = sneakerPosts.find(it => it.id === postId);
    // If found, update Firestore with the new value
    if (item) {
      const newLikes = (typeof item.likes === 'number' ? item.likes : 0) + likeDelta;
      await updateSneakerLikes(postId, newLikes);
    }
  };


  const renderStars = (rating: number) => (
    <View style={styles.starsContainer}>
      {Array.from({ length: 5 }).map((_, index) => (
        <View key={index} style={styles.starWrapper}>
          {index < rating ? (
            <StarIconActive width={20} height={20} />
          ) : (
            <StarIcon width={20} height={20} color={Colors.gray3} />
          )}
        </View>
      ))}
    </View>
  );

  const renderPost = (post: SneakerItem) => {
    const isLiked = likedPosts.has(post.id);

    return (
      <View key={post.id} style={styles.postContainer}>
        {/* User Header - Use default values if no user data */}
        <View style={styles.userHeader}>
          <View style={styles.userInfo}>
            {post.user?.avatar ? (
              <Image
                source={{ uri: post.user.avatar }}
                style={styles.userAvatar}
              />
            ) : (
              <View style={styles.noUser}>
                <ThemedText type="body2" style={styles.avatarInitial}>
                  {post.user?.name?.charAt(0).toUpperCase() || '철'}
                </ThemedText>
              </View>
            )}
            <View style={styles.userDetails}>
              <ThemedText type="sub1" style={styles.userName}>
                {post.user?.name || '기록왕철수'}
              </ThemedText>
              <View style={styles.locationRow}>
                <Ionicons name="location" size={12} color={Colors.gray2} />
                <ThemedText type="body3" style={styles.userLocation}>
                  {post.user?.location || '서울특별시 성동구'}
                </ThemedText>
              </View>
            </View>
          </View>
          <ThemedText type="body3" style={styles.timeLabel}>
            {post.timeAgo || '방금 전'}
          </ThemedText>
        </View>

        {/* Post Image */}
        <View style={styles.imageContainer}>
          <Image source={post.image} style={styles.postImage} />

          {/* Like button overlay */}
          <View style={styles.likeOverlay}>
            <TouchableOpacity 
              style={styles.likeButton}
              onPress={() => toggleLike(post.id)}
            >
              <ThemedText type="body3" style={[
                styles.likeCount, 
                { color: isLiked ? Colors.primary : Colors.gray4 }
              ]}>
                {typeof post.likes === 'number' ? post.likes.toString() : '0'}
              </ThemedText>
              {isLiked ? (
                <LikeIconActive width={18} height={17} />
              ) : (
                <LikeIcon width={18} height={17} color={Colors.gray4} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Rating */}
        <View style={styles.ratingSection}>
          {renderStars(post.rating)}
        </View>

        {/* Description */}
        <ThemedText type="body2" style={styles.description}>
          {post.description || '이 러닝화 정말 좋아요!'}
        </ThemedText>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Eclipse />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <ThemedText type="h1" style={styles.headerTitle}>러닝템</ThemedText>
        <View style={styles.headerRight} />
      </View>
      {/* Posts List */}
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {sneakerPosts.map(post => renderPost(post))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.blackGray,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray1,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
    height: 40,
  },
  scrollContainer: {
    flex: 1,
  },
  postContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray1,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
    noUser: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: Colors.gray2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userLocation: {
    color: Colors.gray2,
    fontSize: 12,
    marginLeft: 4,
  },
    timeLabel: {
    position: 'absolute',
    right: 10,          // Position near the right edge
    paddingHorizontal: 8,
    paddingVertical: 4,
    color: Colors.gray2,
    fontSize: 12,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },
  postImage: {
    width: '100%',
    height: 300,
    backgroundColor: Colors.gray4,
  },
  likeOverlay: {
    position: 'absolute',
    bottom: 12,
    right: 12,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(21, 21, 28, 0.50)', 
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  likeCount: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 6,
  },
  ratingSection: {
    marginBottom: 10,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starWrapper: {
    marginRight: 8,
  },
  description: {
    color: Colors.white,
    fontSize: 16,
    lineHeight: 22,
  },
});
