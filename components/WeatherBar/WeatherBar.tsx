import { Colors } from "@/constants/Colors";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { ThemedText } from "../ThemedText";
import Dust from "./Dust";
import Rain from "./Rain";

// 현재 위치 기준: 온도/강수 + PM2.5/PM10 + AQI
import * as Location from 'expo-location';

const loadKoreaNow = async (latitude: number, longitude: number) => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') throw new Error('위치 권한 거부');

    // 1) 현재 날씨/강수
    const wxUrl =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${latitude}&longitude=${longitude}` +
      `&current=temperature_2m,precipitation,weather_code` +
      `&hourly=precipitation` +
      `&timezone=Asia%2FSeoul`;
    const weather = await (await fetch(wxUrl)).json();

    // 2) 현재 대기질(미세먼지)
    const aqUrl =
      `https://air-quality-api.open-meteo.com/v1/air-quality` +
      `?latitude=${latitude}&longitude=${longitude}` +
      `&current=pm2_5,pm10,us_aqi` +
      `&timezone=Asia%2FSeoul`;
    const air = await (await fetch(aqUrl)).json();

    return { weather, air };
  } catch (error) {
    console.error('날씨 데이터 로드 실패:', error);
    return null;
  }
}

interface WeatherData {
  weather: {
    current: {
      temperature_2m: number;
      precipitation: number;
      weather_code: number;
    };
  };
  air: {
    current: {
      pm2_5: number;
      pm10: number;
      us_aqi: number;
    };
  };
}

export default function WeatherBar({latitude, longitude}: {latitude:number, longitude:number}) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        const data = await loadKoreaNow(latitude, longitude);
        if (data) {
          setWeatherData(data);
          console.log(data);
        } else {
          setError('날씨 데이터를 불러올 수 없습니다.');
        }
      } catch (err) {
        setError('날씨 데이터 로드 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [latitude, longitude]);

  if (loading) {
    return (
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 30,
        marginTop: 11,
      }}>
        <ThemedText type="body2" style={{color: Colors.gray4}}>날씨 정보 로딩 중...</ThemedText>
      </View>
    );
  }

  if (error || !weatherData) {
    return (
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 30,
        marginTop: 11,
      }}>
        <ThemedText type="body2" style={{color: Colors.gray4}}>날씨 정보를 불러올 수 없습니다</ThemedText>
      </View>
    );
  }

  return (
    <View style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 11,
        gap:30,
      }}>
        <View>
          <ThemedText type="h1" style={{color: Colors.white}}>
            {Math.round(weatherData.weather.current.temperature_2m)}°
          </ThemedText>
        </View>
        <View>
          <Rain precipitation={weatherData.weather.current.precipitation} />
        </View>
        <View>
          <Dust concentration={weatherData.air.current.pm2_5} />
        </View>
      </View>
  );
}