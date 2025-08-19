import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageSourcePropType,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface CustomAlertProps {
  visible: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  onCancel?: () => void; 
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
}) => {
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    if (visible) {
      animationRef.current?.play();
    }
  }, [visible]);

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.alertContainer}>
          <LottieView
            ref={animationRef}
            source={require('../assets/alertMotion.json')}
            autoPlay={false}
            loop={false}
            style={styles.lottieAnimation}
          />

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          {confirmText && cancelText && onConfirm ? (
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                onPress={onClose}
                style={[styles.buttonWrapper, styles.cancelButton]}
              >
                <View style={[styles.button, { backgroundColor: '#303034' }]}>
                  <Text style={[styles.cancelButtonText, { color: '#FAFAF8' }]}>
                    {cancelText}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={onConfirm} style={styles.buttonWrapper}>
                <View style={[styles.button, { backgroundColor: '#303034' }]}>
                  <Text style={styles.confirmText}>{confirmText}</Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : (
             <TouchableOpacity onPress={onClose} style={styles.buttonWrapper}>
              <LinearGradient
                colors={['#54F895', '#2AFBEA']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.button}
              >
                <Text style={styles.primaryButtonText}>{confirmText || '확인했어요'}</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  alertContainer: {
    width: '85%',
    maxWidth: 320,
    backgroundColor: '#15151C',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    overflow: 'hidden',
  },
  lottieAnimation: {
    position: 'absolute',
    width: 250,
    height: 250,
  },
  icon: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 20,
  },
    title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FAFAF8',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#D9D9D9',
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonWrapper: {
    flex: 1,
    shadowColor: '#34D399',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 15,
    elevation: 10,
  },
    buttonWrapperFullWidth: {
    width: '100%',
    shadowColor: '#34D399',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
    button: {
    width: 250,
    height:68,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
    primaryButtonText: {
    color: '#15151C', // Dark text for green button
    fontSize: 16,
  },
  confirmText: {
    color: '#E77C7C',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButtonText: {
    color: '#FAFAF8', // Light text for gray button
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
  },
});

export default CustomAlert;