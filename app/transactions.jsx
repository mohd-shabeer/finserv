import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Dimensions,
    FlatList,
    RefreshControl,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, {
    FadeInDown,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const TransactionsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');
  const [refreshing, setRefreshing] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const animatedValue = useSharedValue(0);
  const filterHeight = useSharedValue(0);

  useEffect(() => {
    animatedValue.value = withSpring(1);
    loadTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [searchQuery, selectedFilter, selectedPeriod, transactions]);

  const loadTransactions = () => {
    // Mock transaction data with realistic banking transactions
    const mockTransactions = [
      {
        id: 'txn_001',
        type: 'debit',
        category: 'food',
        title: 'Swiggy Food Delivery',
        description: 'Order #SW12345',
        amount: 850.00,
        date: '2025-01-05',
        time: '2:30 PM',
        status: 'completed',
        merchant: 'Swiggy',
        icon: 'restaurant-outline',
        color: '#ef4444',
        bgColor: '#fef2f2',
        method: 'UPI',
        reference: 'UPI/250105/143012345'
      },
      {
        id: 'txn_002',
        type: 'credit',
        category: 'salary',
        title: 'Salary Credit',
        description: 'Tech Corp Pvt Ltd',
        amount: 125000.00,
        date: '2025-01-01',
        time: '9:00 AM',
        status: 'completed',
        merchant: 'Tech Corp',
        icon: 'business-outline',
        color: '#10b981',
        bgColor: '#f0fdf4',
        method: 'NEFT',
        reference: 'NEFT/250101/090012345'
      },
      {
        id: 'txn_003',
        type: 'debit',
        category: 'shopping',
        title: 'Amazon Purchase',
        description: 'Electronics & Accessories',
        amount: 15999.00,
        date: '2025-01-04',
        time: '11:45 AM',
        status: 'completed',
        merchant: 'Amazon',
        icon: 'bag-outline',
        color: '#f59e0b',
        bgColor: '#fffbeb',
        method: 'Card',
        reference: 'CARD/250104/114512345'
      },
      {
        id: 'txn_004',
        type: 'debit',
        category: 'utilities',
        title: 'Electricity Bill',
        description: 'KPCL - Monthly Bill',
        amount: 2850.75,
        date: '2025-01-03',
        time: '4:20 PM',
        status: 'completed',
        merchant: 'KPCL',
        icon: 'flash-outline',
        color: '#8b5cf6',
        bgColor: '#faf5ff',
        method: 'UPI',
        reference: 'UPI/250103/162012345'
      },
      {
        id: 'txn_005',
        type: 'debit',
        category: 'transport',
        title: 'Uber Trip',
        description: 'Koramangala to Airport',
        amount: 650.00,
        date: '2025-01-02',
        time: '6:15 AM',
        status: 'completed',
        merchant: 'Uber',
        icon: 'car-outline',
        color: '#06b6d4',
        bgColor: '#f0f9ff',
        method: 'UPI',
        reference: 'UPI/250102/061512345'
      },
      {
        id: 'txn_006',
        type: 'credit',
        category: 'refund',
        title: 'Refund - Flipkart',
        description: 'Product Return',
        amount: 2499.00,
        date: '2025-01-02',
        time: '3:30 PM',
        status: 'completed',
        merchant: 'Flipkart',
        icon: 'refresh-outline',
        color: '#10b981',
        bgColor: '#f0fdf4',
        method: 'UPI',
        reference: 'UPI/250102/153012345'
      },
      {
        id: 'txn_007',
        type: 'debit',
        category: 'entertainment',
        title: 'Netflix Subscription',
        description: 'Monthly Premium Plan',
        amount: 649.00,
        date: '2025-01-01',
        time: '12:00 PM',
        status: 'completed',
        merchant: 'Netflix',
        icon: 'tv-outline',
        color: '#dc2626',
        bgColor: '#fef2f2',
        method: 'Card',
        reference: 'CARD/250101/120012345'
      },
      {
        id: 'txn_008',
        type: 'debit',
        category: 'transfer',
        title: 'Money Transfer',
        description: 'To John Doe',
        amount: 5000.00,
        date: '2024-12-31',
        time: '8:45 PM',
        status: 'completed',
        merchant: 'P2P Transfer',
        icon: 'send-outline',
        color: '#3b82f6',
        bgColor: '#eff6ff',
        method: 'UPI',
        reference: 'UPI/241231/204512345'
      },
      {
        id: 'txn_009',
        type: 'debit',
        category: 'health',
        title: 'Apollo Pharmacy',
        description: 'Medicines & Health',
        amount: 1250.00,
        date: '2024-12-30',
        time: '7:20 PM',
        status: 'completed',
        merchant: 'Apollo Pharmacy',
        icon: 'medical-outline',
        color: '#059669',
        bgColor: '#f0fdf4',
        method: 'Card',
        reference: 'CARD/241230/192012345'
      },
      {
        id: 'txn_010',
        type: 'debit',
        category: 'fuel',
        title: 'Shell Petrol Pump',
        description: 'Fuel Purchase',
        amount: 3200.00,
        date: '2024-12-29',
        time: '10:30 AM',
        status: 'completed',
        merchant: 'Shell',
        icon: 'car-sport-outline',
        color: '#dc2626',
        bgColor: '#fef2f2',
        method: 'Card',
        reference: 'CARD/241229/103012345'
      }
    ];

    setTransactions(mockTransactions);
    setFilteredTransactions(mockTransactions);
  };

  const filterTransactions = () => {
    let filtered = transactions;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(txn => 
        txn.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.merchant.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by type
    if (selectedFilter !== 'all') {
      if (selectedFilter === 'income') {
        filtered = filtered.filter(txn => txn.type === 'credit');
      } else if (selectedFilter === 'expenses') {
        filtered = filtered.filter(txn => txn.type === 'debit');
      } else {
        filtered = filtered.filter(txn => txn.category === selectedFilter);
      }
    }

    // Filter by period
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    if (selectedPeriod !== 'all') {
      filtered = filtered.filter(txn => {
        const txnDate = new Date(txn.date);
        
        switch (selectedPeriod) {
          case 'today':
            return txnDate.toDateString() === now.toDateString();
          case 'thisWeek':
            const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
            return txnDate >= weekStart;
          case 'thisMonth':
            return txnDate.getMonth() === currentMonth && txnDate.getFullYear() === currentYear;
          case 'lastMonth':
            const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
            const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
            return txnDate.getMonth() === lastMonth && txnDate.getFullYear() === lastMonthYear;
          default:
            return true;
        }
      });
    }

    setFilteredTransactions(filtered);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
    filterHeight.value = withTiming(showFilters ? 0 : 200, { duration: 300 });
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      loadTransactions();
      setRefreshing(false);
    }, 1000);
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-IN', { 
        day: 'numeric', 
        month: 'short' 
      });
    }
  };

  const getTransactionIcon = (transaction) => {
    return transaction.icon || (transaction.type === 'credit' ? 'arrow-down-outline' : 'arrow-up-outline');
  };

  const filterCategories = [
    { id: 'all', name: 'All', icon: 'apps-outline' },
    { id: 'income', name: 'Income', icon: 'trending-up-outline' },
    { id: 'expenses', name: 'Expenses', icon: 'trending-down-outline' },
    { id: 'food', name: 'Food', icon: 'restaurant-outline' },
    { id: 'shopping', name: 'Shopping', icon: 'bag-outline' },
    { id: 'transport', name: 'Transport', icon: 'car-outline' },
    { id: 'utilities', name: 'Bills', icon: 'flash-outline' },
    { id: 'entertainment', name: 'Entertainment', icon: 'tv-outline' },
    { id: 'health', name: 'Health', icon: 'medical-outline' },
    { id: 'transfer', name: 'Transfer', icon: 'send-outline' }
  ];

  const periodOptions = [
    { id: 'today', name: 'Today' },
    { id: 'thisWeek', name: 'This Week' },
    { id: 'thisMonth', name: 'This Month' },
    { id: 'lastMonth', name: 'Last Month' },
    { id: 'all', name: 'All Time' }
  ];

  const calculateTotalsByType = () => {
    const income = filteredTransactions
      .filter(txn => txn.type === 'credit')
      .reduce((sum, txn) => sum + txn.amount, 0);
    
    const expenses = filteredTransactions
      .filter(txn => txn.type === 'debit')
      .reduce((sum, txn) => sum + txn.amount, 0);

    return { income, expenses };
  };

  const { income, expenses } = calculateTotalsByType();

  const renderTransactionItem = ({ item, index }) => (
    <Animated.View
      entering={FadeInDown.delay(index * 100)}
      className="bg-white rounded-2xl p-4 mb-3 mx-4"
      style={{
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      }}
    >
      <TouchableOpacity
        className="flex-row items-center"
        onPress={() => router.push(`/transaction-detail/${item.id}`)}
      >
        <View 
          className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
          style={{ backgroundColor: item.bgColor }}
        >
          <Ionicons 
            name={getTransactionIcon(item)} 
            size={20} 
            color={item.color} 
          />
        </View>
        
        <View className="flex-1">
          <Text className="font-semibold text-gray-800 text-base mb-1">
            {item.title}
          </Text>
          <Text className="text-gray-600 text-sm mb-1">
            {item.description}
          </Text>
          <View className="flex-row items-center">
            <Text className="text-gray-500 text-xs mr-2">
              {formatDate(item.date)} • {item.time}
            </Text>
            <View className="bg-gray-100 rounded-full px-2 py-1">
              <Text className="text-xs text-gray-600">
                {item.method}
              </Text>
            </View>
          </View>
        </View>
        
        <View className="items-end">
          <Text 
            className={`font-bold text-lg ${
              item.type === 'credit' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {item.type === 'credit' ? '+' : '-'}{formatCurrency(item.amount)}
          </Text>
          <Text className="text-gray-500 text-xs">
            {item.status}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderFilterChip = ({ item }) => (
    <TouchableOpacity
      onPress={() => setSelectedFilter(item.id)}
      className={`mr-3 px-4 py-2 rounded-full flex-row items-center ${
        selectedFilter === item.id
          ? 'bg-blue-500'
          : 'bg-white border border-gray-200'
      }`}
      style={{
        elevation: selectedFilter === item.id ? 4 : 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: selectedFilter === item.id ? 0.15 : 0.05,
        shadowRadius: selectedFilter === item.id ? 4 : 2,
      }}
    >
      <Ionicons
        name={item.icon}
        size={16}
        color={selectedFilter === item.id ? 'white' : '#6b7280'}
        style={{ marginRight: 6 }}
      />
      <Text
        className={`text-sm font-medium ${
          selectedFilter === item.id ? 'text-white' : 'text-gray-700'
        }`}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const filterAnimatedStyle = useAnimatedStyle(() => ({
    height: filterHeight.value,
    opacity: filterHeight.value / 200,
  }));

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" backgroundColor="#3b82f6" />
      
      {/* Header */}
      <LinearGradient
        colors={['#3b82f6', '#1d4ed8']}
        className="pt-12 pb-6"
      >
        <View className="flex-row items-center justify-between px-4 mb-4">
          <View className="flex-row items-center">
            <TouchableOpacity className="mr-3" onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-white">Transactions</Text>
          </View>
          <TouchableOpacity onPress={toggleFilters}>
            <Ionicons 
              name={showFilters ? "close" : "filter"} 
              size={24} 
              color="white" 
            />
          </TouchableOpacity>
        </View>

        {/* Summary Cards */}
        <View className="flex-row px-4 mb-4">
          <View className="flex-1 bg-opacity-20 rounded-2xl p-4 mr-2">
            <Text className="text-white text-sm opacity-90">Income</Text>
            <Text className="text-white text-xl font-bold">
              {formatCurrency(income)}
            </Text>
          </View>
          <View className="flex-1 bg-opacity-20 rounded-2xl p-4 ml-2">
            <Text className="text-white text-sm opacity-90">Expenses</Text>
            <Text className="text-white text-xl font-bold">
              {formatCurrency(expenses)}
            </Text>
          </View>
        </View>

        {/* Search Bar */}
        <View className="mx-4 mb-4">
          <View className="bg-opacity-20 rounded-2xl px-4 py-3 flex-row items-center">
            <Ionicons name="search" size={20} color="white" />
            <TextInput
              placeholder="Search transactions..."
              placeholderTextColor="rgba(255,255,255,0.7)"
              className="flex-1 ml-3 text-white"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Period Filter */}
        <View className="px-4">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {periodOptions.map((period) => (
              <TouchableOpacity
                key={period.id}
                onPress={() => setSelectedPeriod(period.id)}
                className={`mr-3 px-4 py-2 rounded-full ${
                  selectedPeriod === period.id
                    ? 'bg-white'
                    : 'bg-opacity-20'
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    selectedPeriod === period.id
                      ? 'text-blue-600'
                      : 'text-white'
                  }`}
                >
                  {period.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </LinearGradient>

      {/* Expandable Filter Section */}
      <Animated.View style={filterAnimatedStyle} className="bg-white overflow-hidden">
        <View className="p-4">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            Filter by Category
          </Text>
          <FlatList
            data={filterCategories}
            renderItem={renderFilterChip}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 10 }}
          />
        </View>
      </Animated.View>

      {/* Transactions List */}
      <View className="flex-1">
        {filteredTransactions.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Ionicons name="receipt-outline" size={64} color="#d1d5db" />
            <Text className="text-gray-500 text-lg mt-4">
              No transactions found
            </Text>
            <Text className="text-gray-400 text-sm mt-2 text-center px-8">
              Try adjusting your search or filter criteria
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredTransactions}
            renderItem={renderTransactionItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingTop: 16, paddingBottom: 100 }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#3b82f6']}
                tintColor="#3b82f6"
              />
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
};

export default TransactionsPage;