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
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { wp } from "../../helpers/common";

const { width, height } = Dimensions.get('window');

const Transfer = () => {
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const shimmerPosition = useRef(new Animated.Value(-200)).current;
  
  // State management
  const [step, setStep] = useState(1); // 1: Select Method, 2: Enter Details, 3: Confirm
  const [transferType, setTransferType] = useState('');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [memo, setMemo] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(0);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 80,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Shimmer animation
    const shimmerAnimation = Animated.loop(
      Animated.timing(shimmerPosition, {
        toValue: 200,
        duration: 2000,
        useNativeDriver: true,
      })
    );
    shimmerAnimation.start();

    // Keyboard listeners
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setShowKeyboard(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setShowKeyboard(false)
    );

    return () => {
      shimmerAnimation.stop();
      keyboardDidHideListener?.remove();
      keyboardDidShowListener?.remove();
    };
  }, []);

  // User accounts data
  const userAccounts = [
    {
      id: 1,
      name: "Primary Checking",
      number: "****7892",
      balance: 15750.50,
      type: "checking",
      color: "#3b82f6"
    },
    {
      id: 2,
      name: "Savings Account",
      number: "****1234",
      balance: 42300.75,
      type: "savings",
      color: "#10b981"
    },
    {
      id: 3,
      name: "Business Account",
      number: "****5678",
      balance: 8920.25,
      type: "business",
      color: "#f59e0b"
    }
  ];

  // Transfer methods
  const transferMethods = [
    {
      id: 'quick',
      title: 'Quick Transfer',
      subtitle: 'Send to your contacts',
      icon: 'flash-on',
      color: '#3b82f6',
      gradient: ['#3b82f6', '#1d4ed8'],
      popular: true
    },
    {
      id: 'bank',
      title: 'Bank Transfer',
      subtitle: 'Using account number',
      icon: 'account-balance',
      color: '#10b981',
      gradient: ['#10b981', '#059669'],
      popular: false
    },
    {
      id: 'upi',
      title: 'UPI Transfer',
      subtitle: 'Using UPI ID',
      icon: 'qr-code',
      color: '#8b5cf6',
      gradient: ['#8b5cf6', '#7c3aed'],
      popular: true
    },
    {
      id: 'international',
      title: 'International',
      subtitle: 'Send money abroad',
      icon: 'public',
      color: '#f59e0b',
      gradient: ['#f59e0b', '#d97706'],
      popular: false
    }
  ];

  // Recent contacts
  const recentContacts = [
    {
      id: 1,
      name: "John Smith",
      avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150",
      account: "****9876",
      lastTransfer: "$250",
      bank: "Chase Bank"
    },
    {
      id: 2,
      name: "Emma Wilson",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150",
      account: "****5432",
      lastTransfer: "$75",
      bank: "Wells Fargo"
    },
    {
      id: 3,
      name: "Michael Brown",
      avatar: "https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=150",
      account: "****8765",
      lastTransfer: "$500",
      bank: "Bank of America"
    },
    {
      id: 4,
      name: "Sarah Davis",
      avatar: "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150",
      account: "****3210",
      lastTransfer: "$120",
      bank: "Citibank"
    }
  ];

  // Quick amounts
  const quickAmounts = [50, 100, 250, 500, 1000, 2500];

  const handleTransferMethodSelect = (methodId) => {
    setTransferType(methodId);
    setStep(2);
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  const handleTransfer = () => {
    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      router.push('/transfer-success');
    }, 3000);
  };

  const renderTransferMethod = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => handleTransferMethodSelect(item.id)}
    >
      <BlurView intensity={25} tint="light" style={styles.methodCard}>
        <View className="p-6">
          {item.popular && (
            <View className="absolute top-4 right-4">
              <View className="bg-orange-500 px-2 py-1 rounded-full">
                <Text className="font-inter-semibold text-white text-xs">Popular</Text>
              </View>
            </View>
          )}
          
          <LinearGradient
            colors={item.gradient}
            style={styles.methodIcon}
          >
            <MaterialIcons name={item.icon} size={28} color="white" />
          </LinearGradient>
          
          <Text className="font-inter-bold text-gray-900 text-lg mt-4">
            {item.title}
          </Text>
          <Text className="font-inter text-gray-500 text-sm mt-1">
            {item.subtitle}
          </Text>
          
          <View className="flex-row items-center justify-between mt-4">
            <View className="flex-row items-center">
              <MaterialIcons name="schedule" size={14} color="#6b7280" />
              <Text className="font-inter text-gray-500 text-xs ml-1">
                Instant
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={item.color} />
          </View>
        </View>
      </BlurView>
    </TouchableOpacity>
  );

  const renderContact = ({ item }) => (
    <TouchableOpacity
      className="mr-4"
      activeOpacity={0.8}
      onPress={() => setRecipient(item.name)}
    >
      <BlurView intensity={20} tint="light" style={styles.contactCard}>
        <View className="items-center p-4">
          <Image 
            source={{ uri: item.avatar }} 
            className="w-14 h-14 rounded-full mb-3" 
          />
          <Text className="font-inter-semibold text-gray-900 text-sm text-center">
            {item.name}
          </Text>
          <Text className="font-inter text-gray-500 text-xs mt-1 text-center">
            {item.bank}
          </Text>
          <View className="bg-blue-50 px-2 py-1 rounded-lg mt-2">
            <Text className="font-inter-medium text-blue-600 text-xs">
              {item.lastTransfer}
            </Text>
          </View>
        </View>
      </BlurView>
    </TouchableOpacity>
  );

  const renderQuickAmount = (amount) => (
    <TouchableOpacity
      key={amount}
      className="flex-1 mx-1"
      activeOpacity={0.8}
      onPress={() => setAmount(amount.toString())}
    >
      <BlurView intensity={20} tint="light" style={styles.quickAmountButton}>
        <Text className="font-inter-semibold text-gray-700 text-center">
          ${amount}
        </Text>
      </BlurView>
    </TouchableOpacity>
  );

  const renderAccount = ({ item, index }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => setSelectedAccount(index)}
    >
      <BlurView 
        intensity={selectedAccount === index ? 30 : 20} 
        tint="light" 
        style={[
          styles.accountCard,
          selectedAccount === index && styles.selectedAccount
        ]}
      >
        <View className="p-4 flex-row items-center">
          <View 
            className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
            style={{ backgroundColor: `${item.color}15` }}
          >
            <MaterialIcons 
              name={item.type === 'checking' ? 'account-balance-wallet' : 
                    item.type === 'savings' ? 'savings' : 'business'} 
              size={24} 
              color={item.color} 
            />
          </View>
          <View className="flex-1">
            <Text className="font-inter-semibold text-gray-900 text-base">
              {item.name}
            </Text>
            <Text className="font-inter text-gray-500 text-sm">
              {item.number}
            </Text>
          </View>
          <View className="items-end">
            <Text className="font-inter-bold text-gray-900 text-lg">
              ${item.balance.toLocaleString()}
            </Text>
            {selectedAccount === index && (
              <MaterialIcons name="check-circle" size={20} color={item.color} />
            )}
          </View>
        </View>
      </BlurView>
    </TouchableOpacity>
  );

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <Animated.View
            style={[
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
          >
            <Text className="font-inter-bold text-gray-900 text-2xl px-6 mb-2">
              How would you like to send money?
            </Text>
            <Text className="font-inter text-gray-500 text-base px-6 mb-8">
              Choose your preferred transfer method
            </Text>

            <FlatList
              data={transferMethods}
              renderItem={renderTransferMethod}
              numColumns={2}
              columnWrapperStyle={{ paddingHorizontal: 16, gap: 12 }}
              contentContainerStyle={{ gap: 12 }}
              scrollEnabled={false}
            />

            <View className="mt-8 px-6">
              <Text className="font-inter-bold text-gray-900 text-lg mb-4">
                Recent Contacts
              </Text>
              <FlatList
                data={recentContacts}
                renderItem={renderContact}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingLeft: 0 }}
              />
            </View>
          </Animated.View>
        );

      case 2:
        return (
          <Animated.View
            style={[
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
          >
            <Text className="font-inter-bold text-gray-900 text-2xl px-6 mb-2">
              Transfer Details
            </Text>
            <Text className="font-inter text-gray-500 text-base px-6 mb-6">
              Enter the transfer information
            </Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* From Account */}
              <View className="px-6 mb-6">
                <Text className="font-inter-semibold text-gray-900 text-base mb-4">
                  From Account
                </Text>
                <FlatList
                  data={userAccounts}
                  renderItem={renderAccount}
                  scrollEnabled={false}
                  contentContainerStyle={{ gap: 12 }}
                />
              </View>

              {/* Amount Section */}
              <View className="px-6 mb-6">
                <Text className="font-inter-semibold text-gray-900 text-base mb-4">
                  Amount
                </Text>
                <BlurView intensity={20} tint="light" style={styles.amountInput}>
                  <View className="p-6 items-center">
                    <Text className="font-inter text-gray-500 text-lg mb-2">USD</Text>
                    <TextInput
                      value={amount}
                      onChangeText={setAmount}
                      placeholder="0.00"
                      placeholderTextColor="#9ca3af"
                      keyboardType="numeric"
                      className="font-inter-bold text-gray-900 text-4xl text-center"
                      style={{ minWidth: 200 }}
                    />
                  </View>
                </BlurView>

                {/* Quick Amount Buttons */}
                <View className="mt-4">
                  <Text className="font-inter text-gray-600 text-sm mb-3">
                    Quick amounts
                  </Text>
                  <View className="flex-row flex-wrap gap-2">
                    {quickAmounts.map(renderQuickAmount)}
                  </View>
                </View>
              </View>

              {/* Recipient */}
              <View className="px-6 mb-6">
                <Text className="font-inter-semibold text-gray-900 text-base mb-4">
                  To
                </Text>
                <BlurView intensity={20} tint="light" style={styles.inputField}>
                  <TextInput
                    value={recipient}
                    onChangeText={setRecipient}
                    placeholder={
                      transferType === 'bank' ? 'Account number' :
                      transferType === 'upi' ? 'UPI ID' :
                      'Name or phone number'
                    }
                    placeholderTextColor="#9ca3af"
                    className="font-inter text-gray-900 text-base p-4"
                  />
                </BlurView>
              </View>

              {/* Memo */}
              <View className="px-6 mb-8">
                <Text className="font-inter-semibold text-gray-900 text-base mb-4">
                  Memo (Optional)
                </Text>
                <BlurView intensity={20} tint="light" style={styles.inputField}>
                  <TextInput
                    value={memo}
                    onChangeText={setMemo}
                    placeholder="What's this for?"
                    placeholderTextColor="#9ca3af"
                    className="font-inter text-gray-900 text-base p-4"
                    multiline
                    numberOfLines={3}
                  />
                </BlurView>
              </View>
            </ScrollView>
          </Animated.View>
        );

      case 3:
        return (
          <Animated.View
            style={[
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
          >
            <Text className="font-inter-bold text-gray-900 text-2xl px-6 mb-2">
              Confirm Transfer
            </Text>
            <Text className="font-inter text-gray-500 text-base px-6 mb-8">
              Please review the details before confirming
            </Text>

            <View className="px-6">
              {/* Transfer Summary */}
              <BlurView intensity={30} tint="light" style={styles.summaryCard}>
                <LinearGradient
                  colors={['#667eea', '#764ba2']}
                  style={styles.summaryGradient}
                >
                  <View className="p-6">
                    <View className="items-center mb-6">
                      <Text className="font-inter text-white text-lg opacity-90">
                        Transfer Amount
                      </Text>
                      <Text className="font-inter-bold text-white text-4xl mt-2">
                        ${amount}
                      </Text>
                    </View>
                    
                    <View className="bg-opacity-20 rounded-2xl p-4">
                      <View className="flex-row justify-between items-center mb-3">
                        <Text className="font-inter text-white opacity-80">From</Text>
                        <Text className="font-inter-semibold text-white">
                          {userAccounts[selectedAccount].name}
                        </Text>
                      </View>
                      <View className="flex-row justify-between items-center mb-3">
                        <Text className="font-inter text-white opacity-80">To</Text>
                        <Text className="font-inter-semibold text-white">
                          {recipient}
                        </Text>
                      </View>
                      <View className="flex-row justify-between items-center mb-3">
                        <Text className="font-inter text-white opacity-80">Fee</Text>
                        <Text className="font-inter-semibold text-white">
                          $0.00
                        </Text>
                      </View>
                      <View className="border-t border-white border-opacity-30 pt-3">
                        <View className="flex-row justify-between items-center">
                          <Text className="font-inter-semibold text-white">Total</Text>
                          <Text className="font-inter-bold text-white text-lg">
                            ${amount}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View style={styles.summaryShine} />
                </LinearGradient>
              </BlurView>

              {memo && (
                <BlurView intensity={20} tint="light" style={styles.memoCard}>
                  <View className="p-4">
                    <Text className="font-inter-semibold text-gray-900 text-sm mb-2">
                      Memo
                    </Text>
                    <Text className="font-inter text-gray-600">
                      {memo}
                    </Text>
                  </View>
                </BlurView>
              )}

              {/* Security Notice */}
              <BlurView intensity={15} tint="light" style={styles.securityNotice}>
                <View className="flex-row p-4">
                  <MaterialIcons name="security" size={20} color="#10b981" />
                  <View className="ml-3 flex-1">
                    <Text className="font-inter-semibold text-gray-900 text-sm">
                      Secure Transfer
                    </Text>
                    <Text className="font-inter text-gray-600 text-xs mt-1">
                      This transfer is protected by 256-bit SSL encryption
                    </Text>
                  </View>
                </View>
              </BlurView>
            </View>
          </Animated.View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 pb-20">
      <LinearGradient
        colors={['#f8fafc', '#f1f5f9']}
        className="flex-1"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="flex-1">
              {/* Header */}
              <Animated.View
                style={[
                  { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
                ]}
              >
                <BlurView intensity={30} tint="light" style={styles.header}>
                  <View className="flex-row items-center justify-between px-6 py-4">
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={handleBack}
                    >
                      <BlurView intensity={20} tint="light" style={styles.headerButton}>
                        <MaterialIcons name="arrow-back" size={22} color="#374151" />
                      </BlurView>
                    </TouchableOpacity>
                    
                    <View className="items-center">
                      <Text className="font-inter-bold text-gray-900 text-lg">
                        Transfer Money
                      </Text>
                      <View className="flex-row items-center mt-1">
                        {[1, 2, 3].map((stepNumber) => (
                          <View key={stepNumber} className="flex-row items-center">
                            <View
                              className={`w-2 h-2 rounded-full ${
                                step >= stepNumber ? 'bg-blue-600' : 'bg-gray-300'
                              }`}
                            />
                            {stepNumber < 3 && (
                              <View
                                className={`w-4 h-0.5 mx-1 ${
                                  step > stepNumber ? 'bg-blue-600' : 'bg-gray-300'
                                }`}
                              />
                            )}
                          </View>
                        ))}
                      </View>
                    </View>

                    <TouchableOpacity activeOpacity={0.7}>
                      <BlurView intensity={20} tint="light" style={styles.headerButton}>
                        <MaterialIcons name="help-outline" size={22} color="#374151" />
                      </BlurView>
                    </TouchableOpacity>
                  </View>
                </BlurView>
              </Animated.View>

              {/* Content */}
              <View className="flex-1 mt-4" style={{ paddingBottom: Platform.OS === 'ios' ? 100 : 85 }}>
                {renderStepContent()}
              </View>

              {/* Bottom Actions */}
              {!showKeyboard && step > 1 && (
                <View className="absolute bottom-0 left-0 right-0" style={{ paddingBottom: Platform.OS === 'ios' ? 100 : 85 }}>
                  <Animated.View
                    className="px-6 pb-6 bg-gray-50"
                    style={[
                      { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
                    ]}
                  >
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={step === 3 ? handleTransfer : handleNext}
                      disabled={isProcessing}
                    >
                      <BlurView intensity={40} tint="light" style={styles.primaryButton}>
                        <LinearGradient
                          colors={['#3b82f6', '#1d4ed8']}
                          style={styles.buttonGradient}
                        >
                          {isProcessing ? (
                            <View className="flex-row items-center">
                              <MaterialIcons name="hourglass-empty" size={20} color="white" />
                              <Text className="font-inter-semibold text-white text-lg ml-2">
                                Processing...
                              </Text>
                            </View>
                          ) : (
                            <Text className="font-inter-semibold text-white text-lg">
                              {step === 3 ? 'Confirm Transfer' : 'Continue'}
                            </Text>
                          )}
                          
                          {/* Shimmer effect */}
                          <Animated.View
                            style={[
                              styles.buttonShimmer,
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
                        </LinearGradient>
                      </BlurView>
                    </TouchableOpacity>
                  </Animated.View>
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Transfer;

const styles = StyleSheet.create({
  header: {
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
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
  methodCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    flex: 1,
    margin: 6,
  },
  methodIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    width: wp(30),
  },
  accountCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  selectedAccount: {
    borderColor: '#3b82f6',
    borderWidth: 2,
  },
  amountInput: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  inputField: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  quickAmountButton: {
    borderRadius: 12,
    overflow: 'hidden',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  summaryCard: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: 16,
  },
  summaryGradient: {
    borderRadius: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  summaryShine: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 80,
    height: 80,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 40,
    transform: [{ rotate: '45deg' }],
  },
  memoCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 16,
  },
  securityNotice: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
  },
  primaryButton: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  buttonShimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 100,
  },
  shimmer: {
    flex: 1,
    width: '100%',
  },
});