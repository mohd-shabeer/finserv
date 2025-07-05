import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    Modal,
    ScrollView,
    StatusBar,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, {
    FadeInRight,
    SlideInLeft,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const SecuritySettingsPage = () => {
  const [activeTab, setActiveTab] = useState('authentication');
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showChangePinModal, setShowChangePinModal] = useState(false);
  const [showDevicesModal, setShowDevicesModal] = useState(false);
  
  // Security toggles
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [transactionSMSEnabled, setTransactionSMSEnabled] = useState(true);
  const [loginAlertsEnabled, setLoginAlertsEnabled] = useState(true);
  const [autoLockEnabled, setAutoLockEnabled] = useState(true);
  const [screenRecordingBlocked, setScreenRecordingBlocked] = useState(true);

  // Form fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  const animatedValue = useSharedValue(0);
  const modalScale = useSharedValue(0);

  useEffect(() => {
    animatedValue.value = withSpring(1);
  }, []);

  const securitySections = {
    authentication: [
      {
        id: 'biometric',
        title: 'Biometric Authentication',
        subtitle: 'Use Face ID or Touch ID to login',
        icon: 'finger-print',
        type: 'toggle',
        value: biometricEnabled,
        onToggle: setBiometricEnabled,
        color: '#10b981'
      },
      {
        id: 'two-factor',
        title: 'Two-Factor Authentication',
        subtitle: 'Extra security with SMS or authenticator',
        icon: 'shield-checkmark',
        type: 'toggle',
        value: twoFactorEnabled,
        onToggle: setTwoFactorEnabled,
        color: '#3b82f6'
      },
      {
        id: 'change-password',
        title: 'Change Login Password',
        subtitle: 'Update your account password',
        icon: 'key',
        type: 'action',
        onPress: () => openModal('password'),
        color: '#f59e0b'
      },
      {
        id: 'change-pin',
        title: 'Change Transaction PIN',
        subtitle: 'Update your 4-digit transaction PIN',
        icon: 'keypad',
        type: 'action',
        onPress: () => openModal('pin'),
        color: '#ef4444'
      },
      {
        id: 'auto-lock',
        title: 'Auto-Lock App',
        subtitle: 'Lock app after 5 minutes of inactivity',
        icon: 'lock-closed',
        type: 'toggle',
        value: autoLockEnabled,
        onToggle: setAutoLockEnabled,
        color: '#8b5cf6'
      }
    ],
    notifications: [
      {
        id: 'transaction-sms',
        title: 'Transaction SMS Alerts',
        subtitle: 'Get SMS for all transactions',
        icon: 'chatbubble-ellipses',
        type: 'toggle',
        value: transactionSMSEnabled,
        onToggle: setTransactionSMSEnabled,
        color: '#10b981'
      },
      {
        id: 'login-alerts',
        title: 'Login Notifications',
        subtitle: 'Alert for new device logins',
        icon: 'notifications',
        type: 'toggle',
        value: loginAlertsEnabled,
        onToggle: setLoginAlertsEnabled,
        color: '#3b82f6'
      },
      {
        id: 'suspicious-activity',
        title: 'Suspicious Activity Alerts',
        subtitle: 'Immediate alerts for unusual activity',
        icon: 'warning',
        type: 'info',
        value: true,
        color: '#ef4444'
      }
    ],
    privacy: [
      {
        id: 'screen-recording',
        title: 'Block Screen Recording',
        subtitle: 'Prevent screenshots and screen recording',
        icon: 'videocam-off',
        type: 'toggle',
        value: screenRecordingBlocked,
        onToggle: setScreenRecordingBlocked,
        color: '#ef4444'
      },
      {
        id: 'session-timeout',
        title: 'Session Timeout',
        subtitle: 'Auto logout after 30 minutes',
        icon: 'time',
        type: 'info',
        value: '30 minutes',
        color: '#f59e0b'
      },
      {
        id: 'data-encryption',
        title: 'Data Encryption',
        subtitle: 'All data encrypted with AES-256',
        icon: 'shield',
        type: 'info',
        value: 'AES-256',
        color: '#10b981'
      }
    ],
    devices: [
      {
        id: 'trusted-devices',
        title: 'Trusted Devices',
        subtitle: 'Manage your trusted devices',
        icon: 'phone-portrait',
        type: 'action',
        onPress: () => openModal('devices'),
        color: '#3b82f6'
      },
      {
        id: 'active-sessions',
        title: 'Active Sessions',
        subtitle: 'View and manage active sessions',
        icon: 'desktop',
        type: 'action',
        onPress: () => Alert.alert('Active Sessions', 'Feature coming soon'),
        color: '#8b5cf6'
      }
    ]
  };

  const trustedDevices = [
    {
      id: 1,
      name: 'iPhone 14 Pro',
      type: 'Mobile',
      lastActive: '2 minutes ago',
      location: 'Bangalore, India',
      isCurrent: true,
      icon: 'phone-portrait'
    },
    {
      id: 2,
      name: 'MacBook Pro',
      type: 'Desktop',
      lastActive: '2 hours ago',
      location: 'Bangalore, India',
      isCurrent: false,
      icon: 'laptop'
    },
    {
      id: 3,
      name: 'iPad Air',
      type: 'Tablet',
      lastActive: '1 day ago',
      location: 'Mumbai, India',
      isCurrent: false,
      icon: 'tablet-portrait'
    }
  ];

  const securityScore = {
    total: 85,
    factors: [
      { name: 'Strong Password', score: 20, enabled: true },
      { name: 'Two-Factor Auth', score: 25, enabled: twoFactorEnabled },
      { name: 'Biometric Login', score: 20, enabled: biometricEnabled },
      { name: 'Device Security', score: 15, enabled: true },
      { name: 'Regular Updates', score: 5, enabled: true }
    ]
  };

  const openModal = (type) => {
    if (type === 'password') setShowChangePasswordModal(true);
    else if (type === 'pin') setShowChangePinModal(true);
    else if (type === 'devices') setShowDevicesModal(true);
    modalScale.value = withSpring(1);
  };

  const closeModal = () => {
    modalScale.value = withTiming(0, { duration: 200 });
    setTimeout(() => {
      setShowChangePasswordModal(false);
      setShowChangePinModal(false);
      setShowDevicesModal(false);
      // Reset form fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setCurrentPin('');
      setNewPin('');
      setConfirmPin('');
    }, 200);
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }
    closeModal();
    Alert.alert('Success', 'Password changed successfully');
  };

  const handleChangePin = () => {
    if (!currentPin || !newPin || !confirmPin) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    if (newPin !== confirmPin) {
      Alert.alert('Error', 'New PINs do not match');
      return;
    }
    if (newPin.length !== 4) {
      Alert.alert('Error', 'PIN must be 4 digits');
      return;
    }
    closeModal();
    Alert.alert('Success', 'Transaction PIN changed successfully');
  };

  const modalAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: modalScale.value }],
      opacity: modalScale.value,
    };
  });

  const renderSecurityItem = (item, index) => (
    <Animated.View
      entering={SlideInLeft.delay(index * 100).springify()}
      key={item.id}
      className="bg-white rounded-2xl p-4 mb-4 border border-gray-100"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View
            className="w-12 h-12 rounded-2xl items-center justify-center mr-3"
            style={{ backgroundColor: `${item.color}15` }}
          >
            <Ionicons name={item.icon} size={24} color={item.color} />
          </View>
          <View className="flex-1">
            <Text className="text-base font-bold text-gray-800">
              {item.title}
            </Text>
            <Text className="text-sm text-gray-600 mt-1">
              {item.subtitle}
            </Text>
          </View>
        </View>
        
        {item.type === 'toggle' && (
          <Switch
            value={item.value}
            onValueChange={item.onToggle}
            trackColor={{ false: '#e5e7eb', true: `${item.color}30` }}
            thumbColor={item.value ? item.color : '#f3f4f6'}
          />
        )}
        
        {item.type === 'action' && (
          <TouchableOpacity onPress={item.onPress}>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
        )}
        
        {item.type === 'info' && (
          <View className="items-end">
            <Text className="text-sm font-medium text-gray-700">
              {typeof item.value === 'string' ? item.value : 'Enabled'}
            </Text>
            <Ionicons name="checkmark-circle" size={16} color={item.color} />
          </View>
        )}
      </View>
    </Animated.View>
  );

  const renderTrustedDevice = (device, index) => (
    <Animated.View
      entering={SlideInLeft.delay(index * 100).springify()}
      key={device.id}
      className="bg-white rounded-2xl p-4 mb-4 border border-gray-100"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View className="w-12 h-12 bg-blue-100 rounded-2xl items-center justify-center mr-3">
            <Ionicons name={device.icon} size={24} color="#3b82f6" />
          </View>
          <View className="flex-1">
            <View className="flex-row items-center">
              <Text className="text-base font-bold text-gray-800">
                {device.name}
              </Text>
              {device.isCurrent && (
                <View className="bg-green-100 px-2 py-1 rounded-full ml-2">
                  <Text className="text-xs font-medium text-green-700">
                    Current
                  </Text>
                </View>
              )}
            </View>
            <Text className="text-sm text-gray-600">
              {device.type} • {device.lastActive}
            </Text>
            <Text className="text-xs text-gray-500">
              {device.location}
            </Text>
          </View>
        </View>
        {!device.isCurrent && (
          <TouchableOpacity className="bg-red-100 px-3 py-2 rounded-xl">
            <Text className="text-red-700 text-xs font-medium">
              Remove
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );

  const renderChangePasswordModal = () => (
    <Modal
      visible={showChangePasswordModal}
      transparent={true}
      animationType="fade"
      onRequestClose={closeModal}
    >
      <View className="flex-1 bg-black bg-opacity-50 justify-center items-center px-4">
        <Animated.View
          style={modalAnimatedStyle}
          className="bg-white rounded-3xl p-6 w-full max-w-sm"
        >
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-xl font-bold text-gray-800">
              Change Password
            </Text>
            <TouchableOpacity onPress={closeModal}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Current Password
            </Text>
            <TextInput
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Enter current password"
              secureTextEntry
              className="bg-gray-50 rounded-xl p-4 text-base"
            />
          </View>

          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              New Password
            </Text>
            <TextInput
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Enter new password"
              secureTextEntry
              className="bg-gray-50 rounded-xl p-4 text-base"
            />
          </View>

          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </Text>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm new password"
              secureTextEntry
              className="bg-gray-50 rounded-xl p-4 text-base"
            />
          </View>

          <TouchableOpacity
            onPress={handleChangePassword}
            className="bg-blue-600 py-4 rounded-xl mb-3"
          >
            <Text className="text-white text-center font-semibold">
              Change Password
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={closeModal}>
            <Text className="text-gray-600 text-center font-medium">
              Cancel
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );

  const renderChangePinModal = () => (
    <Modal
      visible={showChangePinModal}
      transparent={true}
      animationType="fade"
      onRequestClose={closeModal}
    >
      <View className="flex-1 bg-black bg-opacity-50 justify-center items-center px-4">
        <Animated.View
          style={modalAnimatedStyle}
          className="bg-white rounded-3xl p-6 w-full max-w-sm"
        >
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-xl font-bold text-gray-800">
              Change Transaction PIN
            </Text>
            <TouchableOpacity onPress={closeModal}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Current PIN
            </Text>
            <TextInput
              value={currentPin}
              onChangeText={setCurrentPin}
              placeholder="Enter current PIN"
              secureTextEntry
              keyboardType="numeric"
              maxLength={4}
              className="bg-gray-50 rounded-xl p-4 text-base text-center"
            />
          </View>

          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              New PIN
            </Text>
            <TextInput
              value={newPin}
              onChangeText={setNewPin}
              placeholder="Enter new PIN"
              secureTextEntry
              keyboardType="numeric"
              maxLength={4}
              className="bg-gray-50 rounded-xl p-4 text-base text-center"
            />
          </View>

          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Confirm New PIN
            </Text>
            <TextInput
              value={confirmPin}
              onChangeText={setConfirmPin}
              placeholder="Confirm new PIN"
              secureTextEntry
              keyboardType="numeric"
              maxLength={4}
              className="bg-gray-50 rounded-xl p-4 text-base text-center"
            />
          </View>

          <TouchableOpacity
            onPress={handleChangePin}
            className="bg-blue-600 py-4 rounded-xl mb-3"
          >
            <Text className="text-white text-center font-semibold">
              Change PIN
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={closeModal}>
            <Text className="text-gray-600 text-center font-medium">
              Cancel
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );

  const renderDevicesModal = () => (
    <Modal
      visible={showDevicesModal}
      transparent={true}
      animationType="fade"
      onRequestClose={closeModal}
    >
      <View className="flex-1 bg-black bg-opacity-50 justify-center items-center px-4">
        <Animated.View
          style={modalAnimatedStyle}
          className="bg-white rounded-3xl p-6 w-full max-w-md max-h-4/5"
        >
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-xl font-bold text-gray-800">
              Trusted Devices
            </Text>
            <TouchableOpacity onPress={closeModal}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {trustedDevices.map(renderTrustedDevice)}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );

  const tabs = [
    { id: 'authentication', name: 'Authentication', icon: 'lock-closed-outline' },
    { id: 'notifications', name: 'Alerts', icon: 'notifications-outline' },
    { id: 'privacy', name: 'Privacy', icon: 'shield-outline' },
    { id: 'devices', name: 'Devices', icon: 'phone-portrait-outline' }
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" backgroundColor="#ef4444" />
      
      {/* Header */}
      <LinearGradient
        colors={['#ef4444', '#dc2626']}
        className="pt-12 pb-6 px-4"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity className="mr-3" onPress={()=>router.back()}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-white">Security Settings</Text>
          </View>
          <View className="bg-opacity-20 rounded-full px-3 py-1">
            <Text className="text-white text-sm font-bold">
              {securityScore.total}% Secure
            </Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Security Score */}
        <Animated.View
          entering={FadeInRight.delay(200).springify()}
          className="mx-4 mt-6 mb-6"
        >
          <View className="bg-white rounded-2xl p-4 border border-gray-100">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-bold text-gray-800">
                Security Score
              </Text>
              <View className="flex-row items-center">
                <Ionicons name="shield-checkmark" size={20} color="#10b981" />
                <Text className="text-lg font-bold text-green-600 ml-1">
                  {securityScore.total}%
                </Text>
              </View>
            </View>
            <View className="w-full h-2 bg-gray-200 rounded-full mb-3">
              <View
                className="h-full bg-green-500 rounded-full"
                style={{ width: `${securityScore.total}%` }}
              />
            </View>
            <Text className="text-sm text-gray-600">
              Great! Your account has strong security. Keep it up!
            </Text>
          </View>
        </Animated.View>

        {/* Tabs */}
        <View className="px-4 mb-4">
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 16 }}
          >
            {tabs.map((tab, index) => (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                className={`mr-4 px-4 py-3 rounded-2xl border ${
                  activeTab === tab.id 
                    ? 'border-red-600 bg-red-600' 
                    : 'border-gray-200 bg-white'
                }`}
              >
                <View className="flex-row items-center">
                  <Ionicons 
                    name={tab.icon} 
                    size={18} 
                    color={activeTab === tab.id ? 'white' : '#6b7280'} 
                  />
                  <Text 
                    className={`ml-2 font-medium text-sm ${
                      activeTab === tab.id ? 'text-white' : 'text-gray-700'
                    }`}
                  >
                    {tab.name}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Content */}
        <View className="px-4 pb-20">
          {securitySections[activeTab]?.map(renderSecurityItem)}
        </View>
      </ScrollView>

      {renderChangePasswordModal()}
      {renderChangePinModal()}
      {renderDevicesModal()}
    </View>
  );
};

export default SecuritySettingsPage;