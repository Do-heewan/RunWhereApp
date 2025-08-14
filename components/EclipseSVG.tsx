import React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

const Eclipse = () => {
  return (
    <Svg
      height="100%"
      width="100%"
      viewBox="0 0 207 300"
      style={StyleSheet.absoluteFill}
    >
      <Defs>
        <RadialGradient
          id="blurredGlow"
          cx="50%"
          cy="50%"
          rx="50%"
          ry="50%"
          fx="50%"
          fy="50%"
        >
          <Stop offset="0%" stopColor="#00E6B0" stopOpacity="0.1" />
          <Stop offset="100%" stopColor="#00E6B0" stopOpacity="0" />
        </RadialGradient>
      </Defs>

      {/* Simulated blurred circle */}
      <Circle
        cx="100"
        cy="1"
        r="103.5" // Half of 207px
        fill="url(#blurredGlow)"
      />
    </Svg>
  );
};

export default Eclipse;