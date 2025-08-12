import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const CommunityPage = () => {
  const sneakerData = [
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
      hasAddButton: true,
    },
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Ionicons
        key={index}
        name="star"
        size={16}
        color={index < rating ? '#54f895' : '#3C3C43'}
        style={{ marginHorizontal: 1 }}
      />
    ));
  };

  const renderSneakerCard = (item: {
    id: number;
    image: { uri: string };
    likes: number;
    rating: number;
    backgroundColor: string;
    hasAddButton?: boolean;
  }) => (
    <TouchableOpacity key={item.id} style={styles.card}>
      <View style={[styles.cardContainer, { backgroundColor: item.backgroundColor }]}>
        <Image source={item.image} style={styles.sneakerImage} resizeMode="contain" />
        {/* Like button */}
        <View style={styles.likeContainer}>
          <Ionicons name="heart" size={16} color="#54f895" />
          <Text style={styles.likeText}>{item.likes}</Text>
        </View>
      </View>
      {/* Star rating */}
      <View style={styles.ratingContainer}>
        {renderStars(item.rating)}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Floating Review Button */}
      <TouchableOpacity style={styles.reviewButton}>
        <LinearGradient colors={['#54f895', '#2afbea']} style={styles.reviewButtonGradient}>
          <TouchableOpacity onPress={() => router.push('/runwearWrite') }>
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </LinearGradient>
      </TouchableOpacity>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>커뮤니티</Text>
        <View style={styles.tabContainer}>
          <TouchableOpacity style={[styles.tab, styles.activeTab]}>
            <Text style={styles.activeTabText}>Runwear</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>기록공유</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>번개런</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Sneaker Grid */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {sneakerData.map((item) => renderSneakerCard(item))}
        </View>
      </ScrollView>

      {/* Bottom info */}
      <View style={styles.bottomInfo}>
        <View style={styles.likeInfo}>
          <Ionicons name="heart" size={16} color="#54f895" />
          <Text style={styles.bottomLikeText}>15</Text>
        </View>
        <Image
          source={{ uri: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/350e7f3a-979a-402b-9396-a8a998dd76ab/react-infinity-run-flyknit-3-mens-road-running-shoes-XhzpPH.png' }}
          style={styles.bottomImage}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  reviewButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    zIndex: 1000,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  reviewButtonGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#2C2C2E',
    borderRadius: 25,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#54f895',
  },
  activeTabText: {
    color: '#000000',
    fontWeight: '600',
    fontSize: 16,
  },
  tabText: {
    color: '#8E8E93',
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  card: {
    width: '48%',
    marginBottom: 20,
  },
  cardContainer: {
    borderRadius: 20,
    padding: 15,
    height: 160,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sneakerImage: {
    width: 100,
    height: 80,
  },
  likeContainer: {
    position: 'absolute',
    top: 15,
    right: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  likeText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  bottomInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#2C2C2E',
  },
  likeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomLikeText: {
    color: '#FFFFFF',
    marginLeft: 5,
    fontSize: 14,
  },
  bottomImage: {
    width: 40,
    height: 30,
    marginLeft: 15,
    borderRadius: 8,
  },
});

export default CommunityPage;
