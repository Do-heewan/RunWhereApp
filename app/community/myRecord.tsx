import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { collection, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import CustomAlert from '@/components/CustomAlert';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../../backend/db/firebase';
import Eclipse from '../../components/EclipseSVG';
import { LikeIcon, LikeIconActive } from '../../components/IconSVG';

type ShareRecordPost = {
  id: number;
  docId: string; 
  user?: {
    name: string;
    avatar: string;
    location: string;
  };
  image: { uri: string };
  likes: number;
  description?: string;
  timeAgo?: string;
};

// Function to update likes in Firestore
async function updateRecordLikes(docId: string, newLikes: number) {
  const docRef = doc(db, 'sharedRecord', docId);
  await updateDoc(docRef, { likes: newLikes });
}

export default function ShareRecordPage() {
  const { recordId } = useLocalSearchParams();
  const [shareRecordPosts, setShareRecordPosts] = useState<ShareRecordPost[]>([]);
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());

useEffect(() => {
  const unsubscribe = onSnapshot(
    query(collection(db, 'sharedRecord'), orderBy('id', 'desc')),
    snapshot => setShareRecordPosts(
      snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          docId: doc.id, // ← Store Firestore doc ID
          likes: typeof data.likes === 'number' ? data.likes : 0,
        } as ShareRecordPost;
      })
    )
  );
  return unsubscribe;
}, []);

  const toggleLike = async (postId: number) => {
    const isCurrentlyLiked = likedPosts.has(postId);
    const newLikedPosts = new Set(likedPosts);

    if (isCurrentlyLiked) {
      newLikedPosts.delete(postId);
    } else {
      newLikedPosts.add(postId);
    }

    setLikedPosts(newLikedPosts);

    const likeDelta = isCurrentlyLiked ? -1 : 1;
    let newLikes = 0;

    setShareRecordPosts(prev =>
      prev.map(item => {
        if (item.id === postId) {
          newLikes = item.likes + likeDelta;
          return { ...item, likes: newLikes };
        }
        return item;
      })
    );

    // ✅ Find the post by ID to get docId
    const post = shareRecordPosts.find(item => item.id === postId);
    if (post) {
      await updateRecordLikes(post.docId, newLikes);
    }
  };
  const renderPost = (post: ShareRecordPost) => {
  const isLiked = likedPosts.has(post.id);
  return (
    <View key={post.id} style={styles.postContainer}>
      {/* User header */}
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
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => router.push({
            pathname: '/community/editRecord',
            params: {
              id: post.id.toString(),
              description: post.description || '',
              imageUri: post.image.uri,
            }
          })}
        >
      <Text style={styles.editButtonText}>편집하기</Text>
        </TouchableOpacity>
      </View>
      {/* Main image */}
      <View style={styles.imageContainer}>
        <Image source={post.image} style={styles.postImage} />

        {/* Like overlay */}
        <View style={styles.likeOverlay}>
          <TouchableOpacity
            style={styles.likeButton}
            onPress={() => toggleLike(post.id)}
          >
            <ThemedText type="body3" style={[
              styles.likeCount,
              { color: isLiked ? Colors.primary : Colors.gray4 }
            ]}>
              {/* Fix for NaN - ensure it's always a valid number */}
              {post.likes && typeof post.likes === 'number' ? post.likes : 0}
            </ThemedText>
            {isLiked ? (
              <LikeIconActive width={18} height={17} />
            ) : (
              <LikeIcon width={18} height={17} color={Colors.gray4} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Description */}
      <ThemedText type="body2" style={styles.description}>
        {post.description || '새벽 10 km 기록! 기분 최고🔥'}
      </ThemedText>
    </View>
  );
  };


  return (
    <SafeAreaView style={styles.container}>
      <Eclipse />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <ThemedText type="h1" style={styles.headerTitle}>기록공유</ThemedText>
        <View style={styles.headerRight} />
      </View>

      {/* Post list */}
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {shareRecordPosts.map(renderPost)}
      </ScrollView>
    </SafeAreaView>
  );
}

// Updated styles using Colors
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
    marginLeft:4,
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

    editButton: {
    position: 'absolute',
    right: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: Colors.gray1, 
    borderRadius: 10,
  },

  editButtonText: {
    color: Colors.gray3,
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
  description: {
    color: Colors.white,
    fontSize: 16,
    lineHeight: 22,
  },
});
