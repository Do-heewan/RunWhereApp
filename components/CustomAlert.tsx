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

// Define the props for the component
interface CustomAlertProps {
  visible: boolean;
  onClose: () => void;
  icon: ImageSourcePropType;
  title: string;
  message: string;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  onClose,
  icon,
  title,
  message,
}) => {
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    // Play the animation when the alert becomes visible
    if (visible) {
      animationRef.current?.play();
    }
  }, [visible]);

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.alertContainer}>
          {/* Lottie animation as a background */}
          <LottieView
            ref={animationRef}
            source={require('../assets/alertMotion.json')} // Assumes file is in /assets
            autoPlay={false}
            loop={false}
            style={styles.lottieAnimation}
          />

          {/* Icon */}
          <Image source={icon} style={styles.icon} />

          {/* Text Content */}
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          {/* Confirmation Button */}
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
    backgroundColor: '#2C2C2E',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    overflow: 'hidden', // Ensures Lottie doesn't overflow rounded corners
  },
  lottieAnimation: {
    position: 'absolute',
    width: '150%',
    height: '150%',
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
    width: '100%',
    shadowColor: '#34D399', // Glow effect
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.9,
    shadowRadius: 15,
    elevation: 10, // For Android
  },
  button: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#1C1C1E',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CustomAlert;
