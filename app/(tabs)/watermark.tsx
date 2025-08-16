import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import ViewShot from 'react-native-view-shot';

const { width } = Dimensions.get('window');

// Types
interface RunningData {
  name: string;
  pace: string;
  distance: string;
  time: string;
  date: string;
  user?: string;
}

interface RunningTemplate {
  id: string;
  name: string;
  style: {
    textColor: string;
    fontSize: number;
    fontWeight: 'normal' | 'bold';
    opacity: number;
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
  };
  layout: 'corner' | 'center' | 'bottom';
}

interface BackgroundImage {
  id: string;
  name: string;
  source: { uri: string };
}

// Data
const runningTemplates: RunningTemplate[] = [
  {
    id: 'athletic',
    name: 'Athletic',
    style: {
      textColor: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
      opacity: 0.9,
      shadowColor: '#000000',
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.8,
    },
    layout: 'corner',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    style: {
      textColor: '#FFFFFF',
      fontSize: 14,
      fontWeight: 'normal',
      opacity: 0.8,
      shadowColor: '#000000',
      shadowOffset: { width: 1, height: 1 },
      shadowOpacity: 0.6,
    },
    layout: 'bottom',
  },
  {
    id: 'bold',
    name: 'Bold',
    style: {
      textColor: '#FFFFFF',
      fontSize: 20,
      fontWeight: 'bold',
      opacity: 1.0,
      shadowColor: '#000000',
      shadowOffset: { width: 3, height: 3 },
      shadowOpacity: 1.0,
    },
    layout: 'center',
  },
];

// Main Component
const RunningTemplateApp: React.FC = () => {
  const [backgroundImages, setBackgroundImages] = useState<BackgroundImage[]>([
    {
      id: '1',
      name: 'Mountain',
      source: { uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400' },
    },
    {
      id: '2',
      name: 'Ocean',
      source: { uri: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400' },
    },
    {
      id: '3',
      name: 'Forest',
      source: { uri: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400' },
    },
    {
      id: '4',
      name: 'City',
      source: { uri: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400' },
    },
    {
      id: '5',
      name: 'Sunset',
      source: { uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400' },
    },
  ]);
  const [selectedBackground, setSelectedBackground] = useState('1');
  const [selectedTemplate, setSelectedTemplate] = useState('athletic');
  const [activeTab, setActiveTab] = useState<'background' | 'template'>('background');
  const [runningData, setRunningData] = useState<RunningData>({
    name: 'Evening Run',
    pace: '5:02/km',
    distance: '6.8 km',
    time: '00:55:41',
    date: '2025-08-17 20:10',
    user: '한승리',
  });

  const viewShotRef = useRef<ViewShot>(null);

  const updateField = (field: keyof RunningData, value: string) => {
    setRunningData({ ...runningData, [field]: value });
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const getCurrentBackground = () => {
    return backgroundImages.find(bg => bg.id === selectedBackground);
  };

  const getCurrentTemplate = () => {
    return runningTemplates.find(template => template.id === selectedTemplate);
  };

  const renderRunningInfo = () => {
    const template = getCurrentTemplate();
    if (!template) return null;

    const textStyle = {
      color: template.style.textColor,
      fontSize: template.style.fontSize,
      fontWeight: template.style.fontWeight,
      opacity: template.style.opacity,
      textShadowColor: template.style.shadowColor,
      textShadowOffset: template.style.shadowOffset,
      textShadowRadius: template.style.shadowOpacity * 5,
      marginBottom: 4,
    };

    const getPositionStyle = () => {
      switch (template.layout) {
        case 'corner':
          return { position: 'absolute' as const, top: 30, left: 20 };
        case 'center':
          return {
            position: 'absolute' as const,
            top: '50%',
            left: '50%',
            transform: [{ translateX: -100 }, { translateY: -60 }],
          };
        case 'bottom':
          return { position: 'absolute' as const, bottom: 30, left: 20 };
        default:
          return { position: 'absolute' as const, top: 30, left: 20 };
      }
    };

    return (
      <View style={[styles.runningInfoOverlay, getPositionStyle()]}>
        <Text style={textStyle}>🏃‍♂️ {runningData.name}</Text>
        <Text style={textStyle}>페이스: {runningData.pace}</Text>
        <Text style={textStyle}>거리: {runningData.distance}</Text>
        <Text style={textStyle}>시간: {runningData.time}</Text>
        <Text style={textStyle}>날짜: {runningData.date}</Text>
        {runningData.user && <Text style={textStyle}>우저: {runningData.user}</Text>}
      </View>
    );
  };

  // Image picker function
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const pickedImage = result.assets[0].uri;
      const customImageId = 'custom-' + Date.now();
      const newCustomImage = {
        id: customImageId,
        name: '사용자 이미지',
        source: { uri: pickedImage },
      };

      setBackgroundImages(prev => [...prev, newCustomImage]);
      setSelectedBackground(customImageId);
    }
  };

  const handleShare = async () => {
    const ref = viewShotRef.current;
    if (!ref || typeof ref.capture !== 'function') {
      console.warn('ViewShot ref or capture method is not available');
      return;
    }

    try {
      const uri = await ref.capture();
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === 'granted') {
        await MediaLibrary.saveToLibraryAsync(uri);
        Alert.alert('Success', '✅ 이미지가 갤러리에 저장되었습니다!');
      } else {
        Alert.alert('Permission Denied', '❌ 갤러리 저장 권한이 필요합니다.');
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error', '이미지 저장에 실패했습니다: ' + error.message);
      } else {
        Alert.alert('Error', '알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  const backgroundSource = getCurrentBackground()?.source;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>운동 기록 공유</Text>
        {/* Save Button in Header */}
        <TouchableOpacity style={styles.headerShareButton} onPress={handleShare}>
          <Text style={styles.headerShareButtonText}>저장</Text>
        </TouchableOpacity>
      </View>

      {/* Preview with ViewShot */}
      <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1.0 }} style={styles.previewContainer}>
        <ImageBackground
          source={backgroundSource}
          style={styles.previewImage}
          imageStyle={styles.backgroundImage}
        >
          {renderRunningInfo()}
        </ImageBackground>
      </ViewShot>

      {/* Tabs for Background and Template */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'background' && styles.activeTabButton]}
          onPress={() => setActiveTab('background')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'background' && styles.activeTabButtonText]}>
            배경 선택
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'template' && styles.activeTabButton]}
          onPress={() => setActiveTab('template')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'template' && styles.activeTabButtonText]}>
            템플릿 선택
          </Text>
        </TouchableOpacity>
      </View>

      {/* Controls */}
      <ScrollView style={styles.controlsContainer} showsVerticalScrollIndicator={false}>
        {activeTab === 'background' ? (
          <View style={styles.sectionContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              {/* Custom Image Picker Button */}
              <TouchableOpacity style={styles.backgroundItem} onPress={pickImage}>
                <View style={[styles.thumbnail, styles.customThumbnail]}>
                  <Text style={styles.pickText}>+ 내 이미지</Text>
                </View>
                <Text style={styles.backgroundName}>사진 선택</Text>
              </TouchableOpacity>

              {/* Predefined Background Images */}
              {backgroundImages.map(bg => (
                <TouchableOpacity
                  key={bg.id}
                  style={[
                    styles.backgroundItem,
                    selectedBackground === bg.id && styles.selectedBackground,
                  ]}
                  onPress={() => setSelectedBackground(bg.id)}
                >
                  <ImageBackground source={bg.source} style={styles.thumbnail}>
                    <View style={styles.thumbnailOverlay} />
                  </ImageBackground>
                  <Text style={styles.backgroundName}>{bg.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ) : (
          <View style={styles.sectionContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              {runningTemplates.map(template => (
                <TouchableOpacity
                  key={template.id}
                  style={[
                    styles.templateItem,
                    selectedTemplate === template.id && styles.selectedTemplate,
                  ]}
                  onPress={() => setSelectedTemplate(template.id)}
                >
                  <View style={styles.templatePreview}>
                    <Text
                      style={[
                        styles.previewText,
                        {
                          color: template.style.textColor,
                          fontSize: 12,
                          fontWeight: template.style.fontWeight,
                        },
                      ]}
                    >
                      Sample
                    </Text>
                  </View>
                  <Text style={styles.templateName}>{template.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Running Data Input */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>운동 기록 입력</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>제목:</Text>
            <TextInput
              style={styles.input}
              value={runningData.name}
              onChangeText={value => updateField('name', value)}
              placeholder="운동 이름"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>페이스:</Text>
            <TextInput
              style={styles.input}
              value={runningData.pace}
              onChangeText={value => updateField('pace', value)}
              placeholder="5:02/km"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>거리:</Text>
            <TextInput
              style={styles.input}
              value={runningData.distance}
              onChangeText={value => updateField('distance', value)}
              placeholder="6.8 km"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>시간:</Text>
            <TextInput
              style={styles.input}
              value={runningData.time}
              onChangeText={value => updateField('time', value)}
              placeholder="00:55:41"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>날짜:</Text>
            <View style={styles.dateRow}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                value={runningData.date}
                onChangeText={value => updateField('date', value)}
                placeholder="2025-08-17 20:10"
                placeholderTextColor="#999"
              />
              <TouchableOpacity
                style={styles.nowButton}
                onPress={() => updateField('date', getCurrentDateTime())}
              >
                <Text style={styles.nowButtonText}>지금</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>낙네임:</Text>
            <TextInput
              style={styles.input}
              value={runningData.user || ''}
              onChangeText={value => updateField('user', value)}
              placeholder="닉네임"
              placeholderTextColor="#999"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  backButton: {},
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  headerShareButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  headerShareButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  previewContainer: {
    height: 280,
    margin: 20,
    borderRadius: 15,
    overflow: 'hidden',
  },
  previewImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    borderRadius: 15,
  },
  runningInfoOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 15,
    borderRadius: 10,
    minWidth: 180,
  },
  // Tab Styles
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTabButton: {
    backgroundColor: '#007AFF',
  },
  tabButtonText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  controlsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionContainer: {
    marginBottom: 25,
  },
  horizontalScroll: {
    paddingVertical: 10,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  backgroundItem: {
    marginRight: 15,
    alignItems: 'center',
    borderRadius: 8,
    padding: 8,
  },
  selectedBackground: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginBottom: 5,
    overflow: 'hidden',
  },
  customThumbnail: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
  },
  pickText: {
    color: '#007AFF',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  thumbnailOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  backgroundName: {
    color: '#FFFFFF',
    fontSize: 12,
    textAlign: 'center',
  },
  templateItem: {
    marginRight: 15,
    alignItems: 'center',
    borderRadius: 8,
    padding: 8,
  },
  selectedTemplate: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  templatePreview: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  previewText: {
    fontSize: 10,
  },
  templateName: {
    color: '#FFFFFF',
    fontSize: 12,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nowButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 10,
  },
  nowButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default RunningTemplateApp;
