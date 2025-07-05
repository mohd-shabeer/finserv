import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
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
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const EditProfilePage = () => {
  const [activeSection, setActiveSection] = useState('personal');
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Personal Information
  const [firstName, setFirstName] = useState('Sarah');
  const [lastName, setLastName] = useState('Johnson');
  const [email, setEmail] = useState('sarah.johnson@email.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [dateOfBirth, setDateOfBirth] = useState('15/03/1992');
  const [gender, setGender] = useState('Female');
  const [profileImage, setProfileImage] = useState('https://images.pexels.com/photos/3307758/pexels-photo-3307758.jpeg');

  // Address Information
  const [addressLine1, setAddressLine1] = useState('123 MG Road');
  const [addressLine2, setAddressLine2] = useState('Koramangala');
  const [city, setCity] = useState('Bangalore');
  const [state, setState] = useState('Karnataka');
  const [pincode, setPincode] = useState('560034');
  const [country, setCountry] = useState('India');

  // Professional Information
  const [occupation, setOccupation] = useState('Software Engineer');
  const [company, setCompany] = useState('Tech Innovations Pvt Ltd');
  const [annualIncome, setAnnualIncome] = useState('₹12,00,000');
  const [workExperience, setWorkExperience] = useState('5 years');

  // Emergency Contact
  const [emergencyName, setEmergencyName] = useState('John Johnson');
  const [emergencyRelation, setEmergencyRelation] = useState('Brother');
  const [emergencyPhone, setEmergencyPhone] = useState('+91 98765 43211');

  const animatedValue = useSharedValue(0);
  const modalScale = useSharedValue(0);

  useEffect(() => {
    animatedValue.value = withSpring(1);
  }, []);

  const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say'];
  const relationshipOptions = ['Spouse', 'Parent', 'Child', 'Sibling', 'Friend', 'Other'];

  const profileSections = [
    {
      id: 'personal',
      name: 'Personal',
      icon: 'person-outline',
      color: '#3b82f6'
    },
    {
      id: 'address',
      name: 'Address',
      icon: 'location-outline',
      color: '#10b981'
    },
    {
      id: 'professional',
      name: 'Work',
      icon: 'briefcase-outline',
      color: '#f59e0b'
    },
    {
      id: 'emergency',
      name: 'Emergency',
      icon: 'medical-outline',
      color: '#ef4444'
    }
  ];

  const handleSaveProfile = () => {
    // Validate required fields
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim()) {
      Alert.alert('Validation Error', 'Please fill in all required fields.');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address.');
      return;
    }

    // Phone validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      Alert.alert('Validation Error', 'Please enter a valid phone number.');
      return;
    }

    setHasUnsavedChanges(false);
    Alert.alert(
      'Profile Updated',
      'Your profile has been successfully updated.',
      [{ text: 'OK' }]
    );
  };

  const handleImagePicker = () => {
    setShowImagePicker(true);
    modalScale.value = withSpring(1);
  };

  const closeImagePicker = () => {
    modalScale.value = withTiming(0, { duration: 200 });
    setTimeout(() => {
      setShowImagePicker(false);
    }, 200);
  };

  const selectImageOption = (option) => {
    closeImagePicker();
    if (option === 'camera') {
      Alert.alert('Camera', 'Opening camera to take a new photo...');
    } else if (option === 'gallery') {
      Alert.alert('Gallery', 'Opening photo gallery...');
    } else if (option === 'remove') {
      setProfileImage('');
      setHasUnsavedChanges(true);
    }
  };

  const modalAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: modalScale.value }],
      opacity: modalScale.value,
    };
  });

  const renderPersonalSection = () => (
    <Animated.View entering={FadeInDown.springify()}>
      {/* Profile Picture */}
      <View className="bg-white rounded-2xl p-6 mb-6 border border-gray-100">
        <Text className="text-lg font-bold text-gray-800 mb-4">
          Profile Picture
        </Text>
        <View className="items-center">
          <TouchableOpacity onPress={handleImagePicker}>
            <View className="relative">
              {profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  className="w-24 h-24 rounded-full"
                />
              ) : (
                <View className="w-24 h-24 rounded-full bg-gray-200 items-center justify-center">
                  <Ionicons name="person" size={40} color="#9ca3af" />
                </View>
              )}
              <View className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 rounded-full items-center justify-center">
                <Ionicons name="camera" size={16} color="white" />
              </View>
            </View>
          </TouchableOpacity>
          <Text className="text-sm text-gray-600 mt-3 text-center">
            Tap to change profile picture
          </Text>
        </View>
      </View>

      {/* Basic Information */}
      <View className="bg-white rounded-2xl p-6 mb-6 border border-gray-100">
        <Text className="text-lg font-bold text-gray-800 mb-4">
          Basic Information
        </Text>
        
        <View className="space-y-4">
          <View className="flex-row space-x-3">
            <View className="flex-1">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                First Name *
              </Text>
              <TextInput
                value={firstName}
                onChangeText={(text) => {
                  setFirstName(text);
                  setHasUnsavedChanges(true);
                }}
                placeholder="Enter first name"
                className="bg-gray-50 rounded-xl p-4 text-base"
              />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </Text>
              <TextInput
                value={lastName}
                onChangeText={(text) => {
                  setLastName(text);
                  setHasUnsavedChanges(true);
                }}
                placeholder="Enter last name"
                className="bg-gray-50 rounded-xl p-4 text-base"
              />
            </View>
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </Text>
            <TextInput
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setHasUnsavedChanges(true);
              }}
              placeholder="Enter email address"
              keyboardType="email-address"
              autoCapitalize="none"
              className="bg-gray-50 rounded-xl p-4 text-base"
            />
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </Text>
            <TextInput
              value={phone}
              onChangeText={(text) => {
                setPhone(text);
                setHasUnsavedChanges(true);
              }}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
              className="bg-gray-50 rounded-xl p-4 text-base"
            />
          </View>

          <View className="flex-row space-x-3">
            <View className="flex-1">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </Text>
              <TextInput
                value={dateOfBirth}
                onChangeText={(text) => {
                  setDateOfBirth(text);
                  setHasUnsavedChanges(true);
                }}
                placeholder="DD/MM/YYYY"
                className="bg-gray-50 rounded-xl p-4 text-base"
              />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Gender
              </Text>
              <TouchableOpacity className="bg-gray-50 rounded-xl p-4">
                <View className="flex-row items-center justify-between">
                  <Text className="text-base text-gray-800">
                    {gender}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color="#9ca3af" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  );

  const renderAddressSection = () => (
    <Animated.View entering={FadeInDown.springify()}>
      <View className="bg-white rounded-2xl p-6 mb-6 border border-gray-100">
        <Text className="text-lg font-bold text-gray-800 mb-4">
          Residential Address
        </Text>
        
        <View className="space-y-4">
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Address Line 1 *
            </Text>
            <TextInput
              value={addressLine1}
              onChangeText={(text) => {
                setAddressLine1(text);
                setHasUnsavedChanges(true);
              }}
              placeholder="Street address, building name"
              className="bg-gray-50 rounded-xl p-4 text-base"
            />
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Address Line 2
            </Text>
            <TextInput
              value={addressLine2}
              onChangeText={(text) => {
                setAddressLine2(text);
                setHasUnsavedChanges(true);
              }}
              placeholder="Area, locality"
              className="bg-gray-50 rounded-xl p-4 text-base"
            />
          </View>

          <View className="flex-row space-x-3">
            <View className="flex-1">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                City *
              </Text>
              <TextInput
                value={city}
                onChangeText={(text) => {
                  setCity(text);
                  setHasUnsavedChanges(true);
                }}
                placeholder="Enter city"
                className="bg-gray-50 rounded-xl p-4 text-base"
              />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                State *
              </Text>
              <TextInput
                value={state}
                onChangeText={(text) => {
                  setState(text);
                  setHasUnsavedChanges(true);
                }}
                placeholder="Enter state"
                className="bg-gray-50 rounded-xl p-4 text-base"
              />
            </View>
          </View>

          <View className="flex-row space-x-3">
            <View className="flex-1">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                PIN Code *
              </Text>
              <TextInput
                value={pincode}
                onChangeText={(text) => {
                  setPincode(text);
                  setHasUnsavedChanges(true);
                }}
                placeholder="6-digit PIN code"
                keyboardType="numeric"
                maxLength={6}
                className="bg-gray-50 rounded-xl p-4 text-base"
              />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Country *
              </Text>
              <TouchableOpacity className="bg-gray-50 rounded-xl p-4">
                <View className="flex-row items-center justify-between">
                  <Text className="text-base text-gray-800">
                    {country}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color="#9ca3af" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  );

  const renderProfessionalSection = () => (
    <Animated.View entering={FadeInDown.springify()}>
      <View className="bg-white rounded-2xl p-6 mb-6 border border-gray-100">
        <Text className="text-lg font-bold text-gray-800 mb-4">
          Professional Information
        </Text>
        
        <View className="space-y-4">
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Occupation
            </Text>
            <TextInput
              value={occupation}
              onChangeText={(text) => {
                setOccupation(text);
                setHasUnsavedChanges(true);
              }}
              placeholder="Enter your occupation"
              className="bg-gray-50 rounded-xl p-4 text-base"
            />
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Company/Organization
            </Text>
            <TextInput
              value={company}
              onChangeText={(text) => {
                setCompany(text);
                setHasUnsavedChanges(true);
              }}
              placeholder="Enter company name"
              className="bg-gray-50 rounded-xl p-4 text-base"
            />
          </View>

          <View className="flex-row space-x-3">
            <View className="flex-1">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Annual Income
              </Text>
              <TextInput
                value={annualIncome}
                onChangeText={(text) => {
                  setAnnualIncome(text);
                  setHasUnsavedChanges(true);
                }}
                placeholder="Enter annual income"
                className="bg-gray-50 rounded-xl p-4 text-base"
              />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Work Experience
              </Text>
              <TextInput
                value={workExperience}
                onChangeText={(text) => {
                  setWorkExperience(text);
                  setHasUnsavedChanges(true);
                }}
                placeholder="Years of experience"
                className="bg-gray-50 rounded-xl p-4 text-base"
              />
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  );

  const renderEmergencySection = () => (
    <Animated.View entering={FadeInDown.springify()}>
      <View className="bg-white rounded-2xl p-6 mb-6 border border-gray-100">
        <Text className="text-lg font-bold text-gray-800 mb-4">
          Emergency Contact
        </Text>
        <Text className="text-sm text-gray-600 mb-4">
          This person will be contacted in case of emergency
        </Text>
        
        <View className="space-y-4">
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </Text>
            <TextInput
              value={emergencyName}
              onChangeText={(text) => {
                setEmergencyName(text);
                setHasUnsavedChanges(true);
              }}
              placeholder="Enter full name"
              className="bg-gray-50 rounded-xl p-4 text-base"
            />
          </View>

          <View className="flex-row space-x-3">
            <View className="flex-1">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Relationship *
              </Text>
              <TouchableOpacity className="bg-gray-50 rounded-xl p-4">
                <View className="flex-row items-center justify-between">
                  <Text className="text-base text-gray-800">
                    {emergencyRelation}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color="#9ca3af" />
                </View>
              </TouchableOpacity>
            </View>
            <View className="flex-1">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </Text>
              <TextInput
                value={emergencyPhone}
                onChangeText={(text) => {
                  setEmergencyPhone(text);
                  setHasUnsavedChanges(true);
                }}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
                className="bg-gray-50 rounded-xl p-4 text-base"
              />
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  );

  const renderImagePickerModal = () => (
    <Modal
      visible={showImagePicker}
      transparent={true}
      animationType="fade"
      onRequestClose={closeImagePicker}
    >
      <View className="flex-1 bg-black bg-opacity-50 justify-center items-center px-4">
        <Animated.View
          style={modalAnimatedStyle}
          className="bg-white rounded-3xl p-6 w-full max-w-sm"
        >
          <Text className="text-xl font-bold text-gray-800 text-center mb-6">
            Change Profile Picture
          </Text>

          <TouchableOpacity
            onPress={() => selectImageOption('camera')}
            className="flex-row items-center p-4 rounded-xl mb-3 bg-gray-50"
          >
            <Ionicons name="camera" size={24} color="#3b82f6" />
            <Text className="text-base font-medium text-gray-800 ml-3">
              Take Photo
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => selectImageOption('gallery')}
            className="flex-row items-center p-4 rounded-xl mb-3 bg-gray-50"
          >
            <Ionicons name="images" size={24} color="#10b981" />
            <Text className="text-base font-medium text-gray-800 ml-3">
              Choose from Gallery
            </Text>
          </TouchableOpacity>

          {profileImage && (
            <TouchableOpacity
              onPress={() => selectImageOption('remove')}
              className="flex-row items-center p-4 rounded-xl mb-6 bg-red-50"
            >
              <Ionicons name="trash" size={24} color="#ef4444" />
              <Text className="text-base font-medium text-red-600 ml-3">
                Remove Photo
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={closeImagePicker}
            className="py-3"
          >
            <Text className="text-gray-600 text-center font-medium">
              Cancel
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" backgroundColor="#3b82f6" />
      
      {/* Header */}
      <LinearGradient
        colors={['#3b82f6', '#1d4ed8']}
        className="pt-12 pb-6 px-4"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity className="mr-3" onPress={()=>router.back()}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-white">Edit Profile</Text>
          </View>
          {hasUnsavedChanges && (
            <View className="bg-orange-500 px-3 py-1 rounded-full">
              <Text className="text-white text-xs font-medium">
                Unsaved
              </Text>
            </View>
          )}
        </View>
      </LinearGradient>

      <KeyboardAvoidingView 
        className="flex-1" 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Section Tabs */}
          <View className="px-4 py-6">
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 16 }}
            >
              {profileSections.map((section, index) => (
                <TouchableOpacity
                  key={section.id}
                  onPress={() => setActiveSection(section.id)}
                  className={`mr-4 px-4 py-3 rounded-2xl border ${
                    activeSection === section.id 
                      ? 'bg-white border-blue-500' 
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <View className="flex-row items-center">
                    <Ionicons 
                      name={section.icon} 
                      size={18} 
                      color={activeSection === section.id ? section.color : '#6b7280'} 
                    />
                    <Text 
                      className={`ml-2 font-medium text-sm ${
                        activeSection === section.id ? 'text-gray-800' : 'text-gray-600'
                      }`}
                    >
                      {section.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Content */}
          <View className="px-4 pb-20">
            {activeSection === 'personal' && renderPersonalSection()}
            {activeSection === 'address' && renderAddressSection()}
            {activeSection === 'professional' && renderProfessionalSection()}
            {activeSection === 'emergency' && renderEmergencySection()}
          </View>
        </ScrollView>

        {/* Save Button */}
        <View className="px-4 pb-6 bg-white border-t border-gray-200">
          <TouchableOpacity
            onPress={handleSaveProfile}
            className={`py-4 rounded-2xl ${
              hasUnsavedChanges ? 'bg-blue-600' : 'bg-gray-400'
            }`}
            disabled={!hasUnsavedChanges}
          >
            <Text className="text-white text-center font-bold text-lg">
              {hasUnsavedChanges ? 'Save Changes' : 'No Changes'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {renderImagePickerModal()}
    </View>
  );
};

export default EditProfilePage;