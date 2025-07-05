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
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from "../../helpers/common";

const { width, height } = Dimensions.get('window');

const Cards = () => {
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const shimmerPosition = useRef(new Animated.Value(-200)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  
  // State management
  const [selectedCard, setSelectedCard] = useState(0);
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [cardFlipped, setCardFlipped] = useState(false);

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

    // Continuous shimmer animation
    const shimmerAnimation = Animated.loop(
      Animated.timing(shimmerPosition, {
        toValue: 200,
        duration: 3000,
        useNativeDriver: true,
      })
    );
    shimmerAnimation.start();

    return () => {
      shimmerAnimation.stop();
    };
  }, []);

  // Enhanced cards data with real banking features
  const cards = [
    {
      id: 1,
      type: "Platinum Elite",
      number: "4532 1234 5678 9012",
      maskedNumber: "****9012",
      balance: 15780.50,
      availableCredit: 8220.00,
      totalLimit: 24000.00,
      gradient: ["#667eea", "#764ba2"],
      cardHolder: "SARAH JOHNSON",
      expiryDate: "12/27",
      cvv: "123",
      network: "Visa",
      status: "active",
      cardType: "credit",
      benefits: ["Airport Lounge Access", "Cashback 5%", "Zero Foreign Fee"],
      annualFee: 199,
      rewardsPoints: 15680,
      isDefault: true
    },
    {
      id: 2,
      type: "Gold Premier",
      number: "5555 4444 3333 2222",
      maskedNumber: "****2222",
      balance: 8950.25,
      availableCredit: 6049.75,
      totalLimit: 15000.00,
      gradient: ["#f093fb", "#f5576c"],
      cardHolder: "SARAH JOHNSON",
      expiryDate: "08/26",
      cvv: "456",
      network: "Mastercard",
      status: "active",
      cardType: "credit",
      benefits: ["Dining Cashback 3%", "Travel Insurance", "24/7 Concierge"],
      annualFee: 99,
      rewardsPoints: 8450,
      isDefault: false
    },
    {
      id: 3,
      type: "Debit Card",
      number: "4111 1111 1111 1111",
      maskedNumber: "****1111",
      balance: 42300.75,
      availableCredit: 42300.75,
      totalLimit: 50000.00,
      gradient: ["#4facfe", "#00f2fe"],
      cardHolder: "SARAH JOHNSON",
      expiryDate: "06/28",
      cvv: "789",
      network: "Visa",
      status: "active",
      cardType: "debit",
      benefits: ["No ATM Fees", "Free Wire Transfers", "Mobile Banking"],
      annualFee: 0,
      rewardsPoints: 2100,
      isDefault: false
    },
    {
      id: 4,
      type: "Business Elite",
      number: "3782 8224 6310 005",
      maskedNumber: "****0005",
      balance: 12500.00,
      availableCredit: 37500.00,
      totalLimit: 50000.00,
      gradient: ["#fa709a", "#fee140"],
      cardHolder: "SARAH JOHNSON",
      expiryDate: "03/26",
      cvv: "012",
      network: "Amex",
      status: "blocked",
      cardType: "credit",
      benefits: ["Business Rewards", "Expense Tracking", "High Limit"],
      annualFee: 295,
      rewardsPoints: 24100,
      isDefault: false
    }
  ];

  // Quick actions for cards
  const cardActions = [
    {
      id: 'pay',
      title: 'Pay Bills',
      subtitle: 'Utilities & more',
      icon: 'payment',
      color: '#3b82f6',
      gradient: ['#3b82f6', '#1d4ed8']
    },
    {
      id: 'freeze',
      title: 'Freeze Card',
      subtitle: 'Temporary block',
      icon: 'ac-unit',
      color: '#10b981',
      gradient: ['#10b981', '#059669']
    },
    {
      id: 'limit',
      title: 'Set Limits',
      subtitle: 'Spending controls',
      icon: 'tune',
      color: '#f59e0b',
      gradient: ['#f59e0b', '#d97706']
    },
    {
      id: 'pin',
      title: 'Change PIN',
      subtitle: 'Security update',
      icon: 'pin',
      color: '#8b5cf6',
      gradient: ['#8b5cf6', '#7c3aed']
    }
  ];

  // Recent transactions for selected card
  const recentTransactions = [
    {
      id: 1,
      merchant: "Starbucks Coffee",
      category: "Food & Beverage",
      amount: -12.50,
      date: "Today, 2:30 PM",
      location: "Downtown Branch",
      status: "completed",
      icon: "local-cafe",
      color: "#8b5cf6"
    },
    {
      id: 2,
      merchant: "Amazon",
      category: "Shopping",
      amount: -89.99,
      date: "Yesterday, 6:45 PM",
      location: "Online Purchase",
      status: "completed",
      icon: "shopping-bag",
      color: "#f59e0b"
    },
    {
      id: 3,
      merchant: "Shell Gas Station",
      category: "Transportation",
      amount: -45.20,
      date: "Dec 30, 3:15 PM",
      location: "Highway 101",
      status: "completed",
      icon: "local-gas-station",
      color: "#10b981"
    },
    {
      id: 4,
      merchant: "Netflix",
      category: "Entertainment",
      amount: -15.99,
      date: "Dec 29, 8:00 PM",
      location: "Subscription",
      status: "pending",
      icon: "play-circle-filled",
      color: "#ef4444"
    }
  ];

  const handleCardFlip = () => {
    Animated.timing(rotateAnim, {
      toValue: cardFlipped ? 0 : 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
    setCardFlipped(!cardFlipped);
  };

  const handleCardSelect = (index) => {
    setSelectedCard(index);
    setCardFlipped(false);
    rotateAnim.setValue(0);
  };

  const handleCardAction = (actionId) => {
    const card = cards[selectedCard];
    switch (actionId) {
      case 'pay':
        router.push('/bill-pay');
        break;
      case 'freeze':
        // Handle freeze/unfreeze logic
        alert(`${card.status === 'active' ? 'Freezing' : 'Unfreezing'} ${card.type}`);
        break;
      case 'limit':
        router.push('/card-limits');
        break;
      case 'pin':
        router.push('/change-pin');
        break;
      default:
        break;
    }
  };

  const renderCard = ({ item, index }) => {
    const isSelected = selectedCard === index;
    const frontAnimatedStyle = {
      transform: [
        {
          rotateY: rotateAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '180deg'],
          }),
        },
      ],
    };

    const backAnimatedStyle = {
      transform: [
        {
          rotateY: rotateAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['180deg', '360deg'],
          }),
        },
      ],
    };

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => handleCardSelect(index)}
        onLongPress={isSelected ? handleCardFlip : undefined}
      >
        <Animated.View
          style={[
            styles.cardContainer,
            { 
              transform: [{ scale: isSelected ? 1 : 0.95 }],
              opacity: isSelected ? 1 : 0.7 
            }
          ]}
        >
          {/* Card Front */}
          <Animated.View style={[styles.card, frontAnimatedStyle]}>
            <LinearGradient
              colors={item.gradient}
              style={styles.cardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {/* Card Status Indicator */}
              <View className="absolute top-4 right-4">
                <View 
                  className={`px-2 py-1 rounded-full ${
                    item.status === 'active' ? 'bg-green-500' : 
                    item.status === 'blocked' ? 'bg-red-500' : 'bg-yellow-500'
                  }`}
                >
                  <Text className="font-inter-semibold text-white text-xs capitalize">
                    {item.status}
                  </Text>
                </View>
              </View>

              {/* Default Card Badge */}
              {item.isDefault && (
                <View className="absolute top-4 left-4">
                  <View className="bg-opacity-20 px-2 py-1 rounded-full flex-row items-center">
                    <MaterialIcons name="star" size={12} color="white" />
                    <Text className="font-inter-semibold text-white text-xs ml-1">
                      Default
                    </Text>
                  </View>
                </View>
              )}

              {/* Card Type */}
              <View className="absolute top-16 left-6">
                <Text className="font-inter-semibold text-white text-lg opacity-90">
                  {item.type}
                </Text>
                <Text className="font-inter text-white text-sm opacity-75 capitalize">
                  {item.cardType} Card
                </Text>
              </View>

              {/* Chip and Network */}
              <View className="absolute top-20 right-6 flex-row items-center">
                <View className="w-10 h-8 bg-opacity-30 rounded mr-3" />
                <MaterialIcons name="contactless" size={24} color="rgba(255,255,255,0.8)" />
              </View>

              {/* Card Number */}
              <View className="absolute bottom-24 left-6">
                <Text className="font-mono text-white text-lg tracking-widest">
                  {showCardDetails ? item.number : item.maskedNumber}
                </Text>
              </View>

              {/* Card Holder and Expiry */}
              <View className="absolute bottom-6 left-6 right-6 flex-row justify-between items-end">
                <View>
                  <Text className="font-inter text-white opacity-70 text-xs">CARD HOLDER</Text>
                  <Text className="font-inter-semibold text-white text-sm">
                    {item.cardHolder}
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="font-inter text-white opacity-70 text-xs">EXPIRES</Text>
                  <Text className="font-inter-semibold text-white text-sm">
                    {item.expiryDate}
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="font-inter-bold text-white text-lg opacity-90">
                    {item.network}
                  </Text>
                </View>
              </View>

              {/* Shimmer Effect */}
              <Animated.View
                style={[
                  styles.cardShimmer,
                  { transform: [{ translateX: shimmerPosition }] }
                ]}
              >
                <LinearGradient
                  colors={['transparent', 'rgba(255,255,255,0.2)', 'transparent']}
                  style={styles.shimmer}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
              </Animated.View>
            </LinearGradient>
          </Animated.View>

          {/* Card Back */}
          <Animated.View style={[styles.cardBack, backAnimatedStyle]}>
            <LinearGradient
              colors={item.gradient}
              style={styles.cardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {/* Magnetic Stripe */}
              <View className="absolute top-8 left-0 right-0 h-12 bg-black" />
              
              {/* CVV Section */}
              <View className="absolute bottom-20 right-6">
                <Text className="font-inter text-white opacity-70 text-xs mb-1">CVV</Text>
                <View className="bg-white px-3 py-1 rounded">
                  <Text className="font-mono text-black text-sm">
                    {showCardDetails ? item.cvv : '***'}
                  </Text>
                </View>
              </View>

              {/* Card Info */}
              <View className="absolute bottom-6 left-6">
                <Text className="font-inter text-white opacity-70 text-xs">
                  Customer Service: 1-800-FINVERSE
                </Text>
                <Text className="font-inter text-white opacity-70 text-xs mt-1">
                  www.finverse.com
                </Text>
              </View>
            </LinearGradient>
          </Animated.View>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const renderCardAction = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => handleCardAction(item.id)}
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

  const renderTransaction = ({ item }) => (
    <BlurView intensity={20} tint="light" style={styles.transactionCard}>
      <View className="flex-row items-center p-4">
        <View 
          className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
          style={{ backgroundColor: `${item.color}15` }}
        >
          <MaterialIcons name={item.icon} size={24} color={item.color} />
        </View>
        
        <View className="flex-1">
          <Text className="font-inter-semibold text-gray-900 text-base">
            {item.merchant}
          </Text>
          <Text className="font-inter text-gray-500 text-sm">
            {item.location}
          </Text>
          <View className="flex-row items-center mt-1">
            <View 
              className="px-2 py-0.5 rounded-lg mr-2"
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
          <Text className="font-inter-bold text-gray-900 text-lg">
            ${Math.abs(item.amount).toFixed(2)}
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

  const selectedCardData = cards[selectedCard];

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
                  My Cards
                </Text>
                <Text className="font-inter text-gray-500 text-base">
                  Manage your payment cards
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setShowCardDetails(!showCardDetails)}
              >
                <BlurView intensity={20} tint="light" style={styles.headerButton}>
                  <MaterialIcons 
                    name={showCardDetails ? "visibility-off" : "visibility"} 
                    size={22} 
                    color="#374151" 
                  />
                </BlurView>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Cards Carousel */}
          <Animated.View
            style={[
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
          >
            <FlatList
              data={cards}
              renderItem={renderCard}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={wp(85)}
              decelerationRate="fast"
              contentContainerStyle={{ 
                paddingLeft: wp(7.5), 
                paddingRight: wp(7.5),
                paddingVertical: 10
              }}
              onMomentumScrollEnd={(event) => {
                const index = Math.round(event.nativeEvent.contentOffset.x / wp(85));
                setSelectedCard(index);
              }}
            />
            
            {/* Flip Instruction */}
            <Text className="font-inter text-gray-400 text-sm text-center mt-4">
              Long press card to view back side
            </Text>
          </Animated.View>

          {/* Card Summary */}
          <Animated.View
            className="mx-4 mt-6"
            style={[
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
          >
            <BlurView intensity={30} tint="light" style={styles.summaryCard}>
              <View className="p-6">
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="font-inter-bold text-gray-900 text-lg">
                    Card Overview
                  </Text>
                  <View className="flex-row items-center">
                    <MaterialIcons name="account-balance-wallet" size={20} color="#3b82f6" />
                    <Text className="font-inter-semibold text-blue-600 text-sm ml-1">
                      {selectedCardData.type}
                    </Text>
                  </View>
                </View>
                
                <View className="flex-row justify-between">
                  <View className="flex-1">
                    <Text className="font-inter text-gray-500 text-sm">
                      {selectedCardData.cardType === 'credit' ? 'Available Credit' : 'Available Balance'}
                    </Text>
                    <Text className="font-inter-bold text-gray-900 text-2xl">
                      ${selectedCardData.availableCredit.toLocaleString()}
                    </Text>
                    <Text className="font-inter text-gray-400 text-xs mt-1">
                      of ${selectedCardData.totalLimit.toLocaleString()} limit
                    </Text>
                  </View>
                  
                  <View className="flex-1 items-end">
                    <Text className="font-inter text-gray-500 text-sm">Rewards Points</Text>
                    <Text className="font-inter-bold text-orange-600 text-xl">
                      {selectedCardData.rewardsPoints.toLocaleString()}
                    </Text>
                    <Text className="font-inter text-gray-400 text-xs mt-1">
                      ≈ ${(selectedCardData.rewardsPoints * 0.01).toFixed(0)} value
                    </Text>
                  </View>
                </View>

                {/* Usage Bar */}
                <View className="mt-4">
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="font-inter text-gray-600 text-sm">Usage</Text>
                    <Text className="font-inter-semibold text-gray-900 text-sm">
                      {((selectedCardData.totalLimit - selectedCardData.availableCredit) / selectedCardData.totalLimit * 100).toFixed(1)}%
                    </Text>
                  </View>
                  <View className="bg-gray-200 rounded-full h-2">
                    <View 
                      className="bg-blue-600 rounded-full h-2"
                      style={{ 
                        width: `${(selectedCardData.totalLimit - selectedCardData.availableCredit) / selectedCardData.totalLimit * 100}%` 
                      }}
                    />
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
              data={cardActions}
              renderItem={renderCardAction}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
            />
          </Animated.View>

          {/* Benefits */}
          <Animated.View
            className="mx-4 mt-8"
            style={[
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
          >
            <Text className="font-inter-bold text-gray-900 text-lg mb-4">
              Card Benefits
            </Text>
            <BlurView intensity={20} tint="light" style={styles.benefitsCard}>
              <View className="p-4">
                {selectedCardData.benefits.map((benefit, index) => (
                  <View key={index} className="flex-row items-center py-2">
                    <MaterialIcons name="check-circle" size={20} color="#10b981" />
                    <Text className="font-inter text-gray-700 text-sm ml-3">
                      {benefit}
                    </Text>
                  </View>
                ))}
                <View className="border-t border-gray-200 pt-3 mt-3">
                  <View className="flex-row justify-between items-center">
                    <Text className="font-inter text-gray-500 text-sm">Annual Fee</Text>
                    <Text className="font-inter-semibold text-gray-900">
                      {selectedCardData.annualFee === 0 ? 'Free' : `$${selectedCardData.annualFee}`}
                    </Text>
                  </View>
                </View>
              </View>
            </BlurView>
          </Animated.View>

          {/* Recent Transactions */}
          <Animated.View
            className="mt-8"
            style={[
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
          >
            <View className="flex-row justify-between items-center px-6 mb-4">
              <Text className="font-inter-bold text-gray-900 text-lg">
                Recent Transactions
              </Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text className="font-inter-semibold text-blue-600 text-sm">
                  View All
                </Text>
              </TouchableOpacity>
            </View>
            <View className="px-4 space-y-3">
              {recentTransactions.map((transaction) => (
                <View key={transaction.id} className="mb-3">
                  {renderTransaction({ item: transaction })}
                </View>
              ))}
            </View>
          </Animated.View>

          {/* Add New Card */}
          <Animated.View
            className="mx-4 mt-8"
            style={[
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push('/add-card')}
            >
              <BlurView intensity={25} tint="light" style={styles.addCardButton}>
                <View className="flex-row items-center justify-center p-6">
                  <MaterialIcons name="add-circle-outline" size={24} color="#3b82f6" />
                  <Text className="font-inter-semibold text-blue-600 text-lg ml-3">
                    Add New Card
                  </Text>
                </View>
              </BlurView>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Cards;

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
  cardContainer: {
    width: wp(80),
    height: hp(25),
    marginHorizontal: wp(2.5),
    position: 'relative',
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
  },
  cardBack: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
  },
  cardGradient: {
    flex: 1,
    borderRadius: 20,
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  cardShimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 100,
  },
  shimmer: {
    flex: 1,
    width: '100%',
  },
  summaryCard: {
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
  transactionCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  benefitsCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  addCardButton: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
  },
});