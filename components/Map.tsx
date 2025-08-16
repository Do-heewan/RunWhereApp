import React from 'react';
import MapView, { Marker, Polyline } from 'react-native-maps';

interface MapProps {
  style?: any;
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  children?: React.ReactNode;
}

export default function Map({ style, initialRegion, children }: MapProps) {
  return (
    <MapView style={style} initialRegion={initialRegion}>
      {children}
    </MapView>
  );
}

export function MapMarker(props: any) {
  return <Marker {...props} />;
}

export function MapPolyline(props: any) {
  return <Polyline {...props} />;
}