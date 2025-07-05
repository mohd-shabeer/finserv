import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const BillHistory = () => {
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const shimmerPosition = useRef(new Animated.Value(-200)).current;

  // State management
  const [selectedTimeframe, setSelectedTimeframe] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest"); // newest, oldest, amount_high, amount_low

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

  // Timeframe filters
  const timeframeFilters = [
    { id: "all", title: "All Time", icon: "history" },
    { id: "week", title: "This Week", icon: "today" },
    { id: "month", title: "This Month", icon: "calendar-today" },
    { id: "quarter", title: "Last 3 Months", icon: "date-range" },
    { id: "year", title: "This Year", icon: "event" },
  ];

  // Category filters
  const categoryFilters = [
    { id: "all", title: "All Categories", icon: "view-list", color: "#6b7280" },
    { id: "utilities", title: "Utilities", icon: "flash-on", color: "#f59e0b" },
    { id: "mobile", title: "Mobile", icon: "phone-android", color: "#10b981" },
    { id: "internet", title: "Internet", icon: "wifi", color: "#3b82f6" },
    { id: "insurance", title: "Insurance", icon: "security", color: "#8b5cf6" },
    {
      id: "credit",
      title: "Credit Cards",
      icon: "credit-card",
      color: "#ef4444",
    },
    {
      id: "entertainment",
      title: "Entertainment",
      icon: "movie",
      color: "#06b6d4",
    },
  ];

  // Status filters
  const statusFilters = [
    { id: "all", title: "All Status", color: "#6b7280" },
    { id: "paid", title: "Paid", color: "#10b981" },
    { id: "failed", title: "Failed", color: "#ef4444" },
    { id: "pending", title: "Pending", color: "#f59e0b" },
    { id: "refunded", title: "Refunded", color: "#8b5cf6" },
  ];

  // Bill history data
  const billHistory = [
    {
      id: 1,
      title: "Electricity Bill",
      provider: "ConEd Energy",
      amount: 125.5,
      paidDate: "2025-01-02T10:30:00Z",
      category: "utilities",
      status: "paid",
      transactionId: "TXN202501020001",
      paymentMethod: "Primary Checking ****7892",
      logo: "https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=100",
      color: "#f59e0b",
      dueDate: "2025-01-05",
      lateFee: 0,
      receipt: "available",
    },
    {
      id: 2,
      title: "Netflix Subscription",
      provider: "Netflix Inc.",
      amount: 15.99,
      paidDate: "2025-01-01T00:15:00Z",
      category: "entertainment",
      status: "paid",
      transactionId: "TXN202501010002",
      paymentMethod: "Chase Sapphire ****2345",
      logo: "https://images.pexels.com/photos/1040158/pexels-photo-1040158.jpeg?auto=compress&cs=tinysrgb&w=100",
      color: "#ef4444",
      dueDate: "2025-01-01",
      lateFee: 0,
      receipt: "available",
    },
    {
      id: 3,
      title: "Phone Bill",
      provider: "Verizon Wireless",
      amount: 89.99,
      paidDate: "2024-12-30T14:22:00Z",
      category: "mobile",
      status: "failed",
      transactionId: "TXN202412300001",
      paymentMethod: "Primary Checking ****7892",
      logo: "https://images.pexels.com/photos/147413/twitter-facebook-together-exchange-147413.jpeg?auto=compress&cs=tinysrgb&w=100",
      color: "#10b981",
      dueDate: "2024-12-30",
      lateFee: 5.0,
      receipt: "not_available",
      failureReason: "Insufficient funds",
    },
    {
      id: 4,
      title: "Internet Service",
      provider: "Spectrum",
      amount: 79.99,
      paidDate: "2024-12-28T09:45:00Z",
      category: "internet",
      status: "paid",
      transactionId: "TXN202412280003",
      paymentMethod: "Business Account ****5678",
      logo: "https://images.pexels.com/photos/163064/play-stone-network-networked-163064.jpeg?auto=compress&cs=tinysrgb&w=100",
      color: "#3b82f6",
      dueDate: "2024-12-28",
      lateFee: 0,
      receipt: "available",
    },
    {
      id: 5,
      title: "Car Insurance",
      provider: "State Farm",
      amount: 180.0,
      paidDate: "2024-12-25T16:30:00Z",
      category: "insurance",
      status: "paid",
      transactionId: "TXN202412250001",
      paymentMethod: "Savings Account ****1234",
      logo: "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=100",
      color: "#8b5cf6",
      dueDate: "2024-12-25",
      lateFee: 0,
      receipt: "available",
    },
    {
      id: 6,
      title: "Gas Bill",
      provider: "National Grid",
      amount: 68.75,
      paidDate: "2024-12-22T11:15:00Z",
      category: "utilities",
      status: "pending",
      transactionId: "TXN202412220002",
      paymentMethod: "Primary Checking ****7892",
      logo: "https://images.pexels.com/photos/128867/pexels-photo-128867.jpeg?auto=compress&cs=tinysrgb&w=100",
      color: "#f59e0b",
      dueDate: "2024-12-22",
      lateFee: 0,
      receipt: "processing",
    },
    {
      id: 7,
      title: "Spotify Premium",
      provider: "Spotify AB",
      amount: 9.99,
      paidDate: "2024-12-20T08:00:00Z",
      category: "entertainment",
      status: "refunded",
      transactionId: "TXN202412200001",
      paymentMethod: "Chase Sapphire ****2345",
      logo: "https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=100",
      color: "#10b981",
      dueDate: "2024-12-20",
      lateFee: 0,
      receipt: "available",
      refundReason: "Service cancellation",
    },
    {
      id: 8,
      title: "Water Bill",
      provider: "NYC Water",
      amount: 45.3,
      paidDate: "2024-12-18T13:45:00Z",
      category: "utilities",
      status: "paid",
      transactionId: "TXN202412180001",
      paymentMethod: "Primary Checking ****7892",
      logo: "https://images.pexels.com/photos/416528/pexels-photo-416528.jpeg?auto=compress&cs=tinysrgb&w=100",
      color: "#06b6d4",
      dueDate: "2024-12-18",
      lateFee: 0,
      receipt: "available",
    },
  ];

  // Summary statistics
  const getPaymentStats = () => {
    const totalSpent = billHistory
      .filter((bill) => bill.status === "paid")
      .reduce((sum, bill) => sum + bill.amount, 0);

    const totalTransactions = billHistory.length;
    const successfulPayments = billHistory.filter(
      (bill) => bill.status === "paid"
    ).length;
    const failedPayments = billHistory.filter(
      (bill) => bill.status === "failed"
    ).length;

    return {
      totalSpent,
      totalTransactions,
      successfulPayments,
      failedPayments,
      successRate: ((successfulPayments / totalTransactions) * 100).toFixed(1),
    };
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case "paid":
        return {
          color: "#10b981",
          text: "Paid",
          bgColor: "#f0fdf4",
          icon: "check-circle",
        };
      case "failed":
        return {
          color: "#ef4444",
          text: "Failed",
          bgColor: "#fef2f2",
          icon: "error",
        };
      case "pending":
        return {
          color: "#f59e0b",
          text: "Pending",
          bgColor: "#fffbeb",
          icon: "schedule",
        };
      case "refunded":
        return {
          color: "#8b5cf6",
          text: "Refunded",
          bgColor: "#faf5ff",
          icon: "replay",
        };
      default:
        return {
          color: "#6b7280",
          text: "Unknown",
          bgColor: "#f9fafb",
          icon: "help",
        };
    }
  };

  const handleBillPress = (bill) => {
    router.push(`/bill-details/${bill.id}`);
  };

  const handleDownloadReceipt = (bill) => {
    // Handle receipt download
    console.log("Downloading receipt for:", bill.title);
  };

  const handleRetryPayment = (bill) => {
    router.push(`/retry-payment/${bill.id}`);
  };

  const filteredAndSortedHistory = () => {
    let filtered = billHistory.filter((bill) => {
      const matchesSearch =
        bill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bill.provider.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || bill.category === selectedCategory;
      const matchesStatus =
        selectedStatus === "all" || bill.status === selectedStatus;

      // Timeframe filtering
      const billDate = new Date(bill.paidDate);
      const now = new Date();
      let matchesTimeframe = true;

      switch (selectedTimeframe) {
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesTimeframe = billDate >= weekAgo;
          break;
        case "month":
          matchesTimeframe =
            billDate.getMonth() === now.getMonth() &&
            billDate.getFullYear() === now.getFullYear();
          break;
        case "quarter":
          const threeMonthsAgo = new Date(
            now.getTime() - 90 * 24 * 60 * 60 * 1000
          );
          matchesTimeframe = billDate >= threeMonthsAgo;
          break;
        case "year":
          matchesTimeframe = billDate.getFullYear() === now.getFullYear();
          break;
        default:
          matchesTimeframe = true;
      }

      return (
        matchesSearch && matchesCategory && matchesStatus && matchesTimeframe
      );
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      switch (sortOrder) {
        case "newest":
          return new Date(b.paidDate) - new Date(a.paidDate);
        case "oldest":
          return new Date(a.paidDate) - new Date(b.paidDate);
        case "amount_high":
          return b.amount - a.amount;
        case "amount_low":
          return a.amount - b.amount;
        default:
          return new Date(b.paidDate) - new Date(a.paidDate);
      }
    });

    return filtered;
  };

  const renderFilterChip = ({ item, isSelected, onPress, type }) => (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} className="mr-3">
      <BlurView
        intensity={isSelected ? 30 : 20}
        tint="light"
        style={[
          styles.filterChip,
          isSelected && {
            borderColor: item.color || "#3b82f6",
            borderWidth: 2,
          },
        ]}
      >
        <View className="flex-row items-center px-4 py-3">
          {item.icon && (
            <MaterialIcons
              name={item.icon}
              size={16}
              color={isSelected ? item.color || "#3b82f6" : "#6b7280"}
            />
          )}
          <Text
            className={`font-inter-semibold text-sm ${item.icon ? "ml-2" : ""} ${
              isSelected ? "text-gray-900" : "text-gray-600"
            }`}
          >
            {item.title}
          </Text>
        </View>
      </BlurView>
    </TouchableOpacity>
  );

  const renderBillHistoryItem = ({ item, index }) => {
    const statusInfo = getStatusInfo(item.status);
    const billDate = new Date(item.paidDate);

    return (
      <Animated.View
        style={[
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => handleBillPress(item)}
          className="mb-4"
        >
          <BlurView intensity={25} tint="light" style={styles.billHistoryCard}>
            <View className="p-5">
              {/* Header */}
              <View className="flex-row items-start justify-between mb-4">
                <View className="flex-row items-center flex-1">
                  <Image
                    source={{ uri: item.logo }}
                    className="w-14 h-14 rounded-2xl mr-4"
                  />
                  <View className="flex-1">
                    <Text className="font-inter-semibold text-gray-900 text-base">
                      {item.title}
                    </Text>
                    <Text className="font-inter text-gray-500 text-sm">
                      {item.provider}
                    </Text>
                    <Text className="font-inter text-gray-400 text-xs mt-1">
                      {billDate.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </View>
                </View>

                <View className="items-end">
                  <Text className="font-inter-bold text-gray-900 text-xl">
                    ${item.amount.toFixed(2)}
                  </Text>
                  <View
                    className="px-3 py-1 rounded-full mt-2 flex-row items-center"
                    style={{ backgroundColor: statusInfo.bgColor }}
                  >
                    <MaterialIcons
                      name={statusInfo.icon}
                      size={12}
                      color={statusInfo.color}
                    />
                    <Text
                      className="font-inter-semibold text-xs ml-1"
                      style={{ color: statusInfo.color }}
                    >
                      {statusInfo.text}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Details */}
              <View className="bg-gray-50 rounded-2xl p-4">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="font-inter text-gray-600 text-sm">
                    Transaction ID
                  </Text>
                  <Text className="font-mono text-gray-900 text-sm">
                    {item.transactionId}
                  </Text>
                </View>

                <View className="flex-row justify-between items-center mb-2">
                  <Text className="font-inter text-gray-600 text-sm">
                    Payment Method
                  </Text>
                  <Text className="font-inter text-gray-900 text-sm">
                    {item.paymentMethod}
                  </Text>
                </View>

                {item.lateFee > 0 && (
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="font-inter text-gray-600 text-sm">
                      Late Fee
                    </Text>
                    <Text className="font-inter-semibold text-red-600 text-sm">
                      +${item.lateFee.toFixed(2)}
                    </Text>
                  </View>
                )}

                {item.status === "failed" && item.failureReason && (
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="font-inter text-gray-600 text-sm">
                      Failure Reason
                    </Text>
                    <Text className="font-inter text-red-600 text-sm">
                      {item.failureReason}
                    </Text>
                  </View>
                )}

                {item.status === "refunded" && item.refundReason && (
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="font-inter text-gray-600 text-sm">
                      Refund Reason
                    </Text>
                    <Text className="font-inter text-purple-600 text-sm">
                      {item.refundReason}
                    </Text>
                  </View>
                )}

                {/* Action Buttons */}
                <View className="flex-row justify-between items-center pt-3 border-t border-gray-200">
                  <View className="flex-row items-center">
                    {item.receipt === "available" && (
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => handleDownloadReceipt(item)}
                        className="flex-row items-center mr-4"
                      >
                        <MaterialIcons
                          name="download"
                          size={16}
                          color="#3b82f6"
                        />
                        <Text className="font-inter-semibold text-blue-600 text-sm ml-1">
                          Receipt
                        </Text>
                      </TouchableOpacity>
                    )}

                    {item.status === "failed" && (
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => handleRetryPayment(item)}
                        className="flex-row items-center"
                      >
                        <MaterialIcons
                          name="refresh"
                          size={16}
                          color="#10b981"
                        />
                        <Text className="font-inter-semibold text-green-600 text-sm ml-1">
                          Retry
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => handleBillPress(item)}
                  >
                    <MaterialIcons
                      name="chevron-right"
                      size={20}
                      color="#9ca3af"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Shimmer Effect */}
            <Animated.View
              style={[
                styles.billShimmer,
                { transform: [{ translateX: shimmerPosition }] },
              ]}
            >
              <LinearGradient
                colors={["transparent", "rgba(255,255,255,0.3)", "transparent"]}
                style={styles.shimmer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </Animated.View>
          </BlurView>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderEmptyState = () => (
    <Animated.View
      className="items-center py-16"
      style={[{ opacity: fadeAnim }]}
    >
      <BlurView intensity={20} tint="light" style={styles.emptyStateCard}>
        <View className="items-center p-8">
          <View className="w-16 h-16 bg-gray-100 rounded-full items-center justify-center mb-4">
            <MaterialIcons name="receipt-long" size={32} color="#9ca3af" />
          </View>
          <Text className="font-inter-bold text-gray-900 text-lg mb-2">
            No Bills Found
          </Text>
          <Text className="font-inter text-gray-500 text-center leading-5">
            No payment history matches your current filters. Try adjusting your
            search criteria.
          </Text>
        </View>
      </BlurView>
    </Animated.View>
  );

  const stats = getPaymentStats();
  const filteredHistory = filteredAndSortedHistory();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <LinearGradient colors={["#f8fafc", "#f1f5f9"]} className="flex-1">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: Platform.OS === "ios" ? 100 : 85,
          }}
        >
          {/* Header */}
          <Animated.View
            className="px-6 py-4"
            style={[{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}
          >
            <View className="flex-row items-center justify-between mb-6">
              <View className="flex-row items-center">
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => router.back()}
                  className="mr-4"
                >
                  <BlurView
                    intensity={20}
                    tint="light"
                    style={styles.headerButton}
                  >
                    <MaterialIcons
                      name="arrow-back"
                      size={22}
                      color="#374151"
                    />
                  </BlurView>
                </TouchableOpacity>
                <View>
                  <Text className="font-inter-bold text-gray-900 text-2xl">
                    Payment History
                  </Text>
                  <Text className="font-inter text-gray-500 text-base">
                    {filteredHistory.length} transactions found
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center space-x-3">
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setShowFilters(!showFilters)}
                >
                  <BlurView
                    intensity={20}
                    tint="light"
                    style={styles.headerButton}
                  >
                    <MaterialIcons
                      name={showFilters ? "filter-list-off" : "filter-list"}
                      size={22}
                      color="#374151"
                    />
                  </BlurView>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    const nextSort =
                      sortOrder === "newest"
                        ? "oldest"
                        : sortOrder === "oldest"
                          ? "amount_high"
                          : sortOrder === "amount_high"
                            ? "amount_low"
                            : "newest";
                    setSortOrder(nextSort);
                  }}
                >
                  <BlurView
                    intensity={20}
                    tint="light"
                    style={styles.headerButton}
                  >
                    <MaterialIcons name="sort" size={22} color="#374151" />
                  </BlurView>
                </TouchableOpacity>
              </View>
            </View>

            {/* Search Bar */}
            <BlurView intensity={20} tint="light" style={styles.searchBar}>
              <View className="flex-row items-center p-4">
                <MaterialIcons name="search" size={20} color="#9ca3af" />
                <TextInput
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search bills, providers, or transaction IDs..."
                  placeholderTextColor="#9ca3af"
                  className="font-inter text-gray-900 text-base ml-3 flex-1"
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery("")}>
                    <MaterialIcons name="clear" size={20} color="#9ca3af" />
                  </TouchableOpacity>
                )}
              </View>
            </BlurView>
          </Animated.View>

          {/* Statistics Summary */}
          <Animated.View
            className="mx-4 mb-6"
            style={[
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <BlurView intensity={30} tint="light" style={styles.statsCard}>
              <LinearGradient
                colors={["#667eea", "#764ba2"]}
                style={styles.statsGradient}
              >
                <View className="p-6">
                  <Text className="font-inter-bold text-white text-lg mb-4">
                    Payment Statistics
                  </Text>

                  <View className="flex-row justify-between mb-4">
                    <View className="flex-1">
                      <Text className="font-inter text-white opacity-80 text-sm">
                        Total Spent
                      </Text>
                      <Text className="font-inter-bold text-white text-2xl">
                        $
                        {stats.totalSpent.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </Text>
                    </View>
                    <View className="flex-1 items-end">
                      <Text className="font-inter text-white opacity-80 text-sm">
                        Success Rate
                      </Text>
                      <Text className="font-inter-bold text-white text-2xl">
                        {stats.successRate}%
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row justify-between">
                    <View className="bg-opacity-20 px-3 py-2 rounded-xl flex-1 mr-2">
                      <Text className="font-inter text-white opacity-80 text-xs">
                        Successful
                      </Text>
                      <Text className="font-inter-semibold text-white">
                        {stats.successfulPayments}
                      </Text>
                    </View>
                    <View className="bg-opacity-20 px-3 py-2 rounded-xl flex-1 ml-2">
                      <Text className="font-inter text-white opacity-80 text-xs">
                        Failed
                      </Text>
                      <Text className="font-inter-semibold text-white">
                        {stats.failedPayments}
                      </Text>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </BlurView>
          </Animated.View>

          {/* Filters */}
          {showFilters && (
            <Animated.View className="mb-6" style={[{ opacity: fadeAnim }]}>
              {/* Timeframe Filters */}
              <View className="mb-4">
                <Text className="font-inter-bold text-gray-900 text-base px-6 mb-3">
                  Time Period
                </Text>
                <FlatList
                  data={timeframeFilters}
                  renderItem={({ item }) =>
                    renderFilterChip({
                      item,
                      isSelected: selectedTimeframe === item.id,
                      onPress: () => setSelectedTimeframe(item.id),
                      type: "timeframe",
                    })
                  }
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingLeft: 24, paddingRight: 8 }}
                />
              </View>

              {/* Category Filters */}
              <View className="mb-4">
                <Text className="font-inter-bold text-gray-900 text-base px-6 mb-3">
                  Categories
                </Text>
                <FlatList
                  data={categoryFilters}
                  renderItem={({ item }) =>
                    renderFilterChip({
                      item,
                      isSelected: selectedCategory === item.id,
                      onPress: () => setSelectedCategory(item.id),
                      type: "category",
                    })
                  }
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingLeft: 24, paddingRight: 8 }}
                />
              </View>

              {/* Status Filters */}
              <View className="mb-4">
                <Text className="font-inter-bold text-gray-900 text-base px-6 mb-3">
                  Payment Status
                </Text>
                <FlatList
                  data={statusFilters}
                  renderItem={({ item }) =>
                    renderFilterChip({
                      item,
                      isSelected: selectedStatus === item.id,
                      onPress: () => setSelectedStatus(item.id),
                      type: "status",
                    })
                  }
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingLeft: 24, paddingRight: 8 }}
                />
              </View>

              {/* Sort Options */}
              <View className="mb-4">
                <Text className="font-inter-bold text-gray-900 text-base px-6 mb-3">
                  Sort By
                </Text>
                <View className="px-6">
                  <BlurView
                    intensity={20}
                    tint="light"
                    style={styles.sortContainer}
                  >
                    <View className="p-4">
                      <View className="flex-row flex-wrap">
                        {[
                          {
                            id: "newest",
                            title: "Newest First",
                            icon: "trending-down",
                          },
                          {
                            id: "oldest",
                            title: "Oldest First",
                            icon: "trending-up",
                          },
                          {
                            id: "amount_high",
                            title: "Highest Amount",
                            icon: "arrow-upward",
                          },
                          {
                            id: "amount_low",
                            title: "Lowest Amount",
                            icon: "arrow-downward",
                          },
                        ].map((sort) => (
                          <TouchableOpacity
                            key={sort.id}
                            activeOpacity={0.8}
                            onPress={() => setSortOrder(sort.id)}
                            className={`flex-row items-center px-3 py-2 rounded-xl mr-3 mb-2 ${
                              sortOrder === sort.id
                                ? "bg-blue-100"
                                : "bg-gray-100"
                            }`}
                          >
                            <MaterialIcons
                              name={sort.icon}
                              size={16}
                              color={
                                sortOrder === sort.id ? "#3b82f6" : "#6b7280"
                              }
                            />
                            <Text
                              className={`font-inter-semibold text-sm ml-2 ${
                                sortOrder === sort.id
                                  ? "text-blue-600"
                                  : "text-gray-600"
                              }`}
                            >
                              {sort.title}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </BlurView>
                </View>
              </View>

              {/* Clear Filters Button */}
              <View className="px-6">
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    setSelectedTimeframe("all");
                    setSelectedCategory("all");
                    setSelectedStatus("all");
                    setSearchQuery("");
                    setSortOrder("newest");
                  }}
                  className="mb-4"
                >
                  <BlurView
                    intensity={25}
                    tint="light"
                    style={styles.clearFiltersButton}
                  >
                    <View className="flex-row items-center justify-center p-4">
                      <MaterialIcons
                        name="clear-all"
                        size={20}
                        color="#ef4444"
                      />
                      <Text className="font-inter-semibold text-red-500 text-base ml-2">
                        Clear All Filters
                      </Text>
                    </View>
                  </BlurView>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}

          {/* Current Sort Indicator */}
          <Animated.View className="px-6 mb-4" style={[{ opacity: fadeAnim }]}>
            <View className="flex-row items-center justify-between">
              <Text className="font-inter text-gray-500 text-sm">
                Showing {filteredHistory.length} results • Sorted by{" "}
                {sortOrder === "newest"
                  ? "Newest First"
                  : sortOrder === "oldest"
                    ? "Oldest First"
                    : sortOrder === "amount_high"
                      ? "Highest Amount"
                      : "Lowest Amount"}
              </Text>
              {(selectedTimeframe !== "all" ||
                selectedCategory !== "all" ||
                selectedStatus !== "all" ||
                searchQuery) && (
                <View className="bg-blue-100 px-2 py-1 rounded-full">
                  <Text className="font-inter-semibold text-blue-600 text-xs">
                    Filtered
                  </Text>
                </View>
              )}
            </View>
          </Animated.View>

          {/* Payment History List */}
          <Animated.View
            className="px-4"
            style={[
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            {filteredHistory.length > 0 ? (
              <FlatList
                data={filteredHistory}
                renderItem={renderBillHistoryItem}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              renderEmptyState()
            )}
          </Animated.View>

          {/* Export Options */}
          {filteredHistory.length > 0 && (
            <Animated.View
              className="mx-4 mt-6 mb-8"
              style={[{ opacity: fadeAnim }]}
            >
              <BlurView intensity={25} tint="light" style={styles.exportCard}>
                <View className="p-5">
                  <Text className="font-inter-bold text-gray-900 text-lg mb-4">
                    Export Payment History
                  </Text>
                  <View className="flex-row space-x-3">
                    <TouchableOpacity
                      activeOpacity={0.8}
                      className="flex-1"
                      onPress={() => console.log("Export PDF")}
                    >
                      <LinearGradient
                        colors={["#ef4444", "#dc2626"]}
                        style={styles.exportButton}
                      >
                        <MaterialIcons
                          name="picture-as-pdf"
                          size={20}
                          color="white"
                        />
                        <Text className="font-inter-semibold text-white text-sm ml-2">
                          PDF Report
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.8}
                      className="flex-1"
                      onPress={() => console.log("Export CSV")}
                    >
                      <LinearGradient
                        colors={["#10b981", "#059669"]}
                        style={styles.exportButton}
                      >
                        <MaterialIcons
                          name="file-download"
                          size={20}
                          color="white"
                        />
                        <Text className="font-inter-semibold text-white text-sm ml-2">
                          CSV Export
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              </BlurView>
            </Animated.View>
          )}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default BillHistory;

const styles = StyleSheet.create({
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  searchBar: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  statsCard: {
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  statsGradient: {
    borderRadius: 24,
    position: "relative",
    overflow: "hidden",
  },
  filterChip: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  sortContainer: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  clearFiltersButton: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.2)",
    backgroundColor: "rgba(239, 68, 68, 0.05)",
  },
  billHistoryCard: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    position: "relative",
  },
  billShimmer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 100,
  },
  shimmer: {
    flex: 1,
    width: "100%",
  },
  emptyStateCard: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  exportCard: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  exportButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
