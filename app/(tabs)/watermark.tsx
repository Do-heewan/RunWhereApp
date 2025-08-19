import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import React, { useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  DimensionValue,
  ImageBackground,
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
  ViewStyle
} from 'react-native';
import Svg, { G, Mask, Path, Rect } from 'react-native-svg';
import ViewShot from 'react-native-view-shot';
import Eclipse from '../../components/EclipseSVG';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Custom SVG Icons
const AddImageIcon = () => (
  <Svg width="40" height="41" viewBox="0 0 40 41" fill="none">
    <Mask id="mask0" maskUnits="userSpaceOnUse" x="0" y="0" width="40" height="41">
      <Rect y="0.5" width="40" height="40" fill="#D9D9D9" />
    </Mask>
    <G mask="url(#mask0)">
      <Path d="M19.9999 28.8333C19.5833 28.8333 19.2291 28.6875 18.9374 28.3958C18.6458 28.1041 18.4999 27.75 18.4999 27.3333V22H13.1666C12.75 22 12.3958 21.8541 12.1041 21.5625C11.8124 21.2708 11.6666 20.9166 11.6666 20.5C11.6666 20.0833 11.8124 19.7291 12.1041 19.4375C12.3958 19.1458 12.75 19 13.1666 19H18.4999V13.6666C18.4999 13.25 18.6458 12.8958 18.9374 12.6041C19.2291 12.3125 19.5833 12.1666 19.9999 12.1666C20.4166 12.1666 20.7708 12.3125 21.0624 12.6041C21.3541 12.8958 21.4999 13.25 21.4999 13.6666V19H26.8333C27.25 19 27.6041 19.1458 27.8958 19.4375C28.1874 19.7291 28.3333 20.0833 28.3333 20.5C28.3333 20.9166 28.1874 21.2708 27.8958 21.5625C27.6041 21.8541 27.25 22 26.8333 22H21.4999V27.3333C21.4999 27.75 21.3541 28.1041 21.0624 28.3958C20.7708 28.6875 20.4166 28.8333 19.9999 28.8333Z" fill="#007AFF" />
    </G>
  </Svg>
);

const ChevronIcon = ({ isExpanded }: { isExpanded: boolean }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d={isExpanded ? "M18 15l-6-6-6 6" : "M6 9l6 6 6-6"} stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const { width } = Dimensions.get('window');

// Types
interface RunningData {
  name?: string;
  pace?: string;
  distance?: string;
  time?: string;
  date?: string;
  user?: string;
  calorie?: string;
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
  fields: Array<keyof RunningData>;
}

interface BackgroundImage {
  id: string;
  name: string;
  source: { uri: string };
}

// Data
const runningTemplates: RunningTemplate[] = [
  { id: 'athletic', name: 'Athletic', style: { textColor: '#FFFFFF', fontSize: 16, fontWeight: 'bold', opacity: 0.9, shadowColor: '#000000', shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.8 }, layout: 'corner', fields: ['name', 'pace', 'distance'] },
  { id: 'minimal', name: 'Minimal', style: { textColor: '#FFFFFF', fontSize: 14, fontWeight: 'normal', opacity: 0.8, shadowColor: '#000000', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 0.6 }, layout: 'bottom', fields: ['date', 'calorie', 'name'] },
  { id: 'bold', name: 'Bold', style: { textColor: '#FFFFFF', fontSize: 20, fontWeight: 'bold', opacity: 1.0, shadowColor: '#000000', shadowOffset: { width: 3, height: 3 }, shadowOpacity: 1.0 }, layout: 'center', fields: ['time', 'distance', 'user'] },
];

// Main Component
const RunningTemplateApp: React.FC = () => {
  const [backgroundImages, setBackgroundImages] = useState<BackgroundImage[]>([
    { id: '1', name: 'Sunset', source: require('../../assets/images/runbg1.png') },
    { id: '2', name: 'Night', source: require('../../assets/images/runbg2.png') },
    { id: '3', name: 'SkyTrack', source: require('../../assets/images/runbg3.png') },
    { id: '4', name: 'RoadRun', source: require('../../assets/images/runbg4.png') },
    { id: '5', name: 'Running', source: require('../../assets/images/runbg5.png') },
  ]);

  const [selectedBackground, setSelectedBackground] = useState('1');
  const [selectedTemplate, setSelectedTemplate] = useState('athletic');
  const [activeTab, setActiveTab] = useState<'background' | 'template'>('background');
  const [isDataInputVisible, setIsDataInputVisible] = useState(true);
  const [runningData, setRunningData] = useState<RunningData>({
    name: 'Evening Run',
    pace: '5:02/km',
    distance: '6.8 km',
    time: '00:55:41',
    date: '2025-08-17 20:10',
    user: '한승리',
    calorie: '350 kcal',
  });
  const viewShotRef = useRef<ViewShot>(null);

  const toggleDataInputVisibility = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsDataInputVisible(!isDataInputVisible);
  };

  const updateField = (field: keyof RunningData, value: string) => {
    setRunningData({ ...runningData, [field]: value });
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  };

  const getCurrentBackground = () => backgroundImages.find(bg => bg.id === selectedBackground);
  const getCurrentTemplate = () => runningTemplates.find(template => template.id === selectedTemplate);

  const renderRunningInfo = () => {
    const template = getCurrentTemplate();
    if (!template) return null;

    const textStyle = { color: template.style.textColor, fontSize: template.style.fontSize, fontWeight: template.style.fontWeight, opacity: template.style.opacity, textShadowColor: template.style.shadowColor, textShadowOffset: template.style.shadowOffset, textShadowRadius: template.style.shadowOpacity * 5, marginBottom: 4 };

    const getPositionStyle = (): ViewStyle => {
      switch (template.layout) {
        case 'corner': return { position: 'absolute', top: 30, left: 20 };
        case 'center': return { position: 'absolute', top: '50%' as DimensionValue, left: '50%' as DimensionValue, transform: [{ translateX: -100 }, { translateY: -60 }] };
        case 'bottom': return { position: 'absolute', bottom: 30, left: 20 };
        default: return { position: 'absolute', top: 30, left: 20 };
      }
    };

    return (
      <View style={[styles.runningInfoOverlay, getPositionStyle()]}>
        {runningData.name && <Text style={textStyle}>🏃‍♂️ {runningData.name}</Text>}
        {runningData.pace && <Text style={textStyle}>페이스: {runningData.pace}</Text>}
        {runningData.distance && <Text style={textStyle}>거리: {runningData.distance}</Text>}
        {runningData.time && <Text style={textStyle}>시간: {runningData.time}</Text>}
        {runningData.date && <Text style={textStyle}>날짜: {runningData.date}</Text>}
        {runningData.user && <Text style={textStyle}>유저: {runningData.user}</Text>}
      </View>
    );
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return alert('Permission to access gallery is required!');

    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 1 });
    if (!result.canceled && result.assets.length > 0) {
      const newCustomImage = { id: 'custom-' + Date.now(), name: '사용자 이미지', source: { uri: result.assets[0].uri } };
      setBackgroundImages(prev => [...prev, newCustomImage]);
      setSelectedBackground(newCustomImage.id);
    }
  };

  const handleSave = async () => {
    if (!viewShotRef.current?.capture) return;
    try {
      const uri = await viewShotRef.current.capture();
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === 'granted') {
        const asset = await MediaLibrary.createAssetAsync(uri);
        const album = await MediaLibrary.getAlbumAsync('RunWhere');
        album ? await MediaLibrary.addAssetsToAlbumAsync([asset], album, false) : await MediaLibrary.createAlbumAsync('RunWhere', asset, false);
        Alert.alert('Success', '✅ 이미지가 갤러리의 RunWhere 폴더에 저장되었습니다!');
      } else {
        Alert.alert('Permission Denied', '❌ 갤러리 저장 권한이 필요합니다.');
      }
    } catch (error) {
      Alert.alert('Error', `이미지 저장에 실패했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  };

  const renderInputForField = (field: keyof RunningData) => {
    const placeholders = { name: '운동 이름', pace: '5:02/km', distance: '6.8 km', time: '00:55:41', calorie: '350 kcal', user: '닉네임', date: '' };
    const labels = { name: '제목', pace: '페이스', distance: '거리', time: '시간', calorie: '칼로리', user: '닉네임', date: '날짜' };
    
    if (field === 'date') {
      return (
        <View style={styles.inputGroup} key="date">
          <Text style={styles.label}>날짜:</Text>
          <View style={styles.dateRow}>
            <TextInput style={[styles.input, { flex: 1 }]} value={runningData.date} onChangeText={value => updateField('date', value)} />
            <TouchableOpacity style={styles.nowButton} onPress={() => updateField('date', getCurrentDateTime())}><Text style={styles.nowButtonText}>지금</Text></TouchableOpacity>
          </View>
        </View>
      );
    }
    
    return (
      <View style={styles.inputGroup} key={field}>
        <Text style={styles.label}>{labels[field]}:</Text>
        <TextInput style={styles.input} value={runningData[field]} onChangeText={value => updateField(field, value)} placeholder={placeholders[field]} />
      </View>
    );
  };

  const renderDataInputs = () => {
    const template = getCurrentTemplate();
    return template ? template.fields.map(renderInputForField) : null;
  };

  return (
    <View style={styles.container}>
      <Eclipse />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>러닝샷 편집</Text>
        <TouchableOpacity style={styles.headerSaveButton} onPress={handleSave}><Text style={styles.headerSaveButtonText}>저장</Text></TouchableOpacity>
      </View>

      <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1.0 }} style={styles.previewContainer}>
        <ImageBackground source={getCurrentBackground()?.source} style={styles.previewImage} imageStyle={styles.backgroundImage}>{renderRunningInfo()}</ImageBackground>
      </ViewShot>

      <View style={styles.tabsContainer}>
        <TouchableOpacity style={[styles.tabButton, activeTab === 'background' && styles.activeTabButton]} onPress={() => setActiveTab('background')}><Text style={[styles.tabButtonText, activeTab === 'background' && styles.activeTabButtonText]}>배경 선택</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.tabButton, activeTab === 'template' && styles.activeTabButton]} onPress={() => setActiveTab('template')}><Text style={[styles.tabButtonText, activeTab === 'template' && styles.activeTabButtonText]}>템플릿 선택</Text></TouchableOpacity>
      </View>

      <ScrollView style={styles.controlsContainer} showsVerticalScrollIndicator={false}>
        {activeTab === 'background' ? (
          <View style={styles.sectionContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity style={styles.backgroundItem} onPress={pickImage}>
                <View style={[styles.thumbnail, styles.customThumbnail]}><AddImageIcon /></View>
                <Text style={styles.backgroundName}>사진 추가</Text>
              </TouchableOpacity>
              {backgroundImages.map(bg => (
                <TouchableOpacity key={bg.id} style={[styles.backgroundItem, selectedBackground === bg.id && styles.selectedBackground]} onPress={() => setSelectedBackground(bg.id)}>
                  <ImageBackground source={bg.source} style={styles.thumbnail}><View style={styles.thumbnailOverlay} /></ImageBackground>
                  <Text style={styles.backgroundName}>{bg.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ) : (
          <View style={styles.sectionContainer}>
                    {/* === Collapsible Section Start === */}
        <View style={styles.sectionContainer}>
          <TouchableOpacity onPress={toggleDataInputVisibility} style={styles.dropdownHeader}>
            <Text style={styles.sectionTitle}>운동 기록 입력</Text>
            <ChevronIcon isExpanded={isDataInputVisible} />
          </TouchableOpacity>
          {isDataInputVisible && <View>{renderDataInputs()}</View>}
        </View>
        {/* === Collapsible Section End === */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {runningTemplates.map(template => (
                <TouchableOpacity key={template.id} style={[styles.templateItem, selectedTemplate === template.id && styles.selectedTemplate]} onPress={() => setSelectedTemplate(template.id)}>
                  <View style={styles.templatePreview}><Text style={{ ...styles.previewText, color: template.style.textColor, fontWeight: template.style.fontWeight }}>Sample</Text></View>
                  <Text style={styles.templateName}>{template.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
        
        

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 50, paddingHorizontal: 30, paddingBottom: 15 },
  headerTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', flex: 1, textAlign: 'center' },
  headerSaveButton: { backgroundColor: '#54F895', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  headerSaveButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },
  previewContainer: { height: 280, margin: 20, borderRadius: 15, overflow: 'hidden' },
  previewImage: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  backgroundImage: { borderRadius: 15 },
  runningInfoOverlay: { backgroundColor: 'rgba(0, 0, 0, 0.4)', padding: 15, borderRadius: 10, minWidth: 180 },
  tabsContainer: { flexDirection: 'row', marginHorizontal: 20, marginBottom: 10, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 10, padding: 4 },
  tabButton: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 8 },
  activeTabButton: { backgroundColor: '#54F895' },
  tabButtonText: { color: 'rgba(255, 255, 255, 0.7)', fontSize: 14, fontWeight: '500' },
  activeTabButtonText: { color: '#FFFFFF', fontWeight: 'bold' },
  controlsContainer: { flex: 1, paddingHorizontal: 20 },
  sectionContainer: { marginBottom: 25 },
  dropdownHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  backgroundItem: { marginRight: 15, alignItems: 'center' },
  selectedBackground: { backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 8, padding: 4 },
  thumbnail: { width: 60, height: 60, borderRadius: 8, marginBottom: 5, overflow: 'hidden' },
  customThumbnail: { backgroundColor: 'rgba(255, 255, 255, 0.1)', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#007AFF', borderStyle: 'dashed' },
  thumbnailOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.3)' },
  backgroundName: { color: '#FFFFFF', fontSize: 12, textAlign: 'center' },
  templateItem: { marginRight: 15, alignItems: 'center' },
  selectedTemplate: { backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 8, padding: 4 },
  templatePreview: { width: 60, height: 60, backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 5 },
  previewText: { fontSize: 12 },
  templateName: { color: '#FFFFFF', fontSize: 12, textAlign: 'center' },
  inputGroup: { marginBottom: 15 },
  label: { color: '#FFFFFF', fontSize: 14, marginBottom: 5 },
  input: { backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#FFFFFF', padding: 12, borderRadius: 8, fontSize: 16 },
  dateRow: { flexDirection: 'row', alignItems: 'center' },
  nowButton: { backgroundColor: 'rgba(255, 255, 255, 0.2)', paddingHorizontal: 15, paddingVertical: 12, borderRadius: 8, marginLeft: 10 },
  nowButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },
});

export default RunningTemplateApp;
