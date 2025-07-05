import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    FlatList,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const Bills = () => {
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const shimmerPosition = useRef(new Animated.Value(-200)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  // State management
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

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

    // Continuous animations
    const shimmerAnimation = Animated.loop(
      Animated.timing(shimmerPosition, {
        toValue: 200,
        duration: 3000,
        useNativeDriver: true,
      })
    );

    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    shimmerAnimation.start();
    pulseAnimation.start();

    return () => {
      shimmerAnimation.stop();
      pulseAnimation.stop();
    };
  }, []);

  // Bill categories
  const billCategories = [
    { id: 'all', title: 'All Bills', icon: 'view-list', color: '#6b7280' },
    { id: 'utilities', title: 'Utilities', icon: 'flash-on', color: '#f59e0b' },
    { id: 'mobile', title: 'Mobile', icon: 'phone-android', color: '#10b981' },
    { id: 'internet', title: 'Internet', icon: 'wifi', color: '#3b82f6' },
    { id: 'insurance', title: 'Insurance', icon: 'security', color: '#8b5cf6' },
    { id: 'credit', title: 'Credit Cards', icon: 'credit-card', color: '#ef4444' },
  ];

  // Upcoming bills
  const upcomingBills = [
    {
      id: 1,
      title: "Electricity Bill",
      provider: "ConEd Energy",
      amount: 125.50,
      dueDate: "2025-01-08",
      category: "utilities",
      logo: "https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=100",
      color: "#f59e0b",
      status: "due_soon",
      autopay: true,
      lastPaid: "2024-12-08"
    },
    {
      id: 2,
      title: "Phone Bill",
      provider: "Verizon Wireless",
      amount: 89.99,
      dueDate: "2025-01-10",
      category: "mobile",
      logo: "https://images.pexels.com/photos/147413/twitter-facebook-together-exchange-147413.jpeg?auto=compress&cs=tinysrgb&w=100",
      color: "#10b981",
      status: "upcoming",
      autopay: false,
      lastPaid: "2024-12-10"
    },
    {
      id: 3,
      title: "Internet Service",
      provider: "Spectrum",
      amount: 79.99,
      dueDate: "2025-01-12",
      category: "internet",
      logo: "https://images.pexels.com/photos/163064/play-stone-network-networked-163064.jpeg?auto=compress&cs=tinysrgb&w=100",
      color: "#3b82f6",
      status: "upcoming",
      autopay: true,
      lastPaid: "2024-12-12"
    },
    {
      id: 4,
      title: "Car Insurance",
      provider: "State Farm",
      amount: 180.00,
      dueDate: "2025-01-15",
      category: "insurance",
      logo: "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=100",
      color: "#8b5cf6",
      status: "upcoming",
      autopay: true,
      lastPaid: "2024-12-15"
    },
    {
      id: 5,
      title: "Credit Card",
      provider: "Chase Sapphire",
      amount: 450.25,
      dueDate: "2025-01-18",
      category: "credit",
      logo: "https://images.pexels.com/photos/164501/pexels-photo-164501.jpeg?auto=compress&cs=tinysrgb&w=100",
      color: "#ef4444",
      status: "upcoming",
      autopay: false,
      lastPaid: "2024-12-18"
    },
    {
      id: 6,
      title: "Gas Bill",
      provider: "National Grid",
      amount: 68.75,
      dueDate: "2025-01-20",
      category: "utilities",
      logo: "https://images.pexels.com/photos/128867/pexels-photo-128867.jpeg?auto=compress&cs=tinysrgb&w=100",
      color: "#f59e0b",
      status: "upcoming",
      autopay: true,
      lastPaid: "2024-12-20"
    }
  ];

  // Recent payments
  const recentPayments = [
    {
      id: 1,
      title: "Water Bill",
      provider: "NYC Water",
      amount: 45.30,
      paidDate: "2025-01-02",
      category: "utilities",
      status: "paid",
      color: "#06b6d4"
    },
    {
      id: 2,
      title: "Netflix Subscription",
      provider: "Netflix",
      amount: 15.99,
      paidDate: "2025-01-01",
      category: "entertainment",
      status: "paid",
      color: "#ef4444"
    },
    {
      id: 3,
      title: "Spotify Premium",
      provider: "Spotify",
      amount: 9.99,
      paidDate: "2024-12-30",
      category: "entertainment",
      status: "paid",
      color: "#10b981"
    }
  ];

  // Quick pay options
  const quickPayOptions = [
    {
      id: 'mobile',
      title: 'Mobile Recharge',
      subtitle: 'Prepaid & Postpaid',
      icon: 'phone-android',
      color: '#10b981',
      gradient: ['#10b981', '#059669']
    },
    {
      id: 'dth',
      title: 'DTH Recharge',
      subtitle: 'TV & Streaming',
      icon: 'tv',
      color: '#8b5cf6',
      gradient: ['#8b5cf6', '#7c3aed']
    },
    {
      id: 'fastag',
      title: 'FASTag',
      subtitle: 'Toll Payments',
      icon: 'local-parking',
      color: '#f59e0b',
      gradient: ['#f59e0b', '#d97706']
    },
    {
      id: 'education',
      title: 'Education',
      subtitle: 'Fees & Courses',
      icon: 'school',
      color: '#3b82f6',
      gradient: ['#3b82f6', '#1d4ed8']
    }
  ];

  const getStatusInfo = (status) => {
    switch (status) {
      case 'due_soon':
        return { color: '#ef4444', text: 'Due Soon', bgColor: '#fef2f2' };
      case 'upcoming':
        return { color: '#f59e0b', text: 'Upcoming', bgColor: '#fffbeb' };
      case 'paid':
        return { color: '#10b981', text: 'Paid', bgColor: '#f0fdf4' };
      case 'overdue':
        return { color: '#dc2626', text: 'Overdue', bgColor: '#fef2f2' };
      default:
        return { color: '#6b7280', text: 'Unknown', bgColor: '#f9fafb' };
    }
  };

  const getTotalUpcoming = () => {
    return upcomingBills.reduce((sum, bill) => sum + bill.amount, 0);
  };

  const handlePayBill = (bill) => {
    router.push(`/pay-bill/${bill.id}`);
  };

  const handleQuickPay = (option) => {
    router.push(`/quick-pay/${option.id}`);
  };

  const renderCategory = ({ item }) => {
    const isSelected = selectedCategory === item.id;
    
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setSelectedCategory(item.id)}
        className="mr-3"
      >
        <BlurView 
          intensity={isSelected ? 30 : 20} 
          tint="light" 
          style={[
            styles.categoryChip,
            isSelected && { borderColor: item.color, borderWidth: 2 }
          ]}
        >
          <View className="flex-row items-center px-4 py-3">
            <MaterialIcons 
              name={item.icon} 
              size={18} 
              color={isSelected ? item.color : '#6b7280'} 
            />
            <Text 
              className={`font-inter-semibold text-sm ml-2 ${
                isSelected ? 'text-gray-900' : 'text-gray-600'
              }`}
            >
              {item.title}
            </Text>
          </View>
        </BlurView>
      </TouchableOpacity>
    );
  };

  const renderUpcomingBill = ({ item, index }) => {
    const statusInfo = getStatusInfo(item.status);
    const daysUntilDue = Math.ceil((new Date(item.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
    
    return (
      <Animated.View
        style={[
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => handlePayBill(item)}
          className="mb-4"
        >
          <BlurView intensity={25} tint="light" style={styles.billCard}>
            <View className="p-5">
              {/* Header */}
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center flex-1">
                  <Image 
                    source={{ uri: item.logo }} 
                    className="w-12 h-12 rounded-2xl mr-4" 
                  />
                  <View className="flex-1">
                    <Text className="font-inter-semibold text-gray-900 text-base">
                      {item.title}
                    </Text>
                    <Text className="font-inter text-gray-500 text-sm">
                      {item.provider}
                    </Text>
                  </View>
                </View>
                
                <View className="items-end">
                  <Text className="font-inter-bold text-gray-900 text-xl">
                    ${item.amount.toFixed(2)}
                  </Text>
                  <View 
                    className="px-3 py-1 rounded-full mt-1"
                    style={{ backgroundColor: statusInfo.bgColor }}
                  >
                    <Text 
                      className="font-inter-semibold text-xs"
                      style={{ color: statusInfo.color }}
                    >
                      {statusInfo.text}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Details */}
              <View className="bg-gray-50 rounded-2xl p-4">
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="font-inter text-gray-600 text-sm">Due Date</Text>
                  <Text className="font-inter-semibold text-gray-900 text-sm">
                    {new Date(item.dueDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </Text>
                </View>
                
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="font-inter text-gray-600 text-sm">Days Left</Text>
                  <Text 
                    className="font-inter-semibold text-sm"
                    style={{ color: daysUntilDue <= 3 ? '#ef4444' : '#6b7280' }}
                  >
                    {daysUntilDue} days
                  </Text>
                </View>

                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center">
                    <MaterialIcons 
                      name={item.autopay ? "check-circle" : "radio-button-unchecked"} 
                      size={16} 
                      color={item.autopay ? "#10b981" : "#9ca3af"} 
                    />
                    <Text className="font-inter text-gray-600 text-sm ml-2">
                      AutoPay {item.autopay ? 'On' : 'Off'}
                    </Text>
                  </View>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => handlePayBill(item)}
                  >
                    <LinearGradient
                      colors={[item.color, `${item.color}CC`]}
                      style={styles.payButton}
                    >
                      <Text className="font-inter-semibold text-white text-sm">
                        Pay Now
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Shimmer Effect */}
            <Animated.View
              style={[
                styles.billShimmer,
                { transform: [{ translateX: shimmerPosition }] }
              ]}
            >
              <LinearGradient
                colors={['transparent', 'rgba(255,255,255,0.3)', 'transparent']}
                style={styles.shimmer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </Animated.View>
          </BlurView>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderQuickPay = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => handleQuickPay(item)}
      className="flex-1 mx-1"
    >
      <BlurView intensity={25} tint="light" style={styles.quickPayCard}>
        <LinearGradient
          colors={item.gradient}
          style={styles.quickPayIcon}
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

  const renderRecentPayment = ({ item }) => (
    <BlurView intensity={20} tint="light" style={styles.recentPaymentCard}>
      <View className="flex-row items-center p-4">
        <View 
          className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
          style={{ backgroundColor: `${item.color}15` }}
        >
          <MaterialIcons name="check-circle" size={24} color={item.color} />
        </View>
        
        <View className="flex-1">
          <Text className="font-inter-semibold text-gray-900 text-base">
            {item.title}
          </Text>
          <Text className="font-inter text-gray-500 text-sm">
            {item.provider}
          </Text>
        </View>
        
        <View className="items-end">
          <Text className="font-inter-bold text-gray-900 text-lg">
            ${item.amount.toFixed(2)}
          </Text>
          <Text className="font-inter text-gray-400 text-xs">
            {new Date(item.paidDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric'
            })}
          </Text>
        </View>
      </View>
    </BlurView>
  );

  const filteredBills = upcomingBills.filter(bill => 
    selectedCategory === 'all' || bill.category === selectedCategory
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
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
                  Bills & Payments
                </Text>
                <Text className="font-inter text-gray-500 text-base">
                  Manage your upcoming bills
                </Text>
              </View>
              <View className="flex-row items-center space-x-3">
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setShowSearch(!showSearch)}
                >
                  <BlurView intensity={20} tint="light" style={styles.headerButton}>
                    <MaterialIcons name="search" size={22} color="#374151" />
                  </BlurView>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => router.push('/bill-history')}
                >
                  <BlurView intensity={20} tint="light" style={styles.headerButton}>
                    <MaterialIcons name="history" size={22} color="#374151" />
                  </BlurView>
                </TouchableOpacity>
              </View>
            </View>

            {/* Search Bar */}
            {showSearch && (
              <Animated.View
                className="mb-4"
                style={[{ opacity: fadeAnim }]}
              >
                <BlurView intensity={20} tint="light" style={styles.searchBar}>
                  <View className="flex-row items-center p-4">
                    <MaterialIcons name="search" size={20} color="#9ca3af" />
                    <TextInput
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      placeholder="Search bills and payees..."
                      placeholderTextColor="#9ca3af"
                      className="font-inter text-gray-900 text-base ml-3 flex-1"
                    />
                    {searchQuery.length > 0 && (
                      <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <MaterialIcons name="clear" size={20} color="#9ca3af" />
                      </TouchableOpacity>
                    )}
                  </View>
                </BlurView>
              </Animated.View>
            )}
          </Animated.View>

          {/* Total Upcoming */}
          <Animated.View
            className="mx-4 mb-6"
            style={[
              { opacity: fadeAnim, transform: [{ scale: pulseAnim }] }
            ]}
          >
            <BlurView intensity={30} tint="light" style={styles.totalCard}>
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.totalGradient}
              >
                <View className="p-6">
                  <View className="flex-row items-center justify-between">
                    <View>
                      <Text className="font-inter text-white text-lg opacity-90">
                        Total Upcoming Bills
                      </Text>
                      <Text className="font-inter-bold text-white text-4xl mt-2">
                        ${getTotalUpcoming().toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </Text>
                      <Text className="font-inter text-white opacity-80 text-sm mt-1">
                        {upcomingBills.length} bills this month
                      </Text>
                    </View>
                    <View className="items-end">
                      <View className=" bg-opacity-20 p-3 rounded-2xl">
                        <MaterialIcons name="receipt-long" size={32} color="white" />
                      </View>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </BlurView>
          </Animated.View>

          {/* Quick Pay Options */}
          <Animated.View
            className="mb-6"
            style={[
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
          >
            <Text className="font-inter-bold text-gray-900 text-lg px-6 mb-4">
              Quick Pay
            </Text>
            <FlatList
              data={quickPayOptions}
              renderItem={renderQuickPay}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
            />
          </Animated.View>

          {/* Bill Categories */}
          <Animated.View
            className="mb-6"
            style={[
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
          >
            <Text className="font-inter-bold text-gray-900 text-lg px-6 mb-4">
              Categories
            </Text>
            <FlatList
              data={billCategories}
              renderItem={renderCategory}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 24, paddingRight: 8 }}
            />
          </Animated.View>

          {/* Upcoming Bills */}
          <Animated.View
            className="mb-6"
            style={[
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
          >
            <View className="flex-row justify-between items-center px-6 mb-4">
              <Text className="font-inter-bold text-gray-900 text-lg">
                Upcoming Bills
              </Text>
              <TouchableOpacity 
                activeOpacity={0.7}
                onPress={() => router.push('/all-bills')}
              >
                <Text className="font-inter-semibold text-blue-600 text-sm">
                  View All
                </Text>
              </TouchableOpacity>
            </View>
            <View className="px-4">
              <FlatList
                data={filteredBills}
                renderItem={renderUpcomingBill}
                scrollEnabled={false}
              />
            </View>
          </Animated.View>

          {/* Recent Payments */}
          <Animated.View
            className="mb-8"
            style={[
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
          >
            <Text className="font-inter-bold text-gray-900 text-lg px-6 mb-4">
              Recent Payments
            </Text>
            <View className="px-4 space-y-3">
              {recentPayments.map((payment, index) => (
                <View key={payment.id} className="mb-3">
                  {renderRecentPayment({ item: payment })}
                </View>
              ))}
            </View>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Bills;

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
  searchBar: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  totalCard: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  totalGradient: {
    borderRadius: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  categoryChip: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  billCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    position: 'relative',
  },
  billShimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 100,
  },
  shimmer: {
    flex: 1,
    width: '100%',
  },
  payButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  quickPayCard: {
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  quickPayIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentPaymentCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
});