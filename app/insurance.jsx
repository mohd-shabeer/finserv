import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Dimensions,
    Modal,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View
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

const InsurancePage = () => {
  const [activeTab, setActiveTab] = useState('my-policies');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [selectedInsurance, setSelectedInsurance] = useState(null);

  const animatedValue = useSharedValue(0);
  const quoteModalScale = useSharedValue(0);

  useEffect(() => {
    animatedValue.value = withSpring(1);
  }, []);

  const insuranceTypes = [
    {
      id: 'health',
      name: 'Health Insurance',
      icon: 'medical-outline',
      description: 'Comprehensive health coverage',
      startingPrice: '₹199/month',
      color: '#dc2626',
      bgColor: '#fef2f2',
      coverage: 'Up to ₹50 Lakhs'
    },
    {
      id: 'life',
      name: 'Life Insurance',
      icon: 'heart-outline',
      description: 'Secure your family\'s future',
      startingPrice: '₹299/month',
      color: '#059669',
      bgColor: '#f0fdf4',
      coverage: 'Up to ₹1 Crore'
    },
    {
      id: 'motor',
      name: 'Motor Insurance',
      icon: 'car-outline',
      description: 'Protect your vehicle',
      startingPrice: '₹2,499/year',
      color: '#7c3aed',
      bgColor: '#faf5ff',
      coverage: 'Comprehensive'
    },
    {
      id: 'travel',
      name: 'Travel Insurance',
      icon: 'airplane-outline',
      description: 'Safe travels worldwide',
      startingPrice: '₹149/trip',
      color: '#ea580c',
      bgColor: '#fff7ed',
      coverage: 'Global Coverage'
    },
    {
      id: 'home',
      name: 'Home Insurance',
      icon: 'home-outline',
      description: 'Protect your home & belongings',
      startingPrice: '₹999/year',
      color: '#0891b2',
      bgColor: '#f0f9ff',
      coverage: 'Up to ₹25 Lakhs'
    },
    {
      id: 'business',
      name: 'Business Insurance',
      icon: 'business-outline',
      description: 'Comprehensive business protection',
      startingPrice: '₹1,999/year',
      color: '#7c2d12',
      bgColor: '#fefbf2',
      coverage: 'Customizable'
    }
  ];

  const myPolicies = [
    {
      id: 1,
      type: 'Health Insurance',
      policyNumber: 'HLT2024001234',
      provider: 'Star Health',
      premium: '₹15,999/year',
      coverage: '₹5,00,000',
      status: 'Active',
      renewalDate: '15 Mar 2025',
      daysToRenewal: 68,
      icon: 'medical-outline',
      color: '#dc2626'
    },
    {
      id: 2,
      type: 'Life Insurance',
      policyNumber: 'LIF2023005678',
      provider: 'LIC of India',
      premium: '₹24,000/year',
      coverage: '₹25,00,000',
      status: 'Active',
      renewalDate: '10 Jun 2025',
      daysToRenewal: 155,
      icon: 'heart-outline',
      color: '#059669'
    },
    {
      id: 3,
      type: 'Motor Insurance',
      policyNumber: 'MOT2024002345',
      provider: 'Bajaj Allianz',
      premium: '₹8,500/year',
      coverage: 'Comprehensive',
      status: 'Expiring Soon',
      renewalDate: '25 Jan 2025',
      daysToRenewal: 20,
      icon: 'car-outline',
      color: '#7c3aed'
    }
  ];

  const claims = [
    {
      id: 1,
      claimNumber: 'CLM2024001',
      type: 'Health Insurance',
      amount: '₹45,000',
      status: 'Approved',
      date: '15 Dec 2024',
      hospital: 'Apollo Hospital',
      color: '#059669'
    },
    {
      id: 2,
      claimNumber: 'CLM2024002',
      type: 'Motor Insurance',
      amount: '₹12,500',
      status: 'Processing',
      date: '02 Jan 2025',
      description: 'Accident repair',
      color: '#ea580c'
    }
  ];

  const quickActions = [
    { id: 1, name: 'File Claim', icon: 'document-text-outline', color: '#dc2626' },
    { id: 2, name: 'Renew Policy', icon: 'refresh-outline', color: '#059669' },
    { id: 3, name: 'Compare Plans', icon: 'analytics-outline', color: '#7c3aed' },
    { id: 4, name: 'Policy Documents', icon: 'folder-outline', color: '#ea580c' }
  ];

  const openQuoteModal = (insurance) => {
    setSelectedInsurance(insurance);
    setShowQuoteModal(true);
    quoteModalScale.value = withSpring(1);
  };

  const closeQuoteModal = () => {
    quoteModalScale.value = withTiming(0, { duration: 200 });
    setTimeout(() => {
      setShowQuoteModal(false);
      setSelectedInsurance(null);
    }, 200);
  };

  const quoteModalAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: quoteModalScale.value }],
      opacity: quoteModalScale.value,
    };
  });

  const renderInsuranceCard = (insurance, index) => (
    <Animated.View
      entering={FadeInDown.delay(index * 100).springify()}
      key={insurance.id}
      className="mr-4"
      style={{ marginRight: index === insuranceTypes.length - 1 ? 0 : 16 }}
    >
      <TouchableOpacity
        onPress={() => openQuoteModal(insurance)}
        className="w-52 rounded-2xl p-4 border border-gray-200"
        style={{ backgroundColor: insurance.bgColor }}
      >
        <View className="flex-row items-center justify-between mb-3">
          <View
            className="w-12 h-12 rounded-full items-center justify-center"
            style={{ backgroundColor: insurance.color }}
          >
            <Ionicons name={insurance.icon} size={24} color="white" />
          </View>
          <View className="bg-white px-3 py-1 rounded-lg">
            <Text className="text-xs font-semibold" style={{ color: insurance.color }}>
              {insurance.startingPrice}
            </Text>
          </View>
        </View>
        <Text className="text-base font-bold text-gray-800 mb-1">
          {insurance.name}
        </Text>
        <Text className="text-xs text-gray-600 mb-2">
          {insurance.description}
        </Text>
        <Text className="text-xs font-medium" style={{ color: insurance.color }}>
          {insurance.coverage}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderMyPolicy = (policy, index) => (
    <Animated.View
      entering={SlideInLeft.delay(index * 150).springify()}
      key={policy.id}
      className="bg-white rounded-2xl p-4 mb-6 border border-gray-100"
    >
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center flex-1">
          <View
            className="w-10 h-10 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: `${policy.color}15` }}
          >
            <Ionicons name={policy.icon} size={20} color={policy.color} />
          </View>
          <View className="flex-1">
            <Text className="text-base font-bold text-gray-800">
              {policy.type}
            </Text>
            <Text className="text-xs text-gray-500">
              {policy.provider} • {policy.policyNumber}
            </Text>
          </View>
        </View>
        <View
          className={`px-3 py-1 rounded-full ${
            policy.status === 'Active' 
              ? 'bg-green-100' 
              : policy.status === 'Expiring Soon'
              ? 'bg-orange-100'
              : 'bg-red-100'
          }`}
        >
          <Text
            className={`text-xs font-medium ${
              policy.status === 'Active' 
                ? 'text-green-700' 
                : policy.status === 'Expiring Soon'
                ? 'text-orange-700'
                : 'text-red-700'
            }`}
          >
            {policy.status}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center justify-between mb-4">
        <View>
          <Text className="text-xs text-gray-500">Coverage</Text>
          <Text className="text-sm font-semibold text-gray-800">
            {policy.coverage}
          </Text>
        </View>
        <View>
          <Text className="text-xs text-gray-500">Premium</Text>
          <Text className="text-sm font-semibold text-gray-800">
            {policy.premium}
          </Text>
        </View>
        <View>
          <Text className="text-xs text-gray-500">Renewal</Text>
          <Text className="text-sm font-semibold text-gray-800">
            {policy.renewalDate}
          </Text>
        </View>
      </View>

      {policy.status === 'Expiring Soon' && (
        <View className="bg-orange-50 rounded-xl p-3 mb-4 border border-orange-200">
          <View className="flex-row items-center">
            <Ionicons name="warning-outline" size={16} color="#ea580c" />
            <Text className="text-xs text-orange-700 ml-2 flex-1">
              Policy expires in {policy.daysToRenewal} days. Renew now to avoid coverage gap.
            </Text>
          </View>
        </View>
      )}

      <View className="flex-row space-x-3 gap-3">
        <TouchableOpacity className="flex-1 bg-blue-600 py-3 rounded-xl">
          <Text className="text-white text-center font-medium text-sm">
            View Policy
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className={`flex-1 py-3 rounded-xl ${
            policy.status === 'Expiring Soon' 
              ? 'bg-orange-600' 
              : 'border border-gray-300'
          }`}
        >
          <Text 
            className={`text-center font-medium text-sm ${
              policy.status === 'Expiring Soon' 
                ? 'text-white' 
                : 'text-gray-700'
            }`}
          >
            {policy.status === 'Expiring Soon' ? 'Renew Now' : 'Manage'}
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderClaim = (claim, index) => (
    <Animated.View
      entering={SlideInLeft.delay(index * 150).springify()}
      key={claim.id}
      className="bg-white rounded-2xl p-4 mb-6 border border-gray-100"
    >
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-1">
          <Text className="text-base font-bold text-gray-800">
            {claim.type}
          </Text>
          <Text className="text-xs text-gray-500">
            Claim: {claim.claimNumber} • {claim.date}
          </Text>
        </View>
        <View
          className={`px-3 py-1 rounded-full ${
            claim.status === 'Approved' 
              ? 'bg-green-100' 
              : claim.status === 'Processing'
              ? 'bg-blue-100'
              : 'bg-red-100'
          }`}
        >
          <Text
            className={`text-xs font-medium ${
              claim.status === 'Approved' 
                ? 'text-green-700' 
                : claim.status === 'Processing'
                ? 'text-blue-700'
                : 'text-red-700'
            }`}
          >
            {claim.status}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-lg font-bold" style={{ color: claim.color }}>
          {claim.amount}
        </Text>
        <Text className="text-sm text-gray-600">
          {claim.hospital || claim.description}
        </Text>
      </View>

      <TouchableOpacity className="bg-gray-100 py-3 rounded-xl">
        <Text className="text-gray-700 text-center font-medium text-sm">
          View Details
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderQuickAction = (action, index) => (
    <Animated.View
      entering={FadeInRight.delay(index * 100).springify()}
      key={action.id}
      className="items-center flex-1"
    >
      <TouchableOpacity
        className="w-16 h-16 rounded-2xl items-center justify-center mb-2"
        style={{ backgroundColor: `${action.color}15` }}
      >
        <Ionicons name={action.icon} size={24} color={action.color} />
      </TouchableOpacity>
      <Text className="text-xs text-gray-600 text-center leading-3">
        {action.name}
      </Text>
    </Animated.View>
  );

  const renderQuoteModal = () => (
    <Modal
      visible={showQuoteModal}
      transparent={true}
      animationType="fade"
      onRequestClose={closeQuoteModal}
    >
      <View className="flex-1 bg-black bg-opacity-50 justify-center items-center px-4">
        <Animated.View
          style={quoteModalAnimatedStyle}
          className="bg-white rounded-3xl p-6 w-full max-w-sm"
        >
          {selectedInsurance && (
            <>
              <View className="flex-row items-center justify-between mb-6">
                <View className="flex-row items-center">
                  <View
                    className="w-12 h-12 rounded-full items-center justify-center mr-3"
                    style={{ backgroundColor: selectedInsurance.color }}
                  >
                    <Ionicons name={selectedInsurance.icon} size={24} color="white" />
                  </View>
                  <View>
                    <Text className="text-lg font-bold text-gray-800">
                      {selectedInsurance.name}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      Get instant quote
                    </Text>
                  </View>
                </View>
                <TouchableOpacity onPress={closeQuoteModal}>
                  <Ionicons name="close" size={24} color="#6b7280" />
                </TouchableOpacity>
              </View>

              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Your Age
                </Text>
                <TextInput
                  placeholder="Enter your age"
                  keyboardType="numeric"
                  className="bg-gray-50 rounded-xl p-4 text-base"
                />
              </View>

              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Coverage Amount
                </Text>
                <View className="flex-row space-x-2 gap-2">
                  {['₹5L', '₹10L', '₹25L', '₹50L'].map((amount) => (
                    <TouchableOpacity
                      key={amount}
                      className="flex-1 bg-gray-100 py-3 rounded-xl"
                    >
                      <Text className="text-sm font-medium text-center text-gray-700">
                        {amount}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 mb-4">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-sm text-gray-600">Estimated Premium</Text>
                  <Text className="text-lg font-bold text-blue-600">
                    {selectedInsurance.startingPrice}
                  </Text>
                </View>
                <Text className="text-xs text-gray-500">
                  Final premium may vary based on your profile
                </Text>
              </View>

              <TouchableOpacity
                className="py-4 rounded-xl"
                style={{ backgroundColor: selectedInsurance.color }}
                onPress={closeQuoteModal}
              >
                <Text className="text-white text-center font-semibold">
                  Get Detailed Quote
                </Text>
              </TouchableOpacity>
            </>
          )}
        </Animated.View>
      </View>
    </Modal>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" backgroundColor="#6366f1" />
      
      {/* Header */}
      <LinearGradient
        colors={['#6366f1', '#8b5cf6']}
        className="pt-12 pb-6 px-4"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity className="mr-3" onPress={()=>router.back()}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-white">Insurance</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Insurance Types */}
        <View className="py-6">
          <View className="px-4 mb-4">
            <Text className="text-lg font-bold text-gray-800">
              Insurance Plans
            </Text>
            <Text className="text-sm text-gray-600">
              Protect what matters most to you
            </Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="px-4"
            contentContainerStyle={{ paddingRight: 16 }}
          >
            {insuranceTypes.map(renderInsuranceCard)}
          </ScrollView>
        </View>

        {/* Quick Actions */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-4">
            Quick Actions
          </Text>
          <View className="flex-row justify-between space-x-2">
            {quickActions.map(renderQuickAction)}
          </View>
        </View>

        {/* Coverage Summary */}
        <Animated.View
          entering={FadeInRight.delay(200).springify()}
          className="mx-4 mb-6"
        >
          <LinearGradient
            colors={['#1e40af', '#3b82f6']}
            className="rounded-2xl p-4"
          >
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-white text-sm opacity-90 mb-1">
                  Total Coverage
                </Text>
                <Text className="text-white text-2xl font-bold">
                  ₹30,00,000
                </Text>
                <Text className="text-blue-200 text-xs">
                  3 active policies
                </Text>
              </View>
              <View className="items-end">
                <View className="bg-opacity-20 rounded-xl p-3 mb-2">
                  <Ionicons name="shield-checkmark" size={24} color="white" />
                </View>
                <Text className="text-blue-200 text-xs">
                  ₹48,499/year
                </Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Tabs */}
        <View className="px-4 mb-4">
          <View className="flex-row bg-white rounded-2xl p-1 border border-gray-200">
            <TouchableOpacity
              onPress={() => setActiveTab('my-policies')}
              className={`flex-1 py-3 rounded-xl ${
                activeTab === 'my-policies' ? 'bg-blue-600' : ''
              }`}
            >
              <Text
                className={`text-center font-medium ${
                  activeTab === 'my-policies' ? 'text-white' : 'text-gray-600'
                }`}
              >
                My Policies
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab('claims')}
              className={`flex-1 py-3 rounded-xl ${
                activeTab === 'claims' ? 'bg-blue-600' : ''
              }`}
            >
              <Text
                className={`text-center font-medium ${
                  activeTab === 'claims' ? 'text-white' : 'text-gray-600'
                }`}
              >
                Claims
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <View className="px-4 pb-20">
          {activeTab === 'my-policies' ? (
            <View>
              {myPolicies.map(renderMyPolicy)}
            </View>
          ) : (
            <View>
              {claims.map(renderClaim)}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <Animated.View
        entering={FadeInRight.delay(500).springify()}
        className="absolute bottom-6 right-4"
      >
        <TouchableOpacity 
          className="bg-blue-600 w-14 h-14 rounded-full items-center justify-center"
          onPress={() => openQuoteModal(insuranceTypes[0])}
        >
          <Ionicons name="add" size={28} color="white" />
        </TouchableOpacity>
      </Animated.View>

      {renderQuoteModal()}
    </View>
  );
};

export default InsurancePage;