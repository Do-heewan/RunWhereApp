import React from 'react';
import { Polyline } from 'react-native-maps';

interface GradientPolylineProps {
  coordinates: Array<{
    latitude: number;
    longitude: number;
  }>;
  strokeWidth?: number;
  colors?: string[];
}

export default function GradientPolyline({ 
  coordinates, 
  strokeWidth = 5, 
  colors = ['#54F895', '#2AFBEA'] 
}: GradientPolylineProps) {
  // 그라데이션 폴리라인을 구현하기 위해 여러 개의 폴리라인을 겹쳐서 사용
  const segments = [];
  for (let i = 0; i < coordinates.length - 1; i++) {
    segments.push({
      start: coordinates[i],
      end: coordinates[i + 1],
      progress: i / (coordinates.length - 2), // 0~1 사이의 진행률
    });
  }

  return (
    <>
      {segments.map((segment, index) => {
        const segmentColors = [
          `rgba(84, 248, 149, ${0.3 + segment.progress * 0.7})`, // 시작 색상
          `rgba(42, 251, 234, ${0.3 + segment.progress * 0.7})`, // 끝 색상
        ];

        return (
          <Polyline
            key={index}
            coordinates={[segment.start, segment.end]}
            strokeColor={segmentColors[0]}
            strokeWidth={strokeWidth}
            lineDashPattern={[1]}
            zIndex={1000 + index} // 겹침 순서
          />
        );
      })}
      
      {/* 메인 폴리라인 (그라데이션 효과를 위한 베이스) */}
      <Polyline
        coordinates={coordinates}
        strokeColor={colors[0]}
        strokeWidth={strokeWidth}
        lineDashPattern={[1]}
        zIndex={999}
      />
    </>
  );
}
