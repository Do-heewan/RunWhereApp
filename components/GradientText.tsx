import React from 'react';
import { Text, TextStyle, StyleProp } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';

interface GradientTextProps {
  text: string;
  style?: StyleProp<TextStyle>;
}

const GradientText: React.FC<GradientTextProps> = ({ text, style }) => (
  <MaskedView
    maskElement={
      <Text style={[style, { backgroundColor: 'transparent' }]}>
        {text}
      </Text>
    }
  >
    <LinearGradient
      colors={['#54f895', '#2afbea']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <Text style={[style, { opacity: 0 }]}>{text}</Text>
    </LinearGradient>
  </MaskedView>
);

export default GradientText;