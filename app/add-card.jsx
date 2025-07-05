import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    KeyboardAvoidingView,
    Modal,
    Platform,
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
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const AddCardPage = () => {
  const [cardType, setCardType] = useState('debit');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardNickname, setCardNickname] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [showBankModal, setShowBankModal] = useState(false);
  const [showCardPreview, setShowCardPreview] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [cardBrand, setCardBrand] = useState('');

  const animatedValue = useSharedValue(0);
  const modalScale = useSharedValue(0);
  const cardFlip = useSharedValue(0);

  useEffect(() => {
    animatedValue.value = withSpring(1);
  }, []);

  useEffect(() => {
    validateForm();
    detectCardBrand();
  }, [cardNumber, cardHolder, expiryMonth, expiryYear, cvv, selectedBank]);

  const banks = [
    { id: 'hdfc', name: 'HDFC Bank', logo: '🏦', color: '#dc2626' },
    { id: 'icici', name: 'ICICI Bank', logo: '🏛️', color: '#f59e0b' },
    { id: 'sbi', name: 'State Bank of India', logo: '🏢', color: '#059669' },
    { id: 'axis', name: 'Axis Bank', logo: '🏪', color: '#8b5cf6' },
    { id: 'kotak', name: 'Kotak Mahindra', logo: '🏬', color: '#ef4444' },
    { id: 'pnb', name: 'Punjab National Bank', logo: '🏭', color: '#3b82f6' },
    { id: 'bob', name: 'Bank of Baroda', logo: '🏘️', color: '#10b981' },
    { id: 'canara', name: 'Canara Bank', logo: '🏗️', color: '#7c3aed' }
  ];

  const cardTypes = [
    {
      id: 'debit',
      name: 'Debit Card',
      description: 'Link your bank debit card',
      icon: 'card-outline',
      color: '#3b82f6'
    },
    {
      id: 'credit',
      name: 'Credit Card',
      description: 'Add your credit card',
      icon: 'card',
      color: '#10b981'
    }
  ];

  const validateForm = () => {
    const isCardNumberValid = cardNumber.replace(/\s/g, '').length >= 16;
    const isCardHolderValid = cardHolder.trim().length >= 2;
    const isExpiryValid = expiryMonth.length === 2 && expiryYear.length === 2;
    const isCvvValid = cvv.length >= 3;
    const isBankSelected = selectedBank !== '';

    setIsFormValid(
      isCardNumberValid && 
      isCardHolderValid && 
      isExpiryValid && 
      isCvvValid && 
      isBankSelected
    );
  };

  const detectCardBrand = () => {
    const number = cardNumber.replace(/\s/g, '');
    if (number.startsWith('4')) {
      setCardBrand('Visa');
    } else if (number.startsWith('5') || number.startsWith('2')) {
      setCardBrand('Mastercard');
    } else if (number.startsWith('3')) {
      setCardBrand('American Express');
    } else if (number.startsWith('6')) {
      setCardBrand('Discover');
    } else {
      setCardBrand('');
    }
  };

  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\s/g, '');
    const formatted = cleaned.replace(/(.{4})/g, '$1 ').trim();
    if (formatted.length <= 19) {
      setCardNumber(formatted);
    }
  };

  const formatExpiry = (text, type) => {
    const cleaned = text.replace(/\D/g, '');
    if (type === 'month') {
      if (cleaned.length <= 2) {
        if (cleaned === '' || (parseInt(cleaned) >= 1 && parseInt(cleaned) <= 12)) {
          setExpiryMonth(cleaned);
        }
      }
    } else {
      if (cleaned.length <= 2) {
        setExpiryYear(cleaned);
      }
    }
  };

  const openBankModal = () => {
    setShowBankModal(true);
    modalScale.value = withSpring(1);
  };

  const closeBankModal = () => {
    modalScale.value = withTiming(0, { duration: 200 });
    setTimeout(() => {
      setShowBankModal(false);
    }, 200);
  };

  const selectBank = (bank) => {
    setSelectedBank(bank.id);
    closeBankModal();
  };

  const handleAddCard = () => {
    if (!isFormValid) {
      Alert.alert('Validation Error', 'Please fill in all required fields correctly.');
      return;
    }

    Alert.alert(
      'Card Added Successfully',
      `Your ${cardType} card has been added to your Finverse account.`,
      [
        {
          text: 'OK',
          onPress: () => {
            // Reset form or navigate back
            console.log('Card added successfully');
          }
        }
      ]
    );
  };

  const flipCard = () => {
    cardFlip.value = withSpring(cardFlip.value === 0 ? 1 : 0);
  };

  const modalAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: modalScale.value }],
      opacity: modalScale.value,
    };
  });

  const cardFrontStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(cardFlip.value, [0, 1], [0, 180]);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      backfaceVisibility: 'hidden',
    };
  });

  const cardBackStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(cardFlip.value, [0, 1], [180, 360]);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      backfaceVisibility: 'hidden',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    };
  });

  const getCardGradient = () => {
    switch (cardBrand.toLowerCase()) {
      case 'visa':
        return ['#1a1f71', '#0f3460'];
      case 'mastercard':
        return ['#eb001b', '#f79e1b'];
      case 'american express':
        return ['#006fcf', '#012169'];
      default:
        return ['#667eea', '#764ba2'];
    }
  };

  const selectedBankData = banks.find(bank => bank.id === selectedBank);

  const renderCardPreview = () => (
    <Animated.View
      entering={FadeInDown.delay(100).springify()}
      className="mb-6"
    >
      <Text className="text-lg font-bold text-gray-800 mb-4 px-4">
        Card Preview
      </Text>
      
      <TouchableOpacity onPress={flipCard} className="mx-4">
        <View className="h-48 perspective-1000">
          {/* Card Front */}
          <Animated.View style={[cardFrontStyle]} className="absolute inset-0">
            <LinearGradient
              colors={getCardGradient()}
              className="h-full rounded-2xl p-6 justify-between"
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {/* Card Header */}
              <View className="flex-row justify-between items-start">
                <Text className="text-white text-lg font-bold">
                  {selectedBankData?.logo || '🏦'} {selectedBankData?.name || 'Your Bank'}
                </Text>
                <Text className="text-white text-sm font-medium">
                  {cardBrand || 'CARD'}
                </Text>
              </View>

              {/* Card Number */}
              <View>
                <Text className="text-white text-xl font-mono tracking-wider">
                  {cardNumber || '•••• •••• •••• ••••'}
                </Text>
              </View>

              {/* Card Bottom */}
              <View className="flex-row justify-between items-end">
                <View>
                  <Text className="text-gray-300 text-xs">CARD HOLDER</Text>
                  <Text className="text-white text-sm font-medium">
                    {cardHolder.toUpperCase() || 'YOUR NAME'}
                  </Text>
                </View>
                <View>
                  <Text className="text-gray-300 text-xs">EXPIRES</Text>
                  <Text className="text-white text-sm font-medium">
                    {expiryMonth && expiryYear ? `${expiryMonth}/${expiryYear}` : 'MM/YY'}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Card Back */}
          <Animated.View style={[cardBackStyle]}>
            <LinearGradient
              colors={getCardGradient()}
              className="h-full rounded-2xl"
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {/* Magnetic Strip */}
              <View className="h-12 bg-black mt-6" />
              
              {/* CVV Section */}
              <View className="px-6 mt-6">
                <View className="bg-white h-8 rounded flex-row items-center justify-end px-3">
                  <Text className="text-gray-800 font-mono">
                    {cvv || '•••'}
                  </Text>
                </View>
                <Text className="text-gray-300 text-xs mt-2">CVV</Text>
              </View>

              {/* Card Info */}
              <View className="px-6 mt-8">
                <Text className="text-white text-xs leading-4">
                  This card is property of {selectedBankData?.name || 'Your Bank'}. 
                  If found, please return to any branch.
                </Text>
              </View>
            </LinearGradient>
          </Animated.View>
        </View>
      </TouchableOpacity>
      
      <Text className="text-center text-xs text-gray-500 mt-3">
        Tap card to flip and view back
      </Text>
    </Animated.View>
  );

  const renderCardType = (type, index) => (
    <Animated.View
      entering={FadeInRight.delay(index * 100).springify()}
      key={type.id}
      className="flex-1"
      style={{ marginRight: index === 0 ? 12 : 0 }}
    >
      <TouchableOpacity
        onPress={() => setCardType(type.id)}
        className={`p-4 rounded-2xl border ${
          cardType === type.id 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-200 bg-white'
        }`}
      >
        <View className="items-center">
          <View
            className="w-12 h-12 rounded-full items-center justify-center mb-3"
            style={{ backgroundColor: cardType === type.id ? type.color : `${type.color}20` }}
          >
            <Ionicons 
              name={type.icon} 
              size={24} 
              color={cardType === type.id ? 'white' : type.color} 
            />
          </View>
          <Text className={`text-sm font-bold text-center ${
            cardType === type.id ? 'text-blue-600' : 'text-gray-800'
          }`}>
            {type.name}
          </Text>
          <Text className="text-xs text-gray-600 text-center mt-1">
            {type.description}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderBankOption = (bank) => (
    <TouchableOpacity
      key={bank.id}
      onPress={() => selectBank(bank)}
      className={`flex-row items-center p-4 rounded-xl mb-3 ${
        selectedBank === bank.id ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
      }`}
    >
      <Text className="text-2xl mr-3">{bank.logo}</Text>
      <Text className="text-base font-medium text-gray-800 flex-1">
        {bank.name}
      </Text>
      {selectedBank === bank.id && (
        <Ionicons name="checkmark-circle" size={20} color="#3b82f6" />
      )}
    </TouchableOpacity>
  );

  const renderBankModal = () => (
    <Modal
      visible={showBankModal}
      transparent={true}
      animationType="fade"
      onRequestClose={closeBankModal}
    >
      <View className="flex-1 bg-black bg-opacity-50 justify-center items-center px-4">
        <Animated.View
          style={modalAnimatedStyle}
          className="bg-white rounded-3xl p-6 w-full max-w-md max-h-4/5"
        >
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-xl font-bold text-gray-800">
              Select Your Bank
            </Text>
            <TouchableOpacity onPress={closeBankModal}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {banks.map(renderBankOption)}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" backgroundColor="#10b981" />
      
      {/* Header */}
      <LinearGradient
        colors={['#10b981', '#059669']}
        className="pt-12 pb-6 px-4"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity className="mr-3" onPress={()=>router.back()}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-white">Add New Card</Text>
          </View>
          <View className="bg-opacity-20 rounded-full px-3 py-1">
            <Text className="text-white text-xs font-medium">
              Secure
            </Text>
          </View>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView 
        className="flex-1" 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Security Notice */}
          <Animated.View
            entering={FadeInDown.delay(200).springify()}
            className="mx-4 mt-6 mb-6"
          >
            <View className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
              <View className="flex-row items-center mb-2">
                <Ionicons name="shield-checkmark" size={20} color="#3b82f6" />
                <Text className="text-blue-800 font-bold ml-2">
                  Your data is secure
                </Text>
              </View>
              <Text className="text-blue-700 text-sm leading-5">
                We use bank-grade encryption to protect your card information. Your details are never stored on our servers.
              </Text>
            </View>
          </Animated.View>

          {/* Card Type Selection */}
          <View className="px-4 mb-6">
            <Text className="text-lg font-bold text-gray-800 mb-4">
              Select Card Type
            </Text>
            <View className="flex-row">
              {cardTypes.map(renderCardType)}
            </View>
          </View>

          {/* Card Preview */}
          {(cardNumber || cardHolder || expiryMonth || expiryYear) && renderCardPreview()}

          {/* Card Information Form */}
          <View className="px-4 mb-6">
            <Text className="text-lg font-bold text-gray-800 mb-4">
              Card Information
            </Text>
            
            <View className="bg-white rounded-2xl p-6 border border-gray-100">
              {/* Bank Selection */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Issuing Bank *
                </Text>
                <TouchableOpacity
                  onPress={openBankModal}
                  className="bg-gray-50 rounded-xl p-4"
                >
                  <View className="flex-row items-center justify-between">
                    <Text className={`text-base ${
                      selectedBankData ? 'text-gray-800' : 'text-gray-500'
                    }`}>
                      {selectedBankData ? 
                        `${selectedBankData.logo} ${selectedBankData.name}` : 
                        'Select your bank'
                      }
                    </Text>
                    <Ionicons name="chevron-down" size={16} color="#9ca3af" />
                  </View>
                </TouchableOpacity>
              </View>

              {/* Card Number */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Card Number *
                </Text>
                <TextInput
                  value={cardNumber}
                  onChangeText={formatCardNumber}
                  placeholder="1234 5678 9012 3456"
                  keyboardType="numeric"
                  className="bg-gray-50 rounded-xl p-4 text-base font-mono"
                />
                {cardBrand && (
                  <Text className="text-xs text-blue-600 mt-1">
                    {cardBrand} detected
                  </Text>
                )}
              </View>

              {/* Card Holder Name */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Card Holder Name *
                </Text>
                <TextInput
                  value={cardHolder}
                  onChangeText={setCardHolder}
                  placeholder="Enter name as on card"
                  autoCapitalize="characters"
                  className="bg-gray-50 rounded-xl p-4 text-base"
                />
              </View>

              {/* Expiry Date and CVV */}
              <View className="flex-row space-x-3 mb-4">
                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Expiry Month *
                  </Text>
                  <TextInput
                    value={expiryMonth}
                    onChangeText={(text) => formatExpiry(text, 'month')}
                    placeholder="MM"
                    keyboardType="numeric"
                    maxLength={2}
                    className="bg-gray-50 rounded-xl p-4 text-base text-center"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Expiry Year *
                  </Text>
                  <TextInput
                    value={expiryYear}
                    onChangeText={(text) => formatExpiry(text, 'year')}
                    placeholder="YY"
                    keyboardType="numeric"
                    maxLength={2}
                    className="bg-gray-50 rounded-xl p-4 text-base text-center"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    CVV *
                  </Text>
                  <TextInput
                    value={cvv}
                    onChangeText={setCvv}
                    placeholder="123"
                    keyboardType="numeric"
                    maxLength={4}
                    secureTextEntry
                    className="bg-gray-50 rounded-xl p-4 text-base text-center"
                  />
                </View>
              </View>

              {/* Card Nickname */}
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Card Nickname (Optional)
                </Text>
                <TextInput
                  value={cardNickname}
                  onChangeText={setCardNickname}
                  placeholder="e.g., My Primary Card"
                  className="bg-gray-50 rounded-xl p-4 text-base"
                />
                <Text className="text-xs text-gray-500 mt-1">
                  Give your card a memorable name for easy identification
                </Text>
              </View>
            </View>
          </View>

          {/* Terms and Conditions */}
          <View className="px-4 mb-6">
            <View className="bg-gray-100 rounded-2xl p-4">
              <Text className="text-sm text-gray-700 leading-5">
                By adding this card, you agree to our{' '}
                <Text className="text-blue-600 font-medium">Terms of Service</Text>
                {' '}and{' '}
                <Text className="text-blue-600 font-medium">Privacy Policy</Text>
                . Your card will be securely linked to your Finverse account.
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Add Card Button */}
        <View className="px-4 pb-6 bg-white border-t border-gray-200">
          <TouchableOpacity
            onPress={handleAddCard}
            className={`py-4 rounded-2xl ${
              isFormValid ? 'bg-green-600' : 'bg-gray-400'
            }`}
            disabled={!isFormValid}
          >
            <Text className="text-white text-center font-bold text-lg">
              {isFormValid ? 'Add Card Securely' : 'Complete Required Fields'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {renderBankModal()}
    </View>
  );
};

export default AddCardPage;