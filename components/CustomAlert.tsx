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
  onCancel?: () => void; // ✅ Add this line
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
                  <Text style={[styles.buttonText, { color: '#FAFAF8' }]}>
                    {cancelText}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={onConfirm} style={styles.buttonWrapper}>
                <View style={[styles.button, { backgroundColor: '#303034' }]}>
                  <Text style={styles.buttonText}>{confirmText}</Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={onClose} style={styles.buttonWrapper}>
              <LinearGradient
                colors={['#45F5B9', '#00D68F']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>확인했어요</Text>
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
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#E5E5EA',
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
  button: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#E77C7C',
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