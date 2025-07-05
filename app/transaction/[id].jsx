import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Modal,
    ScrollView,
    Share,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, {
    FadeInDown,
    SlideInLeft,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const TransactionDetailPage = () => {
  const { id } = useLocalSearchParams();
  const [transaction, setTransaction] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const animatedValue = useSharedValue(0);
  const modalScale = useSharedValue(0);

  useEffect(() => {
    loadTransactionDetails();
    animatedValue.value = withSpring(1);
  }, [id]);

  const loadTransactionDetails = () => {
    // Mock transaction data - in real app, fetch from API based on id
    const mockTransaction = {
      id: id || 'txn_001',
      type: 'debit',
      category: 'food',
      title: 'Swiggy Food Delivery',
      description: 'Order #SW12345',
      amount: 850.00,
      date: '2025-01-05',
      time: '2:30 PM',
      status: 'completed',
      merchant: 'Swiggy',
      icon: 'restaurant-outline',
      color: '#ef4444',
      bgColor: '#fef2f2',
      method: 'UPI',
      reference: 'UPI/250105/143012345',
      from: {
        name: 'Sarah Johnson',
        account: 'Finverse Savings ****7890',
        type: 'Bank Account'
      },
      to: {
        name: 'Swiggy',
        account: 'swiggy@paytm',
        type: 'UPI ID'
      },
      location: {
        address: '123 MG Road, Koramangala, Bangalore',
        coordinates: { lat: 12.9352, lng: 77.6245 }
      },
      fees: {
        transactionFee: 0,
        gst: 0,
        total: 0
      },
      tags: ['Food', 'Delivery', 'Dinner'],
      notes: 'Ordered dinner for family',
      receipt: {
        available: true,
        url: 'https://example.com/receipt.pdf'
      },
      support: {
        disputeEnabled: true,
        refundPolicy: '7 days return policy'
      }
    };

    setTimeout(() => {
      setTransaction(mockTransaction);
      setLoading(false);
    }, 500);
  };

  const handleShare = async () => {
    if (!transaction) return;

    try {
      const message = `Transaction Details\n\n` +
        `${transaction.title}\n` +
        `Amount: ₹${transaction.amount.toFixed(2)}\n` +
        `Date: ${transaction.date} at ${transaction.time}\n` +
        `Reference: ${transaction.reference}\n` +
        `Status: ${transaction.status}\n\n` +
        `Shared from Finverse Banking App`;

      await Share.share({
        message,
        title: 'Transaction Details'
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleDispute = () => {
    Alert.alert(
      'Dispute Transaction',
      'Are you sure you want to raise a dispute for this transaction? Our team will review it within 24 hours.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Raise Dispute', 
          onPress: () => {
            Alert.alert('Success', 'Dispute raised successfully. Reference ID: DIS2025010001');
          }
        }
      ]
    );
  };

  const handleDownloadReceipt = () => {
    Alert.alert('Success', 'Receipt downloaded to your device');
  };

  const showReceiptPreview = () => {
    setShowReceiptModal(true);
    modalScale.value = withSpring(1);
  };

  const hideReceiptPreview = () => {
    modalScale.value = withTiming(0, { duration: 200 });
    setTimeout(() => setShowReceiptModal(false), 200);
  };

  const modalAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: modalScale.value }],
  }));

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'failed': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'checkmark-circle-outline';
      case 'pending': return 'time-outline';
      case 'failed': return 'close-circle-outline';
      default: return 'help-circle-outline';
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-gray-600 mt-4">Loading transaction details...</Text>
      </View>
    );
  }

  if (!transaction) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <Ionicons name="receipt-outline" size={64} color="#d1d5db" />
        <Text className="text-gray-600 text-lg mt-4">Transaction not found</Text>
        <TouchableOpacity 
          onPress={() => router.back()}
          className="mt-4 bg-blue-500 px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" backgroundColor={transaction.color} />
      
      {/* Header */}
      <LinearGradient
        colors={[transaction.color, transaction.color + '99']}
        className="pt-12 pb-6"
      >
        <Animated.View 
          entering={SlideInLeft.delay(100)}
          className="flex-row items-center justify-between px-4"
        >
          <View className="flex-row items-center">
            <TouchableOpacity className="mr-3" onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-white">Transaction Details</Text>
          </View>
          <View className="flex-row">
            <TouchableOpacity className="mr-3" onPress={handleShare}>
              <Ionicons name="share-outline" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Alert.alert('More Options', 'Feature coming soon!')}>
              <Ionicons name="ellipsis-vertical" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </LinearGradient>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Transaction Summary Card */}
        <Animated.View 
          entering={FadeInDown.delay(200)}
          className="mx-4 -mt-8 bg-white rounded-3xl p-6"
          style={{
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
          }}
        >
          <View className="items-center mb-6">
            <View 
              className="w-20 h-20 rounded-3xl items-center justify-center mb-4"
              style={{ backgroundColor: transaction.bgColor }}
            >
              <Ionicons 
                name={transaction.icon} 
                size={32} 
                color={transaction.color} 
              />
            </View>
            
            <Text className="text-2xl font-bold text-gray-800 mb-1">
              {transaction.title}
            </Text>
            <Text className="text-gray-600 text-center mb-4">
              {transaction.description}
            </Text>
            
            <Text 
              className={`text-4xl font-bold mb-2 ${
                transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
            </Text>
            
            <View className="flex-row items-center">
              <Ionicons 
                name={getStatusIcon(transaction.status)} 
                size={16} 
                color={getStatusColor(transaction.status)} 
              />
              <Text 
                className="ml-2 font-semibold capitalize"
                style={{ color: getStatusColor(transaction.status) }}
              >
                {transaction.status}
              </Text>
            </View>
          </View>

          {/* Quick Actions */}
          <View className="flex-row justify-around border-t border-gray-100 pt-4">
            {transaction.receipt?.available && (
              <TouchableOpacity 
                onPress={showReceiptPreview}
                className="items-center"
              >
                <View className="w-12 h-12 bg-blue-50 rounded-2xl items-center justify-center mb-2">
                  <Ionicons name="receipt-outline" size={20} color="#3b82f6" />
                </View>
                <Text className="text-xs text-gray-600">Receipt</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              onPress={handleShare}
              className="items-center"
            >
              <View className="w-12 h-12 bg-green-50 rounded-2xl items-center justify-center mb-2">
                <Ionicons name="share-outline" size={20} color="#10b981" />
              </View>
              <Text className="text-xs text-gray-600">Share</Text>
            </TouchableOpacity>
            
            {transaction.support?.disputeEnabled && (
              <TouchableOpacity 
                onPress={handleDispute}
                className="items-center"
              >
                <View className="w-12 h-12 bg-red-50 rounded-2xl items-center justify-center mb-2">
                  <Ionicons name="flag-outline" size={20} color="#ef4444" />
                </View>
                <Text className="text-xs text-gray-600">Dispute</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              onPress={() => router.push(`/contact-support?txn=${transaction.id}`)}
              className="items-center"
            >
              <View className="w-12 h-12 bg-purple-50 rounded-2xl items-center justify-center mb-2">
                <Ionicons name="help-circle-outline" size={20} color="#8b5cf6" />
              </View>
              <Text className="text-xs text-gray-600">Help</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Transaction Details */}
        <Animated.View 
          entering={FadeInDown.delay(400)}
          className="mx-4 mt-6 bg-white rounded-2xl p-6"
          style={{
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
          }}
        >
          <Text className="text-lg font-bold text-gray-800 mb-4">
            Transaction Information
          </Text>
          
          <View className="space-y-4">
            <View className="flex-row justify-between py-3 border-b border-gray-100">
              <Text className="text-gray-600">Reference ID</Text>
              <Text className="font-semibold text-gray-800">{transaction.reference}</Text>
            </View>
            
            <View className="flex-row justify-between py-3 border-b border-gray-100">
              <Text className="text-gray-600">Date & Time</Text>
              <Text className="font-semibold text-gray-800">
                {transaction.date} at {transaction.time}
              </Text>
            </View>
            
            <View className="flex-row justify-between py-3 border-b border-gray-100">
              <Text className="text-gray-600">Payment Method</Text>
              <Text className="font-semibold text-gray-800">{transaction.method}</Text>
            </View>
            
            <View className="flex-row justify-between py-3 border-b border-gray-100">
              <Text className="text-gray-600">Category</Text>
              <View className="bg-gray-100 rounded-full px-3 py-1">
                <Text className="text-sm font-medium text-gray-700 capitalize">
                  {transaction.category}
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Transfer Details */}
        <Animated.View 
          entering={FadeInDown.delay(600)}
          className="mx-4 mt-6 bg-white rounded-2xl p-6"
          style={{
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
          }}
        >
          <Text className="text-lg font-bold text-gray-800 mb-4">
            Transfer Details
          </Text>
          
          <View className="space-y-4">
            <View>
              <Text className="text-gray-600 mb-2">From</Text>
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-blue-50 rounded-xl items-center justify-center mr-3">
                  <Ionicons name="person-outline" size={20} color="#3b82f6" />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-800">{transaction.from.name}</Text>
                  <Text className="text-gray-600 text-sm">{transaction.from.account}</Text>
                </View>
              </View>
            </View>
            
            <View className="items-center py-2">
              <Ionicons name="arrow-down" size={24} color="#6b7280" />
            </View>
            
            <View>
              <Text className="text-gray-600 mb-2">To</Text>
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-green-50 rounded-xl items-center justify-center mr-3">
                  <Ionicons name="business-outline" size={20} color="#10b981" />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-800">{transaction.to.name}</Text>
                  <Text className="text-gray-600 text-sm">{transaction.to.account}</Text>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Fees Breakdown */}
        {transaction.fees && (
          <Animated.View 
            entering={FadeInDown.delay(800)}
            className="mx-4 mt-6 bg-white rounded-2xl p-6"
            style={{
              elevation: 2,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
            }}
          >
            <Text className="text-lg font-bold text-gray-800 mb-4">
              Fee Breakdown
            </Text>
            
            <View className="space-y-3">
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Transaction Amount</Text>
                <Text className="font-semibold text-gray-800">
                  ₹{transaction.amount.toFixed(2)}
                </Text>
              </View>
              
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Transaction Fee</Text>
                <Text className="font-semibold text-gray-800">
                  ₹{transaction.fees.transactionFee.toFixed(2)}
                </Text>
              </View>
              
              <View className="flex-row justify-between">
                <Text className="text-gray-600">GST</Text>
                <Text className="font-semibold text-gray-800">
                  ₹{transaction.fees.gst.toFixed(2)}
                </Text>
              </View>
              
              <View className="border-t border-gray-200 pt-3">
                <View className="flex-row justify-between">
                  <Text className="font-bold text-gray-800">Total</Text>
                  <Text className="font-bold text-gray-800">
                    ₹{(transaction.amount + transaction.fees.total).toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Notes & Tags */}
        {(transaction.notes || transaction.tags) && (
          <Animated.View 
            entering={FadeInDown.delay(1000)}
            className="mx-4 mt-6 mb-8 bg-white rounded-2xl p-6"
            style={{
              elevation: 2,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
            }}
          >
            {transaction.notes && (
              <View className="mb-4">
                <Text className="text-lg font-bold text-gray-800 mb-2">Notes</Text>
                <Text className="text-gray-600">{transaction.notes}</Text>
              </View>
            )}
            
            {transaction.tags && transaction.tags.length > 0 && (
              <View>
                <Text className="text-lg font-bold text-gray-800 mb-3">Tags</Text>
                <View className="flex-row flex-wrap">
                  {transaction.tags.map((tag, index) => (
                    <View 
                      key={index}
                      className="bg-blue-50 rounded-full px-3 py-1 mr-2 mb-2"
                    >
                      <Text className="text-blue-600 text-sm font-medium">#{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </Animated.View>
        )}
      </ScrollView>

      {/* Receipt Modal */}
      <Modal
        visible={showReceiptModal}
        transparent={true}
        animationType="fade"
        onRequestClose={hideReceiptPreview}
      >
        <View className="flex-1 bg-black bg-opacity-50 justify-center items-center p-4">
          <Animated.View
            style={modalAnimatedStyle}
            className="bg-white rounded-3xl p-6 w-full max-w-md"
          >
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-bold text-gray-800">Receipt</Text>
              <TouchableOpacity onPress={hideReceiptPreview}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            
            <View className="items-center py-8 border-2 border-dashed border-gray-200 rounded-2xl">
              <Ionicons name="receipt-outline" size={48} color="#6b7280" />
              <Text className="text-gray-600 mt-4 text-center">
                Receipt preview will be available here
              </Text>
            </View>
            
            <TouchableOpacity
              onPress={handleDownloadReceipt}
              className="mt-6 bg-blue-500 rounded-2xl py-4 items-center"
            >
              <Text className="text-white font-bold text-lg">Download Receipt</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

export default TransactionDetailPage;