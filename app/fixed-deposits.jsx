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

const FixedDepositsPage = () => {
  const [activeTab, setActiveTab] = useState('my-fds');
  const [selectedTenure, setSelectedTenure] = useState('12');
  const [fdAmount, setFdAmount] = useState('50000');
  const [showCalculator, setShowCalculator] = useState(false);
  const [calculatorVisible, setCalculatorVisible] = useState(false);

  const animatedValue = useSharedValue(0);
  const calculatorScale = useSharedValue(0);

  useEffect(() => {
    animatedValue.value = withSpring(1);
  }, []);

  const fdPlans = [
    {
      id: 1,
      name: 'Regular FD',
      rate: '7.25%',
      minAmount: '₹1,000',
      tenure: '7 days to 10 years',
      color: '#6366f1',
      bgColor: '#f0f9ff',
      icon: 'wallet-outline'
    },
    {
      id: 2,
      name: 'Senior Citizen FD',
      rate: '7.75%',
      minAmount: '₹1,000',
      tenure: '7 days to 10 years',
      color: '#059669',
      bgColor: '#f0fdf4',
      icon: 'people-outline'
    },
    {
      id: 3,
      name: 'Tax Saver FD',
      rate: '7.00%',
      minAmount: '₹100',
      tenure: '5 years',
      color: '#dc2626',
      bgColor: '#fef2f2',
      icon: 'shield-checkmark-outline'
    },
    {
      id: 4,
      name: 'Flexi FD',
      rate: '6.75%',
      minAmount: '₹25,000',
      tenure: '1 to 5 years',
      color: '#7c3aed',
      bgColor: '#faf5ff',
      icon: 'refresh-outline'
    }
  ];

  const myFDs = [
    {
      id: 1,
      fdNumber: 'FD001234567',
      amount: '₹2,00,000',
      rate: '7.25%',
      maturityDate: '15 Mar 2025',
      maturityAmount: '₹2,14,500',
      tenure: '12 months',
      status: 'Active',
      progress: 75,
      daysLeft: 68
    },
    {
      id: 2,
      fdNumber: 'FD001234568',
      amount: '₹5,00,000',
      rate: '7.75%',
      maturityDate: '22 Jun 2025',
      maturityAmount: '₹5,38,750',
      tenure: '18 months',
      status: 'Active',
      progress: 45,
      daysLeft: 168
    },
    {
      id: 3,
      fdNumber: 'FD001234569',
      amount: '₹1,50,000',
      rate: '7.00%',
      maturityDate: '10 Dec 2024',
      maturityAmount: '₹1,60,500',
      tenure: '12 months',
      status: 'Matured',
      progress: 100,
      daysLeft: 0
    }
  ];

  const tenureOptions = [
    { label: '6M', value: '6', rate: '6.50%' },
    { label: '1Y', value: '12', rate: '7.25%' },
    { label: '2Y', value: '24', rate: '7.50%' },
    { label: '3Y', value: '36', rate: '7.75%' },
    { label: '5Y', value: '60', rate: '8.00%' },
  ];

  const calculateMaturity = () => {
    const principal = parseFloat(fdAmount);
    const tenure = parseInt(selectedTenure);
    const rate = tenureOptions.find(t => t.value === selectedTenure)?.rate || '7.25%';
    const rateValue = parseFloat(rate.replace('%', ''));
    const maturityAmount = principal + (principal * rateValue * (tenure / 12)) / 100;
    return {
      maturityAmount: maturityAmount.toFixed(0),
      rate: rate,
      interest: (maturityAmount - principal).toFixed(0)
    };
  };

  const openCalculator = () => {
    setShowCalculator(true);
    setCalculatorVisible(true);
    calculatorScale.value = withSpring(1);
  };

  const closeCalculator = () => {
    calculatorScale.value = withTiming(0, { duration: 200 });
    setTimeout(() => {
      setShowCalculator(false);
      setCalculatorVisible(false);
    }, 200);
  };

  const calculatorAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: calculatorScale.value }],
      opacity: calculatorScale.value,
    };
  });

  const renderFDPlan = (plan, index) => (
    <Animated.View
      entering={FadeInDown.delay(index * 100).springify()}
      key={plan.id}
      className="mr-4 last:mr-0"
      style={{ marginRight: index === fdPlans.length - 1 ? 0 : 16 }}
    >
      <TouchableOpacity
        className="w-44 rounded-2xl p-4 border border-gray-200"
        style={{ backgroundColor: plan.bgColor }}
      >
        <View className="flex-row items-center justify-between mb-3">
          <View
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: plan.color }}
          >
            <Ionicons name={plan.icon} size={20} color="white" />
          </View>
          <View className="bg-white px-2 py-1 rounded-lg">
            <Text className="text-xs font-semibold" style={{ color: plan.color }}>
              {plan.rate}
            </Text>
          </View>
        </View>
        <Text className="text-base font-bold text-gray-800 mb-1">
          {plan.name}
        </Text>
        <Text className="text-xs text-gray-600 mb-2">
          Min: {plan.minAmount}
        </Text>
        <Text className="text-xs text-gray-500">
          {plan.tenure}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderMyFD = (fd, index) => (
    <Animated.View
      entering={SlideInLeft.delay(index * 150).springify()}
      key={fd.id}
      className="bg-white rounded-2xl p-4 mb-6 border border-gray-100"
    >
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-1">
          <Text className="text-base font-bold text-gray-800">
            {fd.amount}
          </Text>
          <Text className="text-xs text-gray-500">
            FD: {fd.fdNumber}
          </Text>
        </View>
        <View className="items-end">
          <View
            className={`px-3 py-1 rounded-full ${
              fd.status === 'Active' ? 'bg-green-100' : 'bg-orange-100'
            }`}
          >
            <Text
              className={`text-xs font-medium ${
                fd.status === 'Active' ? 'text-green-700' : 'text-orange-700'
              }`}
            >
              {fd.status}
            </Text>
          </View>
        </View>
      </View>

      {fd.status === 'Active' && (
        <View className="mb-3">
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-xs text-gray-600">Progress</Text>
            <Text className="text-xs font-medium text-gray-800">
              {fd.daysLeft} days left
            </Text>
          </View>
          <View className="w-full h-2 bg-gray-200 rounded-full">
            <View
              className="h-full rounded-full"
              style={{
                width: `${fd.progress}%`,
                backgroundColor: '#10b981',
              }}
            />
          </View>
        </View>
      )}

      <View className="flex-row items-center justify-between mb-3">
        <View>
          <Text className="text-xs text-gray-500">Interest Rate</Text>
          <Text className="text-sm font-semibold text-gray-800">
            {fd.rate}
          </Text>
        </View>
        <View>
          <Text className="text-xs text-gray-500">Tenure</Text>
          <Text className="text-sm font-semibold text-gray-800">
            {fd.tenure}
          </Text>
        </View>
        <View>
          <Text className="text-xs text-gray-500">Maturity Date</Text>
          <Text className="text-sm font-semibold text-gray-800">
            {fd.maturityDate}
          </Text>
        </View>
      </View>

      <View className="bg-gray-50 rounded-xl p-3 mb-3">
        <Text className="text-xs text-gray-600 mb-1">Maturity Amount</Text>
        <Text className="text-lg font-bold text-green-600">
          {fd.maturityAmount}
        </Text>
      </View>

      <View className="flex-row space-x-3 gap-3">
        <TouchableOpacity className="flex-1 bg-blue-600 py-3 rounded-xl">
          <Text className="text-white text-center font-medium text-sm">
            View Details
          </Text>
        </TouchableOpacity>
        {fd.status === 'Matured' ? (
          <TouchableOpacity className="flex-1 bg-green-600 py-3 rounded-xl">
            <Text className="text-white text-center font-medium text-sm">
              Renew
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity className="flex-1 border border-gray-300 py-3 rounded-xl">
            <Text className="text-gray-700 text-center font-medium text-sm">
              Pre-close
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );

  const renderCalculator = () => (
    <Modal
      visible={showCalculator}
      transparent={true}
      animationType="fade"
      onRequestClose={closeCalculator}
    >
      <View className="flex-1 bg-black bg-opacity-50 justify-center items-center px-4">
        <Animated.View
          style={calculatorAnimatedStyle}
          className="bg-white rounded-3xl p-6 w-full max-w-sm"
        >
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-xl font-bold text-gray-800">
              FD Calculator
            </Text>
            <TouchableOpacity onPress={closeCalculator}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Investment Amount
            </Text>
            <TextInput
              value={fdAmount}
              onChangeText={setFdAmount}
              placeholder="Enter amount"
              keyboardType="numeric"
              className="bg-gray-50 rounded-xl p-4 text-base"
            />
          </View>

          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-3">
              Select Tenure
            </Text>
            <View className="flex-row justify-between">
              {tenureOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => setSelectedTenure(option.value)}
                  className={`px-4 py-3 rounded-xl ${
                    selectedTenure === option.value
                      ? 'bg-blue-600'
                      : 'bg-gray-100'
                  }`}
                >
                  <Text
                    className={`text-sm font-medium text-center ${
                      selectedTenure === option.value
                        ? 'text-white'
                        : 'text-gray-700'
                    }`}
                  >
                    {option.label}
                  </Text>
                  <Text
                    className={`text-xs text-center ${
                      selectedTenure === option.value
                        ? 'text-blue-200'
                        : 'text-gray-500'
                    }`}
                  >
                    {option.rate}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {fdAmount && (
            <View className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 mb-4">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-sm text-gray-600">Investment</Text>
                <Text className="text-sm font-semibold text-gray-800">
                  ₹{parseInt(fdAmount).toLocaleString()}
                </Text>
              </View>
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-sm text-gray-600">Interest</Text>
                <Text className="text-sm font-semibold text-green-600">
                  ₹{parseInt(calculateMaturity().interest).toLocaleString()}
                </Text>
              </View>
              <View className="border-t border-gray-200 pt-2">
                <View className="flex-row items-center justify-between">
                  <Text className="text-base font-bold text-gray-800">
                    Maturity Amount
                  </Text>
                  <Text className="text-lg font-bold text-blue-600">
                    ₹{parseInt(calculateMaturity().maturityAmount).toLocaleString()}
                  </Text>
                </View>
              </View>
            </View>
          )}

          <TouchableOpacity
            className="bg-blue-600 py-4 rounded-xl"
            onPress={closeCalculator}
          >
            <Text className="text-white text-center font-semibold">
              Open FD with this amount
            </Text>
          </TouchableOpacity>
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
            <Text className="text-xl font-bold text-white">Fixed Deposits</Text>
          </View>
          <View className="flex-row items-center space-x-3">
            <TouchableOpacity onPress={openCalculator}>
              <Ionicons name="calculator-outline" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="notifications-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* FD Plans */}
        <View className="py-6">
          <View className="px-4 mb-4">
            <Text className="text-lg font-bold text-gray-800">
              FD Plans Available
            </Text>
            <Text className="text-sm text-gray-600">
              Choose the best plan for your investment
            </Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="px-4"
            contentContainerStyle={{ paddingRight: 16 }}
          >
            {fdPlans.map(renderFDPlan)}
          </ScrollView>
        </View>

        {/* Quick Stats */}
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
                  Total FD Value
                </Text>
                <Text className="text-white text-2xl font-bold">
                  ₹7,50,000
                </Text>
                <Text className="text-blue-200 text-xs">
                  Expected maturity: ₹8,53,250
                </Text>
              </View>
              <View className="items-end">
                <View className="bg-opacity-20 rounded-xl p-3">
                  <Ionicons name="trending-up" size={24} color="white" />
                </View>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Tabs */}
        <View className="px-4 mb-4">
          <View className="flex-row bg-white rounded-2xl p-1 border border-gray-200">
            <TouchableOpacity
              onPress={() => setActiveTab('my-fds')}
              className={`flex-1 py-3 rounded-xl ${
                activeTab === 'my-fds' ? 'bg-blue-600' : ''
              }`}
            >
              <Text
                className={`text-center font-medium ${
                  activeTab === 'my-fds' ? 'text-white' : 'text-gray-600'
                }`}
              >
                My FDs
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab('rates')}
              className={`flex-1 py-3 rounded-xl ${
                activeTab === 'rates' ? 'bg-blue-600' : ''
              }`}
            >
              <Text
                className={`text-center font-medium ${
                  activeTab === 'rates' ? 'text-white' : 'text-gray-600'
                }`}
              >
                Interest Rates
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <View className="px-4 pb-20">
          {activeTab === 'my-fds' ? (
            <View>
              {myFDs.map(renderMyFD)}
            </View>
          ) : (
            <View className="bg-white rounded-2xl border border-gray-100">
              <View className="p-4 border-b border-gray-100">
                <Text className="text-lg font-bold text-gray-800 mb-1">
                  Current Interest Rates
                </Text>
                <Text className="text-sm text-gray-600">
                  Rates effective from Jan 2025
                </Text>
              </View>
              {tenureOptions.map((option, index) => (
                <Animated.View
                  entering={FadeInDown.delay(index * 100).springify()}
                  key={option.value}
                  className={`flex-row items-center justify-between p-4 ${
                    index < tenureOptions.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <View>
                    <Text className="text-base font-semibold text-gray-800">
                      {option.label === '6M' ? '6 Months' : 
                       option.label === '1Y' ? '1 Year' :
                       option.label === '2Y' ? '2 Years' :
                       option.label === '3Y' ? '3 Years' : '5 Years'}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      General public
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-lg font-bold text-green-600">
                      {option.rate}
                    </Text>
                    <Text className="text-xs text-gray-500">
                      +0.50% for seniors
                    </Text>
                  </View>
                </Animated.View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <Animated.View
        entering={FadeInRight.delay(500).springify()}
        className="absolute bottom-6 right-4"
      >
        <TouchableOpacity className="bg-blue-600 w-14 h-14 rounded-full items-center justify-center">
          <Ionicons name="add" size={28} color="white" />
        </TouchableOpacity>
      </Animated.View>

      {renderCalculator()}
    </View>
  );
};

export default FixedDepositsPage;