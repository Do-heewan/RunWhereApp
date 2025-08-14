import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Image, ScrollView, StyleSheet,
  Text, TouchableOpacity, View,
} from 'react-native';
import { LikeIcon, LikeIconActive, StarIcon, StarIconActive } from '../../components/IconSVG';
import { SafeAreaView } from 'react-native-safe-area-context';
import Eclipse from '../../components/EclipseSVG';

// Sample data for runwear posts
type RunwearPost = {
  id: number;
  user: {
    name: string;
    avatar: string;
    location: string;
  };
  images: { uri: string }[];
  likes: number;
  rating: number;
  description: string;
  timeAgo: string;
};

const runwearPosts: RunwearPost[] = [
  {
    id: 1,
    user: {
      name: '러닝하는실버',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      location: '울산시 울주군',
    },
    images: [
      { uri: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop' },
    ],
    likes: 48,
    rating: 4,
    description: '이 러닝화 정말 좋아요!',
    timeAgo: '5시간 전',
  },
  {
    id: 2,
    user: {
      name: '러닝하는실버',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      location: '울산시 울주군',
    },
    images: [
      { uri: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=600&fit=crop' },
    ],
    likes: 32,
    rating: 5,
    description: '새로 산 러닝화 후기입니다',
    timeAgo: '1일 전',
  },
];

export default function RunwearPage() {
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());

  const toggleLike = (postId: number) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const renderStars = (rating: number) => (
    <View style={styles.starsContainer}>
      {Array.from({ length: 5 }).map((_, index) => (
        <View key={index} style={styles.starWrapper}>
          {index < rating ? (
            <StarIconActive width={20} height={20} />
          ) : (
            <StarIcon width={20} height={20} color="#ADADB2" />
          )}
        </View>
      ))}
    </View>
  );

  const renderPost = (post: RunwearPost) => {
    const isLiked = likedPosts.has(post.id);

    return (
      <View key={post.id} style={styles.postContainer}>
        {/* User Header */}
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

        {/* Post Image */}
        <View style={styles.imageContainer}>
          <Image source={post.images[0]} style={styles.postImage} />
          
          {/* Like button overlay */}
          <View style={styles.likeOverlay}>
            <TouchableOpacity 
              style={styles.likeButton}
              onPress={() => toggleLike(post.id)}
            >
              <Text style={[styles.likeCount, { color: isLiked ? '#54F895' : '#D9D9D9' }]}>
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

        {/* Rating */}
        <View style={styles.ratingSection}>
          {renderStars(post.rating)}
        </View>

        {/* Description */}
        <Text style={styles.description}>{post.description}</Text>
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
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>러닝템</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Posts List */}
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {runwearPosts.map(post => renderPost(post))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15151C',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
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
    borderBottomColor: '#2C2C2E',
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
  userDetails: {
    flex: 1,
  },
  userName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userLocation: {
    color: '#8E8E93',
    fontSize: 12,
    marginLeft: 4,
  },
  timeAgo: {
    color: '#8E8E93',
    fontSize: 12,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
  },
  postImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#E5E5E5',
  },
  likeOverlay: {
    position: 'absolute',
    bottom: 12,
    right: 12,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(21, 21, 28, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  likeCount: {
    fontSize: 14,
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
    color: '#fff',
    fontSize: 16,
    lineHeight: 22,
  },
});
