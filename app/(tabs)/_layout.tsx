import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#54f895',
        tabBarInactiveTintColor: 'white',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1C1C1E',
          borderTopWidth: 3,
          borderTopColor: '#2C2C2E', // optional: subtle border color
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
        },
      }}
    >
      {/* HOME TAB */}
      <Tabs.Screen
        name="home"
        options={{
          title: '',
          tabBarIcon: ({ size, focused }) =>
            focused ? (
              <View
                style={{
                  width: 38,
                  height: 30,
                  borderRadius: 30,
                  backgroundColor: '#7c7c7c',
                  justifyContent: 'center',
                  alignItems: 'center',
                  shadowColor: '#54f895',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.8,
                  shadowRadius: 10,
                }}
              >
                <Ionicons name="walk" size={size || 28} color="#54f895" />
              </View>
            ) : (
              <Ionicons name="walk-outline" size={size || 28} color="white" />
            ),
        }}
      />

      {/* COMMUNITY TAB */}
      <Tabs.Screen
        name="community"
        options={{
          title: '',
          tabBarIcon: ({ size, focused }) =>
            focused ? (
              <View
                style={{
                  width: 38,
                  height: 30,
                  borderRadius: 30,
                  backgroundColor: '#7c7c7c',
                  justifyContent: 'center',
                  alignItems: 'center',
                  shadowColor: '#54f895',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.8,
                  shadowRadius: 10,
                }}
              >
                <Ionicons name="people" size={size || 24} color="#54f895" />
              </View>
            ) : (
              <Ionicons name="people-outline" size={size || 24} color="white" />
            ),
        }}
      />

      {/* WATERMARK TAB */}
      <Tabs.Screen
        name="watermark"
        options={{
          title: '',
          tabBarIcon: ({ focused }) =>
            focused ? (
              <View
                style={{
                  width: 38,
                  height: 30,
                  borderRadius: 30,
                  backgroundColor: '#7c7c7c',
                  justifyContent: 'center',
                  alignItems: 'center',
                  shadowColor: '#54f895',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.8,
                  shadowRadius: 10,
                }}
              >
                <View style={{ position: 'relative' }}>
                  <Ionicons name="image" size={24} color="#54f895" />
                  <Ionicons
                    name="add-circle"
                    size={15}
                    color="#white"
                    style={{ position: 'absolute', top: -2, right: -2 }}
                  />
                </View>
              </View>
            ) : (
              <View style={{ position: 'relative' }}>
                <Ionicons name="image-outline" size={24} color="white" />
                <Ionicons
                  name="add-circle"
                  size={16}
                  color="#1C1C1E"
                  style={{ position: 'absolute', top: -2, right: -2 }}
                />
                <Ionicons
                  name="add"
                  size={10}
                  color="white"
                  style={{ position: 'absolute', top: 1, right: 1}}
                />
              </View>
            ),
          tabBarLabelStyle: { display: 'none' },
        }}
      />

      {/* PROFILE TAB */}
      <Tabs.Screen
        name="profile"
        options={{
          title: '',
          tabBarIcon: ({ size, focused }) =>
            focused ? (
              <View
                                style={{
                  width: 38,
                  height: 30,
                  borderRadius: 30,
                  backgroundColor: '#7c7c7c',
                  justifyContent: 'center',
                  alignItems: 'center',
                  shadowColor: '#54f895',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.8,
                  shadowRadius: 10,
                }}
              >
                <Ionicons name="person-circle" size={size || 30} color="#54f895" />
              </View>
            ) : (
              <Ionicons name="person-circle-outline" size={size || 30} color="white" />
            ),
        }}
      />
    </Tabs>
  );
}