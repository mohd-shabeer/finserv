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
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const Profile = () => {
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const shimmerPosition = useRef(new Animated.Value(-200)).current;
  
  // State management
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [marketingEnabled, setMarketingEnabled] = useState(false);

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

    // Shimmer animation
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

  // User profile data
  const userProfile = {
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300",
    address: "123 Financial District, New York, NY 10004",
    dateOfBirth: "March 15, 1990",
    customerSince: "January 2020",
    accountType: "Premium Banking",
    creditScore: 785,
    lastLogin: "Today, 9:30 AM",
    securityLevel: "High",
    verificationStatus: "Verified"
  };

  // Profile menu sections
  const profileSections = [
    {
      title: "Account Management",
      items: [
        {
          id: 'personal-info',
          title: 'Personal Information',
          subtitle: 'Update your details',
          icon: 'person-outline',
          color: '#3b82f6',
          route: '/personal-info',
          hasArrow: true
        },
        {
          id: 'documents',
          title: 'Documents & Verification',
          subtitle: 'ID, passport, documents',
          icon: 'description',
          color: '#10b981',
          route: '/documents',
          hasArrow: true
        },
        {
          id: 'addresses',
          title: 'Addresses',
          subtitle: 'Home, billing addresses',
          icon: 'location-on',
          color: '#f59e0b',
          route: '/addresses',
          hasArrow: true
        },
        {
          id: 'linked-accounts',
          title: 'Linked Accounts',
          subtitle: 'External bank accounts',
          icon: 'account-balance',
          color: '#8b5cf6',
          route: '/linked-accounts',
          hasArrow: true
        }
      ]
    },
    {
      title: "Security & Privacy",
      items: [
        {
          id: 'security-settings',
          title: 'Security Settings',
          subtitle: 'Password, PIN, security',
          icon: 'security',
          color: '#ef4444',
          route: '/security-settings',
          hasArrow: true
        },
        {
          id: 'biometrics',
          title: 'Biometric Authentication',
          subtitle: 'Face ID, Touch ID',
          icon: 'fingerprint',
          color: '#06b6d4',
          isToggle: true,
          value: biometricsEnabled,
          onToggle: setBiometricsEnabled
        },
        {
          id: 'two-factor',
          title: 'Two-Factor Authentication',
          subtitle: 'SMS, authenticator app',
          icon: 'verified-user',
          color: '#10b981',
          isToggle: true,
          value: twoFactorEnabled,
          onToggle: setTwoFactorEnabled
        },
        {
          id: 'privacy',
          title: 'Privacy Settings',
          subtitle: 'Data sharing, analytics',
          icon: 'privacy-tip',
          color: '#8b5cf6',
          route: '/privacy-settings',
          hasArrow: true
        }
      ]
    },
    {
      title: "Preferences",
      items: [
        {
          id: 'notifications',
          title: 'Push Notifications',
          subtitle: 'Transaction alerts, updates',
          icon: 'notifications',
          color: '#f59e0b',
          isToggle: true,
          value: notificationsEnabled,
          onToggle: setNotificationsEnabled
        },
        {
          id: 'marketing',
          title: 'Marketing Communications',
          subtitle: 'Offers, promotions',
          icon: 'campaign',
          color: '#ef4444',
          isToggle: true,
          value: marketingEnabled,
          onToggle: setMarketingEnabled
        },
        {
          id: 'language',
          title: 'Language & Region',
          subtitle: 'English (US)',
          icon: 'language',
          color: '#3b82f6',
          route: '/language-settings',
          hasArrow: true
        },
        {
          id: 'currency',
          title: 'Currency Settings',
          subtitle: 'USD - US Dollar',
          icon: 'attach-money',
          color: '#10b981',
          route: '/currency-settings',
          hasArrow: true
        }
      ]
    },
    {
      title: "Support & Help",
      items: [
        {
          id: 'help-center',
          title: 'Help Center',
          subtitle: 'FAQs, guides, tutorials',
          icon: 'help-outline',
          color: '#3b82f6',
          route: '/help-center',
          hasArrow: true
        },
        {
          id: 'contact-support',
          title: 'Contact Support',
          subtitle: 'Chat, call, email',
          icon: 'support-agent',
          color: '#10b981',
          route: '/contact-support',
          hasArrow: true
        },
        {
          id: 'feedback',
          title: 'Send Feedback',
          subtitle: 'Rate app, suggestions',
          icon: 'feedback',
          color: '#f59e0b',
          route: '/feedback',
          hasArrow: true
        },
        {
          id: 'about',
          title: 'About Finverse',
          subtitle: 'Version 2.1.0',
          icon: 'info-outline',
          color: '#6b7280',
          route: '/about',
          hasArrow: true
        }
      ]
    }
  ];

  // Quick stats data
  const quickStats = [
    {
      id: 'accounts',
      title: 'Active Accounts',
      value: '5',
      icon: 'account-balance-wallet',
      color: '#3b82f6',
      gradient: ['#3b82f6', '#1d4ed8']
    },
    {
      id: 'cards',
      title: 'Credit Cards',
      value: '3',
      icon: 'credit-card',
      color: '#10b981',
      gradient: ['#10b981', '#059669']
    },
    {
      id: 'score',
      title: 'Credit Score',
      value: '785',
      icon: 'trending-up',
      color: '#f59e0b',
      gradient: ['#f59e0b', '#d97706']
    },
    {
      id: 'rewards',
      title: 'Reward Points',
      value: '15.6K',
      icon: 'stars',
      color: '#8b5cf6',
      gradient: ['#8b5cf6', '#7c3aed']
    }
  ];

  const handleMenuItemPress = (item) => {
    if (item.route) {
      router.push(item.route);
    }
  };

  const handleLogout = () => {
    // Handle logout logic
    router.push('/login');
  };

  const renderQuickStat = ({ item }) => (
    <View className="flex-1 mx-1">
      <BlurView intensity={25} tint="light" style={styles.statCard}>
        <LinearGradient
          colors={item.gradient}
          style={styles.statIcon}
        >
          <MaterialIcons name={item.icon} size={24} color="white" />
        </LinearGradient>
        <Text className="font-inter-bold text-gray-900 text-lg mt-3">
          {item.value}
        </Text>
        <Text className="font-inter text-gray-500 text-xs text-center">
          {item.title}
        </Text>
      </BlurView>
    </View>
  );

  const renderMenuItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => handleMenuItemPress(item)}
      disabled={item.isToggle}
    >
      <BlurView intensity={20} tint="light" style={styles.menuItem}>
        <View className="flex-row items-center p-4">
          <View 
            className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
            style={{ backgroundColor: `${item.color}15` }}
          >
            <MaterialIcons name={item.icon} size={24} color={item.color} />
          </View>
          
          <View className="flex-1">
            <Text className="font-inter-semibold text-gray-900 text-base">
              {item.title}
            </Text>
            <Text className="font-inter text-gray-500 text-sm mt-0.5">
              {item.subtitle}
            </Text>
          </View>
          
          {item.isToggle ? (
            <Switch
              value={item.value}
              onValueChange={item.onToggle}
              trackColor={{ false: '#e5e7eb', true: item.color }}
              thumbColor={item.value ? 'white' : '#f3f4f6'}
              ios_backgroundColor="#e5e7eb"
            />
          ) : item.hasArrow && (
            <MaterialIcons name="chevron-right" size={20} color="#9ca3af" />
          )}
        </View>
      </BlurView>
    </TouchableOpacity>
  );

  const renderSection = (section) => (
    <View key={section.title} className="mb-8">
      <Text className="font-inter-bold text-gray-900 text-lg px-6 mb-4">
        {section.title}
      </Text>
      <View className="px-4 space-y-2">
        {section.items.map((item, index) => (
          <View key={item.id} className="mb-2">
            {renderMenuItem({ item })}
          </View>
        ))}
      </View>
    </View>
  );

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
                  Profile
                </Text>
                <Text className="font-inter text-gray-500 text-base">
                  Manage your account settings
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => router.push('/edit-profile')}
              >
                <BlurView intensity={20} tint="light" style={styles.headerButton}>
                  <MaterialIcons name="edit" size={22} color="#374151" />
                </BlurView>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Profile Card */}
          <Animated.View
            className="mx-4 mb-8"
            style={[
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
          >
            <BlurView intensity={30} tint="light" style={styles.profileCard}>
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.profileGradient}
              >
                <View className="p-6">
                  <View className="flex-row items-center mb-6">
                    <View className="relative">
                      <Image 
                        source={{ uri: userProfile.avatar }} 
                        className="w-20 h-20 rounded-full border-4 border-white" 
                      />
                      <View className="absolute -bottom-1 -right-1">
                        <View className="w-6 h-6 bg-green-500 rounded-full border-2 border-white items-center justify-center">
                          <MaterialIcons name="verified" size={14} color="white" />
                        </View>
                      </View>
                    </View>
                    
                    <View className="ml-4 flex-1">
                      <Text className="font-inter-bold text-white text-xl">
                        {userProfile.name}
                      </Text>
                      <Text className="font-inter text-white opacity-90 text-sm">
                        {userProfile.accountType}
                      </Text>
                      <View className="flex-row items-center mt-2">
                        <MaterialIcons name="security" size={16} color="rgba(255,255,255,0.8)" />
                        <Text className="font-inter text-white opacity-80 text-xs ml-1">
                          {userProfile.securityLevel} Security
                        </Text>
                      </View>
                    </View>
                    
                    <View className="items-end">
                      <View className="bg-opacity-20 px-3 py-2 rounded-xl">
                        <Text className="font-inter-semibold text-white text-xs">
                          Customer Since
                        </Text>
                        <Text className="font-inter-bold text-white text-sm">
                          {userProfile.customerSince}
                        </Text>
                      </View>
                    </View>
                  </View>
                  
                  <View className="bg-opacity-20 rounded-2xl p-4">
                    <View className="flex-row justify-between items-center mb-2">
                      <Text className="font-inter text-white opacity-80 text-sm">
                        Email
                      </Text>
                      <Text className="font-inter-semibold text-white text-sm">
                        {userProfile.email}
                      </Text>
                    </View>
                    <View className="flex-row justify-between items-center mb-2">
                      <Text className="font-inter text-white opacity-80 text-sm">
                        Phone
                      </Text>
                      <Text className="font-inter-semibold text-white text-sm">
                        {userProfile.phone}
                      </Text>
                    </View>
                    <View className="flex-row justify-between items-center">
                      <Text className="font-inter text-white opacity-80 text-sm">
                        Last Login
                      </Text>
                      <Text className="font-inter-semibold text-white text-sm">
                        {userProfile.lastLogin}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Shimmer Effect */}
                <Animated.View
                  style={[
                    styles.profileShimmer,
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
            </BlurView>
          </Animated.View>

          {/* Quick Stats */}
          <Animated.View
            className="mb-8"
            style={[
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
          >
            <Text className="font-inter-bold text-gray-900 text-lg px-6 mb-4">
              Quick Overview
            </Text>
            <FlatList
              data={quickStats}
              renderItem={renderQuickStat}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
            />
          </Animated.View>

          {/* Menu Sections */}
          <Animated.View
            style={[
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
          >
            {profileSections.map(renderSection)}
          </Animated.View>

          {/* Logout Section */}
          <Animated.View
            className="mx-4 mt-4 mb-8"
            style={[
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleLogout}
            >
              <BlurView intensity={25} tint="light" style={styles.logoutButton}>
                <View className="flex-row items-center justify-center p-4">
                  <MaterialIcons name="logout" size={24} color="#ef4444" />
                  <Text className="font-inter-semibold text-red-500 text-lg ml-3">
                    Sign Out
                  </Text>
                </View>
              </BlurView>
            </TouchableOpacity>
          </Animated.View>

          {/* App Info */}
          <Animated.View
            className="items-center mb-8"
            style={[
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
          >
            <Text className="font-inter text-gray-400 text-sm">
              Finverse Banking App
            </Text>
            <Text className="font-inter text-gray-400 text-xs mt-1">
              Version 2.1.0 • Build 2025.01.04
            </Text>
            <View className="flex-row items-center mt-2">
              <MaterialIcons name="security" size={16} color="#10b981" />
              <Text className="font-inter text-gray-400 text-xs ml-1">
                Bank-grade security • FDIC Insured
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Profile;

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
  profileCard: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  profileGradient: {
    borderRadius: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  profileShimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 100,
  },
  shimmer: {
    flex: 1,
    width: '100%',
  },
  statCard: {
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItem: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  logoutButton: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },
});