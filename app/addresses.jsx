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
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const Addresses = () => {
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const shimmerPosition = useRef(new Animated.Value(-200)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  // State management
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

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

    // Continuous animations
    const shimmerAnimation = Animated.loop(
      Animated.timing(shimmerPosition, {
        toValue: 300,
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

    animationSequence.start();
    shimmerAnimation.start();
    pulseAnimation.start();

    return () => {
      shimmerAnimation.stop();
      pulseAnimation.stop();
    };
  }, []);

  // Enhanced addresses data with real-world examples
  const addresses = [
    {
      id: 1,
      type: "Home",
      label: "Primary Residence",
      street: "2847 Sunset Boulevard",
      apartment: "Apt 4B",
      city: "Los Angeles",
      state: "California",
      zipCode: "90026",
      country: "United States",
      isPrimary: true,
      isVerified: true,
      lastUpdated: "2024-12-15",
      icon: "home",
      color: "#3b82f6",
      gradient: ["#3b82f6", "#1d4ed8"],
      mapUrl: "https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg?auto=compress&cs=tinysrgb&w=400",
      usedForServices: ["Banking", "Tax Documents", "Credit Cards"]
    },
    {
      id: 2,
      type: "Billing",
      label: "Billing Address",
      street: "1892 Financial District",
      apartment: "Suite 2100",
      city: "New York",
      state: "New York",
      zipCode: "10004",
      country: "United States",
      isPrimary: false,
      isVerified: true,
      lastUpdated: "2024-11-28",
      icon: "receipt-long",
      color: "#10b981",
      gradient: ["#10b981", "#059669"],
      mapUrl: "https://images.pexels.com/photos/2070975/pexels-photo-2070975.jpeg?auto=compress&cs=tinysrgb&w=400",
      usedForServices: ["Credit Card Bills", "Statements"]
    },
    {
      id: 3,
      type: "Office",
      label: "Work Address",
      street: "5600 Innovation Drive",
      apartment: "Floor 12",
      city: "Austin",
      state: "Texas",
      zipCode: "78731",
      country: "United States",
      isPrimary: false,
      isVerified: false,
      lastUpdated: "2024-10-22",
      icon: "business",
      color: "#f59e0b",
      gradient: ["#f59e0b", "#d97706"],
      mapUrl: "https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg?auto=compress&cs=tinysrgb&w=400",
      usedForServices: ["Business Account", "Payroll"]
    },
    {
      id: 4,
      type: "Secondary",
      label: "Vacation Home",
      street: "789 Ocean View Drive",
      apartment: "",
      city: "Miami Beach",
      state: "Florida",
      zipCode: "33139",
      country: "United States",
      isPrimary: false,
      isVerified: true,
      lastUpdated: "2024-09-10",
      icon: "beach-access",
      color: "#8b5cf6",
      gradient: ["#8b5cf6", "#7c3aed"],
      mapUrl: "https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg?auto=compress&cs=tinysrgb&w=400",
      usedForServices: ["Secondary Banking"]
    }
  ];

  // Address management actions
  const addressActions = [
    {
      id: 'add',
      title: 'Add Address',
      subtitle: 'New location',
      icon: 'add-location',
      color: '#3b82f6',
      gradient: ['#3b82f6', '#1d4ed8'],
      action: () => router.push('/add-address')
    },
    {
      id: 'verify',
      title: 'Verify Address',
      subtitle: 'Confirm location',
      icon: 'verified',
      color: '#10b981',
      gradient: ['#10b981', '#059669'],
      action: () => handleVerifyAddress()
    },
    {
      id: 'map',
      title: 'Map View',
      subtitle: 'See locations',
      icon: 'map',
      color: '#f59e0b',
      gradient: ['#f59e0b', '#d97706'],
      action: () => router.push('/address-map')
    },
    {
      id: 'import',
      title: 'Import',
      subtitle: 'From contacts',
      icon: 'import-contacts',
      color: '#8b5cf6',
      gradient: ['#8b5cf6', '#7c3aed'],
      action: () => handleImportAddress()
    }
  ];

  const handleAddressSelect = (address) => {
    setSelectedAddress(address.id === selectedAddress ? null : address.id);
  };

  const handleSetPrimary = (addressId) => {
    Alert.alert(
      "Set Primary Address",
      "Are you sure you want to set this as your primary address? This will be used for all official communications.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Confirm", onPress: () => {
          Alert.alert("Success", "Primary address updated successfully!");
        }}
      ]
    );
  };

  const handleEditAddress = (address) => {
    router.push(`/edit-address/${address.id}`);
  };

  const handleDeleteAddress = (address) => {
    if (address.isPrimary) {
      Alert.alert("Cannot Delete", "You cannot delete your primary address. Please set another address as primary first.");
      return;
    }
    
    Alert.alert(
      "Delete Address",
      `Are you sure you want to delete this address?\n\n${address.street}, ${address.city}`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: () => {
            Alert.alert("Deleted", "Address has been removed successfully.");
          }
        }
      ]
    );
  };

  const handleVerifyAddress = () => {
    Alert.alert(
      "Address Verification",
      "We'll send a verification code to your selected address. This may take 5-7 business days.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Send Verification", onPress: () => {
          Alert.alert("Verification Sent", "A verification code has been mailed to your address.");
        }}
      ]
    );
  };

  const handleImportAddress = () => {
    Alert.alert(
      "Import from Contacts",
      "This will allow Finverse to access your contacts to import addresses. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Allow Access", onPress: () => {
          Alert.alert("Feature Coming Soon", "Contact import feature will be available in the next update.");
        }}
      ]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const renderAddressAction = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={item.action}
      className="flex-1 mx-1"
    >
      <BlurView intensity={25} tint="light" style={styles.actionCard}>
        <LinearGradient
          colors={item.gradient}
          style={styles.actionIcon}
        >
          <MaterialIcons name={item.icon} size={22} color="white" />
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

  const renderAddress = ({ item }) => {
    const isSelected = selectedAddress === item.id;
    
    return (
      <Animated.View
        style={[
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: isSelected ? pulseAnim : 1 }
            ],
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => handleAddressSelect(item)}
          className="mb-4"
        >
          <BlurView 
            intensity={isSelected ? 35 : 25} 
            tint="light" 
            style={[
              styles.addressCard,
              isSelected && styles.selectedAddressCard
            ]}
          >
            <LinearGradient
              colors={isSelected ? item.gradient : ['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
              style={styles.addressGradient}
            >
              <View className="p-6">
                {/* Address Header */}
                <View className="flex-row items-center justify-between mb-4">
                  <View className="flex-row items-center">
                    <View 
                      className="w-14 h-14 rounded-2xl items-center justify-center mr-4"
                      style={{ backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : `${item.color}15` }}
                    >
                      <MaterialIcons 
                        name={item.icon} 
                        size={28} 
                        color={isSelected ? 'white' : item.color} 
                      />
                    </View>
                    <View>
                      <View className="flex-row items-center">
                        <Text 
                          className={`font-inter-bold text-xl ${
                            isSelected ? 'text-white' : 'text-gray-900'
                          }`}
                        >
                          {item.type}
                        </Text>
                        {item.isPrimary && (
                          <View className="bg-orange-500 px-2 py-1 rounded-full ml-2">
                            <Text className="font-inter-bold text-white text-xs">
                              Primary
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text 
                        className={`font-inter text-base ${
                          isSelected ? 'text-white opacity-90' : 'text-gray-500'
                        }`}
                      >
                        {item.label}
                      </Text>
                    </View>
                  </View>
                  
                  {/* Status Indicators */}
                  <View className="items-end">
                    <View className="flex-row items-center space-x-2">
                      {item.isVerified ? (
                        <View className="bg-green-500 px-2 py-1 rounded-full">
                          <Text className="font-inter-semibold text-white text-xs">
                            Verified
                          </Text>
                        </View>
                      ) : (
                        <View className="bg-yellow-500 px-2 py-1 rounded-full">
                          <Text className="font-inter-semibold text-white text-xs">
                            Pending
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text 
                      className={`font-inter text-xs mt-2 ${
                        isSelected ? 'text-white opacity-80' : 'text-gray-400'
                      }`}
                    >
                      Updated: {new Date(item.lastUpdated).toLocaleDateString()}
                    </Text>
                  </View>
                </View>

                {/* Address Details */}
                <View className="mb-4">
                  <Text 
                    className={`font-inter-semibold text-lg ${
                      isSelected ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {item.street}
                    {item.apartment && `, ${item.apartment}`}
                  </Text>
                  <Text 
                    className={`font-inter text-base mt-1 ${
                      isSelected ? 'text-white opacity-90' : 'text-gray-600'
                    }`}
                  >
                    {item.city}, {item.state} {item.zipCode}
                  </Text>
                  <Text 
                    className={`font-inter text-base ${
                      isSelected ? 'text-white opacity-80' : 'text-gray-500'
                    }`}
                  >
                    {item.country}
                  </Text>
                </View>

                {/* Services Used */}
                <View className="mb-4">
                  <Text 
                    className={`font-inter-semibold text-sm mb-2 ${
                      isSelected ? 'text-white opacity-90' : 'text-gray-700'
                    }`}
                  >
                    Used for:
                  </Text>
                  <View className="flex-row flex-wrap">
                    {item.usedForServices.map((service, index) => (
                      <View 
                        key={index}
                        className={`px-3 py-1 rounded-full mr-2 mb-2 ${
                          isSelected ? 'bg-opacity-20' : 'bg-gray-100'
                        }`}
                      >
                        <Text 
                          className={`font-inter text-xs ${
                            isSelected ? 'text-white' : 'text-gray-600'
                          }`}
                        >
                          {service}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Action Buttons */}
                <View className="flex-row justify-between items-center">
                  <View className="flex-row space-x-3">
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => handleEditAddress(item)}
                      className={`flex-row items-center px-4 py-2 rounded-xl ${
                        isSelected ? 'bg-opacity-20' : 'bg-blue-50'
                      }`}
                    >
                      <MaterialIcons 
                        name="edit" 
                        size={16} 
                        color={isSelected ? 'white' : '#3b82f6'} 
                      />
                      <Text 
                        className={`font-inter-medium text-sm ml-1 ${
                          isSelected ? 'text-white' : 'text-blue-600'
                        }`}
                      >
                        Edit
                      </Text>
                    </TouchableOpacity>
                    
                    {!item.isPrimary && (
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => handleSetPrimary(item.id)}
                        className={`flex-row items-center px-4 py-2 rounded-xl ${
                          isSelected ? 'bg-opacity-20' : 'bg-green-50'
                        }`}
                      >
                        <MaterialIcons 
                          name="star-outline" 
                          size={16} 
                          color={isSelected ? 'white' : '#10b981'} 
                        />
                        <Text 
                          className={`font-inter-medium text-sm ml-1 ${
                            isSelected ? 'text-white' : 'text-green-600'
                          }`}
                        >
                          Set Primary
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => handleDeleteAddress(item)}
                    disabled={item.isPrimary}
                    className={`p-2 rounded-xl ${
                      item.isPrimary ? 'opacity-50' : ''
                    } ${isSelected ? 'bg-opacity-20' : 'bg-red-50'}`}
                  >
                    <MaterialIcons 
                      name="delete-outline" 
                      size={16} 
                      color={isSelected ? 'white' : '#ef4444'} 
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Enhanced Shimmer Effect */}
              {isSelected && (
                <Animated.View
                  style={[
                    styles.addressShimmer,
                    { transform: [{ translateX: shimmerPosition }] },
                  ]}
                >
                  <LinearGradient
                    colors={[
                      "transparent",
                      "rgba(255,255,255,0.3)",
                      "transparent",
                    ]}
                    style={styles.shimmer}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  />
                </Animated.View>
              )}

              {/* Decorative Elements */}
              {isSelected && (
                <>
                  <View style={styles.decorativeCircle1} />
                  <View style={styles.decorativeCircle2} />
                </>
              )}
            </LinearGradient>
          </BlurView>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <LinearGradient
        colors={['#f8fafc', '#f1f5f9']}
        className="flex-1"
      >
        {/* Enhanced Header */}
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
              <View className="flex-row items-center justify-between px-6 py-4">
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => router.back()}
                >
                  <BlurView intensity={25} tint="light" style={styles.headerButton}>
                    <MaterialIcons name="arrow-back" size={22} color="#374151" />
                  </BlurView>
                </TouchableOpacity>
                
                <View className="items-center">
                  <Text className="font-inter-bold text-gray-900 text-xl">
                    My Addresses
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <MaterialIcons name="location-on" size={16} color="#3b82f6" />
                    <Text className="font-inter-medium text-gray-600 text-sm ml-1">
                      {addresses.length} saved locations
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => router.push('/add-address')}
                >
                  <BlurView intensity={25} tint="light" style={styles.headerButton}>
                    <MaterialIcons name="add" size={22} color="#374151" />
                  </BlurView>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </BlurView>
        </Animated.View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ 
            paddingBottom: Platform.OS === 'ios' ? 100 : 85,
            paddingTop: 20 
          }}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              tintColor="#3b82f6"
            />
          }
        >
          {/* Quick Actions */}
          <Animated.View
            className="mb-8"
            style={[
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
          >
            <Text className="font-inter-bold text-gray-900 text-lg px-6 mb-4">
              Quick Actions
            </Text>
            <FlatList
              data={addressActions}
              renderItem={renderAddressAction}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
            />
          </Animated.View>

          {/* Address Summary Card */}
          <Animated.View
            className="mx-4 mb-8"
            style={[
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
          >
            <BlurView intensity={30} tint="light" style={styles.summaryCard}>
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.summaryGradient}
              >
                <View className="p-6">
                  <View className="flex-row items-center justify-between mb-4">
                    <View>
                      <Text className="font-inter-bold text-white text-xl">
                        Address Overview
                      </Text>
                      <Text className="font-inter text-white opacity-90 text-sm">
                        Manage your saved locations
                      </Text>
                    </View>
                    <View className=" bg-opacity-20 p-3 rounded-2xl">
                      <MaterialIcons name="location-city" size={24} color="white" />
                    </View>
                  </View>
                  
                  <View className="flex-row justify-between">
                    <View className="items-center">
                      <Text className="font-inter-bold text-white text-2xl">
                        {addresses.length}
                      </Text>
                      <Text className="font-inter text-white opacity-80 text-xs">
                        Total Addresses
                      </Text>
                    </View>
                    <View className="items-center">
                      <Text className="font-inter-bold text-white text-2xl">
                        {addresses.filter(addr => addr.isVerified).length}
                      </Text>
                      <Text className="font-inter text-white opacity-80 text-xs">
                        Verified
                      </Text>
                    </View>
                    <View className="items-center">
                      <Text className="font-inter-bold text-white text-2xl">
                        1
                      </Text>
                      <Text className="font-inter text-white opacity-80 text-xs">
                        Primary
                      </Text>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </BlurView>
          </Animated.View>

          {/* Addresses List */}
          <View className="px-4">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="font-inter-bold text-gray-900 text-lg">
                Saved Addresses
              </Text>
              <TouchableOpacity 
                activeOpacity={0.7}
                onPress={() => Alert.alert("Sort Options", "Feature coming soon!")}
              >
                <View className="flex-row items-center">
                  <MaterialIcons name="sort" size={16} color="#6b7280" />
                  <Text className="font-inter-medium text-gray-500 text-sm ml-1">
                    Sort
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={addresses}
              renderItem={renderAddress}
              scrollEnabled={false}
            />
          </View>

          {/* Help Section */}
          <Animated.View
            className="mx-4 mt-4"
            style={[
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
          >
            <BlurView intensity={20} tint="light" style={styles.helpCard}>
              <View className="p-4">
                <View className="flex-row items-center mb-3">
                  <MaterialIcons name="help-outline" size={20} color="#3b82f6" />
                  <Text className="font-inter-semibold text-gray-900 text-base ml-2">
                    Address Management Tips
                  </Text>
                </View>
                <Text className="font-inter text-gray-600 text-sm leading-5">
                  • Keep your primary address updated for important banking communications
                  {'\n'}• Verify new addresses to ensure secure delivery
                  {'\n'}• Use different addresses for different banking services as needed
                  {'\n'}• Contact support if you need help with address verification
                </Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => router.push('/contact-support')}
                  className="mt-4"
                >
                  <View className="flex-row items-center">
                    <MaterialIcons name="support-agent" size={16} color="#3b82f6" />
                    <Text className="font-inter-semibold text-blue-600 text-sm ml-1">
                      Get Help
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </BlurView>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Addresses;

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

  // Action Card Styles
  actionCard: {
    borderRadius: 18,
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

  // Enhanced Address Card Styles
  addressCard: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  selectedAddressCard: {
    borderColor: '#3b82f6',
    borderWidth: 2,
  },
  addressGradient: {
    borderRadius: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  addressShimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 120,
  },
  shimmer: {
    flex: 1,
    width: '100%',
  },
  decorativeCircle1: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: -30,
    left: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },

  // Help Card Styles
  helpCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
});