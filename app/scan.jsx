import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const Scan = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const overlayOpacity = useRef(new Animated.Value(0.6)).current;
  
  // State management
  const [scanMode, setScanMode] = useState('qr'); // 'qr', 'document', 'check'
  const [isScanning, setIsScanning] = useState(true);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [scanCount, setScanCount] = useState(0);

  // Scan modes configuration
  const scanModes = [
    {
      id: 'qr',
      title: 'QR Payment',
      subtitle: 'Scan QR codes for payments',
      icon: 'qr-code-scanner',
      color: '#3b82f6',
      gradient: ['#3b82f6', '#1d4ed8'],
      popular: true
    },
    {
      id: 'document',
      title: 'Documents',
      subtitle: 'Scan documents & receipts',
      icon: 'document-scanner',
      color: '#10b981',
      gradient: ['#10b981', '#059669'],
      popular: true
    },
    {
      id: 'check',
      title: 'Check Deposit',
      subtitle: 'Deposit checks instantly',
      icon: 'receipt-long',
      color: '#f59e0b',
      gradient: ['#f59e0b', '#d97706'],
      popular: false
    },
    {
      id: 'card',
      title: 'Add Card',
      subtitle: 'Scan credit/debit cards',
      icon: 'credit-card',
      color: '#8b5cf6',
      gradient: ['#8b5cf6', '#7c3aed'],
      popular: false
    }
  ];

  useEffect(() => {
    // Request camera permission on mount
    if (!permission?.granted) {
      requestPermission();
    }

    // Enhanced entrance animations
    const animationSequence = Animated.stagger(150, [
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 80,
        friction: 8,
        useNativeDriver: true,
      }),
    ]);

    // Scanning line animation
    const scanLineAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ])
    );

    // Pulse animation for scan button
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    // Overlay breathing animation
    const overlayAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(overlayOpacity, {
          toValue: 0.4,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0.6,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    animationSequence.start();
    scanLineAnimation.start();
    pulseAnimation.start();
    overlayAnimation.start();

    return () => {
      scanLineAnimation.stop();
      pulseAnimation.stop();
      overlayAnimation.stop();
    };
  }, [permission]);

  const handleBarCodeScanned = ({ type, data }) => {
    if (!isScanning) return;
    
    setIsScanning(false);
    setScannedData({ type, data });
    setScanCount(prev => prev + 1);

    // Haptic feedback would go here
    // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Process scanned data based on scan mode
    processScanResult(data, type);
  };

  const processScanResult = (data, type) => {
    const currentMode = scanModes.find(mode => mode.id === scanMode);
    
    switch (scanMode) {
      case 'qr':
        handleQRPayment(data);
        break;
      case 'document':
        handleDocumentScan(data);
        break;
      case 'check':
        handleCheckDeposit(data);
        break;
      case 'card':
        handleCardScan(data);
        break;
      default:
        handleGenericScan(data);
    }
  };

  const handleQRPayment = (data) => {
    // Simulate QR payment processing
    Alert.alert(
      'QR Code Scanned! 💳',
      `Payment request detected.\n\nMerchant: Demo Store\nAmount: $25.99\n\nProceed with payment?`,
      [
        { text: 'Cancel', onPress: () => resetScanning() },
        { 
          text: 'Pay Now', 
          onPress: () => {
            Alert.alert('Payment Successful! ✅', 'Your payment has been processed successfully.');
            router.back();
          }
        }
      ]
    );
  };

  const handleDocumentScan = (data) => {
    Alert.alert(
      'Document Scanned! 📄',
      'Document has been captured and processed.\n\nThis document will be saved to your secure document vault.',
      [
        { text: 'Scan Another', onPress: () => resetScanning() },
        { text: 'Done', onPress: () => router.back() }
      ]
    );
  };

  const handleCheckDeposit = (data) => {
    Alert.alert(
      'Check Detected! 🏦',
      'Please ensure the check is flat and all corners are visible.\n\nProceed with deposit?',
      [
        { text: 'Retake', onPress: () => resetScanning() },
        { 
          text: 'Deposit', 
          onPress: () => {
            Alert.alert('Check Deposited! ✅', 'Your check has been submitted for processing. Funds will be available within 1-2 business days.');
            router.back();
          }
        }
      ]
    );
  };

  const handleCardScan = (data) => {
    Alert.alert(
      'Card Scanned! 💳',
      'Card information has been captured securely.\n\nProceed to add this card to your account?',
      [
        { text: 'Cancel', onPress: () => resetScanning() },
        { text: 'Add Card', onPress: () => router.push('/add-card') }
      ]
    );
  };

  const handleGenericScan = (data) => {
    Alert.alert(
      'Code Scanned!',
      `Scanned data: ${data}`,
      [
        { text: 'Scan Again', onPress: () => resetScanning() },
        { text: 'Done', onPress: () => router.back() }
      ]
    );
  };

  const resetScanning = () => {
    setIsScanning(true);
    setScannedData(null);
  };

  const toggleFlash = () => {
    setFlashEnabled(!flashEnabled);
  };

  const handleScanModeChange = (modeId) => {
    setScanMode(modeId);
    resetScanning();
  };

  const renderScanOverlay = () => {
    const currentMode = scanModes.find(mode => mode.id === scanMode);
    
    return (
      <View style={styles.scanOverlay}>
        {/* Overlay Background */}
        <Animated.View 
          style={[
            styles.overlayBackground,
            { opacity: overlayOpacity }
          ]}
        />
        
        {/* Scan Frame */}
        <View style={styles.scanFrame}>
          {/* Corner Brackets */}
          <View style={[styles.cornerBracket, styles.topLeft, { borderColor: currentMode?.color }]} />
          <View style={[styles.cornerBracket, styles.topRight, { borderColor: currentMode?.color }]} />
          <View style={[styles.cornerBracket, styles.bottomLeft, { borderColor: currentMode?.color }]} />
          <View style={[styles.cornerBracket, styles.bottomRight, { borderColor: currentMode?.color }]} />
          
          {/* Scanning Line */}
          <Animated.View
            style={[
              styles.scanLine,
              {
                backgroundColor: currentMode?.color,
                transform: [
                  {
                    translateY: scanLineAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 200],
                    }),
                  },
                ],
              },
            ]}
          />
          
          {/* Center Dot */}
          <View style={styles.centerDot}>
            <Animated.View
              style={[
                styles.centerDotInner,
                {
                  backgroundColor: currentMode?.color,
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            />
          </View>
        </View>
      </View>
    );
  };

  const renderScanModeSelector = () => (
    <Animated.View
      style={[
        styles.scanModeContainer,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
      ]}
    >
      <BlurView intensity={40} tint="dark" style={styles.scanModeBlur}>
        <View className="p-4">
          <Text className="font-inter-bold text-white text-lg text-center mb-4">
            Scan Mode
          </Text>
          <View className="flex-row flex-wrap justify-center">
            {scanModes.map((mode) => (
              <TouchableOpacity
                key={mode.id}
                activeOpacity={0.8}
                onPress={() => handleScanModeChange(mode.id)}
                className="m-2"
              >
                <BlurView 
                  intensity={scanMode === mode.id ? 30 : 20} 
                  tint="light" 
                  style={[
                    styles.modeButton,
                    scanMode === mode.id && { borderColor: mode.color, borderWidth: 2 }
                  ]}
                >
                  <LinearGradient
                    colors={scanMode === mode.id ? mode.gradient : ['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
                    style={styles.modeButtonGradient}
                  >
                    <MaterialIcons 
                      name={mode.icon} 
                      size={24} 
                      color={scanMode === mode.id ? 'white' : mode.color} 
                    />
                    <Text 
                      className={`font-inter-semibold text-sm mt-2 text-center ${
                        scanMode === mode.id ? 'text-white' : 'text-gray-700'
                      }`}
                    >
                      {mode.title}
                    </Text>
                    {mode.popular && (
                      <View className="absolute -top-1 -right-1 bg-orange-500 px-1 py-0.5 rounded-full">
                        <Text className="font-inter-bold text-white text-xs">★</Text>
                      </View>
                    )}
                  </LinearGradient>
                </BlurView>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </BlurView>
    </Animated.View>
  );

  const renderScanInfo = () => {
    const currentMode = scanModes.find(mode => mode.id === scanMode);
    
    return (
      <Animated.View
        style={[
          styles.scanInfoContainer,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
        ]}
      >
        <BlurView intensity={40} tint="dark" style={styles.scanInfoBlur}>
          <View className="p-6">
            <View className="flex-row items-center justify-center mb-4">
              <View 
                className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
                style={{ backgroundColor: `${currentMode?.color}20` }}
              >
                <MaterialIcons 
                  name={currentMode?.icon} 
                  size={24} 
                  color={currentMode?.color} 
                />
              </View>
              <View>
                <Text className="font-inter-bold text-white text-lg">
                  {currentMode?.title}
                </Text>
                <Text className="font-inter text-white opacity-80 text-sm">
                  {currentMode?.subtitle}
                </Text>
              </View>
            </View>
            
            <Text className="font-inter text-white opacity-90 text-center text-sm leading-5">
              {scanMode === 'qr' && 'Position the QR code within the frame. Payment details will appear automatically.'}
              {scanMode === 'document' && 'Ensure the document is well-lit and all edges are visible within the frame.'}
              {scanMode === 'check' && 'Place the check flat and ensure all four corners are visible for processing.'}
              {scanMode === 'card' && 'Position the card within the frame. Only the card number and name will be captured.'}
            </Text>
            
            {scanCount > 0 && (
              <View className="mt-4 bg-opacity-20 rounded-xl p-3">
                <Text className="font-inter-semibold text-white text-center text-sm">
                  ✅ {scanCount} item(s) scanned
                </Text>
              </View>
            )}
          </View>
        </BlurView>
      </Animated.View>
    );
  };

  if (!permission) {
    return (
      <SafeAreaView className="flex-1 bg-black">
        <View className="flex-1 items-center justify-center">
          <Text className="font-inter text-white text-lg">Requesting camera permission...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView className="flex-1 bg-black">
        <LinearGradient
          colors={['#1f2937', '#111827']}
          className="flex-1"
        >
          <View className="flex-1 items-center justify-center px-8">
            <Animated.View
              style={[
                { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
              ]}
            >
              <BlurView intensity={30} tint="dark" style={styles.permissionCard}>
                <View className="p-8 items-center">
                  <View className="w-20 h-20 bg-blue-600 rounded-full items-center justify-center mb-6">
                    <MaterialIcons name="camera-alt" size={32} color="white" />
                  </View>
                  
                  <Text className="font-inter-bold text-white text-2xl text-center mb-4">
                    Camera Access Required
                  </Text>
                  <Text className="font-inter text-white opacity-90 text-center text-base leading-6 mb-8">
                    Finverse needs camera access to scan QR codes, documents, and checks for secure banking transactions.
                  </Text>
                  
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={requestPermission}
                    className="w-full"
                  >
                    <BlurView intensity={20} tint="light" style={styles.permissionButton}>
                      <LinearGradient
                        colors={['#3b82f6', '#1d4ed8']}
                        style={styles.permissionButtonGradient}
                      >
                        <MaterialIcons name="camera-alt" size={20} color="white" />
                        <Text className="font-inter-semibold text-white text-lg ml-2">
                          Grant Camera Access
                        </Text>
                      </LinearGradient>
                    </BlurView>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => router.back()}
                    className="mt-4"
                  >
                    <Text className="font-inter text-white opacity-70 text-base">
                      Go Back
                    </Text>
                  </TouchableOpacity>
                </View>
              </BlurView>
            </Animated.View>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      
      {/* Camera View */}
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        barcodeScannerSettings={{
          barcodeTypes: scanMode === 'qr' ? ['qr'] : ['qr', 'pdf417', 'datamatrix'],
        }}
        onBarcodeScanned={isScanning ? handleBarCodeScanned : undefined}
        flash={flashEnabled ? 'on' : 'off'}
      >
        {/* Scan Overlay */}
        {renderScanOverlay()}

        {/* Header Controls */}
        <Animated.View
          style={[
            styles.headerContainer,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
          ]}
        >
          <BlurView intensity={40} tint="dark" style={styles.headerBlur}>
            <View className="flex-row items-center justify-between px-6 py-4">
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => router.back()}
              >
                <BlurView intensity={25} tint="light" style={styles.headerButton}>
                  <MaterialIcons name="arrow-back" size={22} color="white" />
                </BlurView>
              </TouchableOpacity>
              
              <View className="items-center">
                <Text className="font-inter-bold text-white text-lg">
                  Finverse Scanner
                </Text>
                <Text className="font-inter text-white opacity-80 text-sm">
                  Secure • Encrypted • Instant
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={toggleFlash}
              >
                <BlurView intensity={25} tint="light" style={styles.headerButton}>
                  <MaterialIcons 
                    name={flashEnabled ? "flash-on" : "flash-off"} 
                    size={22} 
                    color={flashEnabled ? "#fbbf24" : "white"} 
                  />
                </BlurView>
              </TouchableOpacity>
            </View>
          </BlurView>
        </Animated.View>

        {/* Scan Info */}
        <View style={styles.scanInfoPosition}>
          {renderScanInfo()}
        </View>

        {/* Scan Mode Selector */}
        <View style={styles.scanModePosition}>
          {renderScanModeSelector()}
        </View>

        {/* Bottom Controls */}
        <Animated.View
          style={[
            styles.bottomControls,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          <BlurView intensity={40} tint="dark" style={styles.bottomBlur}>
            <View className="flex-row items-center justify-between px-8 py-6">
              {/* Gallery Button */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => Alert.alert('Gallery', 'Open photo gallery to select image for processing')}
              >
                <BlurView intensity={25} tint="light" style={styles.controlButton}>
                  <MaterialIcons name="photo-library" size={24} color="white" />
                </BlurView>
              </TouchableOpacity>

              {/* Manual Capture Button */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  // Manual capture logic
                  Alert.alert('Capture', 'Manual capture feature - take photo for processing');
                }}
              >
                <Animated.View
                  style={[
                    styles.captureButton,
                    { transform: [{ scale: pulseAnim }] }
                  ]}
                >
                  <BlurView intensity={30} tint="light" style={styles.captureButtonBlur}>
                    <LinearGradient
                      colors={['#3b82f6', '#1d4ed8']}
                      style={styles.captureButtonGradient}
                    >
                      <MaterialIcons name="camera-alt" size={32} color="white" />
                    </LinearGradient>
                  </BlurView>
                </Animated.View>
              </TouchableOpacity>

              {/* Settings Button */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => Alert.alert('Scanner Settings', 'Configure scanner preferences and sensitivity')}
              >
                <BlurView intensity={25} tint="light" style={styles.controlButton}>
                  <MaterialIcons name="tune" size={24} color="white" />
                </BlurView>
              </TouchableOpacity>
            </View>
          </BlurView>
        </Animated.View>

        {/* Security Badge */}
        <Animated.View
          style={[
            styles.securityBadge,
            { opacity: fadeAnim }
          ]}
        >
          <BlurView intensity={30} tint="dark" style={styles.securityBlur}>
            <View className="flex-row items-center px-3 py-2">
              <MaterialIcons name="security" size={16} color="#10b981" />
              <Text className="font-inter-medium text-white text-xs ml-2">
                256-bit Encrypted
              </Text>
            </View>
          </BlurView>
        </Animated.View>
      </CameraView>
    </View>
  );
};

export default Scan;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },

  // Header Styles
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerBlur: {
    marginHorizontal: 16,
    marginTop: Platform.OS === 'ios' ? 50 : 20,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },

  // Scan Overlay Styles
  scanOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black',
  },
  scanFrame: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  cornerBracket: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    top: 0,
  },
  centerDot: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 20,
    height: 20,
    marginTop: -10,
    marginLeft: -10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  // Scan Info Styles
  scanInfoPosition: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 140 : 120,
    left: 16,
    right: 16,
  },
  scanInfoContainer: {
    alignItems: 'center',
  },
  scanInfoBlur: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },

  // Scan Mode Styles
  scanModePosition: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 160 : 140,
    left: 16,
    right: 16,
  },
  scanModeContainer: {
    alignItems: 'center',
  },
  scanModeBlur: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  modeButton: {
    width: 70,
    height: 70,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  modeButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },

  // Bottom Controls Styles
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomBlur: {
    marginHorizontal: 16,
    marginBottom: Platform.OS === 'ios' ? 34 : 16,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  captureButtonBlur: {
    flex: 1,
    borderRadius: 40,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  captureButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
  },

  // Security Badge Styles
  securityBadge: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 120 : 100,
    right: 20,
  },
  securityBlur: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },

  // Permission Styles
  permissionButton: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  permissionButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    flexDirection: 'row',
  },
});