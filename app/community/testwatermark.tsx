import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import React, { useRef, useState } from 'react';
import {
  Alert,
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
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import ViewShot from 'react-native-view-shot';
import Eclipse from '../../components/EclipseSVG';
import { AddImageIcon } from '../../components/IconSVG';



// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}



// --- Custom SVG Icons ---
const ChevronIcon = ({ isExpanded }: { isExpanded: boolean }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d={isExpanded ? 'M18 15l-6-6-6 6' : 'M6 9l6 6 6-6'} stroke="#54F895" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
const FlagIcon = () => (
    <Svg width="14" height="16" viewBox="0 0 14 16" fill="none">
        <Path d="M4 2H6V0H4V2ZM8 2V0H10V2H8ZM4 10V8H6V10H4ZM12 6V4H14V6H12ZM12 10V8H14V10H12ZM8 10V8H10V10H8ZM12 2V0H14V2H12ZM6 4V2H8V4H6ZM1 16C0.716667 16 0.479167 15.9042 0.2875 15.7125C0.0958333 15.5208 0 15.2833 0 15V1C0 0.716667 0.0958333 0.479167 0.2875 0.2875C0.479167 0.0958333 0.716667 0 1 0C1.28333 0 1.52083 0.0958333 1.7125 0.2875C1.90417 0.479167 2 0.716667 2 1V2H4V4H2V6H4V8H2V15C2 15.2833 1.90417 15.5208 1.7125 15.7125C1.52083 15.9042 1.28333 16 1 16ZM10 8V6H12V8H10ZM6 8V6H8V8H6ZM4 6V4H6V6H4ZM8 6V4H10V6H8ZM10 4V2H12V4H10Z" fill="#FFFFFF" />
    </Svg>
);
const HeartIcon = () => (
    <Svg width="20" height="18" viewBox="0 0 20 18" fill="none">
        <Path d="M10 18C9.7 18 9.4125 17.9458 9.1375 17.8375C8.8625 17.7292 8.61667 17.5667 8.4 17.35L1.7 10.625C1.11667 10.0417 0.6875 9.375 0.4125 8.625C0.1375 7.875 0 7.09167 0 6.275C0 4.55833 0.558333 3.08333 1.675 1.85C2.79167 0.616667 4.18333 0 5.85 0C6.65 0 7.40417 0.158333 8.1125 0.475C8.82083 0.791667 9.45 1.23333 10 1.8C10.5333 1.23333 11.1542 0.791667 11.8625 0.475C12.5708 0.158333 13.325 0 14.125 0C15.7917 0 17.1875 0.616667 18.3125 1.85C19.4375 3.08333 20 4.55 20 6.25C20 7.06667 19.8583 7.85 19.575 8.6C19.2917 9.35 18.8667 10.0167 18.3 10.6L11.575 17.35C11.3583 17.5667 11.1167 17.7292 10.85 17.8375C10.5833 17.9458 10.3 18 10 18ZM11 5C11.1667 5 11.325 5.04167 11.475 5.125C11.625 5.20833 11.7417 5.31667 11.825 5.45L13.525 8H17.675C17.7917 7.71667 17.8792 7.42917 17.9375 7.1375C17.9958 6.84583 18.025 6.55 18.025 6.25C17.9917 5.1 17.6083 4.1125 16.875 3.2875C16.1417 2.4625 15.225 2.05 14.125 2.05C13.6083 2.05 13.1125 2.15 12.6375 2.35C12.1625 2.55 11.75 2.84167 11.4 3.225L10.725 3.95C10.6417 4.05 10.5333 4.12917 10.4 4.1875C10.2667 4.24583 10.1333 4.275 10 4.275C9.86667 4.275 9.73333 4.24583 9.6 4.1875C9.46667 4.12917 9.35 4.05 9.25 3.95L8.575 3.225C8.225 2.84167 7.81667 2.54167 7.35 2.325C6.88333 2.10833 6.38333 2 5.85 2C4.75 2 3.83333 2.42083 3.1 3.2625C2.36667 4.10417 2 5.1 2 6.25C2 6.55 2.025 6.84583 2.075 7.1375C2.125 7.42917 2.20833 7.71667 2.325 8H7C7.16667 8 7.325 8.04167 7.475 8.125C7.625 8.20833 7.74167 8.31667 7.825 8.45L8.7 9.75L10.05 5.7C10.1167 5.5 10.2375 5.33333 10.4125 5.2C10.5875 5.06667 10.7833 5 11 5ZM11.3 8.25L9.95 12.3C9.88333 12.5 9.75833 12.6667 9.575 12.8C9.39167 12.9333 9.19167 13 8.975 13C8.80833 13 8.65 12.9583 8.5 12.875C8.35 12.7917 8.23333 12.6833 8.15 12.55L6.45 10H3.9L9.825 15.925C9.85833 15.9583 9.8875 15.9792 9.9125 15.9875C9.9375 15.9958 9.96667 16 10 16C10.0333 16 10.0625 15.9958 10.0875 15.9875C10.1125 15.9792 10.1417 15.9583 10.175 15.925L16.075 10H13C12.8333 10 12.675 9.95833 12.525 9.875C12.375 9.79167 12.25 9.68333 12.15 9.55L11.3 8.25Z" fill="#FFFFFF" />
    </Svg>
);
const CalorieIcon = () => (
    <Svg width="16" height="19" viewBox="0 0 16 19" fill="none">
        <Path d="M8 18.9995C5.76667 18.9995 3.875 18.2245 2.325 16.6745C0.775 15.1245 0 13.2329 0 10.9995C0 9.11619 0.558333 7.30785 1.675 5.57452C2.79167 3.84118 4.325 2.32452 6.275 1.02452C6.64167 0.774517 7.02083 0.762017 7.4125 0.987017C7.80417 1.21202 8 1.54952 8 1.99952V3.29952C8 3.86618 8.19583 4.34118 8.5875 4.72452C8.97917 5.10785 9.45833 5.29952 10.025 5.29952C10.3083 5.29952 10.5792 5.23702 10.8375 5.11202C11.0958 4.98702 11.325 4.80785 11.525 4.57452C11.6583 4.40785 11.8292 4.30368 12.0375 4.26202C12.2458 4.22035 12.4417 4.26618 12.625 4.39952C13.675 5.14952 14.5 6.10785 15.1 7.27452C15.7 8.44118 16 9.68285 16 10.9995C16 13.2329 15.225 15.1245 13.675 16.6745C12.125 18.2245 10.2333 18.9995 8 18.9995ZM2 10.9995C2 11.8662 2.175 12.687 2.525 13.462C2.875 14.237 3.375 14.9162 4.025 15.4995C4.00833 15.4162 4 15.3412 4 15.2745V15.0495C4 14.5162 4.1 14.0162 4.3 13.5495C4.5 13.0829 4.79167 12.6579 5.175 12.2745L8 9.49952L10.825 12.2745C11.2083 12.6579 11.5 13.0829 11.7 13.5495C11.9 14.0162 12 14.5162 12 15.0495V15.2745C12 15.3412 11.9917 15.4162 11.975 15.4995C12.625 14.9162 13.125 14.237 13.475 13.462C13.825 12.687 14 11.8662 14 10.9995C14 10.1662 13.8458 9.37868 13.5375 8.63702C13.2292 7.89535 12.7833 7.23285 12.2 6.64952C11.8667 6.86618 11.5167 7.02868 11.15 7.13702C10.7833 7.24535 10.4083 7.29952 10.025 7.29952C8.99167 7.29952 8.09583 6.95785 7.3375 6.27452C6.57917 5.59118 6.14167 4.74952 6.025 3.74952C4.725 4.84952 3.72917 6.02035 3.0375 7.26202C2.34583 8.50368 2 9.74952 2 10.9995ZM8 12.2995L6.575 13.6995C6.39167 13.8829 6.25 14.0912 6.15 14.3245C6.05 14.5579 6 14.7995 6 15.0495C6 15.5829 6.19583 16.0412 6.5875 16.4245C6.97917 16.8079 7.45 16.9995 8 16.9995C8.55 16.9995 9.02083 16.8079 9.4125 16.4245C9.80417 16.0412 10 15.5829 10 15.0495C10 14.7829 9.95 14.537 9.85 14.312C9.75 14.087 9.60833 13.8829 9.425 13.6995L8 12.2995Z" fill="#FFFFFF" />
    </Svg>
);
const PaceIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <Path d="M12.05 13.375L6.125 19.3C5.925 19.5 5.6875 19.6 5.4125 19.6C5.1375 19.6 4.9 19.5 4.7 19.3C4.5 19.1 4.4 18.8625 4.4 18.5875C4.4 18.3125 4.5 18.075 4.7 17.875L13.6 9H11V10C11 10.2833 10.9042 10.5208 10.7125 10.7125C10.5208 10.9042 10.2833 11 10 11C9.71667 11 9.47917 10.9042 9.2875 10.7125C9.09583 10.5208 9 10.2833 9 10V8C9 7.71667 9.09583 7.47917 9.2875 7.2875C9.47917 7.09583 9.71667 7 10 7H14.85C15.1167 7 15.3708 7.05 15.6125 7.15C15.8542 7.25 16.0667 7.39167 16.25 7.575L19.25 10.55C19.5833 10.8833 19.9708 11.1625 20.4125 11.3875C20.8542 11.6125 21.3333 11.775 21.85 11.875C22.1333 11.925 22.3792 12.0542 22.5875 12.2625C22.7958 12.4708 22.9 12.7167 22.9 13C22.9 13.2833 22.7833 13.5167 22.55 13.7C22.3167 13.8833 22.0583 13.9583 21.775 13.925C21.025 13.825 20.3333 13.625 19.7 13.325C19.0667 13.025 18.4833 12.6167 17.95 12.1L16.95 11.05L14.75 13.25L16.075 14.575C16.3083 14.8083 16.4042 15.0875 16.3625 15.4125C16.3208 15.7375 16.1583 15.9833 15.875 16.15L11.325 18.775C11.0917 18.9083 10.8375 18.9417 10.5625 18.875C10.2875 18.8083 10.0833 18.6583 9.95 18.425C9.81667 18.1917 9.7875 17.9375 9.8625 17.6625C9.9375 17.3875 10.0917 17.1833 10.325 17.05L13.75 15.075L12.05 13.375ZM4 13C3.71667 13 3.47917 12.9042 3.2875 12.7125C3.09583 12.5208 3 12.2833 3 12C3 11.7167 3.09583 11.4792 3.2875 11.2875C3.47917 11.0958 3.71667 11 4 11H7C7.28333 11 7.52083 11.0958 7.7125 11.2875C7.90417 11.4792 8 11.7167 8 12C8 12.2833 7.90417 12.5208 7.7125 12.7125C7.52083 12.9042 7.28333 13 7 13H4ZM2 10C1.71667 10 1.47917 9.90417 1.2875 9.7125C1.09583 9.52083 1 9.28333 1 9C1 8.71667 1.09583 8.47917 1.2875 8.2875C1.47917 8.09583 1.71667 8 2 8H5C5.28333 8 5.52083 8.09583 5.7125 8.2875C5.90417 8.47917 6 8.71667 6 9C6 9.28333 5.90417 9.52083 5.7125 9.7125C5.52083 9.90417 5.28333 10 5 10H2ZM19.475 8C18.925 8 18.45 7.80417 18.05 7.4125C17.65 7.02083 17.45 6.55 17.45 6C17.45 5.45 17.65 4.97917 18.05 4.5875C18.45 4.19583 18.925 4 19.475 4C20.025 4 20.5 4.19583 20.9 4.5875C21.3 4.97917 21.5 5.45 21.5 6C21.5 6.55 21.3 7.02083 20.9 7.4125C20.5 7.80417 20.025 8 19.475 8ZM4 7C3.71667 7 3.47917 6.90417 3.2875 6.7125C3.09583 6.52083 3 6.28333 3 6C3 5.71667 3.09583 5.47917 3.2875 5.2875C3.47917 5.09583 3.71667 5 4 5H7C7.28333 5 7.52083 5.09583 7.7125 5.2875C7.90417 5.47917 8 5.71667 8 6C8 6.28333 7.90417 6.52083 7.7125 6.7125C7.52083 6.90417 7.28333 7 7 7H4Z" fill="#FFFFFF" />
    </Svg>
);


// --- Types ---
interface RunningData {
  pace?: string;
  distance?: string;
  time?: string;
  date?: string;
  user?: string;
  calorie?: string;
  heartRate?: string;
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
  layout: 'topCenter_bottomLeft' | 'stackedCenter' | 'topRight_bottomRight' | 'topLeft_center' | 'topLeft_cluster' | 'split_cluster';
  fields: Array<keyof RunningData>;
  previewData: RunningData; 
}


interface BackgroundImage {
  id: string;
  name: string;
  source: { uri: string };
}


// --- Data ---
const runningTemplates: RunningTemplate[] = [
    { id: 'topCenter_bottomLeft', name: '프로', style: { textColor: '#FFFFFF', fontSize: 24, fontWeight: 'bold', opacity: 1, shadowColor: '#000000', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 0.7 }, layout: 'topCenter_bottomLeft', fields: ['distance', 'time', 'calorie', 'pace'], previewData: { distance: '10.0km' } },
    { id: 'stackedCenter', name: '중앙 정렬', style: { textColor: '#FFFFFF', fontSize: 22, fontWeight: 'normal', opacity: 1, shadowColor: '#000000', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 0.7 }, layout: 'stackedCenter', fields: ['distance', 'time', 'calorie', 'pace'], previewData: { distance: '10.0km', time: '55:12', pace: '5:31' } },
    { id: 'topRight_bottomRight', name: '데이터 리치', style: { textColor: '#FFFFFF', fontSize: 16, fontWeight: 'normal', opacity: 1, shadowColor: '#000000', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 0.7 }, layout: 'topRight_bottomRight', fields: ['date', 'distance', 'heartRate', 'calorie', 'pace'], previewData: { date: '2025.08.20', distance: '10.0km' } },
    { id: 'topLeft_center', name: '클래식', style: { textColor: '#FFFFFF', fontSize: 20, fontWeight: 'normal', opacity: 1, shadowColor: '#000000', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 0.7 }, layout: 'topLeft_center', fields: ['time', 'calorie', 'pace', 'distance'], previewData: { distance: '10.0km', time: '55:12' } },
    { id: 'topLeft_cluster', name: '아이코닉 레프트', style: { textColor: '#FFFFFF', fontSize: 16, fontWeight: 'normal', opacity: 1, shadowColor: '#000000', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 0.7 }, layout: 'topLeft_cluster', fields: ['distance', 'heartRate', 'calorie', 'pace'], previewData: { distance: '10.0km' } },
];


// --- Main Component ---
const RunningTemplateApp: React.FC = () => {
    const [backgroundImages, setBackgroundImages] = useState<BackgroundImage[]>([
        { id: '1', name: 'Sunset', source: require('../../assets/images/runbg1.png') },
        { id: '2', name: 'Night', source: require('../../assets/images/runbg2.png') },
        { id: '3', name: 'SkyTrack', source: require('../../assets/images/runbg3.png') },
        { id: '4', name: 'RoadRun', source: require('../../assets/images/runbg4.png') },
        { id: '5', name: 'Running', source: require('../../assets/images/runbg5.png') },
    ]);


    const [selectedBackground, setSelectedBackground] = useState('1');
    const [selectedTemplate, setSelectedTemplate] = useState('split_cluster');
    const [activeTab, setActiveTab] = useState<'background' | 'template'>('template');
    const [isDataInputVisible, setIsDataInputVisible] = useState(true);
    const [runningData, setRunningData] = useState<RunningData>({
        distance: '30.1 km',
        time: '1:54:11',
        calorie: '535 kcal',
        pace: '6:01 /km',
        date: '2025. 08. 20',
        user: '런웨어',
        heartRate: '159 BPM',
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
        return `${now.getFullYear()}. ${String(now.getMonth() + 1).padStart(2, '0')}. ${String(now.getDate()).padStart(2, '0')}`;
    };


    const getCurrentBackground = () => backgroundImages.find(bg => bg.id === selectedBackground);
    const getCurrentTemplate = () => runningTemplates.find(template => template.id === selectedTemplate);


    // --- Renders the main template overlay on the image ---
    const renderRunningInfo = (data: RunningData, baseTextStyle: any) => {
        const template = getCurrentTemplate();
        if (!template) return null;


        const renderFieldWithLabel = (label: string, value: string | undefined, textStyle: any) => (
            value ? <View style={{ alignItems: 'center' }}><Text style={textStyle}>{value}</Text><Text style={{ ...textStyle, fontSize: textStyle.fontSize * 0.6 }}>{label}</Text></View> : null
        );


        const renderIconicStats = (textStyle: any) => (
            <View style={{ alignItems: 'flex-start', gap: 10 }}>
                <View style={styles.iconStatRow}><FlagIcon /><Text style={[textStyle, { color: '#FFFFFF', fontSize: 22, fontWeight: 'bold' }]}>{data.distance}</Text></View>
                <View style={styles.iconStatRow}><HeartIcon /><Text style={[textStyle, { color: '#FFFFFF' }]}>{data.heartRate}</Text></View>
                <View style={styles.iconStatRow}><CalorieIcon /><Text style={[textStyle, { color: '#FFFFFF' }]}>{data.calorie}</Text></View>
                <View style={styles.iconStatRow}><PaceIcon /><Text style={[textStyle, { color: '#FFFFFF' }]}>{data.pace}</Text></View>
            </View>
        );


        switch (template.layout) {
            case 'topCenter_bottomLeft': return (<><View style={[styles.infoOverlay, { top: 30, alignSelf: 'center' }]}><Text style={{ ...baseTextStyle, fontSize: 48, fontWeight: 'bold' }}>{data.distance}</Text></View><View style={[styles.infoOverlay, { bottom: 30, left: 30, flexDirection: 'row', gap: 20 }]}>{renderFieldWithLabel('총시간', data.time, { ...baseTextStyle, fontSize: 20, fontWeight: 'normal' })}{renderFieldWithLabel('칼로리', data.calorie, { ...baseTextStyle, fontSize: 20, fontWeight: 'normal' })}{renderFieldWithLabel('평균페이스', data.pace, { ...baseTextStyle, fontSize: 20, fontWeight: 'normal' })}</View></>);
            case 'stackedCenter': return (<View style={[styles.infoOverlay, { top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', gap: 15 }]}>{renderFieldWithLabel('', data.distance, { ...baseTextStyle, fontSize: 40, fontWeight: 'bold' })}{renderFieldWithLabel('총시간', data.time, { ...baseTextStyle, fontSize: 22 })}{renderFieldWithLabel('칼로리', data.calorie, { ...baseTextStyle, fontSize: 22 })}{renderFieldWithLabel('평균페이스', data.pace, { ...baseTextStyle, fontSize: 22 })}</View>);
            case 'topRight_bottomRight': case 'split_cluster': return (<><View style={[styles.infoOverlay, { top: 30, right: 30 }]}><Text style={{ ...baseTextStyle, fontSize: 16 }}>{data.date}</Text></View><View style={[styles.infoOverlay, { bottom: 30, right: 30 }]}>{renderIconicStats({ ...baseTextStyle, fontSize: 16 })}</View></>);
            case 'topLeft_cluster': return <View style={[styles.infoOverlay, { top: 30, left: 30 }]}>{renderIconicStats({ ...baseTextStyle, fontSize: 16 })}</View>;
            case 'topLeft_center': return (<><View style={[styles.infoOverlay, { top: 30, left: 30, flexDirection: 'row', gap: 20 }]}>{renderFieldWithLabel('총시간', data.time, { ...baseTextStyle, fontSize: 20 })}{renderFieldWithLabel('칼로리', data.calorie, { ...baseTextStyle, fontSize: 20 })}{renderFieldWithLabel('평균페이스', data.pace, { ...baseTextStyle, fontSize: 20 })}</View><View style={[styles.infoOverlay, { top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }]}><View style={[styles.iconStatRow, { gap: 10 }]}><FlagIcon /><Text style={{ ...baseTextStyle, fontSize: 48, fontWeight: 'bold' }}>{data.distance}</Text></View></View></>);
            default: return null;
        }
    };


    // --- Renders a miniature preview of the template layout ---
    const renderTemplatePreview = (template: RunningTemplate) => {
        const previewStyles = {
            ...template.style,
            fontSize: template.style.fontSize / 3,
            textShadowRadius: template.style.shadowOpacity * 2,
        };
        const SmallText = ({ children, style }: { children: React.ReactNode, style?: any }) => <Text style={[styles.templatePreviewText, previewStyles, style]}>{children}</Text>;
        const SmallField = ({ label, value, style }: { label: string, value?: string, style?: any }) => value ? <View style={{ alignItems: 'center' }}><SmallText style={style}>{value}</SmallText><SmallText style={{...style, fontSize: previewStyles.fontSize * 0.7}}>{label}</SmallText></View> : null;


        switch (template.layout) {
            case 'topCenter_bottomLeft': return (<><View style={{ position: 'absolute', top: 10, alignSelf: 'center' }}><SmallText style={{ fontSize: 18, fontWeight: 'bold' }}>{template.previewData.distance}</SmallText></View><View style={{ position: 'absolute', bottom: 10, left: 10, flexDirection: 'row', gap: 8 }}><SmallField label="시간" value={template.previewData.time} /><SmallField label="페이스" value={template.previewData.pace} /></View></>);
            case 'stackedCenter': return (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 3 }}><SmallText style={{ fontSize: 14, fontWeight: 'bold' }}>{template.previewData.distance}</SmallText><SmallField label="시간" value={template.previewData.time} /><SmallField label="페이스" value={template.previewData.pace} /></View>);
            case 'topRight_bottomRight': case 'split_cluster': return (<><View style={{ position: 'absolute', top: 10, right: 10 }}><SmallText>{template.previewData.date}</SmallText></View><View style={{ position: 'absolute', bottom: 10, right: 10, alignItems: 'flex-start', gap: 3 }}><SmallText style={{ fontWeight: 'bold' }}>{template.previewData.distance}</SmallText><SmallText>{template.previewData.heartRate}</SmallText></View></>);
            case 'topLeft_cluster': return (<View style={{ position: 'absolute', top: 10, left: 10, alignItems: 'flex-start', gap: 3 }}><SmallText style={{ fontWeight: 'bold' }}>{template.previewData.distance}</SmallText><SmallText>{template.previewData.heartRate}</SmallText></View>);
            case 'topLeft_center': return (<><View style={{ position: 'absolute', top: 10, left: 10, flexDirection: 'row', gap: 8 }}><SmallField label="시간" value={template.previewData.time} /></View><View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><SmallText style={{ fontSize: 18, fontWeight: 'bold' }}>{template.previewData.distance}</SmallText></View></>);
            default: return null;
        }
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
        const placeholders = { name: '운동 이름', pace: '6:01 /km', distance: '30.1 km', time: '1:54:11', calorie: '535 kcal', user: '닉네임', heartRate: '159 BPM', date: '' };
        const labels = { name: '제목', pace: '페이스', distance: '거리', time: '시간', calorie: '칼로리', user: '닉네임', heartRate: '심박수', date: '날짜' };


        if (field === 'date') {
            return (
                <View style={styles.inputGroup} key="date">
                    <Text style={styles.label}>날짜:</Text>
                    <View style={styles.dateRow}>
                        <TextInput style={[styles.input, { flex: 1 }]} value={runningData.date} onChangeText={value => updateField('date', value)} />
                        <TouchableOpacity style={styles.nowButton} onPress={() => updateField('date', getCurrentDateTime())}><Text style={styles.nowButtonText}>오늘</Text></TouchableOpacity>
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
    
    const currentTemplate = getCurrentTemplate();


    return (
        <View style={styles.container}>
            <Eclipse />
            <View style={styles.header}>
                <View style={styles.headerSide} />
                <Text style={styles.headerTitle}>러닝샷 편집</Text>
                <TouchableOpacity style={styles.headerSaveButton} onPress={handleSave}>
                    <Text style={styles.headerSaveButtonText}>저장</Text>
                </TouchableOpacity>
            </View>


            <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1.0 }} style={styles.previewContainer}>
                <ImageBackground source={getCurrentBackground()?.source} style={styles.previewImage} imageStyle={styles.backgroundImage}>
                    {currentTemplate && renderRunningInfo(runningData, currentTemplate.style)}
                </ImageBackground>
            </ViewShot>


            <View style={styles.tabsContainer}>
                <TouchableOpacity style={[styles.tabButton, activeTab === 'background' && styles.activeTabButton]} onPress={() => setActiveTab('background')}>
                    <Text style={[styles.tabButtonText, activeTab === 'background' && styles.activeTabButtonText]}>배경 선택</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.tabButton, activeTab === 'template' && styles.activeTabButton]} onPress={() => setActiveTab('template')}>
                    <Text style={[styles.tabButtonText, activeTab === 'template' && styles.activeTabButtonText]}>템플릿 선택</Text>
                </TouchableOpacity>
            </View>


            <ScrollView
                style={styles.controlsContainer}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={isDataInputVisible && activeTab === 'template' ? { paddingBottom: 50 } : {}}
            >
                {activeTab === 'background' ? (
                    <View style={styles.sectionContainer}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <TouchableOpacity style={styles.backgroundItem} onPress={pickImage}>
                                <View style={[styles.thumbnail, styles.customThumbnail]}><AddImageIcon /></View>
                                <Text style={styles.backgroundName}>사진 추가</Text>
                            </TouchableOpacity>
                            {backgroundImages.map(bg => (
                                <TouchableOpacity key={bg.id} style={styles.backgroundItem} onPress={() => setSelectedBackground(bg.id)}>
                                    <ImageBackground 
                                        source={bg.source} 
                                        style={[styles.thumbnail, selectedBackground === bg.id && styles.selectedThumbnail]} 
                                        imageStyle={{ borderRadius: 6 }}
                                    >
                                        <View style={styles.thumbnailOverlay} />
                                    </ImageBackground>
                                    <Text style={[styles.backgroundName, selectedBackground === bg.id && styles.selectedBackgroundName]}>{bg.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                ) : (
                    <View>
                        <TouchableOpacity onPress={toggleDataInputVisibility} style={styles.dropdownHeader}>
                            <Text style={styles.sectionTitle}>러닝정보 입력하기</Text>
                            <ChevronIcon isExpanded={isDataInputVisible} />
                        </TouchableOpacity>
                        {isDataInputVisible && <View>{renderDataInputs()}</View>}


                        <View style={styles.sectionContainer}>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} >
                                {runningTemplates.map(template => (
                                    <TouchableOpacity key={template.id} style={styles.templateItem} onPress={() => setSelectedTemplate(template.id)}>
                                        <View style={[styles.templatePreview, selectedTemplate === template.id && styles.selectedTemplatePreview]}>
                                            {renderTemplatePreview(template)}
                                        </View>
                                        <Text style={styles.templateName}>{template.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
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
  headerSide: { width: 64 },
  headerSaveButton: { backgroundColor: '#54F895', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  headerSaveButtonText: { color: '#000', fontWeight: 'bold' },
  previewContainer: { height: 320, marginHorizontal: 20, borderRadius: 15, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.2)' },
  previewImage: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  backgroundImage: { borderRadius: 15 },
  infoOverlay: { position: 'absolute' },
  iconStatRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tabsContainer: { flexDirection: 'row', marginHorizontal: 20, marginTop: 20, marginBottom: 10, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 10, padding: 4 },
  tabButton: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 8 },
  activeTabButton: { backgroundColor: '#54F895' },
  tabButtonText: { color: 'rgba(255, 255, 255, 0.7)', fontSize: 14, fontWeight: '500' },
  activeTabButtonText: { color: '#000000', fontWeight: 'bold' },
  controlsContainer: { flex: 1, paddingHorizontal: 20 },
  sectionContainer: { marginTop: 10, paddingBottom: 50 },
  dropdownHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, marginTop: 10 },
  sectionTitle: { color: '#54F895', fontSize: 16, fontWeight: 'bold' },
  backgroundItem: { marginRight: 15, alignItems: 'center' },
  thumbnail: { width: 95, height: 95, borderRadius: 8, marginBottom: 5, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
  selectedThumbnail: {
    borderColor: '#54F895',
    borderWidth: 2,
    shadowColor: '#54F895',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 8,
  },
  customThumbnail: { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
  thumbnailOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.3)', width: '100%' },
  backgroundName: { color: '#FFFFFF', fontSize: 12, textAlign: 'center' },
  selectedBackgroundName: { 
      color: '#FFFFFF', 
      fontWeight: 'bold',
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 5,
  },
  templateItem: { marginRight: 15, alignItems: 'center' },
  templatePreview: { width: 95, height: 95, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 8, marginBottom: 5, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', padding: 4, position: 'relative', overflow: 'hidden' },
  selectedTemplatePreview: { backgroundColor: 'rgba(255, 255, 255, 0.25)', borderColor: '#54F895' },
  templateName: { color: '#FFFFFF', fontSize: 12, textAlign: 'center' },
  templatePreviewText: { color: '#FFFFFF', opacity: 0.9, textShadowColor: 'rgba(0,0,0,0.8)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2, },
  inputGroup: { marginBottom: 15 },
  label: { color: 'rgba(255,255,255,0.7)', fontSize: 14, marginBottom: 5 },
  input: { backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#FFFFFF', padding: 12, borderRadius: 8, fontSize: 16 },
  dateRow: { flexDirection: 'row', alignItems: 'center' },
  nowButton: { backgroundColor: 'rgba(255, 255, 255, 0.2)', paddingHorizontal: 15, paddingVertical: 12, borderRadius: 8, marginLeft: 10 },
  nowButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },
});


export default RunningTemplateApp;
