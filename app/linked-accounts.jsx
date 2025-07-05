import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    FlatList,
    Modal,
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
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const LinkedAccountsPage = () => {
  const [activeTab, setActiveTab] = useState('linked');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  const animatedValue = useSharedValue(0);
  const modalScale = useSharedValue(0);

  useEffect(() => {
    animatedValue.value = withSpring(1);
  }, []);

  const linkedAccounts = [
    {
      id: 1,
      bankName: 'HDFC Bank',
      accountNumber: '****8765',
      accountType: 'Savings',
      balance: '₹1,25,840',
      status: 'Active',
      verificationStatus: 'Verified',
      lastUpdated: '2 hours ago',
      color: '#dc2626',
      logo: '🏦',
      features: ['UPI Payments', 'Fund Transfer', 'Balance Check'],
      linkedDate: '15 Dec 2024',
      isDefault: true
    },
    {
      id: 2,
      bankName: 'ICICI Bank',
      accountNumber: '****4321',
      accountType: 'Current',
      balance: '₹2,45,600',
      status: 'Active',
      verificationStatus: 'Verified',
      lastUpdated: '1 day ago',
      color: '#f59e0b',
      logo: '🏛️',
      features: ['UPI Payments', 'Fund Transfer', 'EMI Auto-debit'],
      linkedDate: '03 Jan 2025',
      isDefault: false
    },
    {
      id: 3,
      bankName: 'Axis Bank',
      accountNumber: '****9876',
      accountType: 'Savings',
      balance: '₹89,500',
      status: 'Limited',
      verificationStatus: 'Pending',
      lastUpdated: '3 days ago',
      color: '#8b5cf6',
      logo: '🏪',
      features: ['Balance Check Only'],
      linkedDate: '01 Jan 2025',
      isDefault: false
    },
    {
      id: 4,
      bankName: 'SBI',
      accountNumber: '****1122',
      accountType: 'Savings',
      balance: '₹3,75,200',
      status: 'Inactive',
      verificationStatus: 'Failed',
      lastUpdated: '1 week ago',
      color: '#059669',
      logo: '🏢',
      features: ['Requires Re-verification'],
      linkedDate: '20 Dec 2024',
      isDefault: false
    }
  ];

  const popularBanks = [
    { id: 1, name: 'HDFC Bank', logo: '🏦', color: '#dc2626' },
    { id: 2, name: 'ICICI Bank', logo: '🏛️', color: '#f59e0b' },
    { id: 3, name: 'State Bank of India', logo: '🏢', color: '#059669' },
    { id: 4, name: 'Axis Bank', logo: '🏪', color: '#8b5cf6' },
    { id: 5, name: 'Kotak Mahindra', logo: '🏬', color: '#ef4444' },
    { id: 6, name: 'Punjab National Bank', logo: '🏭', color: '#3b82f6' },
    { id: 7, name: 'Bank of Baroda', logo: '🏘️', color: '#10b981' },
    { id: 8, name: 'Canara Bank', logo: '🏗️', color: '#7c3aed' },
    { id: 9, name: 'Union Bank', logo: '🏤', color: '#0891b2' },
    { id: 10, name: 'IDFC First Bank', logo: '🏦', color: '#ea580c' }
  ];

  const accountBenefits = [
    {
      id: 1,
      title: 'Unified Dashboard',
      description: 'View all your accounts in one place',
      icon: 'apps-outline',
      color: '#3b82f6'
    },
    {
      id: 2,
      title: 'Quick Transfers',
      description: 'Transfer money between linked accounts instantly',
      icon: 'swap-horizontal-outline',
      color: '#10b981'
    },
    {
      id: 3,
      title: 'Balance Tracking',
      description: 'Real-time balance updates across all accounts',
      icon: 'trending-up-outline',
      color: '#f59e0b'
    },
    {
      id: 4,
      title: 'Smart Insights',
      description: 'Get spending insights across all your accounts',
      icon: 'analytics-outline',
      color: '#8b5cf6'
    }
  ];

  const filteredBanks = popularBanks.filter(bank =>
    bank.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openAddModal = () => {
    setShowAddModal(true);
    modalScale.value = withSpring(1);
  };

  const closeAddModal = () => {
    modalScale.value = withTiming(0, { duration: 200 });
    setTimeout(() => {
      setShowAddModal(false);
      setSelectedBank(null);
      setAccountNumber('');
      setIfscCode('');
      setAccountHolder('');
      setSearchQuery('');
    }, 200);
  };

  const openVerifyModal = () => {
    setShowVerifyModal(true);
    modalScale.value = withSpring(1);
  };

  const closeVerifyModal = () => {
    modalScale.value = withTiming(0, { duration: 200 });
    setTimeout(() => {
      setShowVerifyModal(false);
      setVerificationCode('');
    }, 200);
  };

  const handleLinkAccount = () => {
    if (!selectedBank || !accountNumber || !ifscCode || !accountHolder) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }
    closeAddModal();
    openVerifyModal();
  };

  const handleVerifyAccount = () => {
    if (!verificationCode) {
      Alert.alert('Error', 'Please enter verification code');
      return;
    }
    closeVerifyModal();
    Alert.alert('Success', 'Account linked successfully!');
  };

  const modalAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: modalScale.value }],
      opacity: modalScale.value,
    };
  });

  const renderLinkedAccount = (account, index) => (
    <Animated.View
      entering={SlideInLeft.delay(index * 150).springify()}
      key={account.id}
      className="bg-white rounded-2xl p-4 mb-6 border border-gray-100"
    >
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center flex-1">
          <View
            className="w-12 h-12 rounded-2xl items-center justify-center mr-3"
            style={{ backgroundColor: `${account.color}15` }}
          >
            <Text className="text-xl">{account.logo}</Text>
          </View>
          <View className="flex-1">
            <View className="flex-row items-center">
              <Text className="text-base font-bold text-gray-800">
                {account.bankName}
              </Text>
              {account.isDefault && (
                <View className="bg-blue-100 px-2 py-1 rounded-full ml-2">
                  <Text className="text-xs font-medium text-blue-700">
                    Primary
                  </Text>
                </View>
              )}
            </View>
            <Text className="text-sm text-gray-600">
              {account.accountType} • {account.accountNumber}
            </Text>
          </View>
        </View>
        <View
          className={`px-3 py-1 rounded-full ${
            account.status === 'Active'
              ? 'bg-green-100'
              : account.status === 'Limited'
              ? 'bg-orange-100'
              : 'bg-red-100'
          }`}
        >
          <Text
            className={`text-xs font-medium ${
              account.status === 'Active'
                ? 'text-green-700'
                : account.status === 'Limited'
                ? 'text-orange-700'
                : 'text-red-700'
            }`}
          >
            {account.status}
          </Text>
        </View>
      </View>

      <View className="bg-gray-50 rounded-xl p-3 mb-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-xs text-gray-600">Available Balance</Text>
            <Text className="text-lg font-bold text-gray-800">
              {account.balance}
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-xs text-gray-600">Last Updated</Text>
            <Text className="text-sm font-medium text-gray-700">
              {account.lastUpdated}
            </Text>
          </View>
        </View>
      </View>

      <View className="mb-4">
        <Text className="text-sm font-medium text-gray-700 mb-2">
          Available Features
        </Text>
        <View className="flex-row flex-wrap">
          {account.features.map((feature, idx) => (
            <View key={idx} className="flex-row items-center mr-4 mb-1">
              <View
                className="w-1.5 h-1.5 rounded-full mr-2"
                style={{ backgroundColor: account.color }}
              />
              <Text className="text-xs text-gray-600">{feature}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className="flex-row space-x-3 gap-3">
        <TouchableOpacity
          className="flex-1 py-3 rounded-xl"
          style={{ backgroundColor: account.color }}
        >
          <Text className="text-white text-center font-medium text-sm">
            {account.status === 'Inactive' ? 'Reactivate' : 'Transfer'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 border border-gray-300 py-3 rounded-xl">
          <Text className="text-gray-700 text-center font-medium text-sm">
            Manage
          </Text>
        </TouchableOpacity>
      </View>

      {account.verificationStatus === 'Pending' && (
        <View className="bg-orange-50 rounded-xl p-3 mt-3 border border-orange-200">
          <View className="flex-row items-center">
            <Ionicons name="warning-outline" size={16} color="#ea580c" />
            <Text className="text-xs text-orange-700 ml-2 flex-1">
              Account verification pending. Complete verification to unlock all features.
            </Text>
          </View>
        </View>
      )}

      {account.verificationStatus === 'Failed' && (
        <View className="bg-red-50 rounded-xl p-3 mt-3 border border-red-200">
          <View className="flex-row items-center">
            <Ionicons name="close-circle-outline" size={16} color="#dc2626" />
            <Text className="text-xs text-red-700 ml-2 flex-1">
              Verification failed. Please update account details and try again.
            </Text>
          </View>
        </View>
      )}
    </Animated.View>
  );

  const renderBenefit = (benefit, index) => (
    <Animated.View
      entering={FadeInDown.delay(index * 100).springify()}
      key={benefit.id}
      className="bg-white rounded-2xl p-4 mb-4 border border-gray-100"
    >
      <View className="flex-row items-center mb-3">
        <View
          className="w-10 h-10 rounded-full items-center justify-center mr-3"
          style={{ backgroundColor: `${benefit.color}15` }}
        >
          <Ionicons name={benefit.icon} size={20} color={benefit.color} />
        </View>
        <View className="flex-1">
          <Text className="text-base font-bold text-gray-800">
            {benefit.title}
          </Text>
          <Text className="text-sm text-gray-600 mt-1">
            {benefit.description}
          </Text>
        </View>
      </View>
    </Animated.View>
  );

  const renderBankOption = ({ item }) => (
    <TouchableOpacity
      onPress={() => setSelectedBank(item)}
      className={`flex-row items-center p-4 rounded-xl mb-2 ${
        selectedBank?.id === item.id ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
      }`}
    >
      <View
        className="w-10 h-10 rounded-full items-center justify-center mr-3"
        style={{ backgroundColor: `${item.color}15` }}
      >
        <Text className="text-lg">{item.logo}</Text>
      </View>
      <Text className="text-base font-medium text-gray-800 flex-1">
        {item.name}
      </Text>
      {selectedBank?.id === item.id && (
        <Ionicons name="checkmark-circle" size={20} color="#3b82f6" />
      )}
    </TouchableOpacity>
  );

  const renderAddModal = () => (
    <Modal
      visible={showAddModal}
      transparent={true}
      animationType="fade"
      onRequestClose={closeAddModal}
    >
      <View className="flex-1 bg-black bg-opacity-50 justify-center items-center px-4">
        <Animated.View
          style={modalAnimatedStyle}
          className="bg-white rounded-3xl p-6 w-full max-w-md max-h-4/5"
        >
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-xl font-bold text-gray-800">
              Link New Account
            </Text>
            <TouchableOpacity onPress={closeAddModal}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {!selectedBank ? (
              <>
                <Text className="text-sm font-medium text-gray-700 mb-3">
                  Search and select your bank
                </Text>
                <View className="bg-gray-50 rounded-xl px-4 py-3 flex-row items-center mb-4">
                  <Ionicons name="search-outline" size={20} color="#6b7280" />
                  <TextInput
                    placeholder="Search banks..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    className="flex-1 ml-3 text-base"
                  />
                </View>
                <FlatList
                  data={filteredBanks}
                  renderItem={renderBankOption}
                  keyExtractor={(item) => item.id.toString()}
                  scrollEnabled={false}
                />
              </>
            ) : (
              <>
                <View className="flex-row items-center p-4 bg-blue-50 rounded-xl mb-6">
                  <View
                    className="w-12 h-12 rounded-full items-center justify-center mr-3"
                    style={{ backgroundColor: `${selectedBank.color}15` }}
                  >
                    <Text className="text-xl">{selectedBank.logo}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-bold text-gray-800">
                      {selectedBank.name}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      Enter your account details
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => setSelectedBank(null)}>
                    <Ionicons name="pencil" size={20} color="#3b82f6" />
                  </TouchableOpacity>
                </View>

                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Account Holder Name
                  </Text>
                  <TextInput
                    value={accountHolder}
                    onChangeText={setAccountHolder}
                    placeholder="Enter full name as per bank records"
                    className="bg-gray-50 rounded-xl p-4 text-base"
                  />
                </View>

                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Account Number
                  </Text>
                  <TextInput
                    value={accountNumber}
                    onChangeText={setAccountNumber}
                    placeholder="Enter account number"
                    keyboardType="numeric"
                    className="bg-gray-50 rounded-xl p-4 text-base"
                  />
                </View>

                <View className="mb-6">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    IFSC Code
                  </Text>
                  <TextInput
                    value={ifscCode}
                    onChangeText={setIfscCode}
                    placeholder="Enter IFSC code"
                    autoCapitalize="characters"
                    className="bg-gray-50 rounded-xl p-4 text-base"
                  />
                </View>

                <TouchableOpacity
                  onPress={handleLinkAccount}
                  className="py-4 rounded-xl mb-3"
                  style={{ backgroundColor: selectedBank.color }}
                >
                  <Text className="text-white text-center font-semibold">
                    Continue to Verification
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setSelectedBank(null)}
                  className="py-4 rounded-xl border border-gray-300"
                >
                  <Text className="text-gray-700 text-center font-medium">
                    Change Bank
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );

  const renderVerifyModal = () => (
    <Modal
      visible={showVerifyModal}
      transparent={true}
      animationType="fade"
      onRequestClose={closeVerifyModal}
    >
      <View className="flex-1 bg-black bg-opacity-50 justify-center items-center px-4">
        <Animated.View
          style={modalAnimatedStyle}
          className="bg-white rounded-3xl p-6 w-full max-w-sm"
        >
          <View className="items-center mb-6">
            <View className="w-16 h-16 bg-blue-100 rounded-full items-center justify-center mb-4">
              <Ionicons name="shield-checkmark" size={32} color="#3b82f6" />
            </View>
            <Text className="text-xl font-bold text-gray-800 text-center">
              Verify Account
            </Text>
            <Text className="text-sm text-gray-600 text-center mt-2">
              We've sent a verification code to your registered mobile number ending with ****67
            </Text>
          </View>

          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Enter Verification Code
            </Text>
            <TextInput
              value={verificationCode}
              onChangeText={setVerificationCode}
              placeholder="Enter 6-digit code"
              keyboardType="numeric"
              maxLength={6}
              className="bg-gray-50 rounded-xl p-4 text-base text-center"
            />
          </View>

          <TouchableOpacity
            onPress={handleVerifyAccount}
            className="bg-blue-600 py-4 rounded-xl mb-3"
          >
            <Text className="text-white text-center font-semibold">
              Verify & Link Account
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={closeVerifyModal}>
            <Text className="text-blue-600 text-center font-medium">
              Resend Code
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
            <Text className="text-xl font-bold text-white">Linked Accounts</Text>
          </View>
          <TouchableOpacity onPress={openAddModal}>
            <Ionicons name="add-circle-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Summary Card */}
        <Animated.View
          entering={FadeInRight.delay(200).springify()}
          className="mx-4 mt-6 mb-6"
        >
          <LinearGradient
            colors={['#1e40af', '#3b82f6']}
            className="rounded-2xl p-4"
          >
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-white text-sm opacity-90 mb-1">
                  Total Linked Accounts
                </Text>
                <Text className="text-white text-2xl font-bold">
                  {linkedAccounts.length}
                </Text>
                <Text className="text-blue-200 text-xs">
                  Combined Balance: ₹7,36,140
                </Text>
              </View>
              <View className="items-end">
                <View className="bg-opacity-20 rounded-xl p-3 mb-2">
                  <Ionicons name="link" size={24} color="white" />
                </View>
                <Text className="text-blue-200 text-xs">
                  {linkedAccounts.filter(acc => acc.status === 'Active').length} Active
                </Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Tabs */}
        <View className="px-4 mb-4">
          <View className="flex-row bg-white rounded-2xl p-1 border border-gray-200">
            <TouchableOpacity
              onPress={() => setActiveTab('linked')}
              className={`flex-1 py-3 rounded-xl ${
                activeTab === 'linked' ? 'bg-blue-600' : ''
              }`}
            >
              <Text
                className={`text-center font-medium ${
                  activeTab === 'linked' ? 'text-white' : 'text-gray-600'
                }`}
              >
                Linked Accounts
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab('benefits')}
              className={`flex-1 py-3 rounded-xl ${
                activeTab === 'benefits' ? 'bg-blue-600' : ''
              }`}
            >
              <Text
                className={`text-center font-medium ${
                  activeTab === 'benefits' ? 'text-white' : 'text-gray-600'
                }`}
              >
                Benefits
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <View className="px-4 pb-20">
          {activeTab === 'linked' ? (
            <View>
              {linkedAccounts.map(renderLinkedAccount)}
            </View>
          ) : (
            <View>
              <Text className="text-lg font-bold text-gray-800 mb-4">
                Why Link Your Accounts?
              </Text>
              {accountBenefits.map(renderBenefit)}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      {activeTab === 'linked' && (
        <Animated.View
          entering={FadeInRight.delay(500).springify()}
          className="absolute bottom-6 right-4"
        >
          <TouchableOpacity 
            className="bg-blue-600 w-14 h-14 rounded-full items-center justify-center"
            onPress={openAddModal}
          >
            <Ionicons name="add" size={28} color="white" />
          </TouchableOpacity>
        </Animated.View>
      )}

      {renderAddModal()}
      {renderVerifyModal()}
    </View>
  );
};

export default LinkedAccountsPage;