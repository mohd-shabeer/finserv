import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    Linking,
    Modal,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View
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

const HelpCenterPage = () => {
  const [activeTab, setActiveTab] = useState('faq');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactType, setContactType] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');

  const animatedValue = useSharedValue(0);
  const modalScale = useSharedValue(0);

  useEffect(() => {
    animatedValue.value = withSpring(1);
  }, []);

  const helpCategories = [
    {
      id: 'account',
      title: 'Account Management',
      icon: 'person-outline',
      color: '#3b82f6',
      count: 15,
      description: 'Login, password, profile settings'
    },
    {
      id: 'transactions',
      title: 'Transactions',
      icon: 'swap-horizontal-outline',
      color: '#10b981',
      count: 12,
      description: 'Transfers, payments, history'
    },
    {
      id: 'cards',
      title: 'Cards & Payments',
      icon: 'card-outline',
      color: '#f59e0b',
      count: 10,
      description: 'Debit cards, credit cards, UPI'
    },
    {
      id: 'security',
      title: 'Security',
      icon: 'shield-checkmark-outline',
      color: '#ef4444',
      count: 8,
      description: 'Fraud protection, security settings'
    },
    {
      id: 'loans',
      title: 'Loans & Credit',
      icon: 'cash-outline',
      color: '#8b5cf6',
      count: 7,
      description: 'Loan applications, EMI, credit score'
    },
    {
      id: 'investments',
      title: 'Investments',
      icon: 'trending-up-outline',
      color: '#06b6d4',
      count: 6,
      description: 'Mutual funds, FDs, market updates'
    }
  ];

  const faqData = [
    {
      id: 1,
      question: 'How do I reset my login password?',
      answer: 'You can reset your password by clicking "Forgot Password" on the login screen. Enter your registered email or phone number, and we\'ll send you a secure link to create a new password. The link will expire in 24 hours for security reasons.',
      category: 'account',
      popular: true
    },
    {
      id: 2,
      question: 'Why is my transaction taking longer than usual?',
      answer: 'Transaction delays can occur due to several reasons: bank holidays, high network traffic, or additional security verification. Most transactions complete within 2-4 hours. If it takes longer than 24 hours, please contact our support team.',
      category: 'transactions',
      popular: true
    },
    {
      id: 3,
      question: 'How do I block my debit card?',
      answer: 'To block your debit card immediately: 1) Go to Cards section in the app, 2) Select your card, 3) Tap "Block Card", 4) Confirm your action with PIN/biometric. You can also call our 24/7 helpline at 1800-XXX-XXXX.',
      category: 'cards',
      popular: true
    },
    {
      id: 4,
      question: 'What should I do if I notice suspicious activity?',
      answer: 'If you notice any suspicious activity: 1) Block your cards immediately, 2) Change your passwords, 3) Contact our fraud team at 1800-XXX-FRAUD, 4) Check your recent transactions, 5) File a complaint in the app. We have 24/7 fraud monitoring.',
      category: 'security',
      popular: true
    },
    {
      id: 5,
      question: 'How can I check my loan eligibility?',
      answer: 'Check your loan eligibility by: 1) Going to Loans section, 2) Selecting loan type, 3) Using our eligibility calculator, 4) Entering your income details. Pre-approved customers will see instant offers. The process takes 2-3 minutes.',
      category: 'loans',
      popular: false
    },
    {
      id: 6,
      question: 'How do I start investing in mutual funds?',
      answer: 'To start investing: 1) Complete your KYC if not done, 2) Go to Investments section, 3) Choose from curated fund recommendations, 4) Start with SIP as low as ₹500, 5) Set up auto-debit for convenience. Our advisors can help you choose.',
      category: 'investments',
      popular: false
    },
    {
      id: 7,
      question: 'Can I increase my daily transaction limit?',
      answer: 'Yes, you can request limit increase through: 1) Settings > Transaction Limits, 2) Submit required documents, 3) Wait for approval (24-48 hours), 4) Limits are based on account type and relationship with bank.',
      category: 'transactions',
      popular: false
    },
    {
      id: 8,
      question: 'How do I enable biometric login?',
      answer: 'Enable biometric login: 1) Go to Settings > Security, 2) Enable Biometric Authentication, 3) Register your fingerprint/face, 4) Test the setup. Biometric data is stored securely on your device only.',
      category: 'security',
      popular: false
    }
  ];

  const quickActions = [
    {
      id: 'chat',
      title: 'Live Chat',
      subtitle: 'Get instant help',
      icon: 'chatbubble-ellipses-outline',
      color: '#10b981',
      action: () => openContactModal('chat')
    },
    {
      id: 'call',
      title: 'Call Support',
      subtitle: '24/7 helpline',
      icon: 'call-outline',
      color: '#3b82f6',
      action: () => openContactModal('call')
    },
    {
      id: 'email',
      title: 'Email Us',
      subtitle: 'Detailed queries',
      icon: 'mail-outline',
      color: '#f59e0b',
      action: () => openContactModal('email')
    },
    {
      id: 'branch',
      title: 'Find Branch',
      subtitle: 'Visit nearest branch',
      icon: 'location-outline',
      color: '#8b5cf6',
      action: () => Alert.alert('Branch Locator', 'Opening branch locator...')
    }
  ];

  const contactOptions = {
    chat: {
      title: 'Live Chat Support',
      description: 'Connect with our support team instantly',
      action: 'Start Chat',
      icon: 'chatbubble-ellipses',
      color: '#10b981'
    },
    call: {
      title: 'Phone Support',
      description: '24/7 helpline: 1800-XXX-XXXX',
      action: 'Call Now',
      icon: 'call',
      color: '#3b82f6'
    },
    email: {
      title: 'Email Support',
      description: 'Send detailed queries to support@finverse.com',
      action: 'Send Email',
      icon: 'mail',
      color: '#f59e0b'
    }
  };

  const filteredFaqs = faqData.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openContactModal = (type) => {
    setContactType(type);
    setShowContactModal(true);
    modalScale.value = withSpring(1);
  };

  const closeContactModal = () => {
    modalScale.value = withTiming(0, { duration: 200 });
    setTimeout(() => {
      setShowContactModal(false);
      setContactType('');
    }, 200);
  };

  const openFeedbackModal = () => {
    setShowFeedbackModal(true);
    modalScale.value = withSpring(1);
  };

  const closeFeedbackModal = () => {
    modalScale.value = withTiming(0, { duration: 200 });
    setTimeout(() => {
      setShowFeedbackModal(false);
      setFeedbackRating(0);
      setFeedbackText('');
    }, 200);
  };

  const handleContactAction = () => {
    switch (contactType) {
      case 'chat':
        closeContactModal();
        Alert.alert('Live Chat', 'Opening live chat support...');
        break;
      case 'call':
        closeContactModal();
        Linking.openURL('tel:1800XXXXXXX');
        break;
      case 'email':
        closeContactModal();
        Linking.openURL('mailto:support@finverse.com');
        break;
    }
  };

  const handleFeedbackSubmit = () => {
    if (feedbackRating === 0) {
      Alert.alert('Rating Required', 'Please provide a rating before submitting.');
      return;
    }
    closeFeedbackModal();
    Alert.alert('Thank You!', 'Your feedback has been submitted successfully.');
  };

  const toggleFaq = (faqId) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };

  const modalAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: modalScale.value }],
      opacity: modalScale.value,
    };
  });

  const renderHelpCategory = (category, index) => (
    <Animated.View
      entering={FadeInDown.delay(index * 100).springify()}
      key={category.id}
      className="mr-4"
      style={{ marginRight: index === helpCategories.length - 1 ? 0 : 16 }}
    >
      <TouchableOpacity
        className="w-44 rounded-2xl p-4 border border-gray-200"
        style={{ backgroundColor: `${category.color}10` }}
      >
        <View className="flex-row items-center justify-between mb-3">
          <View
            className="w-12 h-12 rounded-2xl items-center justify-center"
            style={{ backgroundColor: category.color }}
          >
            <Ionicons name={category.icon} size={24} color="white" />
          </View>
          <View className="bg-white px-2 py-1 rounded-lg">
            <Text className="text-xs font-semibold" style={{ color: category.color }}>
              {category.count} articles
            </Text>
          </View>
        </View>
        <Text className="text-base font-bold text-gray-800 mb-1">
          {category.title}
        </Text>
        <Text className="text-xs text-gray-600">
          {category.description}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderQuickAction = (action, index) => (
    <Animated.View
      entering={FadeInRight.delay(index * 100).springify()}
      key={action.id}
      className="flex-1"
      style={{ marginRight: index < quickActions.length - 1 ? 12 : 0 }}
    >
      <TouchableOpacity
        onPress={action.action}
        className="bg-white rounded-2xl p-4 border border-gray-100 items-center"
      >
        <View
          className="w-12 h-12 rounded-full items-center justify-center mb-3"
          style={{ backgroundColor: `${action.color}15` }}
        >
          <Ionicons name={action.icon} size={24} color={action.color} />
        </View>
        <Text className="text-sm font-bold text-gray-800 text-center mb-1">
          {action.title}
        </Text>
        <Text className="text-xs text-gray-600 text-center">
          {action.subtitle}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderFaq = (faq, index) => (
    <Animated.View
      entering={SlideInLeft.delay(index * 100).springify()}
      key={faq.id}
      className="bg-white rounded-2xl mb-4 border border-gray-100 overflow-hidden"
    >
      <TouchableOpacity
        onPress={() => toggleFaq(faq.id)}
        className="p-4"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1 mr-3">
            <View className="flex-row items-center mb-2">
              <Text className="text-base font-bold text-gray-800 flex-1">
                {faq.question}
              </Text>
              {faq.popular && (
                <View className="bg-orange-100 px-2 py-1 rounded-full ml-2">
                  <Text className="text-xs font-medium text-orange-600">
                    Popular
                  </Text>
                </View>
              )}
            </View>
          </View>
          <Ionicons 
            name={expandedFaq === faq.id ? 'chevron-up' : 'chevron-down'} 
            size={20} 
            color="#6b7280" 
          />
        </View>
      </TouchableOpacity>
      
      {expandedFaq === faq.id && (
        <Animated.View 
          entering={FadeInDown.springify()}
          className="px-4 pb-4"
        >
          <View className="border-t border-gray-100 pt-4">
            <Text className="text-sm text-gray-700 leading-6">
              {faq.answer}
            </Text>
            <View className="flex-row items-center justify-between mt-4">
              <Text className="text-xs text-gray-500">
                Was this helpful?
              </Text>
              <View className="flex-row space-x-3">
                <TouchableOpacity className="flex-row items-center">
                  <Ionicons name="thumbs-up-outline" size={16} color="#10b981" />
                  <Text className="text-xs text-green-600 ml-1">Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-row items-center">
                  <Ionicons name="thumbs-down-outline" size={16} color="#ef4444" />
                  <Text className="text-xs text-red-600 ml-1">No</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Animated.View>
      )}
    </Animated.View>
  );

  const renderContactModal = () => {
    const option = contactOptions[contactType];
    if (!option) return null;

    return (
      <Modal
        visible={showContactModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closeContactModal}
      >
        <View className="flex-1 bg-black bg-opacity-50 justify-center items-center px-4">
          <Animated.View
            style={modalAnimatedStyle}
            className="bg-white rounded-3xl p-6 w-full max-w-sm"
          >
            <View className="items-center mb-6">
              <View
                className="w-16 h-16 rounded-full items-center justify-center mb-4"
                style={{ backgroundColor: `${option.color}15` }}
              >
                <Ionicons name={option.icon} size={32} color={option.color} />
              </View>
              <Text className="text-xl font-bold text-gray-800 text-center">
                {option.title}
              </Text>
              <Text className="text-sm text-gray-600 text-center mt-2">
                {option.description}
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleContactAction}
              className="py-4 rounded-xl mb-3"
              style={{ backgroundColor: option.color }}
            >
              <Text className="text-white text-center font-semibold">
                {option.action}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={closeContactModal}>
              <Text className="text-gray-600 text-center font-medium">
                Cancel
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    );
  };

  const renderFeedbackModal = () => (
    <Modal
      visible={showFeedbackModal}
      transparent={true}
      animationType="fade"
      onRequestClose={closeFeedbackModal}
    >
      <View className="flex-1 bg-black bg-opacity-50 justify-center items-center px-4">
        <Animated.View
          style={modalAnimatedStyle}
          className="bg-white rounded-3xl p-6 w-full max-w-md"
        >
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-xl font-bold text-gray-800">
              Share Feedback
            </Text>
            <TouchableOpacity onPress={closeFeedbackModal}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-3">
              How would you rate our help center?
            </Text>
            <View className="flex-row justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setFeedbackRating(star)}
                >
                  <Ionicons
                    name={star <= feedbackRating ? 'star' : 'star-outline'}
                    size={32}
                    color={star <= feedbackRating ? '#f59e0b' : '#d1d5db'}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Additional Comments (Optional)
            </Text>
            <TextInput
              value={feedbackText}
              onChangeText={setFeedbackText}
              placeholder="Tell us how we can improve..."
              multiline
              numberOfLines={4}
              className="bg-gray-50 rounded-xl p-4 text-base"
              style={{ textAlignVertical: 'top' }}
            />
          </View>

          <TouchableOpacity
            onPress={handleFeedbackSubmit}
            className="bg-blue-600 py-4 rounded-xl mb-3"
          >
            <Text className="text-white text-center font-semibold">
              Submit Feedback
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={closeFeedbackModal}>
            <Text className="text-gray-600 text-center font-medium">
              Cancel
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );

  const tabs = [
    { id: 'faq', name: 'FAQ', icon: 'help-circle-outline' },
    { id: 'guides', name: 'Guides', icon: 'book-outline' },
    { id: 'contact', name: 'Contact', icon: 'call-outline' },
    { id: 'status', name: 'Status', icon: 'pulse-outline' }
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" backgroundColor="#10b981" />
      
      {/* Header */}
      <LinearGradient
        colors={['#10b981', '#059669']}
        className="pt-12 pb-6 px-4"
      >
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <TouchableOpacity className="mr-3" onPress={()=>router.back()}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-white">Help Center</Text>
          </View>
          <TouchableOpacity onPress={openFeedbackModal}>
            <Ionicons name="chatbubble-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="bg-opacity-20 rounded-2xl px-4 py-3 flex-row items-center">
          <Ionicons name="search-outline" size={20} color="white" />
          <TextInput
            placeholder="Search for help articles..."
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 ml-3 text-white text-base"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Quick Actions */}
        <View className="px-4 py-6">
          <Text className="text-lg font-bold text-gray-800 mb-4">
            Quick Actions
          </Text>
          <View className="flex-row">
            {quickActions.map(renderQuickAction)}
          </View>
        </View>

        {/* Help Categories */}
        <View className="py-6">
          <View className="px-4 mb-4">
            <Text className="text-lg font-bold text-gray-800">
              Browse by Category
            </Text>
            <Text className="text-sm text-gray-600">
              Find answers organized by topic
            </Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="px-4"
            contentContainerStyle={{ paddingRight: 16 }}
          >
            {helpCategories.map(renderHelpCategory)}
          </ScrollView>
        </View>

        {/* Tabs */}
        <View className="px-4 mb-4">
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 16 }}
          >
            {tabs.map((tab, index) => (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                className={`mr-4 px-4 py-3 rounded-2xl border ${
                  activeTab === tab.id 
                    ? 'border-green-600 bg-green-600' 
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
          {activeTab === 'faq' && (
            <View>
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-lg font-bold text-gray-800">
                  Frequently Asked Questions
                </Text>
                <Text className="text-sm text-gray-600">
                  {filteredFaqs.length} results
                </Text>
              </View>
              
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map(renderFaq)
              ) : (
                <View className="items-center justify-center py-20">
                  <Ionicons name="search-outline" size={48} color="#9ca3af" />
                  <Text className="text-gray-500 text-lg font-medium mt-4">
                    No results found
                  </Text>
                  <Text className="text-gray-400 text-sm mt-2 text-center">
                    Try adjusting your search terms
                  </Text>
                </View>
              )}
            </View>
          )}

          {activeTab === 'guides' && (
            <View className="items-center justify-center py-20">
              <Ionicons name="book-outline" size={48} color="#9ca3af" />
              <Text className="text-gray-500 text-lg font-medium mt-4">
                Guides Coming Soon
              </Text>
              <Text className="text-gray-400 text-sm mt-2 text-center">
                Detailed guides and tutorials will be available here
              </Text>
            </View>
          )}

          {activeTab === 'contact' && (
            <View>
              <Text className="text-lg font-bold text-gray-800 mb-4">
                Contact Support
              </Text>
              
              <View className="space-y-4">
                {Object.entries(contactOptions).map(([key, option], index) => (
                  <Animated.View
                    entering={SlideInLeft.delay(index * 100).springify()}
                    key={key}
                    className="bg-white rounded-2xl p-4 border border-gray-100"
                  >
                    <TouchableOpacity onPress={() => openContactModal(key)}>
                      <View className="flex-row items-center">
                        <View
                          className="w-12 h-12 rounded-full items-center justify-center mr-3"
                          style={{ backgroundColor: `${option.color}15` }}
                        >
                          <Ionicons name={option.icon} size={24} color={option.color} />
                        </View>
                        <View className="flex-1">
                          <Text className="text-base font-bold text-gray-800">
                            {option.title}
                          </Text>
                          <Text className="text-sm text-gray-600">
                            {option.description}
                          </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                      </View>
                    </TouchableOpacity>
                  </Animated.View>
                ))}
              </View>
            </View>
          )}

          {activeTab === 'status' && (
            <View className="items-center justify-center py-20">
              <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-4">
                <Ionicons name="checkmark-circle" size={32} color="#10b981" />
              </View>
              <Text className="text-lg font-bold text-gray-800 mb-2">
                All Systems Operational
              </Text>
              <Text className="text-gray-600 text-center">
                All Finverse services are running smoothly
              </Text>
              <Text className="text-xs text-gray-500 mt-4">
                Last updated: 2 minutes ago
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {renderContactModal()}
      {renderFeedbackModal()}
    </View>
  );
};

export default HelpCenterPage;