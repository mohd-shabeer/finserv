import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  FlatList,
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

const { width, height } = Dimensions.get('window');

const AddAddress = () => {
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const shimmerPosition = useRef(new Animated.Value(-200)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  
  // State management
  const [step, setStep] = useState(1); // 1: Address Type, 2: Address Details, 3: Verification
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    type: '',
    label: '',
    street: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    isPrimary: false,
    useForServices: []
  });

  // Form validation errors
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Enhanced entrance animations with stagger effect
    const animationSequence = Animated.stagger(150, [
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 80,
        friction: 8,
        useNativeDriver: true,
      }),
    ]);

    // Progress animation
    Animated.timing(progressAnim, {
      toValue: step / 3,
      duration: 300,
      useNativeDriver: false,
    }).start();

    // Continuous shimmer animation
    const shimmerAnimation = Animated.loop(
      Animated.timing(shimmerPosition, {
        toValue: 300,
        duration: 3000,
        useNativeDriver: true,
      })
    );

    animationSequence.start();
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
  }, [step]);

  // Address types with enhanced styling
  const addressTypes = [
    {
      id: 'home',
      title: 'Home',
      subtitle: 'Primary residence',
      icon: 'home',
      color: '#3b82f6',
      gradient: ['#3b82f6', '#1d4ed8'],
      popular: true
    },
    {
      id: 'billing',
      title: 'Billing',
      subtitle: 'For statements & bills',
      icon: 'receipt-long',
      color: '#10b981',
      gradient: ['#10b981', '#059669'],
      popular: true
    },
    {
      id: 'office',
      title: 'Office',
      subtitle: 'Work address',
      icon: 'business',
      color: '#f59e0b',
      gradient: ['#f59e0b', '#d97706'],
      popular: false
    },
    {
      id: 'secondary',
      title: 'Secondary',
      subtitle: 'Additional address',
      icon: 'location-on',
      color: '#8b5cf6',
      gradient: ['#8b5cf6', '#7c3aed'],
      popular: false
    },
    {
      id: 'temporary',
      title: 'Temporary',
      subtitle: 'Short-term address',
      icon: 'schedule',
      color: '#ef4444',
      gradient: ['#ef4444', '#dc2626'],
      popular: false
    },
    {
      id: 'vacation',
      title: 'Vacation',
      subtitle: 'Holiday home',
      icon: 'beach-access',
      color: '#06b6d4',
      gradient: ['#06b6d4', '#0891b2'],
      popular: false
    }
  ];

  // Banking services that can use this address
  const bankingServices = [
    { id: 'statements', title: 'Bank Statements', icon: 'description', color: '#3b82f6' },
    { id: 'cards', title: 'Credit/Debit Cards', icon: 'credit-card', color: '#10b981' },
    { id: 'loans', title: 'Loan Documents', icon: 'account-balance', color: '#f59e0b' },
    { id: 'tax', title: 'Tax Documents', icon: 'receipt', color: '#8b5cf6' },
    { id: 'legal', title: 'Legal Notices', icon: 'gavel', color: '#ef4444' },
    { id: 'marketing', title: 'Promotional Materials', icon: 'campaign', color: '#06b6d4' }
  ];

  // Mock address suggestions (in real app, this would come from a geocoding API)
  const mockAddressSuggestions = [
    {
      id: 1,
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001'
    },
    {
      id: 2,
      street: '124 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001'
    },
    {
      id: 3,
      street: '125 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001'
    }
  ];

  // US States data
  const usStates = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
    'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
    'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
    'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
    'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
    'Wisconsin', 'Wyoming'
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.type) newErrors.type = 'Address type is required';
    if (!formData.label.trim()) newErrors.label = 'Address label is required';
    if (!formData.street.trim()) newErrors.street = 'Street address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    if (formData.zipCode && !/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
      newErrors.zipCode = 'Please enter a valid ZIP code (12345 or 12345-6789)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Show address suggestions for street input
    if (field === 'street' && value.length > 2) {
      setSearchResults(mockAddressSuggestions);
      setShowSuggestions(true);
    } else if (field === 'street') {
      setShowSuggestions(false);
    }
  };

  const handleServiceToggle = (serviceId) => {
    setFormData(prev => ({
      ...prev,
      useForServices: prev.useForServices.includes(serviceId)
        ? prev.useForServices.filter(id => id !== serviceId)
        : [...prev.useForServices, serviceId]
    }));
  };

  const handleAddressTypeSelect = (typeId) => {
    const selectedType = addressTypes.find(type => type.id === typeId);
    setFormData(prev => ({ 
      ...prev, 
      type: typeId,
      label: selectedType?.title || ''
    }));
    setStep(2);
  };

  const handleNext = () => {
    if (step === 2 && validateForm()) {
      setStep(3);
    } else if (step === 1) {
      setStep(2);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Address Added Successfully! 🎉',
        `Your ${formData.label} address has been added to your account.\n\nA verification code will be mailed to this address within 5-7 business days.`,
        [
          {
            text: 'Add Another',
            onPress: () => {
              setStep(1);
              setFormData({
                type: '',
                label: '',
                street: '',
                apartment: '',
                city: '',
                state: '',
                zipCode: '',
                country: 'United States',
                isPrimary: false,
                useForServices: []
              });
              setErrors({});
            }
          },
          {
            text: 'Done',
            style: 'default',
            onPress: () => router.back()
          }
        ]
      );
    }, 2500);
  };

  const handleSuggestionSelect = (suggestion) => {
    setFormData(prev => ({
      ...prev,
      street: suggestion.street,
      city: suggestion.city,
      state: suggestion.state,
      zipCode: suggestion.zipCode
    }));
    setShowSuggestions(false);
  };

  const renderAddressType = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => handleAddressTypeSelect(item.id)}
      className="mb-4"
      style={{ width: (width - 48) / 2 }}
    >
      <BlurView intensity={25} tint="light" style={styles.typeCard}>
        <View className="p-5">
          {item.popular && (
            <View className="absolute top-3 right-3">
              <View className="bg-orange-500 px-2 py-1 rounded-full">
                <Text className="font-inter-bold text-white text-xs">Popular</Text>
              </View>
            </View>
          )}
          
          <LinearGradient
            colors={item.gradient}
            style={styles.typeIcon}
          >
            <MaterialIcons name={item.icon} size={24} color="white" />
          </LinearGradient>
          
          <Text className="font-inter-bold text-gray-900 text-base mt-4">
            {item.title}
          </Text>
          <Text className="font-inter text-gray-500 text-sm mt-1">
            {item.subtitle}
          </Text>
          
          <View className="flex-row items-center justify-between mt-3">
            <View className="flex-row items-center">
              <MaterialIcons name="location-on" size={14} color="#6b7280" />
              <Text className="font-inter text-gray-500 text-xs ml-1">
                Address type
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={18} color={item.color} />
          </View>
        </View>
      </BlurView>
    </TouchableOpacity>
  );

  const renderServiceOption = ({ item }) => {
    const isSelected = formData.useForServices.includes(item.id);
    
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => handleServiceToggle(item.id)}
        className="mb-3"
      >
        <BlurView 
          intensity={isSelected ? 30 : 20} 
          tint="light" 
          style={[
            styles.serviceCard,
            isSelected && styles.selectedServiceCard
          ]}
        >
          <View className="flex-row items-center p-4">
            <View 
              className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
              style={{ backgroundColor: isSelected ? item.color : `${item.color}15` }}
            >
              <MaterialIcons 
                name={item.icon} 
                size={20} 
                color={isSelected ? 'white' : item.color} 
              />
            </View>
            <Text 
              className={`font-inter-semibold text-base flex-1 ${
                isSelected ? 'text-gray-900' : 'text-gray-700'
              }`}
            >
              {item.title}
            </Text>
            <View 
              className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
              }`}
            >
              {isSelected && (
                <MaterialIcons name="check" size={14} color="white" />
              )}
            </View>
          </View>
        </BlurView>
      </TouchableOpacity>
    );
  };

  const renderSuggestion = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => handleSuggestionSelect(item)}
    >
      <BlurView intensity={20} tint="light" style={styles.suggestionCard}>
        <View className="flex-row items-center p-3">
          <MaterialIcons name="location-on" size={18} color="#6b7280" />
          <View className="ml-3 flex-1">
            <Text className="font-inter-semibold text-gray-900 text-sm">
              {item.street}
            </Text>
            <Text className="font-inter text-gray-500 text-xs">
              {item.city}, {item.state} {item.zipCode}
            </Text>
          </View>
          <MaterialIcons name="arrow-forward" size={16} color="#9ca3af" />
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
              What type of address is this?
            </Text>
            <Text className="font-inter text-gray-500 text-base px-6 mb-8">
              Choose the category that best describes this address
            </Text>

            <FlatList
              data={addressTypes}
              renderItem={renderAddressType}
              numColumns={2}
              columnWrapperStyle={{ paddingHorizontal: 16, gap: 16 }}
              contentContainerStyle={{ paddingHorizontal: 0 }}
              scrollEnabled={false}
            />
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
              Enter address details
            </Text>
            <Text className="font-inter text-gray-500 text-base px-6 mb-6">
              Fill in the complete address information
            </Text>

            <ScrollView 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 100 }}
            >
              <View className="px-6">
                {/* Address Label */}
                <View className="mb-6">
                  <Text className="font-inter-semibold text-gray-900 text-base mb-3">
                    Address Label *
                  </Text>
                  <BlurView intensity={20} tint="light" style={[styles.inputField, errors.label && styles.inputError]}>
                    <TextInput
                      value={formData.label}
                      onChangeText={(value) => handleInputChange('label', value)}
                      placeholder="e.g., My Home, Office Address"
                      placeholderTextColor="#9ca3af"
                      className="font-inter text-gray-900 text-base p-4"
                    />
                  </BlurView>
                  {errors.label && (
                    <Text className="font-inter text-red-500 text-sm mt-1">{errors.label}</Text>
                  )}
                </View>

                {/* Street Address */}
                <View className="mb-6">
                  <Text className="font-inter-semibold text-gray-900 text-base mb-3">
                    Street Address *
                  </Text>
                  <BlurView intensity={20} tint="light" style={[styles.inputField, errors.street && styles.inputError]}>
                    <TextInput
                      value={formData.street}
                      onChangeText={(value) => handleInputChange('street', value)}
                      placeholder="123 Main Street"
                      placeholderTextColor="#9ca3af"
                      className="font-inter text-gray-900 text-base p-4"
                    />
                  </BlurView>
                  {errors.street && (
                    <Text className="font-inter text-red-500 text-sm mt-1">{errors.street}</Text>
                  )}
                  
                  {/* Address Suggestions */}
                  {showSuggestions && searchResults.length > 0 && (
                    <View className="mt-2">
                      <FlatList
                        data={searchResults}
                        renderItem={renderSuggestion}
                        scrollEnabled={false}
                        contentContainerStyle={{ gap: 8 }}
                      />
                    </View>
                  )}
                </View>

                {/* Apartment/Suite */}
                <View className="mb-6">
                  <Text className="font-inter-semibold text-gray-900 text-base mb-3">
                    Apartment/Suite (Optional)
                  </Text>
                  <BlurView intensity={20} tint="light" style={styles.inputField}>
                    <TextInput
                      value={formData.apartment}
                      onChangeText={(value) => handleInputChange('apartment', value)}
                      placeholder="Apt 4B, Suite 200, etc."
                      placeholderTextColor="#9ca3af"
                      className="font-inter text-gray-900 text-base p-4"
                    />
                  </BlurView>
                </View>

                {/* City and State Row */}
                <View className="flex-row mb-6 space-x-4">
                  <View className="flex-1">
                    <Text className="font-inter-semibold text-gray-900 text-base mb-3">
                      City *
                    </Text>
                    <BlurView intensity={20} tint="light" style={[styles.inputField, errors.city && styles.inputError]}>
                      <TextInput
                        value={formData.city}
                        onChangeText={(value) => handleInputChange('city', value)}
                        placeholder="New York"
                        placeholderTextColor="#9ca3af"
                        className="font-inter text-gray-900 text-base p-4"
                      />
                    </BlurView>
                    {errors.city && (
                      <Text className="font-inter text-red-500 text-sm mt-1">{errors.city}</Text>
                    )}
                  </View>
                  
                  <View className="flex-1">
                    <Text className="font-inter-semibold text-gray-900 text-base mb-3">
                      State *
                    </Text>
                    <BlurView intensity={20} tint="light" style={[styles.inputField, errors.state && styles.inputError]}>
                      <TextInput
                        value={formData.state}
                        onChangeText={(value) => handleInputChange('state', value)}
                        placeholder="NY"
                        placeholderTextColor="#9ca3af"
                        className="font-inter text-gray-900 text-base p-4"
                        maxLength={2}
                        autoCapitalize="characters"
                      />
                    </BlurView>
                    {errors.state && (
                      <Text className="font-inter text-red-500 text-sm mt-1">{errors.state}</Text>
                    )}
                  </View>
                </View>

                {/* ZIP Code and Country Row */}
                <View className="flex-row mb-6 space-x-4">
                  <View className="flex-1">
                    <Text className="font-inter-semibold text-gray-900 text-base mb-3">
                      ZIP Code *
                    </Text>
                    <BlurView intensity={20} tint="light" style={[styles.inputField, errors.zipCode && styles.inputError]}>
                      <TextInput
                        value={formData.zipCode}
                        onChangeText={(value) => handleInputChange('zipCode', value)}
                        placeholder="10001"
                        placeholderTextColor="#9ca3af"
                        className="font-inter text-gray-900 text-base p-4"
                        keyboardType="numeric"
                        maxLength={10}
                      />
                    </BlurView>
                    {errors.zipCode && (
                      <Text className="font-inter text-red-500 text-sm mt-1">{errors.zipCode}</Text>
                    )}
                  </View>
                  
                  <View className="flex-1">
                    <Text className="font-inter-semibold text-gray-900 text-base mb-3">
                      Country
                    </Text>
                    <BlurView intensity={20} tint="light" style={styles.inputField}>
                      <TextInput
                        value={formData.country}
                        onChangeText={(value) => handleInputChange('country', value)}
                        placeholder="United States"
                        placeholderTextColor="#9ca3af"
                        className="font-inter text-gray-900 text-base p-4"
                        editable={false}
                      />
                    </BlurView>
                  </View>
                </View>

                {/* Primary Address Toggle */}
                <View className="mb-6">
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setFormData(prev => ({ ...prev, isPrimary: !prev.isPrimary }))}
                  >
                    <BlurView intensity={20} tint="light" style={styles.toggleCard}>
                      <View className="flex-row items-center p-4">
                        <View 
                          className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
                          style={{ backgroundColor: formData.isPrimary ? '#3b82f6' : '#3b82f615' }}
                        >
                          <MaterialIcons 
                            name="star" 
                            size={20} 
                            color={formData.isPrimary ? 'white' : '#3b82f6'} 
                          />
                        </View>
                        <View className="flex-1">
                          <Text className="font-inter-semibold text-gray-900 text-base">
                            Set as Primary Address
                          </Text>
                          <Text className="font-inter text-gray-500 text-sm">
                            Use this address for all official communications
                          </Text>
                        </View>
                        <View 
                          className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                            formData.isPrimary ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                          }`}
                        >
                          {formData.isPrimary && (
                            <MaterialIcons name="check" size={14} color="white" />
                          )}
                        </View>
                      </View>
                    </BlurView>
                  </TouchableOpacity>
                </View>
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
              Choose banking services
            </Text>
            <Text className="font-inter text-gray-500 text-base px-6 mb-6">
              Select which services should use this address
            </Text>

            <ScrollView 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 100 }}
            >
              {/* Address Summary */}
              <View className="mx-6 mb-8">
                <BlurView intensity={30} tint="light" style={styles.summaryCard}>
                  <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    style={styles.summaryGradient}
                  >
                    <View className="p-6">
                      <View className="flex-row items-center mb-4">
                        <View className="bg-opacity-20 p-3 rounded-2xl mr-4">
                          <MaterialIcons name="location-on" size={24} color="white" />
                        </View>
                        <View>
                          <Text className="font-inter-bold text-white text-lg">
                            {formData.label}
                          </Text>
                          <Text className="font-inter text-white opacity-90 text-sm capitalize">
                            {formData.type} Address
                          </Text>
                        </View>
                      </View>
                      
                      <View className="bg-opacity-20 rounded-2xl p-4">
                        <Text className="font-inter-semibold text-white text-base">
                          {formData.street}
                          {formData.apartment && `, ${formData.apartment}`}
                        </Text>
                        <Text className="font-inter text-white opacity-90 text-sm">
                          {formData.city}, {formData.state} {formData.zipCode}
                        </Text>
                        <Text className="font-inter text-white opacity-80 text-sm">
                          {formData.country}
                        </Text>
                      </View>
                    </View>
                  </LinearGradient>
                </BlurView>
              </View>

              {/* Banking Services */}
              <View className="px-6">
                <Text className="font-inter-bold text-gray-900 text-lg mb-4">
                  Banking Services
                </Text>
                <FlatList
                  data={bankingServices}
                  renderItem={renderServiceOption}
                  scrollEnabled={false}
                />
              </View>
            </ScrollView>
          </Animated.View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
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
              {/* Enhanced Header with Progress */}
              <Animated.View
                style={[
                  { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
                ]}
              >
                <BlurView intensity={35} tint="light" style={styles.header}>
                  <LinearGradient
                    colors={["rgba(255,255,255,0.95)", "rgba(248,250,252,0.9)"]}
                    style={styles.headerGradient}
                  >
                    <View className="px-6 py-4">
                      <View className="flex-row items-center justify-between mb-4">
                        <TouchableOpacity
                          activeOpacity={0.7}
                          onPress={handleBack}
                        >
                          <BlurView intensity={25} tint="light" style={styles.headerButton}>
                            <MaterialIcons name="arrow-back" size={22} color="#374151" />
                          </BlurView>
                        </TouchableOpacity>
                        
                        <View className="items-center">
                          <Text className="font-inter-bold text-gray-900 text-xl">
                            Add New Address
                          </Text>
                          <Text className="font-inter text-gray-600 text-sm">
                            Step {step} of 3
                          </Text>
                        </View>

                        <TouchableOpacity
                          activeOpacity={0.7}
                          onPress={() => router.push('/help-center')}
                        >
                          <BlurView intensity={25} tint="light" style={styles.headerButton}>
                            <MaterialIcons name="help-outline" size={22} color="#374151" />
                          </BlurView>
                        </TouchableOpacity>
                      </View>

                      {/* Enhanced Progress Bar */}
                      <View className="bg-gray-200 rounded-full h-2 overflow-hidden">
                        <Animated.View
                          className="h-full rounded-full"
                          style={{
                            width: progressAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: ['0%', '100%']
                            }),
                            backgroundColor: '#3b82f6'
                          }}
                        />
                      </View>
                      
                      {/* Step Indicators */}
                      <View className="flex-row justify-between mt-3">
                        {[1, 2, 3].map((stepNumber) => (
                          <View key={stepNumber} className="flex-row items-center">
                            <View
                              className={`w-3 h-3 rounded-full ${
                                step >= stepNumber ? 'bg-blue-600' : 'bg-gray-300'
                              }`}
                            />
                            <Text
                              className={`font-inter text-xs ml-2 ${
                                step >= stepNumber ? 'text-blue-600' : 'text-gray-400'
                              }`}
                            >
                              {stepNumber === 1 ? 'Type' : stepNumber === 2 ? 'Details' : 'Services'}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  </LinearGradient>
                </BlurView>
              </Animated.View>

              {/* Content */}
              <View className="flex-1 mt-4">
                {renderStepContent()}
              </View>

              {/* Bottom Actions */}
              {!showKeyboard && step > 1 && (
                <View className="absolute bottom-0 left-0 right-0" >
                  <Animated.View
                    className="px-6 pb-6 bg-gray-50"
                    style={[
                      { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
                    ]}
                  >
                    {step === 2 && (
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={handleNext}
                        className="mb-3"
                      >
                        <BlurView intensity={40} tint="light" style={styles.primaryButton}>
                          <LinearGradient
                            colors={['#3b82f6', '#1d4ed8']}
                            style={styles.buttonGradient}
                          >
                            <Text className="font-inter-semibold text-white text-lg">
                              Continue to Services
                            </Text>
                            <MaterialIcons name="arrow-forward" size={20} color="white" />
                            
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
                    )}

                    {step === 3 && (
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={handleSubmit}
                        disabled={isSubmitting}
                        className="mb-3"
                      >
                        <BlurView intensity={40} tint="light" style={styles.primaryButton}>
                          <LinearGradient
                            colors={['#10b981', '#059669']}
                            style={styles.buttonGradient}
                          >
                            {isSubmitting ? (
                              <View className="flex-row items-center">
                                <MaterialIcons name="hourglass-empty" size={20} color="white" />
                                <Text className="font-inter-semibold text-white text-lg ml-2">
                                  Adding Address...
                                </Text>
                              </View>
                            ) : (
                              <View className="flex-row items-center">
                                <MaterialIcons name="add-location" size={20} color="white" />
                                <Text className="font-inter-semibold text-white text-lg ml-2">
                                  Add Address
                                </Text>
                              </View>
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
                    )}

                    {/* Skip Services Button for Step 3 */}
                    {step === 3 && (
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                          setFormData(prev => ({ ...prev, useForServices: [] }));
                          handleSubmit();
                        }}
                      >
                        <BlurView intensity={20} tint="light" style={styles.secondaryButton}>
                          <Text className="font-inter-medium text-gray-600 text-center">
                            Skip Services Selection
                          </Text>
                        </BlurView>
                      </TouchableOpacity>
                    )}
                  </Animated.View>
                </View>
              )}

              {/* Security Notice */}
              {step === 3 && (
                <Animated.View
                  className="absolute bottom-32 left-4 right-4"
                  style={[
                    { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
                  ]}
                >
                  <BlurView intensity={20} tint="light" style={styles.securityNotice}>
                    <View className="flex-row p-4">
                      <MaterialIcons name="security" size={20} color="#10b981" />
                      <View className="ml-3 flex-1">
                        <Text className="font-inter-semibold text-gray-900 text-sm">
                          Address Verification
                        </Text>
                        <Text className="font-inter text-gray-600 text-xs mt-1">
                          A verification code will be mailed to this address for security
                        </Text>
                      </View>
                    </View>
                  </BlurView>
                </Animated.View>
              )}
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default AddAddress;

const styles = StyleSheet.create({
  // Enhanced Header Styles
  header: {
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  headerGradient: {
    borderRadius: 24,
  },
  headerButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },

  // Address Type Card Styles
  typeCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    height: 140,
  },
  typeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Input Field Styles
  inputField: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  inputError: {
    borderColor: '#ef4444',
    borderWidth: 2,
  },

  // Toggle Card Styles
  toggleCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },

  // Service Card Styles
  serviceCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  selectedServiceCard: {
    borderColor: '#3b82f6',
    borderWidth: 2,
  },

  // Summary Card Styles
  summaryCard: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  summaryGradient: {
    borderRadius: 24,
    position: 'relative',
    overflow: 'hidden',
  },

  // Suggestion Card Styles
  suggestionCard: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },

  // Button Styles
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
    flexDirection: 'row',
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
  secondaryButton: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 16,
  },

  // Security Notice Styles
  securityNotice: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
  },
});