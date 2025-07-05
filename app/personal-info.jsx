import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
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

const { width, height } = Dimensions.get('window');

const PersonalInfo = () => {
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const shimmerPosition = useRef(new Animated.Value(-200)).current;
  
  // State management
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Form data
  const [formData, setFormData] = useState({
    firstName: "Sarah",
    lastName: "Johnson",
    middleName: "Marie",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    dateOfBirth: "1990-03-15",
    ssn: "***-**-4567",
    address: "123 Financial District",
    city: "New York",
    state: "NY",
    zipCode: "10004",
    country: "United States",
    occupation: "Software Engineer",
    employer: "Tech Innovations Inc",
    annualIncome: "85000",
    citizenship: "US Citizen",
    maritalStatus: "Single"
  });

  const [originalData, setOriginalData] = useState({ ...formData });

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

  // Form sections
  const formSections = [
    {
      title: "Basic Information",
      icon: "person",
      color: "#3b82f6",
      fields: [
        { key: 'firstName', label: 'First Name', type: 'text', required: true },
        { key: 'middleName', label: 'Middle Name', type: 'text', required: false },
        { key: 'lastName', label: 'Last Name', type: 'text', required: true },
        { key: 'dateOfBirth', label: 'Date of Birth', type: 'date', required: true },
        { key: 'ssn', label: 'Social Security Number', type: 'ssn', required: true, secure: true },
      ]
    },
    {
      title: "Contact Information",
      icon: "contact-mail",
      color: "#10b981",
      fields: [
        { key: 'email', label: 'Email Address', type: 'email', required: true },
        { key: 'phone', label: 'Phone Number', type: 'phone', required: true },
      ]
    },
    {
      title: "Address Information",
      icon: "location-on",
      color: "#f59e0b",
      fields: [
        { key: 'address', label: 'Street Address', type: 'text', required: true },
        { key: 'city', label: 'City', type: 'text', required: true },
        { key: 'state', label: 'State', type: 'text', required: true },
        { key: 'zipCode', label: 'ZIP Code', type: 'text', required: true },
        { key: 'country', label: 'Country', type: 'text', required: true },
      ]
    },
    {
      title: "Employment & Financial",
      icon: "work",
      color: "#8b5cf6",
      fields: [
        { key: 'occupation', label: 'Occupation', type: 'text', required: true },
        { key: 'employer', label: 'Employer', type: 'text', required: true },
        { key: 'annualIncome', label: 'Annual Income', type: 'currency', required: true },
      ]
    },
    {
      title: "Additional Information",
      icon: "info",
      color: "#ef4444",
      fields: [
        { key: 'citizenship', label: 'Citizenship Status', type: 'text', required: true },
        { key: 'maritalStatus', label: 'Marital Status', type: 'text', required: true },
      ]
    }
  ];

  // Validation rules
  const validateField = (key, value) => {
    const field = formSections.flatMap(s => s.fields).find(f => f.key === key);
    if (!field) return '';

    if (field.required && (!value || value.trim() === '')) {
      return `${field.label} is required`;
    }

    switch (field.type) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value)) {
          return 'Please enter a valid email address';
        }
        break;
      case 'phone':
        const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
        if (value && !phoneRegex.test(value)) {
          return 'Please enter a valid phone number';
        }
        break;
      case 'currency':
        if (value && isNaN(Number(value.replace(/[,$]/g, '')))) {
          return 'Please enter a valid amount';
        }
        break;
    }
    return '';
  };

  const validateForm = () => {
    const newErrors = {};
    formSections.forEach(section => {
      section.fields.forEach(field => {
        const error = validateField(field.key, formData[field.key]);
        if (error) {
          newErrors[field.key] = error;
        }
      });
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    
    // Clear error when user starts typing
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setOriginalData({ ...formData });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({ ...originalData });
    setErrors({});
  };

  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please correct the errors before saving.');
      return;
    }

    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
      setOriginalData({ ...formData });
      Alert.alert('Success', 'Your personal information has been updated successfully.');
    }, 2000);
  };

  const formatDisplayValue = (field, value) => {
    if (field.secure && !isEditing) {
      return value; // Already masked in state
    }
    
    switch (field.type) {
      case 'currency':
        if (value && !isNaN(Number(value.replace(/[,$]/g, '')))) {
          return `$${Number(value.replace(/[,$]/g, '')).toLocaleString()}`;
        }
        return value;
      case 'date':
        if (value) {
          return new Date(value).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
        }
        return value;
      default:
        return value;
    }
  };

  const renderField = (field) => {
    const hasError = errors[field.key];
    const displayValue = isEditing ? formData[field.key] : formatDisplayValue(field, formData[field.key]);

    return (
      <View key={field.key} className="mb-6">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="font-inter-semibold text-gray-700 text-sm">
            {field.label}
            {field.required && <Text className="text-red-500"> *</Text>}
          </Text>
          {field.secure && (
            <View className="flex-row items-center">
              <MaterialIcons name="security" size={14} color="#6b7280" />
              <Text className="font-inter text-gray-500 text-xs ml-1">Secure</Text>
            </View>
          )}
        </View>

        {isEditing ? (
          <BlurView intensity={20} tint="light" style={[styles.inputContainer, hasError && styles.inputError]}>
            <TextInput
              value={formData[field.key]}
              onChangeText={(value) => handleInputChange(field.key, value)}
              placeholder={field.label}
              placeholderTextColor="#9ca3af"
              keyboardType={
                field.type === 'email' ? 'email-address' :
                field.type === 'phone' ? 'phone-pad' :
                field.type === 'currency' ? 'numeric' : 'default'
              }
              secureTextEntry={field.type === 'ssn'}
              className="font-inter text-gray-900 text-base p-4"
              autoCapitalize={field.type === 'email' ? 'none' : 'words'}
            />
          </BlurView>
        ) : (
          <BlurView intensity={15} tint="light" style={styles.displayContainer}>
            <View className="p-4">
              <Text className="font-inter text-gray-900 text-base">
                {displayValue || 'Not provided'}
              </Text>
            </View>
          </BlurView>
        )}

        {hasError && (
          <View className="flex-row items-center mt-2">
            <MaterialIcons name="error-outline" size={16} color="#ef4444" />
            <Text className="font-inter text-red-500 text-sm ml-1">
              {hasError}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderSection = (section) => (
    <Animated.View
      key={section.title}
      className="mb-8"
      style={[
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
      ]}
    >
      <BlurView intensity={25} tint="light" style={styles.sectionContainer}>
        <View className="p-6">
          {/* Section Header */}
          <View className="flex-row items-center mb-6">
            <View 
              className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
              style={{ backgroundColor: `${section.color}15` }}
            >
              <MaterialIcons name={section.icon} size={24} color={section.color} />
            </View>
            <View>
              <Text className="font-inter-bold text-gray-900 text-lg">
                {section.title}
              </Text>
              <Text className="font-inter text-gray-500 text-sm">
                {isEditing ? 'Edit your information' : 'View your information'}
              </Text>
            </View>
          </View>

          {/* Section Fields */}
          {section.fields.map(renderField)}
        </View>
      </BlurView>
    </Animated.View>
  );

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
                      onPress={() => router.back()}
                    >
                      <BlurView intensity={20} tint="light" style={styles.headerButton}>
                        <MaterialIcons name="arrow-back" size={22} color="#374151" />
                      </BlurView>
                    </TouchableOpacity>
                    
                    <View className="items-center">
                      <Text className="font-inter-bold text-gray-900 text-lg">
                        Personal Information
                      </Text>
                      <Text className="font-inter text-gray-500 text-sm">
                        {isEditing ? 'Edit Mode' : 'View Mode'}
                      </Text>
                    </View>

                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={isEditing ? handleCancel : handleEdit}
                    >
                      <BlurView intensity={20} tint="light" style={styles.headerButton}>
                        <MaterialIcons 
                          name={isEditing ? "close" : "edit"} 
                          size={22} 
                          color="#374151" 
                        />
                      </BlurView>
                    </TouchableOpacity>
                  </View>
                </BlurView>
              </Animated.View>

              {/* Content */}
              <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ 
                  paddingBottom: Platform.OS === 'ios' ? 120 : 105,
                  paddingTop: 20 
                }}
              >
                {/* Profile Summary */}
                <Animated.View
                  className="mx-4 mb-8"
                  style={[
                    { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
                  ]}
                >
                  <BlurView intensity={30} tint="light" style={styles.profileSummary}>
                    <LinearGradient
                      colors={['#667eea', '#764ba2']}
                      style={styles.profileGradient}
                    >
                      <View className="p-6">
                        <View className="flex-row items-center">
                          <Image 
                            source={{ uri: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300" }} 
                            className="w-16 h-16 rounded-full border-3 border-white mr-4" 
                          />
                          <View className="flex-1">
                            <Text className="font-inter-bold text-white text-xl">
                              {formData.firstName} {formData.lastName}
                            </Text>
                            <Text className="font-inter text-white opacity-90 text-sm">
                              {formData.email}
                            </Text>
                            <View className="flex-row items-center mt-2">
                              <MaterialIcons name="verified-user" size={16} color="rgba(255,255,255,0.8)" />
                              <Text className="font-inter text-white opacity-80 text-xs ml-1">
                                Verified Account
                              </Text>
                            </View>
                          </View>
                          {isEditing && (
                            <View className="bg-opacity-20 px-3 py-2 rounded-xl">
                              <Text className="font-inter-semibold text-white text-xs">
                                Editing
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                    </LinearGradient>
                  </BlurView>
                </Animated.View>

                {/* Form Sections */}
                <View className="px-4">
                  {formSections.map(renderSection)}
                </View>

                {/* Security Notice */}
                {isEditing && (
                  <Animated.View
                    className="mx-4 mb-6"
                    style={[
                      { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
                    ]}
                  >
                    <BlurView intensity={15} tint="light" style={styles.securityNotice}>
                      <View className="flex-row p-4">
                        <MaterialIcons name="security" size={20} color="#10b981" />
                        <View className="ml-3 flex-1">
                          <Text className="font-inter-semibold text-gray-900 text-sm">
                            Secure Information Update
                          </Text>
                          <Text className="font-inter text-gray-600 text-xs mt-1">
                            All changes are encrypted and logged for security purposes
                          </Text>
                        </View>
                      </View>
                    </BlurView>
                  </Animated.View>
                )}
              </ScrollView>

              {/* Bottom Actions */}
              {isEditing && !showKeyboard && (
                <View className="absolute bottom-0 left-0 right-0" style={{ paddingBottom: Platform.OS === 'ios' ? 100 : 85 }}>
                  <Animated.View
                    className="px-6 pb-6 bg-gray-50"
                    style={[
                      { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
                    ]}
                  >
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={handleSave}
                      disabled={isSaving}
                    >
                      <BlurView intensity={40} tint="light" style={styles.saveButton}>
                        <LinearGradient
                          colors={['#10b981', '#059669']}
                          style={styles.saveButtonGradient}
                        >
                          {isSaving ? (
                            <View className="flex-row items-center">
                              <MaterialIcons name="hourglass-empty" size={20} color="white" />
                              <Text className="font-inter-semibold text-white text-lg ml-2">
                                Saving...
                              </Text>
                            </View>
                          ) : (
                            <View className="flex-row items-center">
                              <MaterialIcons name="save" size={20} color="white" />
                              <Text className="font-inter-semibold text-white text-lg ml-2">
                                Save Changes
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

export default PersonalInfo;

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
  profileSummary: {
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
  sectionContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  inputContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  inputError: {
    borderColor: '#ef4444',
    borderWidth: 2,
  },
  displayContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  securityNotice: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
  },
  saveButton: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  saveButtonGradient: {
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