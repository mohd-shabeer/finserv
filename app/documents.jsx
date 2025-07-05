import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    ActionSheetIOS,
    Alert,
    Animated,
    Dimensions,
    FlatList,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const Documents = () => {
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const shimmerPosition = useRef(new Animated.Value(-200)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  
  // State management
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedDocument, setSelectedDocument] = useState(null);

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

    // Progress animation for verification status
    Animated.timing(progressAnim, {
      toValue: 0.75, // 75% complete
      duration: 2000,
      useNativeDriver: false,
    }).start();

    return () => {
      shimmerAnimation.stop();
    };
  }, []);

  // Document categories and their requirements
  const documentCategories = [
    {
      id: 'identity',
      title: 'Identity Verification',
      subtitle: 'Government-issued photo ID',
      icon: 'badge',
      color: '#3b82f6',
      gradient: ['#3b82f6', '#1d4ed8'],
      required: true,
      maxFiles: 2,
      acceptedTypes: ['Driver\'s License', 'Passport', 'State ID'],
      description: 'Upload a clear photo of your government-issued ID. Both front and back required for driver\'s license.',
      documents: [
        {
          id: 1,
          name: 'Driver\'s License - Front',
          type: 'Driver\'s License',
          uploadDate: '2024-12-28',
          status: 'verified',
          size: '2.4 MB',
          format: 'PDF',
          thumbnail: 'https://images.pexels.com/photos/3992949/pexels-photo-3992949.jpeg?auto=compress&cs=tinysrgb&w=300'
        },
        {
          id: 2,
          name: 'Driver\'s License - Back',
          type: 'Driver\'s License',
          uploadDate: '2024-12-28',
          status: 'verified',
          size: '2.1 MB',
          format: 'PDF',
          thumbnail: 'https://images.pexels.com/photos/3992949/pexels-photo-3992949.jpeg?auto=compress&cs=tinysrgb&w=300'
        }
      ]
    },
    {
      id: 'address',
      title: 'Address Verification',
      subtitle: 'Proof of residence',
      icon: 'home',
      color: '#10b981',
      gradient: ['#10b981', '#059669'],
      required: true,
      maxFiles: 1,
      acceptedTypes: ['Utility Bill', 'Bank Statement', 'Lease Agreement'],
      description: 'Upload a recent document showing your current address (within 90 days).',
      documents: [
        {
          id: 3,
          name: 'Electricity Bill - December 2024',
          type: 'Utility Bill',
          uploadDate: '2024-12-30',
          status: 'verified',
          size: '1.8 MB',
          format: 'PDF',
          thumbnail: 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=300'
        }
      ]
    },
    {
      id: 'income',
      title: 'Income Verification',
      subtitle: 'Employment and income proof',
      icon: 'work',
      color: '#f59e0b',
      gradient: ['#f59e0b', '#d97706'],
      required: true,
      maxFiles: 3,
      acceptedTypes: ['Pay Stub', 'Tax Return', 'Employment Letter'],
      description: 'Upload recent pay stubs, tax returns, or official employment documentation.',
      documents: [
        {
          id: 4,
          name: 'Pay Stub - December 2024',
          type: 'Pay Stub',
          uploadDate: '2025-01-02',
          status: 'pending',
          size: '1.2 MB',
          format: 'PDF',
          thumbnail: 'https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=300'
        },
        {
          id: 5,
          name: 'Tax Return 2023',
          type: 'Tax Return',
          uploadDate: '2025-01-01',
          status: 'under_review',
          size: '3.8 MB',
          format: 'PDF',
          thumbnail: 'https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=300'
        }
      ]
    },
    {
      id: 'additional',
      title: 'Additional Documents',
      subtitle: 'Supporting documentation',
      icon: 'description',
      color: '#8b5cf6',
      gradient: ['#8b5cf6', '#7c3aed'],
      required: false,
      maxFiles: 5,
      acceptedTypes: ['SSN Card', 'Birth Certificate', 'Marriage Certificate'],
      description: 'Optional documents that may help with account verification.',
      documents: []
    }
  ];

  // Verification status data
  const verificationStatus = {
    overall: 'in_progress', // verified, in_progress, pending, rejected
    completedSteps: 3,
    totalSteps: 4,
    lastUpdated: '2025-01-04',
    estimatedCompletion: '1-2 business days'
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'verified':
        return { color: '#10b981', icon: 'verified', text: 'Verified' };
      case 'pending':
        return { color: '#f59e0b', icon: 'schedule', text: 'Pending Review' };
      case 'under_review':
        return { color: '#3b82f6', icon: 'visibility', text: 'Under Review' };
      case 'rejected':
        return { color: '#ef4444', icon: 'error', text: 'Rejected' };
      default:
        return { color: '#6b7280', icon: 'help', text: 'Unknown' };
    }
  };

  const handleUploadDocument = (categoryId) => {
    const options = ['Camera', 'Photo Library', 'Files', 'Cancel'];
    const cancelButtonIndex = 3;

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
          title: 'Upload Document'
        },
        (buttonIndex) => {
          if (buttonIndex !== cancelButtonIndex) {
            simulateUpload(categoryId, options[buttonIndex]);
          }
        }
      );
    } else {
      Alert.alert(
        'Upload Document',
        'Choose upload method',
        [
          { text: 'Camera', onPress: () => simulateUpload(categoryId, 'Camera') },
          { text: 'Gallery', onPress: () => simulateUpload(categoryId, 'Gallery') },
          { text: 'Files', onPress: () => simulateUpload(categoryId, 'Files') },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    }
  };

  const simulateUpload = (categoryId, method) => {
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          Alert.alert('Success', 'Document uploaded successfully!');
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleDocumentPress = (document) => {
    setSelectedDocument(document);
    Alert.alert(
      document.name,
      `Type: ${document.type}\nStatus: ${getStatusInfo(document.status).text}\nSize: ${document.size}\nUploaded: ${new Date(document.uploadDate).toLocaleDateString()}`,
      [
        { text: 'View', onPress: () => viewDocument(document) },
        { text: 'Replace', onPress: () => replaceDocument(document) },
        { text: 'Delete', onPress: () => deleteDocument(document), style: 'destructive' },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const viewDocument = (document) => {
    Alert.alert('View Document', `Opening ${document.name}...`);
  };

  const replaceDocument = (document) => {
    Alert.alert('Replace Document', `Replacing ${document.name}...`);
  };

  const deleteDocument = (document) => {
    Alert.alert(
      'Delete Document',
      `Are you sure you want to delete ${document.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
          Alert.alert('Deleted', 'Document has been deleted.');
        }}
      ]
    );
  };

  const renderVerificationProgress = () => (
    <Animated.View
      className="mx-4 mb-8"
      style={[
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
      ]}
    >
      <BlurView intensity={30} tint="light" style={styles.progressCard}>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.progressGradient}
        >
          <View className="p-6">
            <View className="flex-row items-center justify-between mb-4">
              <View>
                <Text className="font-inter-bold text-white text-xl">
                  Verification Progress
                </Text>
                <Text className="font-inter text-white opacity-90 text-sm">
                  {verificationStatus.completedSteps} of {verificationStatus.totalSteps} steps completed
                </Text>
              </View>
              <View className="bg-opacity-20 px-3 py-2 rounded-xl">
                <Text className="font-inter-semibold text-white text-sm">
                  {Math.round((verificationStatus.completedSteps / verificationStatus.totalSteps) * 100)}%
                </Text>
              </View>
            </View>

            {/* Progress Bar */}
            <View className="bg-opacity-20 rounded-full h-3 mb-4">
              <Animated.View 
                className="bg-white rounded-full h-3"
                style={{
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%']
                  })
                }}
              />
            </View>

            <View className="flex-row justify-between items-center">
              <View>
                <Text className="font-inter text-white opacity-80 text-xs">
                  Estimated completion
                </Text>
                <Text className="font-inter-semibold text-white text-sm">
                  {verificationStatus.estimatedCompletion}
                </Text>
              </View>
              <View className="flex-row items-center">
                <MaterialIcons name="schedule" size={16} color="rgba(255,255,255,0.8)" />
                <Text className="font-inter text-white opacity-80 text-xs ml-1">
                  Last updated: {new Date(verificationStatus.lastUpdated).toLocaleDateString()}
                </Text>
              </View>
            </View>
          </View>

          {/* Shimmer Effect */}
          <Animated.View
            style={[
              styles.progressShimmer,
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
  );

  const renderDocument = ({ item }) => {
    const statusInfo = getStatusInfo(item.status);
    
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => handleDocumentPress(item)}
        className="mb-3"
      >
        <BlurView intensity={20} tint="light" style={styles.documentItem}>
          <View className="flex-row items-center p-4">
            <Image 
              source={{ uri: item.thumbnail }} 
              className="w-16 h-16 rounded-xl mr-4" 
            />
            
            <View className="flex-1">
              <Text className="font-inter-semibold text-gray-900 text-base">
                {item.name}
              </Text>
              <Text className="font-inter text-gray-500 text-sm">
                {item.type} • {item.size}
              </Text>
              <View className="flex-row items-center mt-2">
                <View 
                  className="px-2 py-1 rounded-lg mr-2"
                  style={{ backgroundColor: `${statusInfo.color}15` }}
                >
                  <Text 
                    className="font-inter-medium text-xs"
                    style={{ color: statusInfo.color }}
                  >
                    {statusInfo.text}
                  </Text>
                </View>
                <Text className="font-inter text-gray-400 text-xs">
                  {new Date(item.uploadDate).toLocaleDateString()}
                </Text>
              </View>
            </View>
            
            <View className="items-end">
              <MaterialIcons 
                name={statusInfo.icon} 
                size={24} 
                color={statusInfo.color} 
              />
              <Text className="font-inter text-gray-400 text-xs mt-1">
                {item.format}
              </Text>
            </View>
          </View>
        </BlurView>
      </TouchableOpacity>
    );
  };

  const renderCategory = (category) => {
    const hasDocuments = category.documents.length > 0;
    const canUpload = category.documents.length < category.maxFiles;

    return (
      <Animated.View
        key={category.id}
        className="mb-8"
        style={[
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
        ]}
      >
        <BlurView intensity={25} tint="light" style={styles.categoryContainer}>
          <View className="p-6">
            {/* Category Header */}
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center">
                <View 
                  className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
                  style={{ backgroundColor: `${category.color}15` }}
                >
                  <MaterialIcons name={category.icon} size={24} color={category.color} />
                </View>
                <View>
                  <View className="flex-row items-center">
                    <Text className="font-inter-bold text-gray-900 text-lg">
                      {category.title}
                    </Text>
                    {category.required && (
                      <View className="bg-red-100 px-2 py-1 rounded-full ml-2">
                        <Text className="font-inter-semibold text-red-600 text-xs">
                          Required
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text className="font-inter text-gray-500 text-sm">
                    {category.subtitle}
                  </Text>
                </View>
              </View>
              
              <View className="items-end">
                <Text className="font-inter-semibold text-gray-700 text-sm">
                  {category.documents.length}/{category.maxFiles}
                </Text>
                <Text className="font-inter text-gray-400 text-xs">
                  files
                </Text>
              </View>
            </View>

            {/* Description */}
            <Text className="font-inter text-gray-600 text-sm mb-4 leading-5">
              {category.description}
            </Text>

            {/* Accepted Types */}
            <View className="mb-4">
              <Text className="font-inter-semibold text-gray-700 text-sm mb-2">
                Accepted Documents:
              </Text>
              <View className="flex-row flex-wrap">
                {category.acceptedTypes.map((type, index) => (
                  <View key={index} className="bg-gray-100 px-3 py-1 rounded-full mr-2 mb-2">
                    <Text className="font-inter text-gray-600 text-xs">
                      {type}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Documents List */}
            {hasDocuments && (
              <View className="mb-4">
                <Text className="font-inter-semibold text-gray-700 text-sm mb-3">
                  Uploaded Documents:
                </Text>
                <FlatList
                  data={category.documents}
                  renderItem={renderDocument}
                  scrollEnabled={false}
                />
              </View>
            )}

            {/* Upload Button */}
            {canUpload && (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleUploadDocument(category.id)}
              >
                <BlurView intensity={20} tint="light" style={styles.uploadButton}>
                  <LinearGradient
                    colors={category.gradient}
                    style={styles.uploadGradient}
                  >
                    <MaterialIcons name="cloud-upload" size={24} color="white" />
                    <Text className="font-inter-semibold text-white text-base ml-2">
                      Upload Document
                    </Text>
                  </LinearGradient>
                </BlurView>
              </TouchableOpacity>
            )}
          </View>
        </BlurView>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <LinearGradient
        colors={['#f8fafc', '#f1f5f9']}
        className="flex-1"
      >
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
                  Documents & Verification
                </Text>
                <Text className="font-inter text-gray-500 text-sm">
                  Upload and manage documents
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => Alert.alert('Help', 'Document upload guidelines and requirements.')}
              >
                <BlurView intensity={20} tint="light" style={styles.headerButton}>
                  <MaterialIcons name="help-outline" size={22} color="#374151" />
                </BlurView>
              </TouchableOpacity>
            </View>
          </BlurView>
        </Animated.View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ 
            paddingBottom: Platform.OS === 'ios' ? 100 : 85,
            paddingTop: 20 
          }}
        >
          {/* Verification Progress */}
          {renderVerificationProgress()}

          {/* Upload Progress (if uploading) */}
          {isUploading && (
            <Animated.View
              className="mx-4 mb-6"
              style={[
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
              ]}
            >
              <BlurView intensity={25} tint="light" style={styles.uploadProgressCard}>
                <View className="p-4">
                  <View className="flex-row items-center mb-3">
                    <MaterialIcons name="cloud-upload" size={20} color="#3b82f6" />
                    <Text className="font-inter-semibold text-gray-900 text-base ml-2">
                      Uploading Document...
                    </Text>
                  </View>
                  <View className="bg-gray-200 rounded-full h-2 mb-2">
                    <View 
                      className="bg-blue-600 rounded-full h-2 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </View>
                  <Text className="font-inter text-gray-500 text-sm">
                    {uploadProgress}% complete
                  </Text>
                </View>
              </BlurView>
            </Animated.View>
          )}

          {/* Document Categories */}
          <View className="px-4">
            {documentCategories.map(renderCategory)}
          </View>

          {/* Security Notice */}
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
                    Document Security
                  </Text>
                  <Text className="font-inter text-gray-600 text-xs mt-1">
                    All documents are encrypted and stored securely. We comply with banking regulations and never share your documents with third parties.
                  </Text>
                </View>
              </View>
            </BlurView>
          </Animated.View>

          {/* Support Info */}
          <Animated.View
            className="mx-4 mb-6"
            style={[
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
          >
            <BlurView intensity={15} tint="light" style={styles.supportCard}>
              <View className="p-4">
                <Text className="font-inter-semibold text-gray-900 text-base mb-2">
                  Need Help?
                </Text>
                <Text className="font-inter text-gray-600 text-sm mb-4">
                  Our verification team reviews documents within 1-2 business days. For questions, contact our support team.
                </Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => router.push('/contact-support')}
                >
                  <View className="flex-row items-center">
                    <MaterialIcons name="support-agent" size={18} color="#3b82f6" />
                    <Text className="font-inter-semibold text-blue-600 text-sm ml-2">
                      Contact Support
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

export default Documents;

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
  progressCard: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  progressGradient: {
    borderRadius: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  progressShimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 100,
  },
  shimmer: {
    flex: 1,
    width: '100%',
  },
  uploadProgressCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
  },
  categoryContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  documentItem: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  uploadButton: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  uploadGradient: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    flexDirection: 'row',
  },
  securityNotice: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
  },
  supportCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
});