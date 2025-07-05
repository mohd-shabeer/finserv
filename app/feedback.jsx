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
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const FeedbackPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [selectedRating, setSelectedRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState('');
  const [improvementSuggestion, setImprovementSuggestion] = useState('');
  const [selectedBugType, setSelectedBugType] = useState('');
  const [bugDescription, setBugDescription] = useState('');
  const [stepsToReproduce, setStepsToReproduce] = useState('');

  const animatedValue = useSharedValue(0);
  const modalScale = useSharedValue(0);

  useEffect(() => {
    animatedValue.value = withSpring(1);
  }, []);

  const feedbackCategories = [
    {
      id: 'app_performance',
      name: 'App Performance',
      icon: 'speedometer-outline',
      color: '#3b82f6',
      description: 'Speed, loading times, responsiveness'
    },
    {
      id: 'user_interface',
      name: 'User Interface',
      icon: 'phone-portrait-outline',
      color: '#10b981',
      description: 'Design, layout, ease of use'
    },
    {
      id: 'features',
      name: 'Features',
      icon: 'star-outline',
      color: '#f59e0b',
      description: 'New features, existing functionality'
    },
    {
      id: 'security',
      name: 'Security',
      icon: 'shield-checkmark-outline',
      color: '#ef4444',
      description: 'Login, authentication, privacy'
    },
    {
      id: 'customer_service',
      name: 'Customer Service',
      icon: 'people-outline',
      color: '#8b5cf6',
      description: 'Support quality, response time'
    },
    {
      id: 'banking_services',
      name: 'Banking Services',
      icon: 'card-outline',
      color: '#06b6d4',
      description: 'Transactions, accounts, loans'
    }
  ];

  const appFeatures = [
    { id: 'dashboard', name: 'Dashboard', icon: 'grid-outline' },
    { id: 'transfers', name: 'Money Transfer', icon: 'swap-horizontal-outline' },
    { id: 'payments', name: 'Bill Payments', icon: 'receipt-outline' },
    { id: 'cards', name: 'Card Management', icon: 'card-outline' },
    { id: 'investments', name: 'Investments', icon: 'trending-up-outline' },
    { id: 'loans', name: 'Loans', icon: 'cash-outline' },
    { id: 'security', name: 'Security Settings', icon: 'shield-outline' },
    { id: 'support', name: 'Customer Support', icon: 'help-circle-outline' }
  ];

  const bugTypes = [
    { id: 'crash', name: 'App Crashes', icon: 'warning-outline', color: '#ef4444' },
    { id: 'login', name: 'Login Issues', icon: 'log-in-outline', color: '#f59e0b' },
    { id: 'transaction', name: 'Transaction Errors', icon: 'card-outline', color: '#8b5cf6' },
    { id: 'display', name: 'Display Problems', icon: 'eye-outline', color: '#06b6d4' },
    { id: 'performance', name: 'Slow Performance', icon: 'speedometer-outline', color: '#10b981' },
    { id: 'notification', name: 'Notification Issues', icon: 'notifications-outline', color: '#3b82f6' }
  ];

  const handleSubmitFeedback = () => {
    if (activeTab === 'general') {
      if (selectedRating === 0 || !feedbackText.trim()) {
        Alert.alert('Incomplete Form', 'Please provide a rating and feedback text.');
        return;
      }
    } else if (activeTab === 'feature') {
      if (!selectedFeature || !improvementSuggestion.trim()) {
        Alert.alert('Incomplete Form', 'Please select a feature and provide your suggestion.');
        return;
      }
    } else if (activeTab === 'bug') {
      if (!selectedBugType || !bugDescription.trim()) {
        Alert.alert('Incomplete Form', 'Please select a bug type and provide description.');
        return;
      }
    }

    // Show thank you modal
    setShowThankYouModal(true);
    modalScale.value = withSpring(1);

    // Reset form
    setTimeout(() => {
      resetForm();
    }, 2000);
  };

  const resetForm = () => {
    setSelectedRating(0);
    setFeedbackText('');
    setSelectedCategory('');
    setContactInfo('');
    setSelectedFeature('');
    setImprovementSuggestion('');
    setSelectedBugType('');
    setBugDescription('');
    setStepsToReproduce('');
  };

  const closeThankYouModal = () => {
    modalScale.value = withTiming(0, { duration: 200 });
    setTimeout(() => {
      setShowThankYouModal(false);
    }, 200);
  };

  const modalAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: modalScale.value }],
      opacity: modalScale.value,
    };
  });

  const renderStarRating = () => (
    <View className="mb-6">
      <Text className="text-base font-bold text-gray-800 mb-3">
        How would you rate your overall experience?
      </Text>
      <View className="flex-row justify-center items-center space-x-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setSelectedRating(star)}
            className="p-2"
          >
            <Ionicons
              name={star <= selectedRating ? 'star' : 'star-outline'}
              size={36}
              color={star <= selectedRating ? '#f59e0b' : '#d1d5db'}
            />
          </TouchableOpacity>
        ))}
      </View>
      <View className="flex-row justify-between mt-2 px-4">
        <Text className="text-xs text-gray-500">Poor</Text>
        <Text className="text-xs text-gray-500">Excellent</Text>
      </View>
    </View>
  );

  const renderCategory = (category, index) => (
    <TouchableOpacity
      key={category.id}
      onPress={() => setSelectedCategory(category.id)}
      className={`p-4 rounded-2xl mb-3 border ${
        selectedCategory === category.id 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-200 bg-white'
      }`}
    >
      <View className="flex-row items-center">
        <View
          className="w-12 h-12 rounded-full items-center justify-center mr-3"
          style={{ backgroundColor: `${category.color}15` }}
        >
          <Ionicons name={category.icon} size={24} color={category.color} />
        </View>
        <View className="flex-1">
          <Text className="text-base font-bold text-gray-800">
            {category.name}
          </Text>
          <Text className="text-sm text-gray-600">
            {category.description}
          </Text>
        </View>
        {selectedCategory === category.id && (
          <Ionicons name="checkmark-circle" size={24} color="#3b82f6" />
        )}
      </View>
    </TouchableOpacity>
  );

  const renderFeature = (feature, index) => (
    <TouchableOpacity
      key={feature.id}
      onPress={() => setSelectedFeature(feature.id)}
      className={`p-4 rounded-2xl border items-center ${
        selectedFeature === feature.id 
          ? 'border-purple-500 bg-purple-50' 
          : 'border-gray-200 bg-white'
      }`}
      style={{ 
        width: (width - 48) / 2 - 6,
        marginRight: (index + 1) % 2 === 0 ? 0 : 12,
        marginBottom: 12
      }}
    >
      <View
        className="w-12 h-12 rounded-2xl items-center justify-center mb-3"
        style={{ backgroundColor: selectedFeature === feature.id ? '#8b5cf6' : '#f3f4f6' }}
      >
        <Ionicons 
          name={feature.icon} 
          size={22} 
          color={selectedFeature === feature.id ? 'white' : '#6b7280'} 
        />
      </View>
      <Text className={`text-xs font-medium text-center leading-4 ${
        selectedFeature === feature.id ? 'text-purple-600' : 'text-gray-700'
      }`}>
        {feature.name}
      </Text>
      {selectedFeature === feature.id && (
        <View className="absolute top-2 right-2">
          <Ionicons name="checkmark-circle" size={20} color="#8b5cf6" />
        </View>
      )}
    </TouchableOpacity>
  );

  const renderBugType = (bugType, index) => (
    <TouchableOpacity
      key={bugType.id}
      onPress={() => setSelectedBugType(bugType.id)}
      className={`p-4 rounded-2xl mb-3 border ${
        selectedBugType === bugType.id 
          ? 'border-red-500 bg-red-50' 
          : 'border-gray-200 bg-white'
      }`}
    >
      <View className="flex-row items-center">
        <View
          className="w-12 h-12 rounded-full items-center justify-center mr-3"
          style={{ backgroundColor: `${bugType.color}15` }}
        >
          <Ionicons name={bugType.icon} size={24} color={bugType.color} />
        </View>
        <Text className="text-base font-bold text-gray-800 flex-1">
          {bugType.name}
        </Text>
        {selectedBugType === bugType.id && (
          <Ionicons name="checkmark-circle" size={24} color="#ef4444" />
        )}
      </View>
    </TouchableOpacity>
  );

  const renderThankYouModal = () => (
    <Modal
      visible={showThankYouModal}
      transparent={true}
      animationType="fade"
      onRequestClose={closeThankYouModal}
    >
      <View className="flex-1 bg-black bg-opacity-50 justify-center items-center px-4">
        <Animated.View
          style={modalAnimatedStyle}
          className="bg-white rounded-3xl p-8 w-full max-w-sm items-center"
        >
          <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center mb-6">
            <Ionicons name="checkmark-circle" size={40} color="#10b981" />
          </View>
          
          <Text className="text-2xl font-bold text-gray-800 text-center mb-4">
            Thank You!
          </Text>
          
          <Text className="text-base text-gray-600 text-center mb-6 leading-6">
            Your feedback has been submitted successfully. We value your input and will use it to improve your banking experience.
          </Text>
          
          <TouchableOpacity
            onPress={closeThankYouModal}
            className="bg-green-600 py-4 px-8 rounded-2xl"
          >
            <Text className="text-white font-semibold">
              Continue
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );

  const tabs = [
    { id: 'general', name: 'General', icon: 'chatbubble-outline' },
    { id: 'feature', name: 'Features', icon: 'bulb-outline' },
    { id: 'bug', name: 'Report Bug', icon: 'bug-outline' }
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" backgroundColor="#8b5cf6" />
      
      {/* Header */}
      <LinearGradient
        colors={['#8b5cf6', '#7c3aed']}
        className="pt-12 pb-6 px-4"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity className="mr-3" onPress={()=>router.back()}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-white">Feedback</Text>
          </View>
          <View className="bg-opacity-20 rounded-full px-3 py-1">
            <Text className="text-white text-xs font-medium">
              Your Voice Matters
            </Text>
          </View>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView 
        className="flex-1" 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Welcome Message */}
          <Animated.View
            entering={FadeInRight.delay(200).springify()}
            className="mx-4 mt-6 mb-6"
          >
            <View className="bg-white rounded-2xl p-4 border border-gray-100">
              <View className="flex-row items-center mb-3">
                <View className="w-12 h-12 bg-purple-100 rounded-2xl items-center justify-center mr-3">
                  <Ionicons name="heart" size={24} color="#8b5cf6" />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-bold text-gray-800">
                    We Value Your Opinion
                  </Text>
                  <Text className="text-sm text-gray-600">
                    Help us improve your banking experience
                  </Text>
                </View>
              </View>
              <Text className="text-xs text-gray-500 leading-4">
                Your feedback helps us build better banking solutions. Share your thoughts, report bugs, or suggest new features.
              </Text>
            </View>
          </Animated.View>

          {/* Tabs */}
          <View className="px-4 mb-6">
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 16 }}
            >
              {tabs.map((tab, index) => (
                <TouchableOpacity
                  key={tab.id}
                  onPress={() => setActiveTab(tab.id)}
                  className={`mr-4 px-6 py-3 rounded-2xl border ${
                    activeTab === tab.id 
                      ? 'border-purple-600 bg-purple-600' 
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
            {activeTab === 'general' && (
              <Animated.View entering={FadeInDown.springify()}>
                {/* Star Rating */}
                <View className="bg-white rounded-2xl p-6 mb-6 border border-gray-100">
                  {renderStarRating()}
                </View>

                {/* Category Selection */}
                <View className="bg-white rounded-2xl p-6 mb-6 border border-gray-100">
                  <Text className="text-base font-bold text-gray-800 mb-4">
                    What is your feedback about?
                  </Text>
                  {feedbackCategories.map(renderCategory)}
                </View>

                {/* Feedback Text */}
                <View className="bg-white rounded-2xl p-6 mb-6 border border-gray-100">
                  <Text className="text-base font-bold text-gray-800 mb-3">
                    Tell us more about your experience
                  </Text>
                  <TextInput
                    value={feedbackText}
                    onChangeText={setFeedbackText}
                    placeholder="Share your thoughts, suggestions, or concerns..."
                    multiline
                    numberOfLines={6}
                    className="bg-gray-50 rounded-xl p-4 text-base"
                    style={{ textAlignVertical: 'top' }}
                  />
                </View>

                {/* Contact Info */}
                <View className="bg-white rounded-2xl p-6 mb-6 border border-gray-100">
                  <Text className="text-base font-bold text-gray-800 mb-3">
                    Contact Information (Optional)
                  </Text>
                  <TextInput
                    value={contactInfo}
                    onChangeText={setContactInfo}
                    placeholder="Email or phone number for follow-up"
                    className="bg-gray-50 rounded-xl p-4 text-base mb-3"
                  />
                  <TouchableOpacity
                    onPress={() => setIsAnonymous(!isAnonymous)}
                    className="flex-row items-center"
                  >
                    <View className={`w-5 h-5 rounded border-2 mr-3 items-center justify-center ${
                      isAnonymous ? 'bg-purple-600 border-purple-600' : 'border-gray-300'
                    }`}>
                      {isAnonymous && (
                        <Ionicons name="checkmark" size={12} color="white" />
                      )}
                    </View>
                    <Text className="text-sm text-gray-700">
                      Submit feedback anonymously
                    </Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            )}

            {activeTab === 'feature' && (
              <Animated.View entering={FadeInDown.springify()}>
                {/* Feature Selection */}
                <View className="bg-white rounded-2xl p-6 mb-6 border border-gray-100">
                  <Text className="text-base font-bold text-gray-800 mb-4">
                    Which feature would you like to improve?
                  </Text>
                  <View className="flex-row flex-wrap justify-between">
                    {appFeatures.map(renderFeature)}
                  </View>
                </View>

                {/* Improvement Suggestion */}
                <View className="bg-white rounded-2xl p-6 mb-6 border border-gray-100">
                  <Text className="text-base font-bold text-gray-800 mb-3">
                    How can we improve this feature?
                  </Text>
                  <TextInput
                    value={improvementSuggestion}
                    onChangeText={setImprovementSuggestion}
                    placeholder="Describe your suggestion in detail..."
                    multiline
                    numberOfLines={6}
                    className="bg-gray-50 rounded-xl p-4 text-base"
                    style={{ textAlignVertical: 'top' }}
                  />
                </View>
              </Animated.View>
            )}

            {activeTab === 'bug' && (
              <Animated.View entering={FadeInDown.springify()}>
                {/* Bug Type Selection */}
                <View className="bg-white rounded-2xl p-6 mb-6 border border-gray-100">
                  <Text className="text-base font-bold text-gray-800 mb-4">
                    What type of issue are you experiencing?
                  </Text>
                  {bugTypes.map(renderBugType)}
                </View>

                {/* Bug Description */}
                <View className="bg-white rounded-2xl p-6 mb-6 border border-gray-100">
                  <Text className="text-base font-bold text-gray-800 mb-3">
                    Describe the issue
                  </Text>
                  <TextInput
                    value={bugDescription}
                    onChangeText={setBugDescription}
                    placeholder="What happened? What did you expect to happen?"
                    multiline
                    numberOfLines={4}
                    className="bg-gray-50 rounded-xl p-4 text-base mb-4"
                    style={{ textAlignVertical: 'top' }}
                  />
                  
                  <Text className="text-base font-bold text-gray-800 mb-3">
                    Steps to reproduce (Optional)
                  </Text>
                  <TextInput
                    value={stepsToReproduce}
                    onChangeText={setStepsToReproduce}
                    placeholder="1. Go to..."
                    multiline
                    numberOfLines={4}
                    className="bg-gray-50 rounded-xl p-4 text-base"
                    style={{ textAlignVertical: 'top' }}
                  />
                </View>
              </Animated.View>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmitFeedback}
              className="bg-purple-600 py-5 rounded-2xl mb-6"
            >
              <Text className="text-white text-center font-bold text-lg">
                Submit Feedback
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {renderThankYouModal()}
    </View>
  );
};

export default FeedbackPage;