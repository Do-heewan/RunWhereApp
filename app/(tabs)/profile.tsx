// import React from 'react';
// import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// const menuItems = [
//   { label: '프로필', key: 'profile' },
//   { label: '러닝템', key: 'runwear' },
//   { label: '기록공유', key: 'record' },
//   { label: '번개런', key: 'flashrun' },
//   { label: '로그아웃', key: 'logout' },
// ];

// export default function ProfileMenu() {

  

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar barStyle="light-content" />
//       <ScrollView contentContainerStyle={styles.scrollViewContent}>
//         <View style={styles.header}>
//           <TouchableOpacity style={styles.chatButton}>
//             <Ionicons name="chatbubble-outline" size={24} color="#FFF" />
//             <View style={styles.chatBadge}>
//               <Text style={styles.chatBadgeText}>12</Text>
//             </View>
//           </TouchableOpacity>
//         </View>

//       {/* Profile Block */}
//       <View style={styles.profileBlock}>
//         <TouchableOpacity style={styles.menuButton}>
//           <Text style={styles.menuButtonText}>프로필</Text>
//         </TouchableOpacity>
//       </View>

//           <Text style={styles.username}>기록갱신러</Text>
//           <View style={styles.locationContainer}>
//             <Ionicons name="location-sharp" size={16} color="#A0A0A0" />
//             <Text style={styles.locationText}>울산시 울주군</Text>
//           </View>

//           <View style={styles.followStatsContainer}>
//             <View style={styles.followStat}>
//               <Text style={styles.followLabel}>팔로우</Text>
//               <Text style={styles.followValue}>28</Text>
//             </View>
//             <View style={styles.followStat}>
//               <Text style={styles.followLabel}>팔로잉</Text>
//               <Text style={styles.followValue}>14</Text>
//             </View>
//           </View>

//       {/* Post Menu Items */}
//       <View style={styles.menuRow}>
//         <TouchableOpacity style={styles.menuButton}>
//           <Text style={styles.menuButtonText}>러닝템</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.menuButton}>
//           <Text style={styles.menuButtonText}>기록공유</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.menuButton}>
//           <Text style={styles.menuButtonText}>번개런</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Logout */}
//       <View style={styles.logoutBlock}>
//         <TouchableOpacity style={styles.menuButton}>
//           <Text style={styles.menuButtonText}>로그아웃</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#1C1C1E', // Main background color
//   },
//   scrollViewContent: {
//     paddingBottom: 40,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     paddingHorizontal: 20,
//     paddingTop: 10,
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   chatButton: {
//     position: 'relative',
//   },
//   chatBadge: {
//     position: 'absolute',
//     top: -4,
//     right: -8,
//     backgroundColor: '#FF453A', // Red badge color
//     borderRadius: 8,
//     paddingHorizontal: 5,
//     paddingVertical: 1,
//     borderWidth: 1,
//     borderColor: '#1C1C1E',
//   },
//   chatBadgeText: {
//     color: '#FFF',
//     fontSize: 11,
//     fontWeight: 'bold',
//   },
//   profileCard: {
//     backgroundColor: '#2C2C2E', // Card background color
//     marginHorizontal: 16,
//     borderRadius: 20,
//     padding: 20,
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   profileImageContainer: {
//     position: 'relative',
//     marginBottom: 15,
//   },
//   profileImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     borderWidth: 2,
//     borderColor: '#3A3A3C',
//   },
//   editButton: {
//     position: 'absolute',
//     bottom: -5,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     borderRadius: 15,
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//   },
//   editButtonText: {
//     color: '#FFF',
//     fontSize: 12,
//   },
//   username: {
//     color: '#FFF',
//     fontSize: 24,
//     fontWeight: 'bold',
//   },
//   locationContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   locationText: {
//     color: '#A0A0A0',
//     fontSize: 14,
//     marginLeft: 5,
//   },
//   followStatsContainer: {
//     flexDirection: 'row',
//     marginTop: 20,
//   },
//   followStat: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginHorizontal: 15,
//   },
//   followLabel: {
//     color: '#A0A0A0',
//     fontSize: 14,
//     marginRight: 8,
//   },
//   followValue: {
//     color: '#FFF',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   statsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     width: '100%',
//     marginTop: 25,
//     paddingTop: 25,
//     borderTopWidth: 1,
//     borderTopColor: '#3A3A3C',
//   },
//   statItem: {
//     alignItems: 'center',
//   },
//   statValue: {
//     color: '#34D399', // Bright green color
//     fontSize: 28,
//     fontWeight: 'bold',
//   },
//   statUnit: {
//     color: '#34D399',
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginLeft: 2,
//     alignSelf: 'flex-end',
//     bottom: 4,
//   },
//   statLabel: {
//     color: '#A0A0A0',
//     fontSize: 12,
//     marginTop: 6,
//   },
//   section: {
//     marginTop: 30,
//     paddingHorizontal: 20,
//   },
//   sectionTitle: {
//     color: '#E5E5EA',
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 15,
//   },
//   activityButtonsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   activityButton: {
//     backgroundColor: '#34D399',
//     paddingVertical: 15,
//     borderRadius: 12,
//     alignItems: 'center',
//     flex: 1,
//     marginHorizontal: 5,
//   },
//   activityButtonText: {
//     color: '#000',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   awardCard: {
//     backgroundColor: '#2C2C2E',
//     borderRadius: 12,
//     padding: 15,
//   },
//   awardText: {
//     color: '#E5E5EA',
//     fontSize: 14,
//   },
// });

// export default ProfileScreen;
