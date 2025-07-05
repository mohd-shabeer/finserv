import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    Linking,
    ScrollView,
    Share,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, {
    FadeInDown,
    FadeInRight,
    SlideInLeft,
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const AboutPage = () => {
  const [activeTab, setActiveTab] = useState('company');
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [logoTapCount, setLogoTapCount] = useState(0);

  const animatedValue = useSharedValue(0);
  const logoScale = useSharedValue(1);

  useEffect(() => {
    animatedValue.value = withSpring(1);
  }, []);

  useEffect(() => {
    if (logoTapCount >= 7) {
      setShowEasterEgg(true);
      setLogoTapCount(0);
    }
  }, [logoTapCount]);

  const companyInfo = {
    name: 'Finverse Banking',
    tagline: 'Your trusted financial partner',
    version: '2.1.0',
    buildNumber: '2025.01.04',
    founded: '2020',
    headquarters: 'Mumbai, India',
    employees: '500+',
    customers: '2M+',
    description: 'Finverse is a leading digital banking platform that revolutionizes how you manage your finances. We combine cutting-edge technology with traditional banking excellence to provide secure, convenient, and innovative financial services.',
    mission: 'To democratize banking and make financial services accessible, transparent, and empowering for everyone.',
    vision: 'To be the most trusted and innovative financial technology company, enabling financial freedom for millions.',
  };

  const teamMembers = [
  {
    id: 1,
    name: 'Adam Parker',
    role: 'CEO & Founder',
    description: 'Former Goldman Sachs VP with 15+ years in fintech',
    icon: 'person-circle-outline',
    color: '#3b82f6'
  },
  {
    id: 2,
    name: 'Sophia Miller',
    role: 'CTO',
    description: 'Ex-Google engineer, AI and blockchain expert',
    icon: 'code-slash-outline',
    color: '#10b981'
  },
  {
    id: 3,
    name: 'David Brooks',
    role: 'Chief Risk Officer',
    description: 'Former RBI official, 20+ years in banking',
    icon: 'shield-checkmark-outline',
    color: '#f59e0b'
  },
  {
    id: 4,
    name: 'Emma Collins',
    role: 'Head of Product',
    description: 'Design thinking expert, former Paytm lead',
    icon: 'bulb-outline',
    color: '#8b5cf6'
  }
];


  const achievements = [
    {
      id: 1,
      title: 'Best Digital Bank 2024',
      subtitle: 'Banking Technology Awards',
      icon: 'trophy-outline',
      color: '#f59e0b'
    },
    {
      id: 2,
      title: 'Top Fintech Startup',
      subtitle: 'TechCrunch Disrupt 2023',
      icon: 'rocket-outline',
      color: '#ef4444'
    },
    {
      id: 3,
      title: 'Customer Choice Award',
      subtitle: 'Indian Banking Association',
      icon: 'heart-outline',
      color: '#ec4899'
    },
    {
      id: 4,
      title: 'Security Excellence',
      subtitle: 'Cybersecurity Council of India',
      icon: 'shield-checkmark-outline',
      color: '#10b981'
    }
  ];

  const legalLinks = [
    {
      id: 1,
      title: 'Privacy Policy',
      description: 'How we protect your data',
      icon: 'shield-outline',
      url: 'https://finverse.com/privacy'
    },
    {
      id: 2,
      title: 'Terms of Service',
      description: 'Our service agreement',
      icon: 'document-text-outline',
      url: 'https://finverse.com/terms'
    },
    {
      id: 3,
      title: 'Cookie Policy',
      description: 'Our cookie usage',
      icon: 'globe-outline',
      url: 'https://finverse.com/cookies'
    },
    {
      id: 4,
      title: 'Compliance',
      description: 'Regulatory information',
      icon: 'checkmark-circle-outline',
      url: 'https://finverse.com/compliance'
    }
  ];

  const socialLinks = [
    {
      id: 1,
      name: 'LinkedIn',
      icon: 'logo-linkedin',
      color: '#0077b5',
      url: 'https://linkedin.com/company/finverse'
    },
    {
      id: 2,
      name: 'Twitter',
      icon: 'logo-twitter',
      color: '#1da1f2',
      url: 'https://twitter.com/finverse'
    },
    {
      id: 3,
      name: 'Instagram',
      icon: 'logo-instagram',
      color: '#e4405f',
      url: 'https://instagram.com/finverse'
    },
    {
      id: 4,
      name: 'YouTube',
      icon: 'logo-youtube',
      color: '#ff0000',
      url: 'https://youtube.com/finverse'
    }
  ];

  const appFeatures = [
    '🏦 Digital Banking Excellence',
    '💳 Smart Card Management',
    '💰 Instant Money Transfers',
    '📊 Investment Portfolio',
    '🛡️ Bank-Grade Security',
    '📱 Biometric Authentication',
    '🔔 Real-time Notifications',
    '🌍 Multi-language Support',
    '💡 AI-Powered Insights',
    '🎯 Goal-based Savings'
  ];

  const handleLogoTap = () => {
    setLogoTapCount(prev => prev + 1);
    logoScale.value = withSpring(1.2, {}, () => {
      logoScale.value = withSpring(1);
    });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Check out Finverse - The future of digital banking! Download now: https://finverse.com/download',
        title: 'Finverse Banking App',
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share the app');
    }
  };

  const handleSocialLink = (url) => {
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Could not open the link');
    });
  };

  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: logoScale.value }],
    };
  });

  const renderTeamMember = (member, index) => (
    <Animated.View
      entering={SlideInLeft.delay(index * 150).springify()}
      key={member.id}
      className="bg-white rounded-2xl p-4 mb-4 border border-gray-100"
    >
      <View className="flex-row items-center">
        <View
          className="w-12 h-12 rounded-full items-center justify-center mr-3"
          style={{ backgroundColor: `${member.color}15` }}
        >
          <Ionicons name={member.icon} size={24} color={member.color} />
        </View>
        <View className="flex-1">
          <Text className="text-base font-bold text-gray-800">
            {member.name}
          </Text>
          <Text className="text-sm font-medium text-gray-600 mb-1">
            {member.role}
          </Text>
          <Text className="text-xs text-gray-500 leading-4">
            {member.description}
          </Text>
        </View>
      </View>
    </Animated.View>
  );

  const renderAchievement = (achievement, index) => (
    <Animated.View
      entering={FadeInDown.delay(index * 100).springify()}
      key={achievement.id}
      className="bg-white rounded-2xl p-4 mr-4 border border-gray-100"
      style={{ width: 180 }}
    >
      <View className="items-center">
        <View
          className="w-12 h-12 rounded-full items-center justify-center mb-3"
          style={{ backgroundColor: `${achievement.color}15` }}
        >
          <Ionicons name={achievement.icon} size={24} color={achievement.color} />
        </View>
        <Text className="text-sm font-bold text-gray-800 text-center mb-1">
          {achievement.title}
        </Text>
        <Text className="text-xs text-gray-600 text-center">
          {achievement.subtitle}
        </Text>
      </View>
    </Animated.View>
  );

  const renderLegalLink = (link, index) => (
    <Animated.View
      entering={SlideInLeft.delay(index * 100).springify()}
      key={link.id}
      className="bg-white rounded-2xl mb-3 border border-gray-100"
    >
      <TouchableOpacity
        onPress={() => handleSocialLink(link.url)}
        className="p-4"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-3">
              <Ionicons name={link.icon} size={20} color="#6b7280" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-bold text-gray-800">
                {link.title}
              </Text>
              <Text className="text-sm text-gray-600">
                {link.description}
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderSocialLink = (social, index) => (
    <Animated.View
      entering={FadeInRight.delay(index * 100).springify()}
      key={social.id}
      className="items-center mx-4"
    >
      <TouchableOpacity
        onPress={() => handleSocialLink(social.url)}
        className="w-12 h-12 rounded-full items-center justify-center mb-2"
        style={{ backgroundColor: `${social.color}15` }}
      >
        <Ionicons name={social.icon} size={24} color={social.color} />
      </TouchableOpacity>
      <Text className="text-xs text-gray-600">
        {social.name}
      </Text>
    </Animated.View>
  );

  const tabs = [
    { id: 'company', name: 'Company', icon: 'business-outline' },
    { id: 'team', name: 'Team', icon: 'people-outline' },
    { id: 'legal', name: 'Legal', icon: 'document-outline' }
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" backgroundColor="#6366f1" />
      
      {/* Header */}
      <LinearGradient
        colors={['#6366f1', '#8b5cf6']}
        className="pt-12 pb-6 px-4"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity className="mr-3" onPress={()=>router.back()}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-white">About Finverse</Text>
          </View>
          <TouchableOpacity onPress={handleShare}>
            <Ionicons name="share-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Company Logo & Info */}
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          className="items-center py-8 px-4"
        >
          <TouchableOpacity onPress={handleLogoTap}>
            <Animated.View
              style={logoAnimatedStyle}
              className="w-24 h-24 bg-blue-600 rounded-3xl items-center justify-center mb-4"
            >
              <Text className="text-white text-3xl font-bold">F</Text>
            </Animated.View>
          </TouchableOpacity>
          
          <Text className="text-2xl font-bold text-gray-800 mb-2">
            {companyInfo.name}
          </Text>
          <Text className="text-base text-gray-600 mb-4">
            {companyInfo.tagline}
          </Text>
          
          <View className="flex-row space-x-6">
            <View className="items-center">
              <Text className="text-lg font-bold text-blue-600">
                {companyInfo.customers}
              </Text>
              <Text className="text-xs text-gray-500">Customers</Text>
            </View>
            <View className="items-center">
              <Text className="text-lg font-bold text-green-600">
                {companyInfo.employees}
              </Text>
              <Text className="text-xs text-gray-500">Employees</Text>
            </View>
            <View className="items-center">
              <Text className="text-lg font-bold text-purple-600">
                {companyInfo.founded}
              </Text>
              <Text className="text-xs text-gray-500">Founded</Text>
            </View>
          </View>

          {showEasterEgg && (
            <Animated.View
              entering={FadeInDown.springify()}
              className="mt-4 bg-purple-100 px-4 py-2 rounded-full"
            >
              <Text className="text-purple-600 text-sm font-medium">
                🎉 You found the easter egg! Thanks for being curious!
              </Text>
            </Animated.View>
          )}
        </Animated.View>

        {/* App Features */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-4">
            What Makes Us Special
          </Text>
          <View className="bg-white rounded-2xl p-4 border border-gray-100">
            <View className="flex-row flex-wrap">
              {appFeatures.map((feature, index) => (
                <Animated.View
                  entering={FadeInRight.delay(index * 50).springify()}
                  key={index}
                  className="w-1/2 mb-2"
                >
                  <Text className="text-sm text-gray-700">
                    {feature}
                  </Text>
                </Animated.View>
              ))}
            </View>
          </View>
        </View>

        {/* Achievements */}
        <View className="mb-6">
          <View className="px-4 mb-4">
            <Text className="text-lg font-bold text-gray-800">
              Awards & Recognition
            </Text>
            <Text className="text-sm text-gray-600">
              Industry recognition for excellence
            </Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="px-4"
            contentContainerStyle={{ paddingRight: 16 }}
          >
            {achievements.map(renderAchievement)}
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
                className={`mr-4 px-6 py-3 rounded-2xl border ${
                  activeTab === tab.id 
                    ? 'border-blue-600 bg-blue-600' 
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
          {activeTab === 'company' && (
            <Animated.View entering={FadeInDown.springify()}>
              {/* Mission & Vision */}
              <View className="bg-white rounded-2xl p-6 mb-6 border border-gray-100">
                <Text className="text-lg font-bold text-gray-800 mb-4">
                  Our Story
                </Text>
                <Text className="text-sm text-gray-700 leading-6 mb-4">
                  {companyInfo.description}
                </Text>
                
                <View className="mb-4">
                  <Text className="text-base font-bold text-gray-800 mb-2">
                    🎯 Our Mission
                  </Text>
                  <Text className="text-sm text-gray-700 leading-5">
                    {companyInfo.mission}
                  </Text>
                </View>
                
                <View>
                  <Text className="text-base font-bold text-gray-800 mb-2">
                    🔮 Our Vision
                  </Text>
                  <Text className="text-sm text-gray-700 leading-5">
                    {companyInfo.vision}
                  </Text>
                </View>
              </View>

              {/* Company Stats */}
              <View className="bg-white rounded-2xl p-6 mb-6 border border-gray-100">
                <Text className="text-lg font-bold text-gray-800 mb-4">
                  Company Information
                </Text>
                <View className="space-y-3">
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-gray-600">Headquarters</Text>
                    <Text className="text-sm font-medium text-gray-800">
                      {companyInfo.headquarters}
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-gray-600">Founded</Text>
                    <Text className="text-sm font-medium text-gray-800">
                      {companyInfo.founded}
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-gray-600">App Version</Text>
                    <Text className="text-sm font-medium text-gray-800">
                      {companyInfo.version}
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-gray-600">Build Number</Text>
                    <Text className="text-sm font-medium text-gray-800">
                      {companyInfo.buildNumber}
                    </Text>
                  </View>
                </View>
              </View>
            </Animated.View>
          )}

          {activeTab === 'team' && (
            <Animated.View entering={FadeInDown.springify()}>
              <Text className="text-lg font-bold text-gray-800 mb-4">
                Leadership Team
              </Text>
              <Text className="text-sm text-gray-600 mb-6">
                Meet the visionaries behind Finverse
              </Text>
              {teamMembers.map(renderTeamMember)}
            </Animated.View>
          )}

          {activeTab === 'legal' && (
            <Animated.View entering={FadeInDown.springify()}>
              <Text className="text-lg font-bold text-gray-800 mb-4">
                Legal Information
              </Text>
              <Text className="text-sm text-gray-600 mb-6">
                Important legal documents and policies
              </Text>
              {legalLinks.map(renderLegalLink)}
            </Animated.View>
          )}
        </View>

        {/* Social Links */}
        <View className="px-4 pb-8">
          <Text className="text-center text-sm text-gray-600 mb-4">
            Connect with us on social media
          </Text>
          <View className="flex-row justify-center">
            {socialLinks.map(renderSocialLink)}
          </View>
        </View>

        {/* Footer */}
        <View className="bg-gray-100 py-6 px-4">
          <Text className="text-center text-xs text-gray-500 mb-2">
            © 2025 Finverse Technologies Pvt. Ltd.
          </Text>
          <Text className="text-center text-xs text-gray-400">
            Licensed by Reserve Bank of India • FDIC Insured • ISO 27001 Certified
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default AboutPage;