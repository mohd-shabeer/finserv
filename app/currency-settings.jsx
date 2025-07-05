import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    Modal,
    RefreshControl,
    ScrollView,
    StatusBar,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, {
    FadeInDown,
    FadeInRight,
    SlideInLeft,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const CurrencySettingsPage = () => {
  const [activeTab, setActiveTab] = useState('primary');
  const [primaryCurrency, setPrimaryCurrency] = useState('INR');
  const [secondaryCurrency, setSecondaryCurrency] = useState('USD');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [modalType, setModalType] = useState('primary');
  const [refreshing, setRefreshing] = useState(false);
  
  // Preferences
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [showCurrencySymbols, setShowCurrencySymbols] = useState(true);
  const [roundDecimals, setRoundDecimals] = useState(true);
  const [alertOnChange, setAlertOnChange] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);

  const animatedValue = useSharedValue(0);
  const modalScale = useSharedValue(0);

  useEffect(() => {
    animatedValue.value = withSpring(1);
  }, []);

  const currencies = [
    {
      code: 'INR',
      name: 'Indian Rupee',
      symbol: '₹',
      flag: '🇮🇳',
      rate: 1.00,
      change: 0.00,
      popular: true,
      country: 'India',
      lastUpdated: '2 min ago'
    },
    {
      code: 'USD',
      name: 'US Dollar',
      symbol: '$',
      flag: '🇺🇸',
      rate: 0.012,
      change: +0.15,
      popular: true,
      country: 'United States',
      lastUpdated: '2 min ago'
    },
    {
      code: 'EUR',
      name: 'Euro',
      symbol: '€',
      flag: '🇪🇺',
      rate: 0.011,
      change: -0.08,
      popular: true,
      country: 'European Union',
      lastUpdated: '3 min ago'
    },
    {
      code: 'GBP',
      name: 'British Pound',
      symbol: '£',
      flag: '🇬🇧',
      rate: 0.0095,
      change: +0.22,
      popular: true,
      country: 'United Kingdom',
      lastUpdated: '2 min ago'
    },
    {
      code: 'AED',
      name: 'UAE Dirham',
      symbol: 'د.إ',
      flag: '🇦🇪',
      rate: 0.044,
      change: +0.05,
      popular: true,
      country: 'UAE',
      lastUpdated: '1 min ago'
    },
    {
      code: 'SGD',
      name: 'Singapore Dollar',
      symbol: 'S$',
      flag: '🇸🇬',
      rate: 0.016,
      change: -0.12,
      popular: false,
      country: 'Singapore',
      lastUpdated: '4 min ago'
    },
    {
      code: 'AUD',
      name: 'Australian Dollar',
      symbol: 'A$',
      flag: '🇦🇺',
      rate: 0.018,
      change: +0.18,
      popular: false,
      country: 'Australia',
      lastUpdated: '3 min ago'
    },
    {
      code: 'CAD',
      name: 'Canadian Dollar',
      symbol: 'C$',
      flag: '🇨🇦',
      rate: 0.017,
      change: -0.05,
      popular: false,
      country: 'Canada',
      lastUpdated: '5 min ago'
    },
    {
      code: 'JPY',
      name: 'Japanese Yen',
      symbol: '¥',
      flag: '🇯🇵',
      rate: 1.85,
      change: +0.32,
      popular: false,
      country: 'Japan',
      lastUpdated: '2 min ago'
    },
    {
      code: 'CHF',
      name: 'Swiss Franc',
      symbol: 'CHF',
      flag: '🇨🇭',
      rate: 0.011,
      change: -0.15,
      popular: false,
      country: 'Switzerland',
      lastUpdated: '6 min ago'
    }
  ];

  const watchlistCurrencies = ['USD', 'EUR', 'GBP', 'AED'];
  const [watchlist, setWatchlist] = useState(watchlistCurrencies);

  const currencyPreferences = [
    {
      id: 'auto-update',
      title: 'Auto Update Rates',
      subtitle: 'Automatically refresh exchange rates',
      description: 'Update rates every 5 minutes when app is active',
      icon: 'refresh',
      type: 'toggle',
      value: autoUpdate,
      onToggle: setAutoUpdate,
      color: '#3b82f6'
    },
    {
      id: 'show-symbols',
      title: 'Show Currency Symbols',
      subtitle: 'Display currency symbols in amounts',
      description: 'Show ₹, $, € symbols instead of currency codes',
      icon: 'cash',
      type: 'toggle',
      value: showCurrencySymbols,
      onToggle: setShowCurrencySymbols,
      color: '#10b981'
    },
    {
      id: 'round-decimals',
      title: 'Round Decimal Places',
      subtitle: 'Round amounts to 2 decimal places',
      description: 'Simplify display by rounding currency amounts',
      icon: 'calculator',
      type: 'toggle',
      value: roundDecimals,
      onToggle: setRoundDecimals,
      color: '#f59e0b'
    },
    {
      id: 'alert-changes',
      title: 'Rate Change Alerts',
      subtitle: 'Notify on significant rate changes',
      description: 'Get alerts when rates change by more than 5%',
      icon: 'notifications',
      type: 'toggle',
      value: alertOnChange,
      onToggle: setAlertOnChange,
      color: '#ef4444'
    },
    {
      id: 'offline-mode',
      title: 'Offline Mode',
      subtitle: 'Use cached rates when offline',
      description: 'Show last known rates when internet is unavailable',
      icon: 'cloud-offline',
      type: 'toggle',
      value: offlineMode,
      onToggle: setOfflineMode,
      color: '#8b5cf6'
    }
  ];

  const filteredCurrencies = currencies.filter(currency =>
    currency.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    currency.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    currency.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      Alert.alert('Rates Updated', 'Exchange rates have been refreshed successfully.');
    }, 2000);
  };

  const openCurrencyModal = (type) => {
    setModalType(type);
    setShowCurrencyModal(true);
    modalScale.value = withSpring(1);
  };

  const closeCurrencyModal = () => {
    modalScale.value = withTiming(0, { duration: 200 });
    setTimeout(() => {
      setShowCurrencyModal(false);
      setSearchQuery('');
    }, 200);
  };

  const handleCurrencySelect = (currencyCode) => {
    if (modalType === 'primary') {
      setPrimaryCurrency(currencyCode);
    } else if (modalType === 'secondary') {
      setSecondaryCurrency(currencyCode);
    }
    closeCurrencyModal();
    
    const currency = currencies.find(c => c.code === currencyCode);
    Alert.alert(
      'Currency Updated',
      `${modalType === 'primary' ? 'Primary' : 'Secondary'} currency set to ${currency?.name}`,
      [{ text: 'OK' }]
    );
  };

  const toggleWatchlist = (currencyCode) => {
    if (watchlist.includes(currencyCode)) {
      setWatchlist(watchlist.filter(code => code !== currencyCode));
    } else {
      setWatchlist([...watchlist, currencyCode]);
    }
  };

  const modalAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: modalScale.value }],
      opacity: modalScale.value,
    };
  });

  const formatAmount = (amount, currencyCode) => {
    const currency = currencies.find(c => c.code === currencyCode);
    if (!currency) return amount.toString();
    
    const formatted = roundDecimals ? amount.toFixed(2) : amount.toString();
    return showCurrencySymbols ? `${currency.symbol}${formatted}` : `${formatted} ${currencyCode}`;
  };

  const renderCurrencyRate = (currency, index) => (
    <Animated.View
      entering={SlideInLeft.delay(index * 100).springify()}
      key={currency.code}
      className="bg-white rounded-2xl p-4 mb-4 border border-gray-100"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <Text className="text-2xl mr-3">{currency.flag}</Text>
          <View className="flex-1">
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-base font-bold text-gray-800">
                {currency.code}
              </Text>
              {currency.popular && (
                <View className="bg-orange-100 px-2 py-1 rounded-full">
                  <Text className="text-xs font-medium text-orange-600">
                    Popular
                  </Text>
                </View>
              )}
            </View>
            <Text className="text-sm text-gray-600 mb-1">
              {currency.name}
            </Text>
            <Text className="text-xs text-gray-500">
              Updated {currency.lastUpdated}
            </Text>
          </View>
        </View>
        
        <View className="items-end ml-3">
          <Text className="text-lg font-bold text-gray-800">
            {formatAmount(currency.rate, primaryCurrency)}
          </Text>
          <View className={`flex-row items-center ${
            currency.change >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            <Ionicons 
              name={currency.change >= 0 ? 'trending-up' : 'trending-down'} 
              size={14} 
              color={currency.change >= 0 ? '#10b981' : '#ef4444'} 
            />
            <Text className={`text-sm font-medium ml-1 ${
              currency.change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {currency.change >= 0 ? '+' : ''}{currency.change.toFixed(2)}%
            </Text>
          </View>
        </View>
        
        <TouchableOpacity
          onPress={() => toggleWatchlist(currency.code)}
          className="ml-3"
        >
          <Ionicons 
            name={watchlist.includes(currency.code) ? 'star' : 'star-outline'} 
            size={20} 
            color={watchlist.includes(currency.code) ? '#f59e0b' : '#9ca3af'} 
          />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderWatchlistItem = (currencyCode, index) => {
    const currency = currencies.find(c => c.code === currencyCode);
    if (!currency) return null;

    return (
      <Animated.View
        entering={FadeInDown.delay(index * 100).springify()}
        key={currency.code}
        className="bg-white rounded-2xl p-4 mr-4 border border-gray-100"
        style={{ width: 160 }}
      >
        <View className="items-center">
          <Text className="text-2xl mb-2">{currency.flag}</Text>
          <Text className="text-base font-bold text-gray-800 mb-1">
            {currency.code}
          </Text>
          <Text className="text-lg font-bold text-blue-600 mb-1">
            {formatAmount(currency.rate, primaryCurrency)}
          </Text>
          <View className={`flex-row items-center ${
            currency.change >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            <Ionicons 
              name={currency.change >= 0 ? 'trending-up' : 'trending-down'} 
              size={12} 
              color={currency.change >= 0 ? '#10b981' : '#ef4444'} 
            />
            <Text className={`text-xs font-medium ml-1 ${
              currency.change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {currency.change >= 0 ? '+' : ''}{currency.change.toFixed(2)}%
            </Text>
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderPreferenceItem = (preference, index) => (
    <Animated.View
      entering={SlideInLeft.delay(index * 100).springify()}
      key={preference.id}
      className="bg-white rounded-2xl p-4 mb-4 border border-gray-100"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View
            className="w-12 h-12 rounded-2xl items-center justify-center mr-3"
            style={{ backgroundColor: `${preference.color}15` }}
          >
            <Ionicons name={preference.icon} size={24} color={preference.color} />
          </View>
          <View className="flex-1">
            <Text className="text-base font-bold text-gray-800">
              {preference.title}
            </Text>
            <Text className="text-sm text-gray-600 mt-1">
              {preference.subtitle}
            </Text>
            <Text className="text-xs text-gray-500 mt-1">
              {preference.description}
            </Text>
          </View>
        </View>
        
        <Switch
          value={preference.value}
          onValueChange={preference.onToggle}
          trackColor={{ false: '#e5e7eb', true: `${preference.color}30` }}
          thumbColor={preference.value ? preference.color : '#f3f4f6'}
        />
      </View>
    </Animated.View>
  );

  const renderCurrencyOption = (currency) => (
    <TouchableOpacity
      key={currency.code}
      onPress={() => handleCurrencySelect(currency.code)}
      className={`flex-row items-center p-4 rounded-xl mb-2 ${
        (modalType === 'primary' && primaryCurrency === currency.code) ||
        (modalType === 'secondary' && secondaryCurrency === currency.code)
          ? 'bg-blue-50 border border-blue-200' 
          : 'bg-gray-50'
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
      <View className="items-end">
        <Text className="text-sm font-medium text-gray-700">
          {formatAmount(currency.rate, primaryCurrency)}
        </Text>
        <Text className={`text-xs ${
          currency.change >= 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          {currency.change >= 0 ? '+' : ''}{currency.change.toFixed(2)}%
        </Text>
      </View>
      {((modalType === 'primary' && primaryCurrency === currency.code) ||
        (modalType === 'secondary' && secondaryCurrency === currency.code)) && (
        <Ionicons name="checkmark-circle" size={20} color="#3b82f6" className="ml-2" />
      )}
    </TouchableOpacity>
  );

  const renderCurrencyModal = () => (
    <Modal
      visible={showCurrencyModal}
      transparent={true}
      animationType="fade"
      onRequestClose={closeCurrencyModal}
    >
      <View className="flex-1 bg-black bg-opacity-50 justify-center items-center px-4">
        <Animated.View
          style={modalAnimatedStyle}
          className="bg-white rounded-3xl p-6 w-full max-w-md max-h-4/5"
        >
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-xl font-bold text-gray-800">
              Select {modalType === 'primary' ? 'Primary' : 'Secondary'} Currency
            </Text>
            <TouchableOpacity onPress={closeCurrencyModal}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <View className="bg-gray-50 rounded-xl px-4 py-3 flex-row items-center mb-4">
            <Ionicons name="search-outline" size={20} color="#6b7280" />
            <TextInput
              placeholder="Search currencies..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 ml-3 text-base"
            />
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-600 mb-3">
                Popular Currencies
              </Text>
              {filteredCurrencies.filter(c => c.popular).map(renderCurrencyOption)}
            </View>
            
            {filteredCurrencies.filter(c => !c.popular).length > 0 && (
              <View>
                <Text className="text-sm font-medium text-gray-600 mb-3">
                  Other Currencies
                </Text>
                {filteredCurrencies.filter(c => !c.popular).map(renderCurrencyOption)}
              </View>
            )}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );

  const primaryCurrencyData = currencies.find(c => c.code === primaryCurrency);
  const secondaryCurrencyData = currencies.find(c => c.code === secondaryCurrency);

  const tabs = [
    { id: 'primary', name: 'Settings', icon: 'settings-outline' },
    { id: 'rates', name: 'Exchange Rates', icon: 'trending-up-outline' },
    { id: 'watchlist', name: 'Watchlist', icon: 'star-outline' },
    { id: 'preferences', name: 'Preferences', icon: 'options-outline' }
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" backgroundColor="#f59e0b" />
      
      {/* Header */}
      <LinearGradient
        colors={['#f59e0b', '#d97706']}
        className="pt-12 pb-6 px-4"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity className="mr-3" onPress={()=>router.back()}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-white">Currency Settings</Text>
          </View>
          <TouchableOpacity onPress={onRefresh}>
            <Ionicons name="refresh" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Currency Overview */}
        <Animated.View
          entering={FadeInRight.delay(200).springify()}
          className="mx-4 mt-6 mb-6"
        >
          <LinearGradient
            colors={['#1e40af', '#3b82f6']}
            className="rounded-2xl p-4"
          >
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-white text-lg font-bold">
                Currency Overview
              </Text>
              <View className="bg-opacity-20 rounded-full px-3 py-1">
                <Text className="text-white text-xs font-medium">
                  Live Rates
                </Text>
              </View>
            </View>
            
            <View className="flex-row justify-between">
              <View className="flex-1 mr-2">
                <Text className="text-blue-200 text-sm mb-1">Primary Currency</Text>
                <Text className="text-white text-xl font-bold">
                  {primaryCurrencyData?.flag} {primaryCurrencyData?.code}
                </Text>
                <Text className="text-blue-200 text-xs">
                  {primaryCurrencyData?.name}
                </Text>
              </View>
              <View className="flex-1 ml-2">
                <Text className="text-blue-200 text-sm mb-1">Secondary Currency</Text>
                <Text className="text-white text-xl font-bold">
                  {secondaryCurrencyData?.flag} {secondaryCurrencyData?.code}
                </Text>
                <Text className="text-blue-200 text-xs">
                  1 {primaryCurrency} = {secondaryCurrencyData?.rate?.toFixed(4)} {secondaryCurrency}
                </Text>
              </View>
            </View>
          </LinearGradient>
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
                    ? 'border-amber-600 bg-amber-600' 
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
          {activeTab === 'primary' && (
            <View>
              <Animated.View
                entering={SlideInLeft.delay(100).springify()}
                className="bg-white rounded-2xl p-4 mb-4 border border-gray-100"
              >
                <TouchableOpacity onPress={() => openCurrencyModal('primary')}>
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1">
                      <Text className="text-2xl mr-3">{primaryCurrencyData?.flag}</Text>
                      <View className="flex-1">
                        <Text className="text-base font-bold text-gray-800">
                          Primary Currency
                        </Text>
                        <Text className="text-sm text-gray-600">
                          {primaryCurrencyData?.name} ({primaryCurrencyData?.code})
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
                <TouchableOpacity onPress={() => openCurrencyModal('secondary')}>
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1">
                      <Text className="text-2xl mr-3">{secondaryCurrencyData?.flag}</Text>
                      <View className="flex-1">
                        <Text className="text-base font-bold text-gray-800">
                          Secondary Currency
                        </Text>
                        <Text className="text-sm text-gray-600">
                          {secondaryCurrencyData?.name} ({secondaryCurrencyData?.code})
                        </Text>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                  </View>
                </TouchableOpacity>
              </Animated.View>
            </View>
          )}

          {activeTab === 'rates' && (
            <View>
              {currencies.map(renderCurrencyRate)}
            </View>
          )}

          {activeTab === 'watchlist' && (
            <View>
              {watchlist.length > 0 ? (
                <>
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    className="mb-6"
                    contentContainerStyle={{ paddingRight: 16 }}
                  >
                    {watchlist.map(renderWatchlistItem)}
                  </ScrollView>
                  
                  <Text className="text-lg font-bold text-gray-800 mb-4">
                    All Currencies
                  </Text>
                  {currencies.map(renderCurrencyRate)}
                </>
              ) : (
                <View className="items-center justify-center py-20">
                  <Ionicons name="star-outline" size={48} color="#9ca3af" />
                  <Text className="text-gray-500 text-lg font-medium mt-4">
                    No currencies in watchlist
                  </Text>
                  <Text className="text-gray-400 text-sm mt-2 text-center">
                    Tap the star icon next to any currency to add it to your watchlist
                  </Text>
                </View>
              )}
            </View>
          )}

          {activeTab === 'preferences' && (
            <View>
              {currencyPreferences.map(renderPreferenceItem)}
            </View>
          )}
        </View>
      </ScrollView>

      {renderCurrencyModal()}
    </View>
  );
};

export default CurrencySettingsPage;