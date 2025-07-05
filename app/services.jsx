import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Dimensions,
    FlatList,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, {
    FadeInDown,
    FadeInRight,
    SlideInLeft,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const ServicesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredServices, setFilteredServices] = useState([]);

  const animatedValue = useSharedValue(0);

  useEffect(() => {
    animatedValue.value = withSpring(1);
    setFilteredServices(allServices);
  }, []);

  // All banking services organized by category
  const serviceCategories = [
    { id: 'all', name: 'All Services', icon: 'apps-outline', color: '#6366f1' },
    { id: 'payments', name: 'Payments', icon: 'card-outline', color: '#10b981' },
    { id: 'investments', name: 'Investments', icon: 'trending-up-outline', color: '#f59e0b' },
    { id: 'loans', name: 'Loans', icon: 'cash-outline', color: '#ef4444' },
    { id: 'insurance', name: 'Insurance', icon: 'shield-checkmark-outline', color: '#8b5cf6' },
    { id: 'digital', name: 'Digital', icon: 'phone-portrait-outline', color: '#06b6d4' },
  ];

  const allServices = [
    // Payment Services
    {
      id: 1,
      title: 'Money Transfer',
      subtitle: 'Send money instantly',
      description: 'Transfer funds to any bank account, UPI ID, or mobile number',
      icon: 'send-outline',
      category: 'payments',
      color: '#3b82f6',
      bgColor: '#eff6ff',
      features: ['Instant transfer', 'Low fees', '24/7 availability'],
      popular: true,
      route: '/transfer'
    },
    {
      id: 2,
      title: 'Bill Payment',
      subtitle: 'Pay all your bills',
      description: 'Electricity, water, gas, mobile, DTH, internet bills',
      icon: 'receipt-outline',
      category: 'payments',
      color: '#10b981',
      bgColor: '#f0fdf4',
      features: ['Auto-pay', 'Reminders', 'Bill history'],
      popular: true,
      route: '/bills'
    },
    {
      id: 3,
      title: 'Mobile Recharge',
      subtitle: 'Recharge instantly',
      description: 'Mobile, DTH, data card recharge with best offers',
      icon: 'phone-portrait-outline',
      category: 'payments',
      color: '#f59e0b',
      bgColor: '#fffbeb',
      features: ['Instant recharge', 'Special offers', 'All operators'],
      popular: true,
      route: '/recharge'
    },
    {
      id: 4,
      title: 'QR Payments',
      subtitle: 'Scan & pay',
      description: 'Pay merchants using QR codes securely',
      icon: 'qr-code-outline',
      category: 'payments',
      color: '#8b5cf6',
      bgColor: '#faf5ff',
      features: ['Contactless', 'Secure', 'Instant'],
      popular: false,
      route: '/qr-pay'
    },

    // Investment Services
    {
      id: 5,
      title: 'Mutual Funds',
      subtitle: 'Grow your wealth',
      description: 'Invest in top-performing mutual funds with zero commission',
      icon: 'trending-up-outline',
      category: 'investments',
      color: '#10b981',
      bgColor: '#f0fdf4',
      features: ['Zero commission', 'SIP available', 'Expert advice'],
      popular: true,
      route: '/mutual-funds'
    },
    {
      id: 6,
      title: 'Fixed Deposits',
      subtitle: 'Guaranteed returns',
      description: 'Secure your money with attractive interest rates',
      icon: 'lock-closed-outline',
      category: 'investments',
      color: '#ef4444',
      bgColor: '#fef2f2',
      features: ['High interest', 'Flexible tenure', 'Auto-renewal'],
      popular: true,
      route: '/fixed-deposits'
    },
    {
      id: 7,
      title: 'Stocks & ETFs',
      subtitle: 'Market investments',
      description: 'Trade in stocks and ETFs with low brokerage',
      icon: 'bar-chart-outline',
      category: 'investments',
      color: '#7c3aed',
      bgColor: '#faf5ff',
      features: ['Low brokerage', 'Real-time data', 'Research reports'],
      popular: false,
      route: '/stocks'
    },
    {
      id: 8,
      title: 'Gold Investment',
      subtitle: 'Digital gold',
      description: 'Buy and sell digital gold starting from ₹1',
      icon: 'medal-outline',
      category: 'investments',
      color: '#f59e0b',
      bgColor: '#fffbeb',
      features: ['Start from ₹1', '24K purity', 'Store digitally'],
      popular: false,
      route: '/gold'
    },

    // Loan Services
    {
      id: 9,
      title: 'Personal Loan',
      subtitle: 'Quick approval',
      description: 'Get instant personal loan up to ₹50 lakhs',
      icon: 'person-outline',
      category: 'loans',
      color: '#6366f1',
      bgColor: '#eff6ff',
      features: ['Instant approval', 'Low interest', 'Flexible EMI'],
      popular: true,
      route: '/personal-loan'
    },
    {
      id: 10,
      title: 'Home Loan',
      subtitle: 'Buy your dream home',
      description: 'Lowest interest rates on home loans',
      icon: 'home-outline',
      category: 'loans',
      color: '#059669',
      bgColor: '#f0fdf4',
      features: ['Lowest rates', 'Quick processing', 'Doorstep service'],
      popular: true,
      route: '/home-loan'
    },
    {
      id: 11,
      title: 'Car Loan',
      subtitle: 'Drive your dream car',
      description: 'Finance your new or used car with attractive rates',
      icon: 'car-outline',
      category: 'loans',
      color: '#dc2626',
      bgColor: '#fef2f2',
      features: ['Up to 100% funding', 'Quick approval', 'Flexible tenure'],
      popular: false,
      route: '/car-loan'
    },
    {
      id: 12,
      title: 'Business Loan',
      subtitle: 'Grow your business',
      description: 'Collateral-free business loans for growth',
      icon: 'business-outline',
      category: 'loans',
      color: '#7c2d12',
      bgColor: '#fef7ed',
      features: ['Collateral-free', 'Quick disbursal', 'Competitive rates'],
      popular: false,
      route: '/business-loan'
    },

    // Insurance Services
    {
      id: 13,
      title: 'Health Insurance',
      subtitle: 'Protect your health',
      description: 'Comprehensive health coverage for family',
      icon: 'medical-outline',
      category: 'insurance',
      color: '#dc2626',
      bgColor: '#fef2f2',
      features: ['Cashless treatment', 'No waiting period', 'Pre & post hospitalization'],
      popular: true,
      route: '/health-insurance'
    },
    {
      id: 14,
      title: 'Life Insurance',
      subtitle: 'Secure your family',
      description: 'Term and whole life insurance plans',
      icon: 'heart-outline',
      category: 'insurance',
      color: '#059669',
      bgColor: '#f0fdf4',
      features: ['High coverage', 'Tax benefits', 'Flexible premiums'],
      popular: true,
      route: '/life-insurance'
    },
    {
      id: 15,
      title: 'Motor Insurance',
      subtitle: 'Vehicle protection',
      description: 'Comprehensive car and bike insurance',
      icon: 'car-outline',
      category: 'insurance',
      color: '#7c3aed',
      bgColor: '#faf5ff',
      features: ['Instant policy', 'Cashless claims', 'Roadside assistance'],
      popular: false,
      route: '/motor-insurance'
    },
    {
      id: 16,
      title: 'Travel Insurance',
      subtitle: 'Safe travels',
      description: 'Domestic and international travel protection',
      icon: 'airplane-outline',
      category: 'insurance',
      color: '#ea580c',
      bgColor: '#fff7ed',
      features: ['Global coverage', 'Emergency assistance', 'Trip cancellation'],
      popular: false,
      route: '/travel-insurance'
    },

    // Digital Services
    {
      id: 17,
      title: 'FASTag',
      subtitle: 'Toll payments',
      description: 'Electronic toll collection for seamless travel',
      icon: 'radio-outline',
      category: 'digital',
      color: '#0891b2',
      bgColor: '#f0f9ff',
      features: ['No queues', 'Auto-recharge', 'Transaction history'],
      popular: false,
      route: '/fastag'
    },
    {
      id: 18,
      title: 'Gift Cards',
      subtitle: 'Perfect gifts',
      description: 'Buy gift cards for popular brands and stores',
      icon: 'gift-outline',
      category: 'digital',
      color: '#be185d',
      bgColor: '#fdf2f8',
      features: ['Multiple brands', 'Instant delivery', 'No expiry'],
      popular: false,
      route: '/gift-cards'
    },
    {
      id: 19,
      title: 'Forex Card',
      subtitle: 'Travel abroad',
      description: 'Multi-currency forex card for international travel',
      icon: 'globe-outline',
      category: 'digital',
      color: '#7c3aed',
      bgColor: '#faf5ff',
      features: ['Multiple currencies', 'Better rates', 'Worldwide acceptance'],
      popular: false,
      route: '/forex-card'
    },
    {
      id: 20,
      title: 'Locker Service',
      subtitle: 'Safe custody',
      description: 'Bank lockers for your valuable items',
      icon: 'lock-closed-outline',
      category: 'digital',
      color: '#059669',
      bgColor: '#f0fdf4',
      features: ['Secure storage', 'Insurance coverage', 'Easy access'],
      popular: false,
      route: '/locker'
    }
  ];

  useEffect(() => {
    filterServices();
  }, [searchQuery, selectedCategory]);

  const filterServices = () => {
    let filtered = allServices;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredServices(filtered);
  };

  const renderCategory = (category, index) => (
    <Animated.View
      entering={FadeInDown.delay(index * 50).springify()}
      key={category.id}
      className="mr-4"
      style={{ marginRight: index === serviceCategories.length - 1 ? 0 : 16 }}
    >
      <TouchableOpacity
        onPress={() => setSelectedCategory(category.id)}
        className={`px-4 py-3 rounded-2xl border ${
          selectedCategory === category.id 
            ? 'border-blue-600' 
            : 'border-gray-200'
        }`}
        style={{
          backgroundColor: selectedCategory === category.id 
            ? category.color 
            : 'white'
        }}
      >
        <View className="flex-row items-center">
          <Ionicons 
            name={category.icon} 
            size={18} 
            color={selectedCategory === category.id ? 'white' : category.color} 
          />
          <Text 
            className={`ml-2 font-medium text-sm ${
              selectedCategory === category.id ? 'text-white' : 'text-gray-700'
            }`}
          >
            {category.name}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderService = ({ item, index }) => (
    <Animated.View
      entering={SlideInLeft.delay(index * 100).springify()}
      className="bg-white rounded-2xl p-4 mb-4 mx-4 border border-gray-100"
      style={{ minHeight: 180 }}
    >
      <View className="flex-row items-start justify-between mb-3" style={{ minHeight: 48 }}>
        <View className="flex-row items-center flex-1">
          <View
            className="w-12 h-12 rounded-2xl items-center justify-center mr-3"
            style={{ backgroundColor: item.bgColor }}
          >
            <Ionicons name={item.icon} size={24} color={item.color} />
          </View>
          <View className="flex-1">
            <View className="flex-row items-center flex-wrap">
              <Text className="text-base font-bold text-gray-800" numberOfLines={1}>
                {item.title}
              </Text>
              {item.popular && (
                <View className="bg-orange-100 px-2 py-1 rounded-full ml-2">
                  <Text className="text-xs font-medium text-orange-600">
                    Popular
                  </Text>
                </View>
              )}
            </View>
            <Text className="text-sm text-gray-600 mt-1" numberOfLines={1}>
              {item.subtitle}
            </Text>
          </View>
        </View>
        <TouchableOpacity className="ml-2">
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>
      </View>

      <Text className="text-sm text-gray-700 mb-3 leading-5" numberOfLines={2} style={{ minHeight: 40 }}>
        {item.description}
      </Text>

      <View className="flex-row flex-wrap mb-4" style={{ minHeight: 32 }}>
        {item.features.map((feature, idx) => (
          <View key={idx} className="flex-row items-center mr-4 mb-1">
            <View 
              className="w-1.5 h-1.5 rounded-full mr-2"
              style={{ backgroundColor: item.color }}
            />
            <Text className="text-xs text-gray-600">
              {feature}
            </Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        className="py-3 rounded-xl"
        style={{ backgroundColor: item.color }}
      >
        <Text className="text-white text-center font-semibold text-sm">
          Get Started
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const popularServices = allServices.filter(service => service.popular);

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" backgroundColor="#6366f1" />
      
      {/* Header */}
      <LinearGradient
        colors={['#6366f1', '#8b5cf6']}
        className="pt-12 pb-6 px-4"
      >
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <TouchableOpacity className="mr-3" onPress={()=>router.back()}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-white">All Services</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="bg-opacity-20 rounded-2xl px-4 py-3 flex-row items-center">
          <Ionicons name="search-outline" size={20} color="white" />
          <TextInput
            placeholder="Search services..."
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 ml-3 text-white text-base"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Categories */}
        <View className="py-6">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="px-4"
            contentContainerStyle={{ paddingRight: 16 }}
          >
            {serviceCategories.map(renderCategory)}
          </ScrollView>
        </View>

        {/* Quick Access - Popular Services */}
        {selectedCategory === 'all' && searchQuery === '' && (
          <Animated.View
            entering={FadeInRight.delay(200).springify()}
            className="mb-6"
          >
            <View className="px-4 mb-4">
              <Text className="text-lg font-bold text-gray-800">
                Popular Services
              </Text>
              <Text className="text-sm text-gray-600">
                Most used services by customers
              </Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="px-4"
              contentContainerStyle={{ paddingRight: 16 }}
            >
              {popularServices.map((service, index) => (
                <Animated.View
                  entering={FadeInDown.delay(index * 100).springify()}
                  key={service.id}
                  className="mr-4"
                  style={{ marginRight: index === popularServices.length - 1 ? 0 : 16 }}
                >
                  <TouchableOpacity
                    className="w-36 rounded-2xl p-4 border border-gray-200"
                    style={{ backgroundColor: service.bgColor, height: 120 }}
                  >
                    <View
                      className="w-10 h-10 rounded-full items-center justify-center mb-3"
                      style={{ backgroundColor: service.color }}
                    >
                      <Ionicons name={service.icon} size={20} color="white" />
                    </View>
                    <Text className="text-sm font-bold text-gray-800 mb-1">
                      {service.title}
                    </Text>
                    <Text className="text-xs text-gray-600">
                      {service.subtitle}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </ScrollView>
          </Animated.View>
        )}

        {/* Services List */}
        <View className="mb-20">
          <View className="px-4 mb-4">
            <Text className="text-lg font-bold text-gray-800">
              {selectedCategory === 'all' ? 'All Services' : 
               serviceCategories.find(c => c.id === selectedCategory)?.name + ' Services'}
              <Text className="text-sm text-gray-600 font-normal">
                {' '}({filteredServices.length})
              </Text>
            </Text>
          </View>
          
          <FlatList
            data={filteredServices}
            renderItem={renderService}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />

          {filteredServices.length === 0 && (
            <View className="items-center justify-center py-20">
              <Ionicons name="search-outline" size={48} color="#9ca3af" />
              <Text className="text-gray-500 text-lg font-medium mt-4">
                No services found
              </Text>
              <Text className="text-gray-400 text-sm mt-2 text-center px-8">
                Try adjusting your search or category filter
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Service Stats */}
      <Animated.View
        entering={FadeInRight.delay(300).springify()}
        className="absolute bottom-6 left-4 right-4"
      >
        <LinearGradient
          colors={['#1e40af', '#3b82f6']}
          className="rounded-2xl p-4 flex-row items-center justify-between"
        >
          <View>
            <Text className="text-white text-sm opacity-90">
              Available Services
            </Text>
            <Text className="text-white text-2xl font-bold">
              {allServices.length}+
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-blue-200 text-xs mb-1">
              Popular Categories
            </Text>
            <Text className="text-white text-sm font-medium">
              Payments • Investments • Loans
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </View>
  );
};

export default ServicesPage;