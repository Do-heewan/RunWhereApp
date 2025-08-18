import React from 'react';
import { View } from 'react-native';
import Svg, { Defs, Ellipse, FeBlend, FeColorMatrix, FeComposite, FeFlood, FeGaussianBlur, FeOffset, Filter, Path, Text as SvgText } from 'react-native-svg';

interface CustomMarkerProps {
  color?: string;
  size?: number;
  label?: string;
  labelColor?: string;
  labelFontSize?: number;
}

export default function CustomMarker({ color = "#15151C", size = 36, label, labelColor = "#FFFFFF", labelFontSize = 10 }: CustomMarkerProps) {
  return (
    <View style={{ alignItems: 'center' }}>
        
      {/* 그림자 (Ellipse 33) */}
      <Svg width={30} height={12} viewBox="0 0 30 12" style={{ position: 'absolute', bottom: -8, zIndex: 1 }}>
        <Defs>
          <Filter id="filter0_i_624_2802" x="0" y="0" width="30" height="16" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <FeFlood floodOpacity="0" result="BackgroundImageFix"/>
            <FeBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            <FeColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <FeOffset dy="4"/>
            <FeGaussianBlur stdDeviation="2"/>
            <FeComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
            <FeColorMatrix type="matrix" values="0 0 0 0 0.32549 0 0 0 0 0.976471 0 0 0 0 0.596078 0 0 0 0.3 0"/>
            <FeBlend mode="normal" in2="shape" result="effect1_innerShadow_624_2802"/>
          </Filter>
        </Defs>
        <Ellipse cx="15" cy="6" rx="15" ry="6" fill="#303034" filter="url(#filter0_i_624_2802)"/>
      </Svg>
      
      {/* 마커 (Union) */}
      <Svg width={size} height={49} viewBox="0 0 36 49" style={{ zIndex: 2 }}>
        <Defs>
          <Filter id="filter0_ii_624_2803" x="0" y="-4.00024" width="36" height="56.6025" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <FeFlood floodOpacity="0" result="BackgroundImageFix"/>
            <FeBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            <FeColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <FeOffset dy="4"/>
            <FeGaussianBlur stdDeviation="2"/>
            <FeComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
            <FeColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.719727 0 0 0 0 0.359863 0 0 0 0.59 0"/>
            <FeBlend mode="normal" in2="shape" result="effect1_innerShadow_624_2803"/>
            <FeColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <FeOffset dy="-5"/>
            <FeGaussianBlur stdDeviation="2"/>
            <FeComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
            <FeColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.330704 0 0 0 0 0.601281 0 0 0 0.25 0"/>
            <FeBlend mode="normal" in2="effect1_innerShadow_624_2803" result="effect2_innerShadow_624_2803"/>
          </Filter>
        </Defs>
        <Path 
          d="M15.6406 46.9333C4.35035 32.2352 0.580237 25.4298 2.67314e-06 18.0251L0.00586209 17.5818C0.0603476 15.3659 0.522186 13.1778 1.37012 11.1277C2.2747 8.94068 3.60101 6.95291 5.27246 5.27905C6.94377 3.60542 8.92774 2.27765 11.1113 1.37182C13.2952 0.465937 15.6362 -0.000245921 18 -0.000245714C20.3638 -0.000245508 22.7048 0.465937 24.8887 1.37183C27.0723 2.27765 29.0562 3.60543 30.7275 5.27905C32.399 6.95291 33.7253 8.94068 34.6299 11.1277C35.5343 13.3145 36 15.6582 36 18.0251C35.4091 25.5664 31.5094 32.486 19.7267 47.7548C18.857 48.8818 17.1526 48.8859 16.281 47.7603L15.6406 46.9333Z" 
          fill={color}
          filter="url(#filter0_ii_624_2803)"
        />
        {label ? (
          <SvgText
            x={18}
            y={22}
            fontSize={labelFontSize}
            fill={labelColor}
            fontWeight="600"
            textAnchor="middle"
          >
            {label}
          </SvgText>
        ) : null}
      </Svg>
    </View>
  );
}
