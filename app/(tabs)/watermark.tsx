import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

type Tab = 'options' | 'loops' | 'outAndBack';

const WIDTH = Dimensions.get('window').width;

export default function Watermark() {
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<Tab>('options');
  const [distance, setDistance] = useState<number>(5_000);
  const [constrainToMap, setConstrainToMap] = useState<boolean>(false);
  const [advanced, setAdvanced] = useState<boolean>(false);
  const [showRoutes, setShowRoutes] = useState<boolean>(false);

  const TabButton = ({ id, label }: { id: Tab; label: string }) => (
    <TouchableOpacity
      onPress={() => setActiveTab(id)}
      style={[
        styles.tabButton,
        activeTab === id && styles.tabButtonActive,
      ]}
    >
      <Text
        style={[
          styles.tabText,
          activeTab === id && styles.tabTextActive,
        ]}
      >
        {label}
      </Text>
      {id !== 'options' && (
        <View style={styles.tabBadge}>
          <Text style={styles.tabBadgeText}>10</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Map Placeholder */}
      <View style={styles.mapPlaceholder}>
        <Ionicons name="map-outline" size={48} color="#9CA3AF" />
        <Text style={styles.mapText}>Route Search Map</Text>
        <Text style={styles.mapSubtext}>Seoul • Gangnam-gu</Text>
        {showRoutes && (
          <View style={styles.routeIndicator}>
            <Ionicons name="location" size={16} color="#7C3AED" />
            <Text style={styles.routeText}>3 routes found</Text>
          </View>
        )}
      </View>

      {/* Floating FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/crew')}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>

      {/* Bottom Sheet */}
      <ScrollView style={styles.sheet} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Tabs */}
        <View style={styles.tabsRow}>
          <TabButton id="options" label="OPTIONS" />
          <TabButton id="loops" label="LOOPS" />
          <TabButton id="outAndBack" label="OUT & BACK" />
        </View>

        {/* OPTIONS tab */}
        {activeTab === 'options' && (
          <>
            <Text style={styles.helperText}>
              Longer route lengths increase search time.
            </Text>

            {/* Distance slider */}
            <Text style={styles.label}>Desired length (m)</Text>
            <View style={styles.distanceRow}>
              <Text style={styles.distanceValue}>{distance.toLocaleString()}</Text>
              <Slider
                style={{ flex: 1, marginLeft: 12 }}
                minimumValue={1_000}
                maximumValue={20_000}
                step={100}
                value={distance}
                minimumTrackTintColor="#4F46E5"
                maximumTrackTintColor="#D1D5DB"
                onValueChange={setDistance}
              />
            </View>

            {/* Toggles */}
            <View style={styles.toggleRow}>
              <Text style={styles.toggleText}>Constrain search to currently visible map</Text>
              <Switch
                value={constrainToMap}
                onValueChange={setConstrainToMap}
                trackColor={{ false: '#D1D5DB', true: '#A78BFA' }}
                thumbColor={constrainToMap ? '#7C3AED' : '#F3F4F6'}
              />
            </View>
            <View style={styles.toggleRow}>
              <Text style={styles.toggleText}>Advanced controls</Text>
              <Switch
                value={advanced}
                onValueChange={setAdvanced}
                trackColor={{ false: '#D1D5DB', true: '#A78BFA' }}
                thumbColor={advanced ? '#7C3AED' : '#F3F4F6'}
              />
            </View>

            {/* Action buttons */}
            <View style={styles.buttonsRow}>
              <TouchableOpacity
                style={styles.findButton}
                onPress={() => setShowRoutes(true)}
              >
                <Text style={styles.findButtonText}>FIND ROUTES</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowRoutes(false)}
              >
                <Text style={styles.cancelButtonText}>CANCEL</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Other tabs */}
        {activeTab !== 'options' && (
          <View style={styles.placeholder}>
            <Ionicons name="alert-circle" size={20} color="#9CA3AF" />
            <Text style={styles.placeholderText}>
              {activeTab === 'loops' ? 'Loop routes' : 'Out & back routes'} will appear here once you run a search.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  mapPlaceholder: {
    height: 280,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#D1D5DB',
  },
  mapText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6B7280',
    marginTop: 8,
  },
  mapSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  routeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
  },
  routeText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#7C3AED',
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    top: 240,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  sheet: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 16,
  },
  tabsRow: {
    flexDirection: 'row',
    marginTop: 12,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tabButton: {
    marginRight: 24,
    paddingVertical: 12,
    paddingHorizontal: 4,
    position: 'relative',
  },
  tabButtonActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#4F46E5',
  },
  tabText: { 
    fontSize: 12, 
    color: '#6B7280',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  tabTextActive: { 
    color: '#4F46E5', 
    fontWeight: '700',
  },
  tabBadge: {
    position: 'absolute',
    top: 2,
    right: -12,
    backgroundColor: '#4F46E5',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  tabBadgeText: { 
    color: 'white', 
    fontSize: 10,
    fontWeight: 'bold',
  },
  helperText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 20,
    marginTop: 16,
  },
  label: { 
    fontSize: 14, 
    fontWeight: '600', 
    marginBottom: 8,
    color: '#374151',
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  distanceValue: { 
    width: 80, 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#4F46E5',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  toggleText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    marginRight: 16,
  },
  buttonsRow: {
    flexDirection: 'row',
    marginTop: 32,
    marginBottom: 16,
  },
  findButton: {
    flex: 1,
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 12,
  },
  findButtonText: { 
    color: 'white', 
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  cancelButton: {
    width: 100,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: { 
    color: '#9CA3AF', 
    fontWeight: '600',
    fontSize: 14,
  },
  placeholder: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 20,
  },
});
