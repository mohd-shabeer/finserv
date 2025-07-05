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
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from "../../helpers/common";

const { width, height } = Dimensions.get('window');

const Home = () => {
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const headerScale = useRef(new Animated.Value(0.95)).current;
  const balancePulse = useRef(new Animated.Value(1)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  
  // State management
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');
  
  // Background particles animation
  const particleAnimations = useRef(
    Array.from({ length: 8 }, () => ({
      translateX: new Animated.Value(0),
      translateY: new Animated.Value(0),
      opacity: new Animated.Value(0.3),
      scale: new Animated.Value(1),
    }))
  ).current;

  useEffect(() => {
    // Entrance animations with stagger effect
    const entranceAnimations = [
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 80,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(headerScale, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ];

    Animated.stagger(150, entranceAnimations).start();

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

    // Enhanced particle animations
    const particleAnimationsList = particleAnimations.map((particle, index) => {
      return Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(particle.translateX, {
              toValue: (Math.random() - 0.5) * 200,
              duration: 8000 + index * 1000,
              useNativeDriver: true,
            }),
            Animated.timing(particle.translateX, {
              toValue: (Math.random() - 0.5) * 200,
              duration: 8000 + index * 1000,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(particle.translateY, {
              toValue: (Math.random() - 0.5) * 300,
              duration: 10000 + index * 800,
              useNativeDriver: true,
            }),
            Animated.timing(particle.translateY, {
              toValue: (Math.random() - 0.5) * 300,
              duration: 10000 + index * 800,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(particle.opacity, {
              toValue: 0.1 + Math.random() * 0.4,
              duration: 4000,
              useNativeDriver: true,
            }),
            Animated.timing(particle.opacity, {
              toValue: 0.1,
              duration: 4000,
              useNativeDriver: true,
            }),
          ]),
        ])
      );
    });

    particleAnimationsList.forEach((animation, index) => {
      setTimeout(() => animation.start(), index * 1200);
    });

    return () => {
      pulseAnimation.stop();
      particleAnimationsList.forEach(animation => animation.stop());
    };
  }, []);

  // Enhanced dummy data with Pexels images
  const userData = {
    name: "Sarah Johnson",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150",
    totalBalance: 125840.50,
    accountNumber: "****7892",
    monthlyIncome: 8500.00,
    monthlyExpenses: 4200.00,
    savingsGoal: 50000,
    currentSavings: 32000,
    creditScore: 785,
    notifications: 3,
    lastLogin: "Today, 9:30 AM"
  };

  // Enhanced quick actions with better organization
  const quickActions = [
    { 
      id: 1, 
      icon: "send", 
      title: "Transfer", 
      subtitle: "Send Money",
      color: "#3b82f6", 
      gradient: ["#3b82f6", "#1d4ed8"],
      onPress: () => router.push('/transfer')
    },
    { 
      id: 2, 
      icon: "qr-code-scanner", 
      title: "Scan", 
      subtitle: "QR Payment",
      color: "#10b981", 
      gradient: ["#10b981", "#059669"],
      onPress: () => router.push('/scan')
    },
    { 
      id: 3, 
      icon: "receipt-long", 
      title: "Bills", 
      subtitle: "Pay Bills",
      color: "#f59e0b", 
      gradient: ["#f59e0b", "#d97706"],
      onPress: () => router.push('/bills')
    },
    { 
      id: 4, 
      icon: "phone-android", 
      title: "Recharge", 
      subtitle: "Mobile/DTH",
      color: "#8b5cf6", 
      gradient: ["#8b5cf6", "#7c3aed"],
      onPress: () => router.push('/recharge')
    },
  ];

  // Enhanced services grid
  const services = [
    { id: 1, icon: "trending-up", title: "Investments", color: "#10b981", route: "/investments" },
    { id: 2, icon: "credit-card", title: "Cards", color: "#f59e0b", route: "/(tabs)/cards" },
    { id: 3, icon: "account-balance", title: "Loans", color: "#8b5cf6", route: "/loans" },
    { id: 4, icon: "savings", title: "Fixed Deposits", color: "#ef4444", route: "/fixed-deposits" },
    { id: 5, icon: "security", title: "Insurance", color: "#06b6d4", route: "/insurance" },
    { id: 6, icon: "more-horiz", title: "More", color: "#6b7280", route: "/services" },
  ];

  // Enhanced transaction data
  const recentTransactions = [
    {
      id: 1,
      type: "debit",
      title: "Starbucks Coffee",
      subtitle: "Food & Beverage",
      amount: -12.50,
      date: "2 minutes ago",
      icon: "local-cafe",
      category: "Food",
      avatar: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=100",
      color: "#8b5cf6",
      status: "completed"
    },
    {
      id: 2,
      type: "credit",
      title: "Salary Credit",
      subtitle: "Tech Innovations Inc",
      amount: 5500.00,
      date: "Today, 9:00 AM",
      icon: "work",
      category: "Income",
      avatar: "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=100",
      color: "#10b981",
      status: "completed"
    },
    {
      id: 3,
      type: "debit",
      title: "Amazon Prime",
      subtitle: "Subscription",
      amount: -15.99,
      date: "Yesterday, 6:45 PM",
      icon: "subscriptions",
      category: "Entertainment",
      avatar: "https://images.pexels.com/photos/1040158/pexels-photo-1040158.jpeg?auto=compress&cs=tinysrgb&w=100",
      color: "#f59e0b",
      status: "completed"
    },
    {
      id: 4,
      type: "credit",
      title: "Cashback Reward",
      subtitle: "Credit Card Benefits",
      amount: 25.50,
      date: "Dec 30, 11:20 AM",
      icon: "card-giftcard",
      category: "Rewards",
      avatar: "https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=100",
      color: "#ef4444",
      status: "completed"
    },
  ];

  // Enhanced spending insights
  const spendingInsights = [
    { category: "Food & Dining", amount: 450, percentage: 35, color: "#f59e0b", icon: "restaurant" },
    { category: "Shopping", amount: 320, percentage: 25, color: "#8b5cf6", icon: "shopping-bag" },
    { category: "Transportation", amount: 180, percentage: 15, color: "#06b6d4", icon: "directions-car" },
    { category: "Entertainment", amount: 130, percentage: 10, color: "#ef4444", icon: "movie" },
    { category: "Others", amount: 200, percentage: 15, color: "#6b7280", icon: "more-horiz" },
  ];

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const toggleBalanceVisibility = () => {
    setBalanceVisible(!balanceVisible);
  };

  const renderQuickAction = ({ item }) => (
    <TouchableOpacity 
      className="flex-1 mx-1"
      activeOpacity={0.8}
      onPress={item.onPress}
    >
      <BlurView intensity={25} tint="light" style={styles.modernQuickAction}>
        <LinearGradient
          colors={[...item.gradient, `${item.gradient[1]}80`]}
          style={styles.quickActionGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <MaterialIcons name={item.icon} size={28} color="white" />
        </LinearGradient>
        <Text className="font-inter-semibold text-gray-900 text-sm mt-3">
          {item.title}
        </Text>
        <Text className="font-inter text-gray-500 text-xs">
          {item.subtitle}
        </Text>
      </BlurView>
    </TouchableOpacity>
  );

  const renderService = ({ item }) => (
    <TouchableOpacity 
      className="items-center p-4"
      style={{ width: width / 3 }}
      activeOpacity={0.8}
      onPress={() => router.push(item.route)}
    >
      <View 
        className="w-14 h-14 rounded-2xl items-center justify-center mb-3"
        style={{ backgroundColor: `${item.color}15` }}
      >
        <MaterialIcons name={item.icon} size={24} color={item.color} />
      </View>
      <Text className="font-inter-medium text-gray-700 text-xs text-center">
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  const renderTransaction = ({ item, index }) => (
    <Animated.View
      style={[
        { opacity: fadeAnim },
        { transform: [{ translateY: slideAnim }] }
      ]}
    >
      <TouchableOpacity 
        className="mb-3" 
        activeOpacity={0.9}
        onPress={() => router.push(`/transaction/${item.id}`)}
      >
        <BlurView intensity={20} tint="light" style={styles.modernTransaction}>
          <View className="flex-row items-center p-4">
            <View className="relative">
              <Image 
                source={{ uri: item.avatar }} 
                className="w-12 h-12 rounded-2xl" 
              />
              <View 
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white items-center justify-center"
                style={{ backgroundColor: item.color }}
              >
                <MaterialIcons 
                  name={item.type === 'credit' ? 'add' : 'remove'} 
                  size={10} 
                  color="white" 
                />
              </View>
            </View>
            
            <View className="flex-1 ml-4">
              <Text className="font-inter-semibold text-gray-900 text-base">
                {item.title}
              </Text>
              <Text className="font-inter text-gray-500 text-sm mt-0.5">
                {item.subtitle}
              </Text>
              <View className="flex-row items-center mt-2">
                <View 
                  className="px-2 py-1 rounded-lg mr-2"
                  style={{ backgroundColor: `${item.color}15` }}
                >
                  <Text 
                    className="font-inter-medium text-xs"
                    style={{ color: item.color }}
                  >
                    {item.category}
                  </Text>
                </View>
                <Text className="font-inter text-gray-400 text-xs">
                  {item.date}
                </Text>
              </View>
            </View>
            
            <View className="items-end">
              <Text 
                className="font-inter-bold text-lg"
                style={{ color: item.type === 'credit' ? '#10b981' : '#1f2937' }}
              >
                {item.type === 'credit' ? '+' : ''}${Math.abs(item.amount).toFixed(2)}
              </Text>
              <View className="flex-row items-center mt-1">
                <View 
                  className="w-2 h-2 rounded-full mr-2"
                  style={{ backgroundColor: item.status === 'completed' ? '#10b981' : '#f59e0b' }}
                />
                <MaterialIcons name="chevron-right" size={16} color="#9ca3af" />
              </View>
            </View>
          </View>
        </BlurView>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderSpendingInsight = ({ item }) => (
    <View className="mr-4" style={{ width: wp(40) }}>
      <BlurView intensity={20} tint="light" style={styles.insightCard}>
        <View className="p-4">
          <View className="flex-row items-center justify-between mb-3">
            <View 
              className="w-10 h-10 rounded-xl items-center justify-center"
              style={{ backgroundColor: `${item.color}15` }}
            >
              <MaterialIcons name={item.icon} size={20} color={item.color} />
            </View>
            <Text className="font-inter-bold text-lg" style={{ color: item.color }}>
              {item.percentage}%
            </Text>
          </View>
          <Text className="font-inter-semibold text-gray-900 text-sm">
            {item.category}
          </Text>
          <Text className="font-inter text-gray-500 text-xs mt-1">
            ${item.amount} this month
          </Text>
          <View className="mt-3 bg-gray-200 rounded-full h-1.5">
            <View 
              className="h-1.5 rounded-full"
              style={{ 
                width: `${item.percentage}%`, 
                backgroundColor: item.color 
              }}
            />
          </View>
        </View>
      </BlurView>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <LinearGradient
        colors={['#f8fafc', '#f1f5f9']}
        className="flex-1"
      >
        {/* Enhanced Background Particles */}
        {particleAnimations.map((particle, index) => (
          <Animated.View
            key={index}
            style={[
              styles.modernParticle,
              {
                transform: [
                  { translateX: particle.translateX },
                  { translateY: particle.translateY },
                  { scale: particle.scale },
                ],
                opacity: particle.opacity,
              },
            ]}
          />
        ))}

        <ScrollView 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          {/* Modern Glass Header */}
          <Animated.View 
            style={[
              { 
                opacity: fadeAnim, 
                transform: [{ scale: headerScale }, { translateY: slideAnim }] 
              }
            ]}
          >
            <BlurView intensity={30} tint="light" style={styles.modernHeader}>
              <View className="flex-row justify-between items-center px-6 py-4">
                <View className="flex-row items-center">
                  <View className="relative">
                    <Image 
                      source={{ uri: userData.avatar }} 
                      className="w-12 h-12 rounded-2xl" 
                    />
                    <View className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                  </View>
                  <View className="ml-4">
                    <Text className="font-inter text-gray-500 text-sm">Welcome back</Text>
                    <Text className="font-inter-bold text-gray-900 text-lg">
                      {userData.name}
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-center space-x-3">
                  <TouchableOpacity activeOpacity={0.7}>
                    <BlurView intensity={20} tint="light" style={styles.modernHeaderButton}>
                      <MaterialIcons name="notifications-none" size={22} color="#374151" />
                      {userData.notifications > 0 && (
                        <View className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full items-center justify-center">
                          <Text className="font-inter-bold text-white text-xs">
                            {userData.notifications}
                          </Text>
                        </View>
                      )}
                    </BlurView>
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={0.7}>
                    <BlurView intensity={20} tint="light" style={styles.modernHeaderButton}>
                      <MaterialIcons name="search" size={22} color="#374151" />
                    </BlurView>
                  </TouchableOpacity>
                </View>
              </View>
            </BlurView>
          </Animated.View>

          {/* Enhanced Balance Card */}
          <Animated.View
            className="mx-4 mt-6 mb-6"
            style={[
              { 
                opacity: fadeAnim, 
                transform: [{ scale: balancePulse }] 
              }
            ]}
          >
            <BlurView intensity={40} tint="light" style={styles.modernBalanceCard}>
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.balanceGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View className="p-6">
                  <View className="flex-row justify-between items-start mb-6">
                    <View>
                      <Text className="font-inter text-white text-base opacity-90">
                        Total Balance
                      </Text>
                      <View className="flex-row items-center mt-2">
                        <Text className="font-inter-bold text-white text-4xl">
                          {balanceVisible ? 
                            `$${userData.totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}` 
                            : '••••••••'
                          }
                        </Text>
                        <TouchableOpacity 
                          className="ml-3 p-2"
                          activeOpacity={0.8}
                          onPress={toggleBalanceVisibility}
                        >
                          <MaterialIcons 
                            name={balanceVisible ? "visibility" : "visibility-off"} 
                            size={20} 
                            color="rgba(255,255,255,0.8)" 
                          />
                        </TouchableOpacity>
                      </View>
                      <Text className="font-mono text-white text-sm opacity-80 mt-1">
                        Account {userData.accountNumber}
                      </Text>
                    </View>
                    <View className="items-end">
                      <View className="bg-opacity-20 px-3 py-2 rounded-xl">
                        <Text className="font-inter-semibold text-white text-xs">
                          Credit Score
                        </Text>
                        <Text className="font-inter-bold text-white text-lg">
                          {userData.creditScore}
                        </Text>
                      </View>
                    </View>
                  </View>
                  
                  <View className="flex-row justify-between">
                    <View className="flex-row items-center  bg-opacity-15 px-4 py-3 rounded-2xl flex-1 mr-2">
                      <MaterialIcons name="trending-up" size={16} color="#10b981" />
                      <View className="ml-2">
                        <Text className="font-inter text-white text-xs opacity-80">Income</Text>
                        <Text className="font-inter-semibold text-white">
                          +${userData.monthlyIncome.toLocaleString()}
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row items-center  bg-opacity-15 px-4 py-3 rounded-2xl flex-1 ml-2">
                      <MaterialIcons name="trending-down" size={16} color="#ef4444" />
                      <View className="ml-2">
                        <Text className="font-inter text-white text-xs opacity-80">Expenses</Text>
                        <Text className="font-inter-semibold text-white">
                          -${userData.monthlyExpenses.toLocaleString()}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={styles.balanceShine} />
              </LinearGradient>
            </BlurView>
          </Animated.View>

          {/* Modern Quick Actions */}
          <Animated.View
            className="mb-6"
            style={[{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
          >
            <Text className="font-inter-bold text-gray-900 text-xl px-6 mb-4">
              Quick Actions
            </Text>
            <View className="px-4">
              <FlatList
                data={quickActions}
                renderItem={renderQuickAction}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 8 }}
              />
            </View>
          </Animated.View>

          {/* Services Grid */}
          <Animated.View
            className="mb-6"
            style={[{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
          >
            <Text className="font-inter-bold text-gray-900 text-xl px-6 mb-4">
              Banking Services
            </Text>
            <FlatList
              data={services}
              renderItem={renderService}
              numColumns={3}
              scrollEnabled={false}
            />
          </Animated.View>

          {/* Spending Insights */}
          <Animated.View
            className="mb-6"
            style={[{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
          >
            <View className="flex-row justify-between items-center px-6 mb-4">
              <Text className="font-inter-bold text-gray-900 text-xl">
                Spending Insights
              </Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text className="font-inter-semibold text-blue-600 text-sm">
                  View Report
                </Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={spendingInsights}
              renderItem={renderSpendingInsight}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 24, paddingRight: 8 }}
            />
          </Animated.View>

          {/* Recent Transactions */}
          <Animated.View
            className="mb-8"
            style={[{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
          >
            <View className="flex-row justify-between items-center px-6 mb-4">
              <Text className="font-inter-bold text-gray-900 text-xl">
                Recent Transactions
              </Text>
              <TouchableOpacity 
                activeOpacity={0.7}
                onPress={() => router.push('/transactions')}
              >
                <Text className="font-inter-semibold text-blue-600 text-sm">
                  View All
                </Text>
              </TouchableOpacity>
            </View>
            <View className="px-4">
              <FlatList
                data={recentTransactions}
                renderItem={renderTransaction}
                scrollEnabled={false}
              />
            </View>
          </Animated.View>

          {/* Bottom Spacing */}
          <View style={{ height: hp(12) }} />
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  modernParticle: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(103, 126, 234, 0.05)',
  },
  modernHeader: {
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  modernHeaderButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  modernBalanceCard: {
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  balanceGradient: {
    borderRadius: 28,
    position: 'relative',
    overflow: 'hidden',
  },
  balanceShine: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 80,
    height: 80,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 40,
    transform: [{ rotate: '45deg' }],
  },
  modernQuickAction: {
    borderRadius: 20,
    overflow: 'hidden',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  quickActionGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modernTransaction: {
    borderRadius: 20,
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
});