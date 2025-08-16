import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const menuItems = [
  { label: '프로필', key: 'profile' },
  { label: '러닝템', key: 'runwear' },
  { label: '기록공유', key: 'record' },
  { label: '번개런', key: 'flashrun' },
  { label: '로그아웃', key: 'logout' },
];

export default function ProfileMenu() {
  return (
    <View style={styles.root}>
      {/* Top Right "현재채팅중인" */}
      <View style={styles.topRow}>
        <View style={styles.spacer} />
        <View style={styles.chatActiveBox}>
          <Text style={styles.chatActiveText}>현재채팅중인</Text>
        </View>
      </View>

      {/* Profile Block */}
      <View style={styles.profileBlock}>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuButtonText}>프로필</Text>
        </TouchableOpacity>
      </View>

      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>내가 올린 게시물</Text>
      </View>

      {/* Post Menu Items */}
      <View style={styles.menuRow}>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuButtonText}>러닝템</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuButtonText}>기록공유</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuButtonText}>번개런</Text>
        </TouchableOpacity>
      </View>

      {/* Logout */}
      <View style={styles.logoutBlock}>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuButtonText}>로그아웃</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#15151c',
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 24,
  },
  spacer: {
    flex: 1,
  },
  chatActiveBox: {
    backgroundColor: '#36363C',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  chatActiveText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  profileBlock: {
    alignItems: 'center',
    marginBottom: 48,
  },
  menuButton: {
    backgroundColor: '#36363C',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 12,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionHeader: {
    marginBottom: 24,
    marginLeft: 8,
  },
  sectionHeaderText: {
    color: '#E5E7EB',
    fontSize: 14,
    fontWeight: '600',
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 48,
  },
  logoutBlock: {
    alignItems: 'center',
    marginTop: 44,
  },
});
