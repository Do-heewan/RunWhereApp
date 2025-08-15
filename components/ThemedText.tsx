// ThemedText.tsx
import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { Platform, StyleSheet, Text, type TextProps } from 'react-native';

type Variant =
  | 'h1'        // 32px 140% -2%
  | 'h2'        // 24px 140% -2%
  | 'sub1'      // 18px 150% -2%
  | 'body1'     // 16px 140% -2%
  | 'body2'     // 16px 140% -2%
  | 'body3'     // 14px 140% -2%
  | 'button1'   // 16px 140% -2%
  | 'button2'   // 12px 140% -2%
  | 'link';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: Variant;               // 기본: body2
};

const FONT = 'Pretendard';
const TRACK_PCT = -2;

/** iOS: px, Android: em 단위 */
const letter = (fontSize: number, pct = TRACK_PCT) =>
  Platform.OS === 'android' ? +(pct / 100).toFixed(3) : +((pct / 100) * fontSize).toFixed(2);

const lh = (fontSize: number, ratio: number) => Math.round(fontSize * ratio);

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'body2',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      {...rest}
      style={[
        { color },
        styles.base,
        styles[type],
        style,
      ]}
    />
  );
}

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
