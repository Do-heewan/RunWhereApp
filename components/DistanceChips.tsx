// DistanceChips.tsx
import { Colors } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from './ThemedText';

type Item = { id: string; label: string; value: [number, number] };

const DATA: Item[] = [
  { id: '1-5',   label: '1~5km',   value: [1, 5] },
  { id: '5-10',  label: '5~10km',  value: [5, 10] },
  { id: '10-20', label: '10~20km', value: [10, 20] },
  { id: '20-30', label: '20~30km', value: [20, 30] },
  { id: '30+',   label: '30km+',   value: [30, 99] },
];

const ITEM_W = 122;  // 버튼 가로폭(고정이면 getItemLayout 가능)
const GAP = 15;      // 아이템 간격

export default function DistanceChips({
  onChange,
  initialId,
}: {
  onChange?: (item: Item) => void;
  initialId?: string;
}) {
  const [selectedId, setSelectedId] = useState(initialId || '');
  const listRef = useRef<FlatList<Item>>(null);

  const handlePress = (item: Item, index: number) => {
    setSelectedId(item.id);
    onChange?.(item);
    // 가운데로 스크롤(고정폭이니 안전)
    listRef.current?.scrollToIndex({ index, viewPosition: 0.5, animated: true });
  };

  return (
    <FlatList
      ref={listRef}
      horizontal
      data={DATA}
      keyExtractor={(it) => it.id}
      contentContainerStyle={styles.container}
      showsHorizontalScrollIndicator={false}
      ItemSeparatorComponent={() => <View style={{ width: GAP }} />}
      getItemLayout={(_, index) => ({
        length: ITEM_W + GAP,
        offset: (ITEM_W + GAP) * index,
        index,
      })}
      style={{flexGrow:0}}
      renderItem={({ item, index }) => {
        const selected = item.id === selectedId;
        return (
          <Pressable
            onPress={() => handlePress(item, index)}
            android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
            style={({ pressed }) => [
              styles.pill,
              pressed && { opacity: 0.92 },
            ]}
            accessibilityRole="button"
            accessibilityState={{ selected }}
          >
            {selected ? (
              <LinearGradient
                colors={['#54F895', '#2AFBEA']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientBackground}
              >
                <ThemedText type="sub1" style={{color: Colors.blackGray}}>{item.label}</ThemedText>
              </LinearGradient>
            ) : (
              <ThemedText type="sub1" style={{color: Colors.blackGray}}>{item.label}</ThemedText>
            )}
          </Pressable>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  pill: {
    borderRadius: 20,
    width: 122,
    height: 72,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  gradientBackground: {
    borderRadius: 20,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
