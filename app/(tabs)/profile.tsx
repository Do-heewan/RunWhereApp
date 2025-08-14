import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'stats' | 'achievements' | 'history'>('stats');

  const StatCard = ({ value, label, color = '#F97316' }: any) => (
    <View style={styles.statCard}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const TabButton = ({ title, isActive, onPress }: any) => (
    <TouchableOpacity
      style={[styles.tabButton, isActive && styles.activeTab]}
      onPress={onPress}
    >
      <Text style={[styles.tabText, isActive && styles.activeTabText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const WeeklyStatItem = ({ icon, value, label, iconColor }: any) => (
    <View style={styles.weeklyStatItem}>
      <View style={styles.weeklyStatIcon}>
        <Ionicons name={icon} size={24} color={iconColor} />
      </View>
      <View style={styles.weeklyStatContent}>
        <Text style={styles.weeklyStatValue}>{value}</Text>
        <Text style={styles.weeklyStatLabel}>{label}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with Profile */}
      <View style={styles.profileHeader}>
        <View style={styles.profileInfo}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg' }}
            style={styles.profileImage}
          />
          <View style={styles.profileText}>
            <Text style={styles.profileName}>Sarah Kim</Text>
            <Text style={styles.profileSubtitle}>Running Enthusiast</Text>
            <View style={styles.locationContainer}>
              <Ionicons name="location-outline" size={14} color="#6B7280" />
              <Text style={styles.locationText}>Seoul, Korea</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <StatCard value="156" label="Total Runs" />
        <StatCard value="842km" label="Distance" />
        <StatCard value="5:42" label="Avg Pace" />
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TabButton
          title="Stats"
          isActive={activeTab === 'stats'}
          onPress={() => setActiveTab('stats')}
        />
        <TabButton
          title="Achievements"
          isActive={activeTab === 'achievements'}
          onPress={() => setActiveTab('achievements')}
        />
        <TabButton
          title="History"
          isActive={activeTab === 'history'}
          onPress={() => setActiveTab('history')}
        />
      </View>

      {/* Content based on active tab */}
      {activeTab === 'stats' && (
        <View style={styles.contentContainer}>
          {/* This Week */}
          <View style={styles.weeklyCard}>
            <Text style={styles.weeklyTitle}>This Week</Text>
            <View style={styles.weeklyStats}>
              <WeeklyStatItem
                icon="radio-button-on"
                value="3"
                label="Runs"
                iconColor="#F97316"
              />
              <WeeklyStatItem
                icon="calendar-outline"
                value="16.1km"
                label="Distance"
                iconColor="#3B82F6"
              />
            </View>
          </View>

          {/* Monthly Goal */}
          <View style={styles.goalCard}>
            <Text style={styles.goalTitle}>Monthly Goal</Text>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '68%' }]} />
              </View>
              <Text style={styles.progressText}>68km of 100km</Text>
            </View>
          </View>
        </View>
      )}

      {activeTab === 'achievements' && (
        <View style={styles.contentContainer}>
          <View style={styles.emptyState}>
            <Ionicons name="trophy-outline" size={48} color="#D1D5DB" />
            <Text style={styles.emptyStateText}>No achievements yet</Text>
            <Text style={styles.emptyStateSubtext}>Keep running to unlock achievements!</Text>
          </View>
        </View>
      )}

      {activeTab === 'history' && (
        <View style={styles.contentContainer}>
          <View style={styles.emptyState}>
            <Ionicons name="time-outline" size={48} color="#D1D5DB" />
            <Text style={styles.emptyStateText}>No history yet</Text>
            <Text style={styles.emptyStateSubtext}>Start tracking your runs to see history</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15151c',
  },
  profileHeader: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 20,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  profileText: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  profileSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  settingsButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: 'white',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: '#F97316',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: 'white',
  },
  contentContainer: {
    padding: 16,
  },
  weeklyCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  weeklyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  weeklyStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  weeklyStatItem: {
    alignItems: 'center',
  },
  weeklyStatIcon: {
    marginBottom: 8,
  },
  weeklyStatContent: {
    alignItems: 'center',
  },
  weeklyStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  weeklyStatLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  goalCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#F97316',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});

export default profile;
