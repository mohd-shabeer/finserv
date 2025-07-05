import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    FlatList,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const Accounts = () => {
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const balancePulse = useRef(new Animated.Value(1)).current;
  
  // State management
  const [selectedAccount, setSelectedAccount] = useState(0);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [timeframe, setTimeframe] = useState('month'); // week, month, year

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 80,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Balance pulse animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(balancePulse, {
          toValue: 1.02,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(balancePulse, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    return () => {
      pulseAnimation.stop();
    };
  }, []);

  // Enhanced accounts data
  const accounts = [
    {
      id: 1,
      name: "Primary Checking",
      accountNumber: "****7892",
      fullAccountNumber: "1234567890127892",
      balance: 15750.50,
      availableBalance: 15750.50,
      type: "checking",
      status: "active",
      color: "#3b82f6",
      gradient: ["#3b82f6", "#1d4ed8"],
      interestRate: 0.01,
      minimumBalance: 100,
      overdraftLimit: 500,
      lastTransaction: "2 hours ago",
      monthlyFee: 0,
      transactions: 47,
      pendingTransactions: 2
    },
    {
      id: 2,
      name: "High Yield Savings",
      accountNumber: "****1234",
      fullAccountNumber: "9876543210121234",
      balance: 42300.75,
      availableBalance: 42300.75,
      type: "savings",
      status: "active",
      color: "#10b981",
      gradient: ["#10b981", "#059669"],
      interestRate: 2.85,
      minimumBalance: 1000,
      overdraftLimit: 0,
      lastTransaction: "Yesterday",
      monthlyFee: 0,
      transactions: 12,
      pendingTransactions: 0
    },
    {
      id: 3,
      name: "Business Account",
      accountNumber: "****5678",
      fullAccountNumber: "5432109876545678",
      balance: 8920.25,
      availableBalance: 8420.25,
      type: "business",
      status: "active",
      color: "#f59e0b",
      gradient: ["#f59e0b", "#d97706"],
      interestRate: 0.5,
      minimumBalance: 2500,
      overdraftLimit: 5000,
      lastTransaction: "3 days ago",
      monthlyFee: 15,
      transactions: 23,
      pendingTransactions: 1
    },
    {
      id: 4,
      name: "Investment Account",
      accountNumber: "****9101",
      fullAccountNumber: "1122334455669101",
      balance: 125840.00,
      availableBalance: 120000.00,
      type: "investment",
      status: "active",
      color: "#8b5cf6",
      gradient: ["#8b5cf6", "#7c3aed"],
      interestRate: 7.2,
      minimumBalance: 10000,
      overdraftLimit: 0,
      lastTransaction: "1 week ago",
      monthlyFee: 25,
      transactions: 8,
      pendingTransactions: 0
    },
    {
      id: 5,
      name: "Emergency Fund",
      accountNumber: "****3456",
      fullAccountNumber: "9988776655443456",
      balance: 25000.00,
      availableBalance: 25000.00,
      type: "savings",
      status: "restricted",
      color: "#ef4444",
      gradient: ["#ef4444", "#dc2626"],
      interestRate: 3.2,
      minimumBalance: 5000,
      overdraftLimit: 0,
      lastTransaction: "2 months ago",
      monthlyFee: 0,
      transactions: 3,
      pendingTransactions: 0
    }
  ];

  // Account actions
  const accountActions = [
    {
      id: 'transfer',
      title: 'Transfer',
      subtitle: 'Move money',
      icon: 'swap-horiz',
      color: '#3b82f6',
      gradient: ['#3b82f6', '#1d4ed8']
    },
    {
      id: 'deposit',
      title: 'Deposit',
      subtitle: 'Add funds',
      icon: 'add-circle',
      color: '#10b981',
      gradient: ['#10b981', '#059669']
    },
    {
      id: 'withdraw',
      title: 'Withdraw',
      subtitle: 'Take out cash',
      icon: 'remove-circle',
      color: '#f59e0b',
      gradient: ['#f59e0b', '#d97706']
    },
    {
      id: 'statement',
      title: 'Statement',
      subtitle: 'Download PDF',
      icon: 'description',
      color: '#8b5cf6',
      gradient: ['#8b5cf6', '#7c3aed']
    }
  ];

  // Recent account activities
  const recentActivities = [
    {
      id: 1,
      type: "credit",
      description: "Direct Deposit - Salary",
      amount: 5500.00,
      date: "Today, 9:00 AM",
      account: "Primary Checking",
      status: "completed",
      category: "Income",
      reference: "DD202501040001"
    },
    {
      id: 2,
      type: "debit",
      description: "Online Transfer to Savings",
      amount: -1000.00,
      date: "Yesterday, 3:30 PM",
      account: "Primary Checking",
      status: "completed",
      category: "Transfer",
      reference: "TRF202501030045"
    },
    {
      id: 3,
      type: "credit",
      description: "Interest Payment",
      amount: 89.50,
      date: "Jan 1, 12:01 AM",
      account: "High Yield Savings",
      status: "completed",
      category: "Interest",
      reference: "INT202501010001"
    },
    {
      id: 4,
      type: "debit",
      description: "Monthly Service Fee",
      amount: -15.00,
      date: "Jan 1, 12:00 AM",
      account: "Business Account",
      status: "completed",
      category: "Fee",
      reference: "FEE202501010001"
    },
    {
      id: 5,
      type: "debit",
      description: "ATM Withdrawal",
      amount: -200.00,
      date: "Dec 30, 2:15 PM",
      account: "Primary Checking",
      status: "pending",
      category: "Withdrawal",
      reference: "ATM202412300102"
    }
  ];

  // Performance data for selected account
  const getAccountPerformance = (accountId, timeframe) => {
    // Mock performance data
    const data = {
      week: [
        { day: 'Mon', balance: 15200 },
        { day: 'Tue', balance: 15400 },
        { day: 'Wed', balance: 15100 },
        { day: 'Thu', balance: 15600 },
        { day: 'Fri', balance: 15750 },
        { day: 'Sat', balance: 15750 },
        { day: 'Sun', balance: 15750 }
      ],
      month: [
        { period: 'Week 1', balance: 14800 },
        { period: 'Week 2', balance: 15200 },
        { period: 'Week 3', balance: 15400 },
        { period: 'Week 4', balance: 15750 }
      ],
      year: [
        { period: 'Q1', balance: 12000 },
        { period: 'Q2', balance: 13500 },
        { period: 'Q3', balance: 14200 },
        { period: 'Q4', balance: 15750 }
      ]
    };
    return data[timeframe];
  };

  const handleAccountSelect = (index) => {
    setSelectedAccount(index);
  };

  const handleAccountAction = (actionId) => {
    const account = accounts[selectedAccount];
    switch (actionId) {
      case 'transfer':
        router.push('/(tabs)/transfer');
        break;
      case 'deposit':
        router.push('/deposit');
        break;
      case 'withdraw':
        router.push('/withdraw');
        break;
      case 'statement':
        router.push('/statements');
        break;
      default:
        break;
    }
  };

  const toggleBalanceVisibility = () => {
    setBalanceVisible(!balanceVisible);
  };

  const getAccountIcon = (type) => {
    switch (type) {
      case 'checking':
        return 'account-balance-wallet';
      case 'savings':
        return 'savings';
      case 'business':
        return 'business';
      case 'investment':
        return 'trending-up';
      default:
        return 'account-balance';
    }
  };

  const renderAccount = ({ item, index }) => {
    const isSelected = selectedAccount === index;
    
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => handleAccountSelect(index)}
      >
        <BlurView 
          intensity={isSelected ? 35 : 25} 
          tint="light" 
          style={[
            styles.accountCard,
            isSelected && styles.selectedAccountCard
          ]}
        >
          <LinearGradient
            colors={isSelected ? item.gradient : ['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.4)']}
            style={styles.accountGradient}
          >
            <View className="p-6">
              {/* Account Header */}
              <View className="flex-row justify-between items-start mb-4">
                <View className="flex-row items-center">
                  <View 
                    className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
                    style={{ backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : `${item.color}15` }}
                  >
                    <MaterialIcons 
                      name={getAccountIcon(item.type)} 
                      size={24} 
                      color={isSelected ? 'white' : item.color} 
                    />
                  </View>
                  <View>
                    <Text 
                      className={`font-inter-semibold text-lg ${
                        isSelected ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {item.name}
                    </Text>
                    <Text 
                      className={`font-mono text-sm ${
                        isSelected ? 'text-white opacity-80' : 'text-gray-500'
                      }`}
                    >
                      {item.accountNumber}
                    </Text>
                  </View>
                </View>
                
                {/* Status Badge */}
                <View 
                  className={`px-2 py-1 rounded-full ${
                    item.status === 'active' ? 'bg-green-500' : 
                    item.status === 'restricted' ? 'bg-red-500' : 'bg-yellow-500'
                  }`}
                >
                  <Text className="font-inter-semibold text-white text-xs capitalize">
                    {item.status}
                  </Text>
                </View>
              </View>

              {/* Balance */}
              <View className="mb-4">
                <Text 
                  className={`font-inter text-sm ${
                    isSelected ? 'text-white opacity-80' : 'text-gray-500'
                  }`}
                >
                  Available Balance
                </Text>
                <View className="flex-row items-center">
                  <Text 
                    className={`font-inter-bold text-3xl ${
                      isSelected ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {balanceVisible ? 
                      `$${item.availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}` 
                      : '••••••••'
                    }
                  </Text>
                  {isSelected && (
                    <TouchableOpacity 
                      className="ml-3 p-1"
                      activeOpacity={0.8}
                      onPress={toggleBalanceVisibility}
                    >
                      <MaterialIcons 
                        name={balanceVisible ? "visibility" : "visibility-off"} 
                        size={20} 
                        color="rgba(255,255,255,0.8)" 
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* Account Info */}
              <View className="flex-row justify-between">
                <View>
                  <Text 
                    className={`font-inter text-xs ${
                      isSelected ? 'text-white opacity-70' : 'text-gray-400'
                    }`}
                  >
                    Interest Rate
                  </Text>
                  <Text 
                    className={`font-inter-semibold ${
                      isSelected ? 'text-white' : 'text-gray-700'
                    }`}
                  >
                    {item.interestRate}% APY
                  </Text>
                </View>
                <View className="items-center">
                  <Text 
                    className={`font-inter text-xs ${
                      isSelected ? 'text-white opacity-70' : 'text-gray-400'
                    }`}
                  >
                    Last Activity
                  </Text>
                  <Text 
                    className={`font-inter-semibold ${
                      isSelected ? 'text-white' : 'text-gray-700'
                    }`}
                  >
                    {item.lastTransaction}
                  </Text>
                </View>
                <View className="items-end">
                  <Text 
                    className={`font-inter text-xs ${
                      isSelected ? 'text-white opacity-70' : 'text-gray-400'
                    }`}
                  >
                    Transactions
                  </Text>
                  <Text 
                    className={`font-inter-semibold ${
                      isSelected ? 'text-white' : 'text-gray-700'
                    }`}
                  >
                    {item.transactions}
                  </Text>
                </View>
              </View>
            </View>

            {/* Selection Indicator */}
            {isSelected && (
              <View className="absolute top-4 left-4">
                <MaterialIcons name="check-circle" size={20} color="white" />
              </View>
            )}
          </LinearGradient>
        </BlurView>
      </TouchableOpacity>
    );
  };

  const renderAccountAction = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => handleAccountAction(item.id)}
      className="flex-1 mx-1"
    >
      <BlurView intensity={25} tint="light" style={styles.actionCard}>
        <LinearGradient
          colors={item.gradient}
          style={styles.actionIcon}
        >
          <MaterialIcons name={item.icon} size={24} color="white" />
        </LinearGradient>
        <Text className="font-inter-semibold text-gray-900 text-sm mt-3 text-center">
          {item.title}
        </Text>
        <Text className="font-inter text-gray-500 text-xs text-center mt-1">
          {item.subtitle}
        </Text>
      </BlurView>
    </TouchableOpacity>
  );

  const renderActivity = ({ item }) => (
    <BlurView intensity={20} tint="light" style={styles.activityCard}>
      <View className="flex-row items-center p-4">
        <View 
          className={`w-12 h-12 rounded-2xl items-center justify-center mr-4 ${
            item.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
          }`}
        >
          <MaterialIcons 
            name={item.type === 'credit' ? 'add' : 'remove'} 
            size={24} 
            color={item.type === 'credit' ? '#10b981' : '#ef4444'} 
          />
        </View>
        
        <View className="flex-1">
          <Text className="font-inter-semibold text-gray-900 text-base">
            {item.description}
          </Text>
          <Text className="font-inter text-gray-500 text-sm">
            {item.account}
          </Text>
          <View className="flex-row items-center mt-1">
            <View 
              className={`px-2 py-0.5 rounded-lg mr-2 ${
                item.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
              }`}
            >
              <Text 
                className={`font-inter-medium text-xs ${
                  item.type === 'credit' ? 'text-green-700' : 'text-red-700'
                }`}
              >
                {item.category}
              </Text>
            </View>
            <Text className="font-inter text-gray-400 text-xs">
              Ref: {item.reference}
            </Text>
          </View>
        </View>
        
        <View className="items-end">
          <Text 
            className={`font-inter-bold text-lg ${
              item.type === 'credit' ? 'text-green-600' : 'text-gray-900'
            }`}
          >
            {item.type === 'credit' ? '+' : ''}${Math.abs(item.amount).toFixed(2)}
          </Text>
          <Text className="font-inter text-gray-400 text-xs">
            {item.date}
          </Text>
          <View className="flex-row items-center mt-1">
            <View 
              className={`w-2 h-2 rounded-full mr-2 ${
                item.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
              }`}
            />
            <Text className="font-inter text-gray-500 text-xs capitalize">
              {item.status}
            </Text>
          </View>
        </View>
      </View>
    </BlurView>
  );

  const selectedAccountData = accounts[selectedAccount];
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  return (
    <SafeAreaView className="flex-1 bg-gray-50 pb-20">
      <LinearGradient
        colors={['#f8fafc', '#f1f5f9']}
        className="flex-1"
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 100 : 85 }}
        >
          {/* Header */}
          <Animated.View
            className="px-6 py-4"
            style={[
              { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
            ]}
          >
            <View className="flex-row items-center justify-between mb-6">
              <View>
                <Text className="font-inter-bold text-gray-900 text-2xl">
                  My Accounts
                </Text>
                <Text className="font-inter text-gray-500 text-base">
                  Manage your bank accounts
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => router.push('/add-account')}
              >
                <BlurView intensity={20} tint="light" style={styles.headerButton}>
                  <MaterialIcons name="add" size={22} color="#374151" />
                </BlurView>
              </TouchableOpacity>
            </View>

            {/* Total Balance Overview */}
            <Animated.View
              style={[{ transform: [{ scale: balancePulse }] }]}
            >
              <BlurView intensity={30} tint="light" style={styles.totalBalanceCard}>
                <LinearGradient
                  colors={['#667eea', '#764ba2']}
                  style={styles.totalBalanceGradient}
                >
                  <View className="p-6">
                    <Text className="font-inter text-white text-lg opacity-90">
                      Total Balance
                    </Text>
                    <Text className="font-inter-bold text-white text-4xl mt-2">
                      ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </Text>
                    <View className="flex-row justify-between items-end mt-4">
                      <View>
                        <Text className="font-inter text-white text-xs opacity-80">
                          {accounts.length} Active Accounts
                        </Text>
                      </View>
                      <View className="flex-row items-center">
                        <MaterialIcons name="trending-up" size={16} color="#10b981" />
                        <Text className="font-inter-semibold text-green-400 text-sm ml-1">
                          +2.4% this month
                        </Text>
                      </View>
                    </View>
                  </View>
                </LinearGradient>
              </BlurView>
            </Animated.View>
          </Animated.View>

          {/* Accounts List */}
          <Animated.View
            className="mt-6"
            style={[
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
          >
            <Text className="font-inter-bold text-gray-900 text-lg px-6 mb-4">
              Select Account
            </Text>
            <FlatList
              data={accounts}
              renderItem={renderAccount}
              scrollEnabled={false}
              contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
            />
          </Animated.View>

          {/* Account Details */}
          <Animated.View
            className="mx-4 mt-8"
            style={[
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
          >
            <Text className="font-inter-bold text-gray-900 text-lg mb-4">
              Account Details
            </Text>
            <BlurView intensity={25} tint="light" style={styles.detailsCard}>
              <View className="p-6">
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="font-inter-bold text-gray-900 text-lg">
                    {selectedAccountData.name}
                  </Text>
                  <View className="flex-row items-center">
                    <MaterialIcons 
                      name={getAccountIcon(selectedAccountData.type)} 
                      size={20} 
                      color={selectedAccountData.color} 
                    />
                    <Text 
                      className="font-inter-semibold text-sm ml-1 capitalize"
                      style={{ color: selectedAccountData.color }}
                    >
                      {selectedAccountData.type}
                    </Text>
                  </View>
                </View>

                <View className="grid grid-cols-2 gap-4">
                  <View className="flex-row justify-between py-3 border-b border-gray-100">
                    <Text className="font-inter text-gray-500">Account Number</Text>
                    <Text className="font-mono text-gray-900">
                      {balanceVisible ? selectedAccountData.fullAccountNumber : selectedAccountData.accountNumber}
                    </Text>
                  </View>
                  <View className="flex-row justify-between py-3 border-b border-gray-100">
                    <Text className="font-inter text-gray-500">Minimum Balance</Text>
                    <Text className="font-inter-semibold text-gray-900">
                      ${selectedAccountData.minimumBalance.toLocaleString()}
                    </Text>
                  </View>
                  <View className="flex-row justify-between py-3 border-b border-gray-100">
                    <Text className="font-inter text-gray-500">Monthly Fee</Text>
                    <Text className="font-inter-semibold text-gray-900">
                      {selectedAccountData.monthlyFee === 0 ? 'Free' : `$${selectedAccountData.monthlyFee}`}
                    </Text>
                  </View>
                  <View className="flex-row justify-between py-3 border-b border-gray-100">
                    <Text className="font-inter text-gray-500">Overdraft Limit</Text>
                    <Text className="font-inter-semibold text-gray-900">
                      {selectedAccountData.overdraftLimit === 0 ? 'None' : `$${selectedAccountData.overdraftLimit.toLocaleString()}`}
                    </Text>
                  </View>
                </View>
              </View>
            </BlurView>
          </Animated.View>

          {/* Quick Actions */}
          <Animated.View
            className="mt-8"
            style={[
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
          >
            <Text className="font-inter-bold text-gray-900 text-lg px-6 mb-4">
              Quick Actions
            </Text>
            <FlatList
              data={accountActions}
              renderItem={renderAccountAction}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
            />
          </Animated.View>

          {/* Recent Activities */}
          <Animated.View
            className="mt-8"
            style={[
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
          >
            <View className="flex-row justify-between items-center px-6 mb-4">
              <Text className="font-inter-bold text-gray-900 text-lg">
                Recent Activities
              </Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text className="font-inter-semibold text-blue-600 text-sm">
                  View All
                </Text>
              </TouchableOpacity>
            </View>
            <View className="px-4 space-y-3">
              {recentActivities.slice(0, 4).map((activity) => (
                <View key={activity.id} className="mb-3">
                  {renderActivity({ item: activity })}
                </View>
              ))}
            </View>
          </Animated.View>

          {/* Account Insights */}
          <Animated.View
            className="mx-4 mt-8"
            style={[
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
          >
            <Text className="font-inter-bold text-gray-900 text-lg mb-4">
              Account Insights
            </Text>
            <View className="flex-row space-x-4">
              <View className="flex-1">
                <BlurView intensity={20} tint="light" style={styles.insightCard}>
                  <LinearGradient
                    colors={['#10b981', '#059669']}
                    style={styles.insightGradient}
                  >
                    <MaterialIcons name="trending-up" size={32} color="white" />
                    <Text className="font-inter-bold text-white text-lg mt-3">
                      Growing Balance
                    </Text>
                    <Text className="font-inter text-white opacity-90 text-sm text-center mt-2 leading-5">
                      Your savings increased by 12% this quarter
                    </Text>
                  </LinearGradient>
                </BlurView>
              </View>
              
              <View className="flex-1">
                <BlurView intensity={20} tint="light" style={styles.insightCard}>
                  <LinearGradient
                    colors={['#3b82f6', '#1d4ed8']}
                    style={styles.insightGradient}
                  >
                    <MaterialIcons name="security" size={32} color="white" />
                    <Text className="font-inter-bold text-white text-lg mt-3">
                      FDIC Protected
                    </Text>
                    <Text className="font-inter text-white opacity-90 text-sm text-center mt-2 leading-5">
                      All deposits insured up to $250,000
                    </Text>
                  </LinearGradient>
                </BlurView>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Accounts;

const styles = StyleSheet.create({
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  totalBalanceCard: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  totalBalanceGradient: {
    borderRadius: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  accountCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  selectedAccountCard: {
    borderColor: '#3b82f6',
    borderWidth: 2,
  },
  accountGradient: {
    borderRadius: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  detailsCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  actionCard: {
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  insightCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  insightGradient: {
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    minHeight: 160,
    position: 'relative',
    overflow: 'hidden',
  },
});