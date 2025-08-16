import { Platform, StyleSheet } from "react-native";

const FONT = 'Pretendard';
const TRACK_PCT = 100;
const letter = (fontSize: number, pct = TRACK_PCT) =>
  Platform.OS === 'android' ? +(pct / 100).toFixed(3) : +((pct / 100) * fontSize).toFixed(2);

const lh = (fontSize: number, ratio: number) => Math.round(fontSize * ratio);

const styles = StyleSheet.create({
    base: {
      fontFamily: FONT,
      // 공통 자간은 각 variant에서 폰트 크기별로 계산
    },
  
    // Headings
    h1: { fontSize: 32, lineHeight: lh(32, 1.4), letterSpacing: letter(32) },
    h2: { fontSize: 24, lineHeight: lh(24, 1.4), letterSpacing: letter(24) },
  
    // Subtitle
    sub1: { fontSize: 18, lineHeight: lh(18, 1.5), letterSpacing: letter(18) },
  
    // Body
    body1: { fontSize: 16, lineHeight: lh(16, 1.4), letterSpacing: letter(16) },
    body2: { fontSize: 16, lineHeight: lh(16, 1.4), letterSpacing: letter(16) },
    body3: { fontSize: 14, lineHeight: lh(14, 1.4), letterSpacing: letter(14) },
  
    // Buttons
    button1: { fontSize: 16, lineHeight: lh(16, 1.4), letterSpacing: letter(16) },
    button2: { fontSize: 12, lineHeight: lh(12, 1.4), letterSpacing: letter(12) },
  
    // Link (색만 다르게, 나머진 body2 규격)
    link: {
      fontSize: 16,
      lineHeight: lh(16, 1.4),
      letterSpacing: letter(16),
      color: '#0a7ea4',
    },
  });