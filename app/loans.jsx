import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  FadeInDown,
  FadeInRight,
  SlideInLeft,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const LoansPage = () => {
  const [selectedLoanType, setSelectedLoanType] = useState('personal');
  const [activeTab, setActiveTab] = useState('available');
  
  const animatedValue = useSharedValue(0);
  
  React.useEffect(() => {
    animatedValue.value = withSpring(1);
  }, []);

  const loanTypes = [
    {
      id: 'personal',
      name: 'Personal Loan',
      icon: 'person-outline',
      rate: '10.5%',
      amount: '₹5,00,000',
      color: '#6366f1',
      bgColor: '#f0f9ff'
    },
    {
      id: 'home',
      name: 'Home Loan',
      icon: 'home-outline',
      rate: '8.5%',
      amount: '₹50,00,000',
      color: '#059669',
      bgColor: '#f0fdf4'
    },
    {
      id: 'car',
      name: 'Car Loan',
      icon: 'car-outline',
      rate: '9.5%',
      amount: '₹10,00,000',
      color: '#dc2626',
      bgColor: '#fef2f2'
    },
    {
      id: 'education',
      name: 'Education Loan',
      icon: 'school-outline',
      rate: '7.5%',
      amount: '₹20,00,000',
      color: '#7c3aed',
      bgColor: '#faf5ff'
    }
  ];

  const activeLoans = [
    {
      id: 1,
      type: 'Personal Loan',
      amount: '₹2,50,000',
      emi: '₹8,500',
      dueDate: '15 Jan 2025',
      progress: 0.65,
      status: 'Active'
    },
    {
      id: 2,
      type: 'Home Loan',
      amount: '₹35,00,000',
      emi: '₹45,000',
      dueDate: '22 Jan 2025',
      progress: 0.25,
      status: 'Active'
    }
  ];

  const quickActions = [
    { id: 1, name: 'Apply New Loan', icon: 'add-circle-outline', color: '#6366f1' },
    { id: 2, name: 'EMI Calculator', icon: 'calculator-outline', color: '#059669' },
    { id: 3, name: 'Pre-closure', icon: 'checkmark-circle-outline', color: '#dc2626' },
    { id: 4, name: 'Loan Statement', icon: 'document-text-outline', color: '#7c3aed' }
  ];

  const renderLoanTypeCard = (loan, index) => (
    <Animated.View 
      entering={FadeInDown.delay(index * 100).springify()}
      key={loan.id}
      className="mr-4"
    >
      <TouchableOpacity
        onPress={() => setSelectedLoanType(loan.id)}
        className={`w-40 h-32 rounded-2xl p-4 ${selectedLoanType === loan.id ? 'border-2' : 'border border-gray-200'}`}
        style={{ 
          backgroundColor: loan.bgColor,
          borderColor: selectedLoanType === loan.id ? loan.color : '#e5e7eb'
        }}
      >
        <View className="flex-row items-center justify-between mb-2">
          <View 
            className="w-8 h-8 rounded-full items-center justify-center"
            style={{ backgroundColor: loan.color }}
          >
            <Ionicons name={loan.icon} size={16} color="white" />
          </View>
          <Text className="text-xs font-medium" style={{ color: loan.color }}>
            {loan.rate}
          </Text>
        </View>
        <Text className="text-sm font-semibold text-gray-800 mb-1">
          {loan.name}
        </Text>
        <Text className="text-xs text-gray-600">
          Up to {loan.amount}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderActiveLoan = (loan, index) => (
    <Animated.View 
      entering={SlideInLeft.delay(index * 150).springify()}
      key={loan.id}
      className="bg-white rounded-2xl p-4 mb-4 border border-gray-100"
    >
      <View className="flex-row items-center justify-between mb-3">
        <View>
          <Text className="text-base font-semibold text-gray-800">
            {loan.type}
          </Text>
          <Text className="text-sm text-gray-500">
            Loan Amount: {loan.amount}
          </Text>
        </View>
        <View className="bg-green-100 px-3 py-1 rounded-full">
          <Text className="text-xs font-medium text-green-700">
            {loan.status}
          </Text>
        </View>
      </View>
      
      <View className="mb-3">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-sm text-gray-600">Progress</Text>
          <Text className="text-sm font-medium text-gray-800">
            {Math.round(loan.progress * 100)}%
          </Text>
        </View>
        <View className="w-full h-2 bg-gray-200 rounded-full">
          <Animated.View 
            className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
            style={{ 
              width: `${loan.progress * 100}%`,
              backgroundColor: '#10b981'
            }}
          />
        </View>
      </View>
      
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-xs text-gray-500">Next EMI</Text>
          <Text className="text-sm font-semibold text-gray-800">
            {loan.emi}
          </Text>
        </View>
        <View>
          <Text className="text-xs text-gray-500">Due Date</Text>
          <Text className="text-sm font-semibold text-gray-800">
            {loan.dueDate}
          </Text>
        </View>
        <TouchableOpacity className="bg-blue-600 px-4 py-2 rounded-xl">
          <Text className="text-white text-xs font-medium">Pay Now</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderQuickAction = (action, index) => (
    <Animated.View 
      entering={FadeInRight.delay(index * 100).springify()}
      key={action.id}
      className="items-center"
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

  return (
    <View className="flex-1 bg-gray-50">
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
            <Text className="text-xl font-bold text-white">Loans</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Loan Types */}
        <View className="px-4 py-6">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Loan Types
          </Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            className="mb-6"
          >
            {loanTypes.map(renderLoanTypeCard)}
          </ScrollView>
        </View>

        {/* Quick Actions */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Quick Actions
          </Text>
          <View className="flex-row justify-between">
            {quickActions.map(renderQuickAction)}
          </View>
        </View>

        {/* Tabs */}
        <View className="px-4 mb-4">
          <View className="flex-row bg-white rounded-2xl p-2">
            <TouchableOpacity
              onPress={() => setActiveTab('available')}
              className={`flex-1 py-3 rounded-xl ${activeTab === 'available' ? 'bg-blue-600' : ''}`}
            >
              <Text className={`text-center font-medium ${activeTab === 'available' ? 'text-white' : 'text-gray-600'}`}>
                Available Loans
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab('active')}
              className={`flex-1 py-3 rounded-xl ${activeTab === 'active' ? 'bg-blue-600' : ''}`}
            >
              <Text className={`text-center font-medium ${activeTab === 'active' ? 'text-white' : 'text-gray-600'}`}>
                Active Loans
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <View className="px-4 pb-6">
          {activeTab === 'available' ? (
            <View>
              <View className="bg-white rounded-2xl p-4 mb-4">
                <View className="flex-row items-center mb-3">
                  <Image 
                    source={{ uri: 'https://images.pexels.com/photos/3943716/pexels-photo-3943716.jpeg' }}
                    className="w-12 h-12 rounded-full mr-3"
                  />
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-gray-800">
                      Personal Loan
                    </Text>
                    <Text className="text-sm text-gray-500">
                      Pre-approved for you
                    </Text>
                  </View>
                  <View className="bg-green-100 px-3 py-1 rounded-full">
                    <Text className="text-xs font-medium text-green-700">
                      10.5% APR
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-center justify-between mb-4">
                  <Text className="text-2xl font-bold text-gray-800">
                    ₹5,00,000
                  </Text>
                  <Text className="text-sm text-gray-500">
                    EMI starts at ₹8,500
                  </Text>
                </View>
                <TouchableOpacity className="bg-blue-600 py-3 rounded-xl">
                  <Text className="text-white text-center font-semibold">
                    Apply Now
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="bg-white rounded-2xl p-4 mb-4">
                <View className="flex-row items-center mb-3">
                  <Image 
                    source={{ uri: 'https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg' }}
                    className="w-12 h-12 rounded-full mr-3"
                  />
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-gray-800">
                      Home Loan
                    </Text>
                    <Text className="text-sm text-gray-500">
                      Special rates available
                    </Text>
                  </View>
                  <View className="bg-green-100 px-3 py-1 rounded-full">
                    <Text className="text-xs font-medium text-green-700">
                      8.5% APR
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-center justify-between mb-4">
                  <Text className="text-2xl font-bold text-gray-800">
                    ₹50,00,000
                  </Text>
                  <Text className="text-sm text-gray-500">
                    EMI starts at ₹45,000
                  </Text>
                </View>
                <TouchableOpacity className="bg-blue-600 py-3 rounded-xl">
                  <Text className="text-white text-center font-semibold">
                    Apply Now
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View>
              {activeLoans.map(renderActiveLoan)}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default LoansPage;