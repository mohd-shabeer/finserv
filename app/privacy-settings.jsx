import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    Linking,
    Modal,
    ScrollView,
    StatusBar,
    Switch,
    Text,
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

const PrivacySettingsPage = () => {
  const [activeTab, setActiveTab] = useState('data-sharing');
  const [showDataExportModal, setShowDataExportModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  
  // Privacy toggles
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [thirdPartySharing, setThirdPartySharing] = useState(false);
  const [locationTracking, setLocationTracking] = useState(true);
  const [crashReporting, setCrashReporting] = useState(true);
  const [personalizedAds, setPersonalizedAds] = useState(false);
  const [dataCollection, setDataCollection] = useState(true);
  const [cookieConsent, setCookieConsent] = useState(true);

  const animatedValue = useSharedValue(0);
  const modalScale = useSharedValue(0);

  useEffect(() => {
    animatedValue.value = withSpring(1);
  }, []);

  const privacySections = {
    'data-sharing': [
      {
        id: 'analytics',
        title: 'Usage Analytics',
        subtitle: 'Help us improve the app with usage data',
        description: 'Anonymous data about how you use the app to improve features and performance.',
        icon: 'analytics',
        type: 'toggle',
        value: analyticsEnabled,
        onToggle: setAnalyticsEnabled,
        color: '#3b82f6',
        impact: 'Medium'
      },
      {
        id: 'marketing',
        title: 'Marketing Communications',
        subtitle: 'Receive personalized offers and promotions',
        description: 'Use your data to send relevant offers, product updates, and promotional content.',
        icon: 'megaphone',
        type: 'toggle',
        value: marketingConsent,
        onToggle: setMarketingConsent,
        color: '#f59e0b',
        impact: 'Low'
      },
      {
        id: 'third-party',
        title: 'Third-Party Data Sharing',
        subtitle: 'Share data with partner services',
        description: 'Limited sharing with trusted partners for service improvement and fraud prevention.',
        icon: 'share',
        type: 'toggle',
        value: thirdPartySharing,
        onToggle: setThirdPartySharing,
        color: '#ef4444',
        impact: 'High'
      },
      {
        id: 'location',
        title: 'Location Services',
        subtitle: 'Use location for ATM/branch finder',
        description: 'Access your location to provide nearby ATM locations and branch services.',
        icon: 'location',
        type: 'toggle',
        value: locationTracking,
        onToggle: setLocationTracking,
        color: '#10b981',
        impact: 'Medium'
      }
    ],
    'data-collection': [
      {
        id: 'crash-reporting',
        title: 'Crash Reporting',
        subtitle: 'Automatically report app crashes',
        description: 'Send crash reports to help us fix bugs and improve app stability.',
        icon: 'bug',
        type: 'toggle',
        value: crashReporting,
        onToggle: setCrashReporting,
        color: '#ef4444',
        impact: 'Low'
      },
      {
        id: 'data-collection-main',
        title: 'Data Collection',
        subtitle: 'Collect data for service improvement',
        description: 'Collect transaction patterns and usage data to enhance banking services.',
        icon: 'server',
        type: 'toggle',
        value: dataCollection,
        onToggle: setDataCollection,
        color: '#8b5cf6',
        impact: 'High'
      },
      {
        id: 'personalized-ads',
        title: 'Personalized Advertising',
        subtitle: 'Show relevant ads based on your activity',
        description: 'Use your banking activity to show relevant financial product advertisements.',
        icon: 'tv',
        type: 'toggle',
        value: personalizedAds,
        onToggle: setPersonalizedAds,
        color: '#f59e0b',
        impact: 'Medium'
      },
      {
        id: 'cookies',
        title: 'Cookie Preferences',
        subtitle: 'Allow cookies for web services',
        description: 'Store cookies to remember your preferences and improve web experience.',
        icon: 'globe',
        type: 'toggle',
        value: cookieConsent,
        onToggle: setCookieConsent,
        color: '#06b6d4',
        impact: 'Low'
      }
    ],
    'data-rights': [
      {
        id: 'export-data',
        title: 'Export My Data',
        subtitle: 'Download a copy of your data',
        description: 'Get a complete copy of all data associated with your account.',
        icon: 'download',
        type: 'action',
        onPress: () => openModal('export'),
        color: '#10b981'
      },
      {
        id: 'delete-data',
        title: 'Delete Specific Data',
        subtitle: 'Remove certain types of data',
        description: 'Choose specific data categories to remove from your account.',
        icon: 'trash',
        type: 'action',
        onPress: () => Alert.alert('Delete Data', 'Contact support to delete specific data categories'),
        color: '#f59e0b'
      },
      {
        id: 'data-portability',
        title: 'Data Portability',
        subtitle: 'Transfer data to another service',
        description: 'Request to transfer your data to another financial service provider.',
        icon: 'swap-horizontal',
        type: 'action',
        onPress: () => Alert.alert('Data Portability', 'Feature coming soon - contact support for assistance'),
        color: '#3b82f6'
      },
      {
        id: 'delete-account',
        title: 'Delete Account',
        subtitle: 'Permanently delete your account',
        description: 'This will permanently delete your account and all associated data.',
        icon: 'close-circle',
        type: 'action',
        onPress: () => openModal('delete'),
        color: '#ef4444'
      }
    ],
    'permissions': [
      {
        id: 'app-permissions',
        title: 'App Permissions',
        subtitle: 'Manage device permissions',
        description: 'Control what device features the app can access.',
        icon: 'settings',
        type: 'action',
        onPress: () => openModal('permissions'),
        color: '#8b5cf6'
      },
      {
        id: 'biometric-consent',
        title: 'Biometric Data Consent',
        subtitle: 'Face ID / Touch ID usage',
        description: 'How we store and use your biometric authentication data.',
        icon: 'finger-print',
        type: 'info',
        value: 'Stored locally only',
        color: '#10b981'
      },
      {
        id: 'contact-access',
        title: 'Contact List Access',
        subtitle: 'Access contacts for transfers',
        description: 'Read your contacts to make money transfers easier.',
        icon: 'people',
        type: 'info',
        value: 'Enabled',
        color: '#f59e0b'
      }
    ]
  };

  const dataCategories = [
    { name: 'Transaction History', size: '2.3 MB', type: 'Financial' },
    { name: 'Account Information', size: '156 KB', type: 'Personal' },
    { name: 'Profile Data', size: '89 KB', type: 'Personal' },
    { name: 'Device Information', size: '45 KB', type: 'Technical' },
    { name: 'Usage Analytics', size: '1.1 MB', type: 'Behavioral' },
    { name: 'Communication Logs', size: '234 KB', type: 'Support' }
  ];

  const appPermissions = [
    { name: 'Camera', status: 'Granted', description: 'For document scanning and QR codes', icon: 'camera' },
    { name: 'Location', status: 'Granted', description: 'Find nearby ATMs and branches', icon: 'location' },
    { name: 'Contacts', status: 'Granted', description: 'Quick money transfers to contacts', icon: 'people' },
    { name: 'Notifications', status: 'Granted', description: 'Transaction alerts and updates', icon: 'notifications' },
    { name: 'Biometrics', status: 'Granted', description: 'Face ID and Touch ID authentication', icon: 'finger-print' },
    { name: 'Microphone', status: 'Denied', description: 'Voice commands (optional)', icon: 'mic' }
  ];

  const openModal = (type) => {
    if (type === 'export') setShowDataExportModal(true);
    else if (type === 'delete') setShowDeleteAccountModal(true);
    else if (type === 'permissions') setShowPermissionsModal(true);
    modalScale.value = withSpring(1);
  };

  const closeModal = () => {
    modalScale.value = withTiming(0, { duration: 200 });
    setTimeout(() => {
      setShowDataExportModal(false);
      setShowDeleteAccountModal(false);
      setShowPermissionsModal(false);
    }, 200);
  };

  const handleExportData = () => {
    closeModal();
    Alert.alert(
      'Data Export Requested', 
      'Your data export will be ready within 24 hours. We\'ll send you an email with download instructions.',
      [{ text: 'OK' }]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Confirm Account Deletion',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            closeModal();
            Alert.alert('Account Deletion', 'Your account deletion request has been submitted. This process may take up to 7 days.');
          }
        }
      ]
    );
  };

  const modalAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: modalScale.value }],
      opacity: modalScale.value,
    };
  });

  const renderPrivacyItem = (item, index) => (
    <Animated.View
      entering={SlideInLeft.delay(index * 100).springify()}
      key={item.id}
      className="bg-white rounded-2xl p-4 mb-4 border border-gray-100"
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-row items-start flex-1">
          <View
            className="w-12 h-12 rounded-2xl items-center justify-center mr-3"
            style={{ backgroundColor: `${item.color}15` }}
          >
            <Ionicons name={item.icon} size={24} color={item.color} />
          </View>
          <View className="flex-1">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-base font-bold text-gray-800">
                {item.title}
              </Text>
              {item.impact && (
                <View className={`px-2 py-1 rounded-full ${
                  item.impact === 'High' ? 'bg-red-100' :
                  item.impact === 'Medium' ? 'bg-orange-100' : 'bg-green-100'
                }`}>
                  <Text className={`text-xs font-medium ${
                    item.impact === 'High' ? 'text-red-700' :
                    item.impact === 'Medium' ? 'text-orange-700' : 'text-green-700'
                  }`}>
                    {item.impact} Impact
                  </Text>
                </View>
              )}
            </View>
            <Text className="text-sm text-gray-600 mb-2">
              {item.subtitle}
            </Text>
            <Text className="text-xs text-gray-500 leading-4">
              {item.description}
            </Text>
          </View>
        </View>
        
        <View className="ml-3 mt-1">
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
                {item.value}
              </Text>
              <Ionicons name="checkmark-circle" size={16} color={item.color} />
            </View>
          )}
        </View>
      </View>
    </Animated.View>
  );

  const renderDataCategory = (category, index) => (
    <View key={index} className="flex-row items-center justify-between py-3 border-b border-gray-100">
      <View className="flex-1">
        <Text className="text-base font-medium text-gray-800">
          {category.name}
        </Text>
        <Text className="text-sm text-gray-500">
          {category.type} • {category.size}
        </Text>
      </View>
      <View className="bg-blue-100 px-2 py-1 rounded">
        <Text className="text-xs font-medium text-blue-700">
          Include
        </Text>
      </View>
    </View>
  );

  const renderPermission = (permission, index) => (
    <View key={index} className="flex-row items-center justify-between py-4 border-b border-gray-100">
      <View className="flex-row items-center flex-1">
        <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
          permission.status === 'Granted' ? 'bg-green-100' : 'bg-red-100'
        }`}>
          <Ionicons 
            name={permission.icon} 
            size={20} 
            color={permission.status === 'Granted' ? '#10b981' : '#ef4444'} 
          />
        </View>
        <View className="flex-1">
          <Text className="text-base font-medium text-gray-800">
            {permission.name}
          </Text>
          <Text className="text-sm text-gray-500">
            {permission.description}
          </Text>
        </View>
      </View>
      <TouchableOpacity 
        onPress={() => permission.status === 'Denied' && Linking.openSettings()}
        className={`px-3 py-2 rounded-xl ${
          permission.status === 'Granted' ? 'bg-green-100' : 'bg-orange-100'
        }`}
      >
        <Text className={`text-xs font-medium ${
          permission.status === 'Granted' ? 'text-green-700' : 'text-orange-700'
        }`}>
          {permission.status === 'Granted' ? 'Granted' : 'Enable'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderDataExportModal = () => (
    <Modal
      visible={showDataExportModal}
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
              Export My Data
            </Text>
            <TouchableOpacity onPress={closeModal}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <View className="mb-4">
            <Text className="text-sm text-gray-600 mb-4">
              Select the data categories you want to include in your export:
            </Text>
            <ScrollView className="max-h-64">
              {dataCategories.map(renderDataCategory)}
            </ScrollView>
          </View>

          <View className="bg-blue-50 rounded-xl p-4 mb-6">
            <Text className="text-sm text-blue-800 font-medium mb-1">
              Data Export Information
            </Text>
            <Text className="text-xs text-blue-700">
              • Export will be available for 7 days{'\n'}
              • Data will be in JSON format{'\n'}
              • You'll receive an email with download link
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleExportData}
            className="bg-blue-600 py-4 rounded-xl mb-3"
          >
            <Text className="text-white text-center font-semibold">
              Request Data Export
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

  const renderDeleteAccountModal = () => (
    <Modal
      visible={showDeleteAccountModal}
      transparent={true}
      animationType="fade"
      onRequestClose={closeModal}
    >
      <View className="flex-1 bg-black bg-opacity-50 justify-center items-center px-4">
        <Animated.View
          style={modalAnimatedStyle}
          className="bg-white rounded-3xl p-6 w-full max-w-sm"
        >
          <View className="items-center mb-6">
            <View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-4">
              <Ionicons name="warning" size={32} color="#ef4444" />
            </View>
            <Text className="text-xl font-bold text-gray-800 text-center">
              Delete Account
            </Text>
            <Text className="text-sm text-gray-600 text-center mt-2">
              This action cannot be undone. All your data will be permanently deleted.
            </Text>
          </View>

          <View className="bg-red-50 rounded-xl p-4 mb-6">
            <Text className="text-sm text-red-800 font-medium mb-2">
              What will be deleted:
            </Text>
            <Text className="text-xs text-red-700">
              • All account information{'\n'}
              • Transaction history{'\n'}
              • Saved preferences{'\n'}
              • Linked accounts{'\n'}
              • All personal data
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleDeleteAccount}
            className="bg-red-600 py-4 rounded-xl mb-3"
          >
            <Text className="text-white text-center font-semibold">
              Delete My Account
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

  const renderPermissionsModal = () => (
    <Modal
      visible={showPermissionsModal}
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
              App Permissions
            </Text>
            <TouchableOpacity onPress={closeModal}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {appPermissions.map(renderPermission)}
          </ScrollView>

          <TouchableOpacity
            onPress={() => Linking.openSettings()}
            className="bg-blue-600 py-4 rounded-xl mt-4"
          >
            <Text className="text-white text-center font-semibold">
              Open Settings
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );

  const tabs = [
    { id: 'data-sharing', name: 'Data Sharing', icon: 'share-outline' },
    { id: 'data-collection', name: 'Collection', icon: 'server-outline' },
    { id: 'data-rights', name: 'Your Rights', icon: 'shield-outline' },
    { id: 'permissions', name: 'Permissions', icon: 'settings-outline' }
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" backgroundColor="#8b5cf6" />
      
      {/* Header */}
      <LinearGradient
        colors={['#8b5cf6', '#7c3aed']}
        className="pt-12 pb-6 px-4"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity className="mr-3" onPress={()=>router.back()}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-white">Privacy Settings</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="information-circle-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Privacy Overview */}
        <Animated.View
          entering={FadeInRight.delay(200).springify()}
          className="mx-4 mt-6 mb-6"
        >
          <View className="bg-white rounded-2xl p-4 border border-gray-100">
            <View className="flex-row items-center mb-3">
              <View className="w-12 h-12 bg-purple-100 rounded-2xl items-center justify-center mr-3">
                <Ionicons name="shield-checkmark" size={24} color="#8b5cf6" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-800">
                  Your Privacy Matters
                </Text>
                <Text className="text-sm text-gray-600">
                  Control how your data is used and shared
                </Text>
              </View>
            </View>
            <Text className="text-xs text-gray-500 leading-4">
              We're committed to protecting your privacy. These settings give you control over your personal data and how it's used to improve your banking experience.
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
                    ? 'border-purple-600 bg-purple-600' 
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
          {privacySections[activeTab]?.map(renderPrivacyItem)}
        </View>
      </ScrollView>

      {renderDataExportModal()}
      {renderDeleteAccountModal()}
      {renderPermissionsModal()}
    </View>
  );
};

export default PrivacySettingsPage;