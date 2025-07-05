import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Modal,
  ScrollView,
  Share,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const BillDetailsPage = ({ billId = 'electricity_001' }) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [scheduleType, setScheduleType] = useState('monthly');
  const [activeTab, setActiveTab] = useState('details');

  const animatedValue = useSharedValue(0);
  const modalScale = useSharedValue(0);

  useEffect(() => {
    animatedValue.value = withSpring(1);
  }, []);

  // Mock bill data - in real app, this would come from API based on billId
  const billData = {
    id: 'electricity_001',
    type: 'electricity',
    provider: 'Karnataka Power Corporation Limited (KPCL)',
    providerLogo: '⚡',
    consumerNumber: 'KEB123456789',
    customerName: 'Sarah Johnson',
    billNumber: 'EB2025010156',
    billDate: '2025-01-05',
    dueDate: '2025-01-20',
    amount: 2850.75,
    status: 'pending',
    address: '123 MG Road, Koramangala, Bangalore - 560034',
    billingPeriod: 'December 2024',
    unitsConsumed: 485,
    ratePerUnit: 5.87,
    previousReading: 12450,
    currentReading: 12935,
    isOverdue: false,
    daysUntilDue: 15,
    lastPaidAmount: 2650.50,
    lastPaidDate: '2024-12-18',
    breakdown: [
      { item: 'Energy Charges', amount: 2846.95, units: 485 },
      { item: 'Fixed Charges', amount: 150.00 },
      { item: 'Electricity Duty', amount: 142.35 },
      { item: 'FPPCA', amount: -288.55 },
    ],
    taxes: [
      { name: 'Service Tax', amount: 0.00 },
      { name: 'CGST', amount: 0.00 },
      { name: 'SGST', amount: 0.00 },
    ],
    history: [
      { month: 'November 2024', amount: 2650.50, units: 452, status: 'paid', date: '2024-12-18' },
      { month: 'October 2024', amount: 2890.75, units: 492, status: 'paid', date: '2024-11-15' },
      { month: 'September 2024', amount: 3120.25, units: 531, status: 'paid', date: '2024-10-12' },
      { month: 'August 2024', amount: 3550.80, units: 605, status: 'paid', date: '2024-09-10' },
      { month: 'July 2024', amount: 4120.40, units: 702, status: 'paid', date: '2024-08-08' },
    ]
  };

  const paymentMethods = [
    {
      id: 'upi',
      name: 'UPI Payment',
      description: 'Pay using UPI apps',
      icon: 'phone-portrait-outline',
      color: '#10b981',
      processingTime: 'Instant'
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      description: 'Pay through your bank',
      icon: 'globe-outline',
      color: '#3b82f6',
      processingTime: 'Instant'
    },
    {
      id: 'card',
      name: 'Debit/Credit Card',
      description: 'Pay with saved cards',
      icon: 'card-outline',
      color: '#f59e0b',
      processingTime: 'Instant'
    },
    {
      id: 'wallet',
      name: 'Finverse Wallet',
      description: 'Pay from wallet balance',
      icon: 'wallet-outline',
      color: '#8b5cf6',
      processingTime: 'Instant',
      balance: '₹5,240.80'
    }
  ];

  const scheduleOptions = [
    { id: 'monthly', name: 'Monthly', description: 'Auto-pay every month' },
    { id: 'bimonthly', name: 'Bi-monthly', description: 'Auto-pay every 2 months' },
    { id: 'quarterly', name: 'Quarterly', description: 'Auto-pay every 3 months' },
  ];

  const getBillStatusColor = () => {
    switch (billData.status) {
      case 'paid': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'overdue': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getBillStatusText = () => {
    switch (billData.status) {
      case 'paid': return 'Paid';
      case 'pending': return 'Pending';
      case 'overdue': return 'Overdue';
      default: return 'Unknown';
    }
  };

  const openPaymentModal = () => {
    setShowPaymentModal(true);
    modalScale.value = withSpring(1);
  };

  const closePaymentModal = () => {
    modalScale.value = withTiming(0, { duration: 200 });
    setTimeout(() => {
      setShowPaymentModal(false);
      setSelectedPaymentMethod('');
    }, 200);
  };

  const openScheduleModal = () => {
    setShowScheduleModal(true);
    modalScale.value = withSpring(1);
  };

  const closeScheduleModal = () => {
    modalScale.value = withTiming(0, { duration: 200 });
    setTimeout(() => {
      setShowScheduleModal(false);
    }, 200);
  };

  const handlePayNow = () => {
    if (!selectedPaymentMethod) {
      Alert.alert('Payment Method Required', 'Please select a payment method.');
      return;
    }
    closePaymentModal();
    Alert.alert(
      'Payment Initiated',
      `Your payment of ₹${billData.amount.toLocaleString()} has been initiated via ${
        paymentMethods.find(m => m.id === selectedPaymentMethod)?.name
      }.`,
      [{ text: 'OK' }]
    );
  };

  const handleSchedulePayment = () => {
    closeScheduleModal();
    Alert.alert(
      'Auto-Pay Scheduled',
      `${scheduleOptions.find(s => s.id === scheduleType)?.name} auto-pay has been set up for your ${billData.type} bills.`,
      [{ text: 'OK' }]
    );
  };

  const handleDownloadBill = () => {
    Alert.alert('Download Bill', 'Bill PDF has been downloaded to your device.');
  };

  const handleShareBill = async () => {
    try {
      await Share.share({
        message: `Bill Details - ${billData.provider}\nBill Number: ${billData.billNumber}\nAmount: ₹${billData.amount.toLocaleString()}\nDue Date: ${billData.dueDate}`,
        title: 'Bill Details',
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share the bill details.');
    }
  };

  const modalAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: modalScale.value }],
      opacity: modalScale.value,
    };
  });

  const renderBillOverview = () => (
    <Animated.View
      entering={FadeInDown.delay(200).springify()}
      className="mx-4 mt-6 mb-6"
    >
      <LinearGradient
        colors={['#1e40af', '#3b82f6']}
        className="rounded-2xl p-6"
      >
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <Text className="text-4xl mr-3">{billData.providerLogo}</Text>
            <View>
              <Text className="text-white text-lg font-bold">
                {billData.type.charAt(0).toUpperCase() + billData.type.slice(1)} Bill
              </Text>
              <Text className="text-blue-200 text-sm">
                {billData.billingPeriod}
              </Text>
            </View>
          </View>
          <View
            className="px-3 py-1 rounded-full"
            style={{ backgroundColor: getBillStatusColor() }}
          >
            <Text className="text-white text-xs font-medium">
              {getBillStatusText()}
            </Text>
          </View>
        </View>

        <View className="mb-4">
          <Text className="text-blue-200 text-sm mb-1">Amount Due</Text>
          <Text className="text-white text-3xl font-bold">
            ₹{billData.amount.toLocaleString()}
          </Text>
        </View>

        <View className="flex-row justify-between">
          <View>
            <Text className="text-blue-200 text-xs">Due Date</Text>
            <Text className="text-white text-sm font-medium">
              {billData.dueDate}
            </Text>
          </View>
          <View>
            <Text className="text-blue-200 text-xs">Consumer No.</Text>
            <Text className="text-white text-sm font-medium">
              {billData.consumerNumber}
            </Text>
          </View>
          <View>
            <Text className="text-blue-200 text-xs">Units</Text>
            <Text className="text-white text-sm font-medium">
              {billData.unitsConsumed} kWh
            </Text>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );

  const renderQuickActions = () => (
    <View className="px-4 mb-6">
      <Text className="text-lg font-bold text-gray-800 mb-4">
        Quick Actions
      </Text>
      <View className="flex-row space-x-3">
        <TouchableOpacity
          onPress={openPaymentModal}
          className="flex-1 bg-green-600 py-4 rounded-2xl"
        >
          <View className="items-center">
            <Ionicons name="card-outline" size={24} color="white" />
            <Text className="text-white font-bold mt-2">Pay Now</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={openScheduleModal}
          className="flex-1 bg-blue-600 py-4 rounded-2xl"
        >
          <View className="items-center">
            <Ionicons name="time-outline" size={24} color="white" />
            <Text className="text-white font-bold mt-2">Auto Pay</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={handleDownloadBill}
          className="flex-1 bg-purple-600 py-4 rounded-2xl"
        >
          <View className="items-center">
            <Ionicons name="download-outline" size={24} color="white" />
            <Text className="text-white font-bold mt-2">Download</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderBillDetails = () => (
    <View className="bg-white rounded-2xl p-6 mb-6 border border-gray-100">
      <Text className="text-lg font-bold text-gray-800 mb-4">
        Bill Information
      </Text>
      
      <View className="space-y-3">
        <View className="flex-row justify-between py-2">
          <Text className="text-gray-600">Provider</Text>
          <Text className="text-gray-800 font-medium flex-1 text-right">
            {billData.provider}
          </Text>
        </View>
        <View className="flex-row justify-between py-2">
          <Text className="text-gray-600">Bill Number</Text>
          <Text className="text-gray-800 font-medium">
            {billData.billNumber}
          </Text>
        </View>
        <View className="flex-row justify-between py-2">
          <Text className="text-gray-600">Bill Date</Text>
          <Text className="text-gray-800 font-medium">
            {billData.billDate}
          </Text>
        </View>
        <View className="flex-row justify-between py-2">
          <Text className="text-gray-600">Customer Name</Text>
          <Text className="text-gray-800 font-medium">
            {billData.customerName}
          </Text>
        </View>
        <View className="flex-row justify-between py-2">
          <Text className="text-gray-600">Service Address</Text>
          <Text className="text-gray-800 font-medium flex-1 text-right">
            {billData.address}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderUsageDetails = () => (
    <View className="bg-white rounded-2xl p-6 mb-6 border border-gray-100">
      <Text className="text-lg font-bold text-gray-800 mb-4">
        Usage Details
      </Text>
      
      <View className="space-y-4">
        <View className="flex-row justify-between items-center">
          <Text className="text-gray-600">Previous Reading</Text>
          <Text className="text-gray-800 font-medium">
            {billData.previousReading.toLocaleString()} kWh
          </Text>
        </View>
        <View className="flex-row justify-between items-center">
          <Text className="text-gray-600">Current Reading</Text>
          <Text className="text-gray-800 font-medium">
            {billData.currentReading.toLocaleString()} kWh
          </Text>
        </View>
        <View className="flex-row justify-between items-center">
          <Text className="text-gray-600">Units Consumed</Text>
          <Text className="text-green-600 font-bold text-lg">
            {billData.unitsConsumed} kWh
          </Text>
        </View>
        <View className="flex-row justify-between items-center">
          <Text className="text-gray-600">Rate per Unit</Text>
          <Text className="text-gray-800 font-medium">
            ₹{billData.ratePerUnit.toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderBillBreakdown = () => (
    <View className="bg-white rounded-2xl p-6 mb-6 border border-gray-100">
      <Text className="text-lg font-bold text-gray-800 mb-4">
        Bill Breakdown
      </Text>
      
      <View className="space-y-3">
        {billData.breakdown.map((item, index) => (
          <View key={index} className="flex-row justify-between items-center py-2">
            <View className="flex-1">
              <Text className="text-gray-700 font-medium">
                {item.item}
              </Text>
              {item.units && (
                <Text className="text-gray-500 text-xs">
                  {item.units} units
                </Text>
              )}
            </View>
            <Text className={`font-bold ${
              item.amount < 0 ? 'text-green-600' : 'text-gray-800'
            }`}>
              {item.amount < 0 ? '-' : ''}₹{Math.abs(item.amount).toLocaleString()}
            </Text>
          </View>
        ))}
        
        <View className="border-t border-gray-200 mt-4 pt-4">
          <View className="flex-row justify-between items-center">
            <Text className="text-lg font-bold text-gray-800">
              Total Amount
            </Text>
            <Text className="text-lg font-bold text-green-600">
              ₹{billData.amount.toLocaleString()}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderPaymentHistory = () => (
    <View className="bg-white rounded-2xl p-6 mb-6 border border-gray-100">
      <Text className="text-lg font-bold text-gray-800 mb-4">
        Payment History
      </Text>
      
      <View className="space-y-4">
        {billData.history.map((payment, index) => (
          <View key={index} className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-gray-800 font-medium">
                {payment.month}
              </Text>
              <Text className="text-gray-500 text-sm">
                {payment.units} kWh • Paid on {payment.date}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-gray-800 font-bold">
                ₹{payment.amount.toLocaleString()}
              </Text>
              <View className="bg-green-100 px-2 py-1 rounded-full">
                <Text className="text-green-700 text-xs font-medium">
                  {payment.status.toUpperCase()}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderPaymentModal = () => (
    <Modal
      visible={showPaymentModal}
      transparent={true}
      animationType="fade"
      onRequestClose={closePaymentModal}
    >
      <View className="flex-1 bg-black bg-opacity-50 justify-center items-center px-4">
        <Animated.View
          style={modalAnimatedStyle}
          className="bg-white rounded-3xl p-6 w-full max-w-md"
        >
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-xl font-bold text-gray-800">
              Select Payment Method
            </Text>
            <TouchableOpacity onPress={closePaymentModal}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <View className="mb-6">
            <Text className="text-center text-2xl font-bold text-gray-800 mb-2">
              ₹{billData.amount.toLocaleString()}
            </Text>
            <Text className="text-center text-gray-600">
              {billData.provider}
            </Text>
          </View>

          <View className="space-y-3 mb-6">
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                onPress={() => setSelectedPaymentMethod(method.id)}
                className={`p-4 rounded-xl border ${
                  selectedPaymentMethod === method.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1">
                    <View
                      className="w-10 h-10 rounded-full items-center justify-center mr-3"
                      style={{ backgroundColor: `${method.color}15` }}
                    >
                      <Ionicons name={method.icon} size={20} color={method.color} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-base font-bold text-gray-800">
                        {method.name}
                      </Text>
                      <Text className="text-sm text-gray-600">
                        {method.description}
                      </Text>
                      {method.balance && (
                        <Text className="text-xs text-green-600 font-medium">
                          Balance: {method.balance}
                        </Text>
                      )}
                    </View>
                  </View>
                  {selectedPaymentMethod === method.id && (
                    <Ionicons name="checkmark-circle" size={20} color="#3b82f6" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            onPress={handlePayNow}
            className={`py-4 rounded-xl ${
              selectedPaymentMethod ? 'bg-green-600' : 'bg-gray-400'
            }`}
            disabled={!selectedPaymentMethod}
          >
            <Text className="text-white text-center font-bold">
              Pay ₹{billData.amount.toLocaleString()}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );

  const renderScheduleModal = () => (
    <Modal
      visible={showScheduleModal}
      transparent={true}
      animationType="fade"
      onRequestClose={closeScheduleModal}
    >
      <View className="flex-1 bg-black bg-opacity-50 justify-center items-center px-4">
        <Animated.View
          style={modalAnimatedStyle}
          className="bg-white rounded-3xl p-6 w-full max-w-md"
        >
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-xl font-bold text-gray-800">
              Schedule Auto-Pay
            </Text>
            <TouchableOpacity onPress={closeScheduleModal}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <Text className="text-gray-600 mb-6 leading-6">
            Set up automatic payment for your {billData.type} bills. We'll remind you 3 days before each payment.
          </Text>

          <View className="space-y-3 mb-6">
            {scheduleOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                onPress={() => setScheduleType(option.id)}
                className={`p-4 rounded-xl border ${
                  scheduleType === option.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-base font-bold text-gray-800">
                      {option.name}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      {option.description}
                    </Text>
                  </View>
                  {scheduleType === option.id && (
                    <Ionicons name="checkmark-circle" size={20} color="#3b82f6" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            onPress={handleSchedulePayment}
            className="bg-blue-600 py-4 rounded-xl"
          >
            <Text className="text-white text-center font-bold">
              Set Up Auto-Pay
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );

  const tabs = [
    { id: 'details', name: 'Details', icon: 'document-text-outline' },
    { id: 'usage', name: 'Usage', icon: 'analytics-outline' },
    { id: 'history', name: 'History', icon: 'time-outline' }
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" backgroundColor="#3b82f6" />
      
      {/* Header */}
      <LinearGradient
        colors={['#3b82f6', '#1d4ed8']}
        className="pt-12 pb-6 px-4"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity className="mr-3" onPress={()=>router.back()}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-white">Bill Details</Text>
          </View>
          <TouchableOpacity onPress={handleShareBill}>
            <Ionicons name="share-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Bill Overview */}
        {renderBillOverview()}

        {/* Quick Actions */}
        {renderQuickActions()}

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
                    ? 'border-blue-600 bg-blue-600' 
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
          {activeTab === 'details' && (
            <Animated.View entering={FadeInDown.springify()}>
              {renderBillDetails()}
              {renderBillBreakdown()}
            </Animated.View>
          )}

          {activeTab === 'usage' && (
            <Animated.View entering={FadeInDown.springify()}>
              {renderUsageDetails()}
            </Animated.View>
          )}

          {activeTab === 'history' && (
            <Animated.View entering={FadeInDown.springify()}>
              {renderPaymentHistory()}
            </Animated.View>
          )}
        </View>
      </ScrollView>

      {renderPaymentModal()}
      {renderScheduleModal()}
    </View>
  );
};

export default BillDetailsPage;