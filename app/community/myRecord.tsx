import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../../backend/db/firebase';
import Eclipse from '../../components/EclipseSVG'; //background Image
import { LikeIcon, LikeIconActive } from '../../components/IconSVG';
import { ThemedText } from '../../components/ThemedText';
import { Colors } from '../../constants/Colors';

type ShareRecordPost = {
  id: number;
  user?: {
    uid: string;
    name: string;
    avatar: string;
  };
  image: { uri: string };
  likes: number;
  description?: string;
  timeAgo?: string;
};

// Function to update likes in Firestore
async function updateRecordLikes(id: number, newLikes: number) {
  const docRef = doc(db, 'sharedRecord', id.toString());
  await updateDoc(docRef, { likes: newLikes });
}

export default function ShareRecordPage() {
  const { recordId } = useLocalSearchParams();
  const [shareRecordPosts, setShareRecordPosts] = useState<ShareRecordPost[]>([]);
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());

  useEffect(() => {
    let unsubscribeSnapshot: (() => void) | null = null;
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setShareRecordPosts([]);
        return;
      }

      const q = query(collection(db, 'sharedRecord'), orderBy('id', 'desc'));
      unsubscribeSnapshot = onSnapshot(q, snapshot => {
        const items = snapshot.docs
          .map(d => {
            const data = d.data() as any;
            return {
              ...data,
              docId: d.id,
              id: typeof data.id === 'number' ? data.id : (data.id ? Number(data.id) : undefined),
              likes: typeof data.likes === 'number' ? data.likes : 0,
            };
          })
          .filter(item => {
            const ownerId = item.user?.uid || item.userId || item.uid || item.ownerId || null;
            return ownerId === user.uid;
          }) as ShareRecordPost[];

        setShareRecordPosts(items);
      }, err => {
        console.warn('sharedRecord 구독 실패', err);
      });
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
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
      await updateRecordLikes(post.id, newLikes);
    }
  };

  const renderPost = (post: ShareRecordPost) => {
  const p: any = post;

  const isLiked = likedPosts.has(p.id);

  return (
    <View key={p.id} style={styles.postContainer}>
      {/* User header */}
      <View style={styles.userHeader}>
        <View style={styles.userInfo}>
          {p.user?.avatar ? (
            <Image
              source={{ uri: p.user.avatar }}
              style={styles.userAvatar}
            />
          ) : (
            <View style={styles.noUser}>
              <ThemedText type="body2" style={styles.avatarInitial}>
                {p.user?.name?.charAt(0).toUpperCase() || '철'}
              </ThemedText>
            </View>
          )}
          <View style={styles.userDetails}>
            <ThemedText type="sub1" style={styles.userName}>
              {p.user?.name || '기록왕철수'}
            </ThemedText>
            {/* <View style={styles.locationRow}>
              <Ionicons name="location" size={12} color={Colors.gray2} />
              <ThemedText type="body3" style={styles.userLocation}>
                {p.user?.location || '서울특별시 성동구'}
              </ThemedText>
            </View> */}
          </View>
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => router.push({
            pathname: '/community/editRecord',
            params: {
              id: p.id.toString(),
              description: p.description || '',
              imageUri: p.image.uri,
            }
          })}
        >
      <Text style={styles.editButtonText}>편집하기</Text>
        </TouchableOpacity>
      </View>
      {/* Main image */}
      <View style={styles.imageContainer}>
        <Image source={p.image} style={styles.postImage} />

        {/* Like overlay */}
        <View style={styles.likeOverlay}>
          <TouchableOpacity
            style={styles.likeButton}
            onPress={() => toggleLike(p.id)}
          >
            <ThemedText type="body3" style={[
              styles.likeCount,
              { color: isLiked ? Colors.primary : Colors.gray4 }
            ]}>
              {/* Fix for NaN - ensure it's always a valid number */}
              {p.likes && typeof p.likes === 'number' ? p.likes : 0}
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
        {p.review || '새벽 10 km 기록! 기분 최고🔥'}
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
        <ThemedText type="h1" style={styles.headerTitle}>마이 기록공유</ThemedText>
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
