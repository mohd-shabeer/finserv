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

const LanguageSettingsPage = () => {
  const [activeTab, setActiveTab] = useState('language');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedRegion, setSelectedRegion] = useState('IN');
  const [selectedCurrency, setSelectedCurrency] = useState('INR');
  const [searchQuery, setSearchQuery] = useState('');
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  
  // Preferences
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [rtlSupport, setRtlSupport] = useState(false);
  const [voiceLanguage, setVoiceLanguage] = useState('en-IN');
  const [keyboardLanguage, setKeyboardLanguage] = useState('en');

  const animatedValue = useSharedValue(0);
  const modalScale = useSharedValue(0);

  useEffect(() => {
    animatedValue.value = withSpring(1);
  }, []);

  const languages = [
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      flag: '🇺🇸',
      completion: 100,
      popular: true,
      rtl: false
    },
    {
      code: 'hi',
      name: 'Hindi',
      nativeName: 'हिन्दी',
      flag: '🇮🇳',
      completion: 95,
      popular: true,
      rtl: false
    },
    {
      code: 'bn',
      name: 'Bengali',
      nativeName: 'বাংলা',
      flag: '🇧🇩',
      completion: 90,
      popular: true,
      rtl: false
    },
    {
      code: 'te',
      name: 'Telugu',
      nativeName: 'తెలుగు',
      flag: '🇮🇳',
      completion: 88,
      popular: true,
      rtl: false
    },
    {
      code: 'mr',
      name: 'Marathi',
      nativeName: 'मराठी',
      flag: '🇮🇳',
      completion: 85,
      popular: true,
      rtl: false
    },
    {
      code: 'ta',
      name: 'Tamil',
      nativeName: 'தமிழ்',
      flag: '🇮🇳',
      completion: 87,
      popular: true,
      rtl: false
    },
    {
      code: 'gu',
      name: 'Gujarati',
      nativeName: 'ગુજરાતી',
      flag: '🇮🇳',
      completion: 83,
      popular: true,
      rtl: false
    },
    {
      code: 'kn',
      name: 'Kannada',
      nativeName: 'ಕನ್ನಡ',
      flag: '🇮🇳',
      completion: 82,
      popular: true,
      rtl: false
    },
    {
      code: 'ml',
      name: 'Malayalam',
      nativeName: 'മലയാളം',
      flag: '🇮🇳',
      completion: 80,
      popular: false,
      rtl: false
    },
    {
      code: 'pa',
      name: 'Punjabi',
      nativeName: 'ਪੰਜਾਬੀ',
      flag: '🇮🇳',
      completion: 78,
      popular: false,
      rtl: false
    },
    {
      code: 'or',
      name: 'Odia',
      nativeName: 'ଓଡ଼ିଆ',
      flag: '🇮🇳',
      completion: 75,
      popular: false,
      rtl: false
    },
    {
      code: 'as',
      name: 'Assamese',
      nativeName: 'অসমীয়া',
      flag: '🇮🇳',
      completion: 72,
      popular: false,
      rtl: false
    },
    {
      code: 'ur',
      name: 'Urdu',
      nativeName: 'اردو',
      flag: '🇵🇰',
      completion: 85,
      popular: false,
      rtl: true
    },
    {
      code: 'ar',
      name: 'Arabic',
      nativeName: 'العربية',
      flag: '🇸🇦',
      completion: 70,
      popular: false,
      rtl: true
    }
  ];

  const regions = [
    { code: 'IN', name: 'India', flag: '🇮🇳', popular: true },
    { code: 'US', name: 'United States', flag: '🇺🇸', popular: true },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', popular: true },
    { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', popular: true },
    { code: 'SG', name: 'Singapore', flag: '🇸🇬', popular: true },
    { code: 'AU', name: 'Australia', flag: '🇦🇺', popular: false },
    { code: 'CA', name: 'Canada', flag: '🇨🇦', popular: false },
    { code: 'DE', name: 'Germany', flag: '🇩🇪', popular: false },
    { code: 'FR', name: 'France', flag: '🇫🇷', popular: false },
    { code: 'JP', name: 'Japan', flag: '🇯🇵', popular: false }
  ];

  const currencies = [
    { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳', popular: true },
    { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸', popular: true },
    { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', popular: true },
    { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧', popular: true },
    { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪', popular: true },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬', popular: false },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺', popular: false },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦', popular: false },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵', popular: false },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭', popular: false }
  ];

  const languageFeatures = [
    {
      id: 'auto-translate',
      title: 'Auto Translation',
      subtitle: 'Automatically translate content',
      description: 'Translate bank statements and documents automatically',
      icon: 'language',
      type: 'toggle',
      value: autoTranslate,
      onToggle: setAutoTranslate,
      color: '#3b82f6'
    },
    {
      id: 'rtl-support',
      title: 'Right-to-Left Layout',
      subtitle: 'Enable RTL text direction',
      description: 'Optimize layout for Arabic and Urdu languages',
      icon: 'swap-horizontal',
      type: 'toggle',
      value: rtlSupport,
      onToggle: setRtlSupport,
      color: '#8b5cf6'
    },
    {
      id: 'voice-language',
      title: 'Voice Commands Language',
      subtitle: 'Set language for voice features',
      description: 'Language used for voice commands and dictation',
      icon: 'mic',
      type: 'info',
      value: languages.find(l => l.code === voiceLanguage.split('-')[0])?.name || 'English',
      color: '#10b981'
    },
    {
      id: 'keyboard-language',
      title: 'Keyboard Language',
      subtitle: 'Default keyboard language',
      description: 'Primary language for text input and suggestions',
      icon: 'keypad',
      type: 'info',
      value: languages.find(l => l.code === keyboardLanguage)?.name || 'English',
      color: '#f59e0b'
    }
  ];

  const filteredLanguages = languages.filter(lang =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openModal = (type) => {
    if (type === 'language') setShowLanguageModal(true);
    else if (type === 'region') setShowRegionModal(true);
    else if (type === 'currency') setShowCurrencyModal(true);
    modalScale.value = withSpring(1);
  };

  const closeModal = () => {
    modalScale.value = withTiming(0, { duration: 200 });
    setTimeout(() => {
      setShowLanguageModal(false);
      setShowRegionModal(false);
      setShowCurrencyModal(false);
      setSearchQuery('');
    }, 200);
  };

  const handleLanguageSelect = (languageCode) => {
    setSelectedLanguage(languageCode);
    const language = languages.find(l => l.code === languageCode);
    if (language?.rtl) {
      setRtlSupport(true);
    }
    closeModal();
    Alert.alert(
      'Language Changed',
      `App language changed to ${language?.name}. Some features may require app restart.`,
      [{ text: 'OK' }]
    );
  };

  const handleRegionSelect = (regionCode) => {
    setSelectedRegion(regionCode);
    closeModal();
    Alert.alert('Region Updated', 'Regional settings have been updated successfully.');
  };

  const handleCurrencySelect = (currencyCode) => {
    setSelectedCurrency(currencyCode);
    closeModal();
    Alert.alert('Currency Updated', 'Default currency has been updated successfully.');
  };

  const modalAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: modalScale.value }],
      opacity: modalScale.value,
    };
  });

  const renderLanguageItem = (language, index) => (
    <TouchableOpacity
      key={language.code}
      onPress={() => handleLanguageSelect(language.code)}
      className={`flex-row items-center p-4 rounded-xl mb-2 ${
        selectedLanguage === language.code ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
      }`}
    >
      <Text className="text-2xl mr-3">{language.flag}</Text>
      <View className="flex-1">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-base font-bold text-gray-800">
            {language.name}
          </Text>
          {language.popular && (
            <View className="bg-orange-100 px-2 py-1 rounded-full">
              <Text className="text-xs font-medium text-orange-600">
                Popular
              </Text>
            </View>
          )}
        </View>
        <Text className="text-sm text-gray-600 mb-1">
          {language.nativeName}
        </Text>
        <View className="flex-row items-center">
          <View className="flex-1 h-1.5 bg-gray-200 rounded-full mr-2">
            <View
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${language.completion}%` }}
            />
          </View>
          <Text className="text-xs text-gray-500">
            {language.completion}%
          </Text>
        </View>
      </View>
      {selectedLanguage === language.code && (
        <Ionicons name="checkmark-circle" size={20} color="#3b82f6" className="ml-2" />
      )}
    </TouchableOpacity>
  );

  const renderRegionItem = (region, index) => (
    <TouchableOpacity
      key={region.code}
      onPress={() => handleRegionSelect(region.code)}
      className={`flex-row items-center p-4 rounded-xl mb-2 ${
        selectedRegion === region.code ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
      }`}
    >
      <Text className="text-2xl mr-3">{region.flag}</Text>
      <View className="flex-1">
        <Text className="text-base font-bold text-gray-800">
          {region.name}
        </Text>
        {region.popular && (
          <Text className="text-xs text-orange-600 font-medium">
            Popular choice
          </Text>
        )}
      </View>
      {selectedRegion === region.code && (
        <Ionicons name="checkmark-circle" size={20} color="#3b82f6" />
      )}
    </TouchableOpacity>
  );

  const renderCurrencyItem = (currency, index) => (
    <TouchableOpacity
      key={currency.code}
      onPress={() => handleCurrencySelect(currency.code)}
      className={`flex-row items-center p-4 rounded-xl mb-2 ${
        selectedCurrency === currency.code ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
      }`}
    >
      <Text className="text-2xl mr-3">{currency.flag}</Text>
      <View className="flex-1">
        <Text className="text-base font-bold text-gray-800">
          {currency.name}
        </Text>
        <Text className="text-sm text-gray-600">
          {currency.code} • {currency.symbol}
        </Text>
      </View>
      {selectedCurrency === currency.code && (
        <Ionicons name="checkmark-circle" size={20} color="#3b82f6" />
      )}
    </TouchableOpacity>
  );

  const renderFeatureItem = (feature, index) => (
    <Animated.View
      entering={SlideInLeft.delay(index * 100).springify()}
      key={feature.id}
      className="bg-white rounded-2xl p-4 mb-4 border border-gray-100"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View
            className="w-12 h-12 rounded-2xl items-center justify-center mr-3"
            style={{ backgroundColor: `${feature.color}15` }}
          >
            <Ionicons name={feature.icon} size={24} color={feature.color} />
          </View>
          <View className="flex-1">
            <Text className="text-base font-bold text-gray-800">
              {feature.title}
            </Text>
            <Text className="text-sm text-gray-600 mt-1">
              {feature.subtitle}
            </Text>
            <Text className="text-xs text-gray-500 mt-1">
              {feature.description}
            </Text>
          </View>
        </View>
        
        {feature.type === 'toggle' && (
          <Switch
            value={feature.value}
            onValueChange={feature.onToggle}
            trackColor={{ false: '#e5e7eb', true: `${feature.color}30` }}
            thumbColor={feature.value ? feature.color : '#f3f4f6'}
          />
        )}
        
        {feature.type === 'info' && (
          <View className="items-end">
            <Text className="text-sm font-medium text-gray-700">
              {feature.value}
            </Text>
          </View>
        )}
      </View>
    </Animated.View>
  );

  const renderLanguageModal = () => (
    <Modal
      visible={showLanguageModal}
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
              Select Language
            </Text>
            <TouchableOpacity onPress={closeModal}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <View className="bg-gray-50 rounded-xl px-4 py-3 flex-row items-center mb-4">
            <Ionicons name="search-outline" size={20} color="#6b7280" />
            <TextInput
              placeholder="Search languages..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 ml-3 text-base"
            />
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-600 mb-3">
                Popular Languages
              </Text>
              {filteredLanguages.filter(l => l.popular).map(renderLanguageItem)}
            </View>
            
            {filteredLanguages.filter(l => !l.popular).length > 0 && (
              <View>
                <Text className="text-sm font-medium text-gray-600 mb-3">
                  Other Languages
                </Text>
                {filteredLanguages.filter(l => !l.popular).map(renderLanguageItem)}
              </View>
            )}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );

  const renderRegionModal = () => (
    <Modal
      visible={showRegionModal}
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
              Select Region
            </Text>
            <TouchableOpacity onPress={closeModal}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-600 mb-3">
                Popular Regions
              </Text>
              {regions.filter(r => r.popular).map(renderRegionItem)}
            </View>
            
            <View>
              <Text className="text-sm font-medium text-gray-600 mb-3">
                Other Regions
              </Text>
              {regions.filter(r => !r.popular).map(renderRegionItem)}
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );

  const renderCurrencyModal = () => (
    <Modal
      visible={showCurrencyModal}
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
              Select Currency
            </Text>
            <TouchableOpacity onPress={closeModal}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-600 mb-3">
                Popular Currencies
              </Text>
              {currencies.filter(c => c.popular).map(renderCurrencyItem)}
            </View>
            
            <View>
              <Text className="text-sm font-medium text-gray-600 mb-3">
                Other Currencies
              </Text>
              {currencies.filter(c => !c.popular).map(renderCurrencyItem)}
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );

  const currentLanguage = languages.find(l => l.code === selectedLanguage);
  const currentRegion = regions.find(r => r.code === selectedRegion);
  const currentCurrency = currencies.find(c => c.code === selectedCurrency);

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" backgroundColor="#10b981" />
      
      {/* Header */}
      <LinearGradient
        colors={['#10b981', '#059669']}
        className="pt-12 pb-6 px-4"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity className="mr-3" onPress={()=>router.back()}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-white">Language & Region</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="globe-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Current Settings Overview */}
        <Animated.View
          entering={FadeInRight.delay(200).springify()}
          className="mx-4 mt-6 mb-6"
        >
          <View className="bg-white rounded-2xl p-4 border border-gray-100">
            <View className="flex-row items-center mb-4">
              <View className="w-12 h-12 bg-green-100 rounded-2xl items-center justify-center mr-3">
                <Ionicons name="globe" size={24} color="#10b981" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-800">
                  Current Settings
                </Text>
                <Text className="text-sm text-gray-600">
                  Your language and regional preferences
                </Text>
              </View>
            </View>
            
            <View className="space-y-3">
              <View className="flex-row items-center justify-between py-2">
                <Text className="text-sm text-gray-600">Language</Text>
                <Text className="text-sm font-medium text-gray-800">
                  {currentLanguage?.flag} {currentLanguage?.name}
                </Text>
              </View>
              <View className="flex-row items-center justify-between py-2">
                <Text className="text-sm text-gray-600">Region</Text>
                <Text className="text-sm font-medium text-gray-800">
                  {currentRegion?.flag} {currentRegion?.name}
                </Text>
              </View>
              <View className="flex-row items-center justify-between py-2">
                <Text className="text-sm text-gray-600">Currency</Text>
                <Text className="text-sm font-medium text-gray-800">
                  {currentCurrency?.symbol} {currentCurrency?.name}
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Quick Settings */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-4">
            Quick Settings
          </Text>
          
          <Animated.View
            entering={SlideInLeft.delay(100).springify()}
            className="bg-white rounded-2xl p-4 mb-4 border border-gray-100"
          >
            <TouchableOpacity onPress={() => openModal('language')}>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <Text className="text-2xl mr-3">{currentLanguage?.flag}</Text>
                  <View className="flex-1">
                    <Text className="text-base font-bold text-gray-800">
                      App Language
                    </Text>
                    <Text className="text-sm text-gray-600">
                      {currentLanguage?.name} ({currentLanguage?.nativeName})
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </View>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            entering={SlideInLeft.delay(200).springify()}
            className="bg-white rounded-2xl p-4 mb-4 border border-gray-100"
          >
            <TouchableOpacity onPress={() => openModal('region')}>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <Text className="text-2xl mr-3">{currentRegion?.flag}</Text>
                  <View className="flex-1">
                    <Text className="text-base font-bold text-gray-800">
                      Region & Format
                    </Text>
                    <Text className="text-sm text-gray-600">
                      {currentRegion?.name}
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </View>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            entering={SlideInLeft.delay(300).springify()}
            className="bg-white rounded-2xl p-4 mb-4 border border-gray-100"
          >
            <TouchableOpacity onPress={() => openModal('currency')}>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <View className="w-10 h-10 bg-yellow-100 rounded-full items-center justify-center mr-3">
                    <Text className="text-base font-bold text-yellow-700">
                      {currentCurrency?.symbol}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-bold text-gray-800">
                      Default Currency
                    </Text>
                    <Text className="text-sm text-gray-600">
                      {currentCurrency?.name} ({currentCurrency?.code})
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Advanced Features */}
        <View className="px-4 pb-20">
          <Text className="text-lg font-bold text-gray-800 mb-4">
            Language Features
          </Text>
          {languageFeatures.map(renderFeatureItem)}
        </View>
      </ScrollView>

      {renderLanguageModal()}
      {renderRegionModal()}
      {renderCurrencyModal()}
    </View>
  );
};

export default LanguageSettingsPage;