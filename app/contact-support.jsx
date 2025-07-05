import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    Alert,
    Animated,
    Dimensions,
    FlatList,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Linking,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { wp } from "../helpers/common";

const { width, height } = Dimensions.get("window");

const ContactSupport = () => {
  // Enhanced Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const shimmerPosition = useRef(new Animated.Value(-200)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const tabSlideAnim = useRef(new Animated.Value(0)).current;
  const headerParallax = useRef(new Animated.Value(0)).current;

  // State management
  const [activeTab, setActiveTab] = useState("contact");
  const [chatMessages, setChatMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");
  const [isOnline, setIsOnline] = useState(true);
  const [scrollY] = useState(new Animated.Value(0));

  useEffect(() => {
    // Enhanced entrance animations with stagger effect
    const animationSequence = Animated.stagger(150, [
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
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
          toValue: 1.15,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );

    animationSequence.start();
    shimmerAnimation.start();
    pulseAnimation.start();

    // Initialize chat
    setChatMessages([
      {
        id: 1,
        type: "agent",
        message:
          "Hello! I'm Sarah from Finverse Support. How can I help you today? 👋",
        timestamp: new Date(),
        agent: {
          name: "Sarah Johnson",
          avatar:
            "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=300",
          role: "Senior Support Agent",
        },
      },
    ]);

    // Keyboard listeners
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setShowKeyboard(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setShowKeyboard(false)
    );

    return () => {
      shimmerAnimation.stop();
      pulseAnimation.stop();
      keyboardDidHideListener?.remove();
      keyboardDidShowListener?.remove();
    };
  }, []);

  // Enhanced tab change animation
  const handleTabChange = (tabId) => {
    Animated.sequence([
      Animated.timing(tabSlideAnim, {
        toValue: -10,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(tabSlideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
    setActiveTab(tabId);
  };

  // Enhanced support contact methods with better gradients
  const contactMethods = [
    {
      id: "phone",
      title: "Phone Support",
      subtitle: "24/7 Customer Service",
      icon: "phone",
      color: "#10b981",
      gradient: ["#10b981", "#059669", "#047857"],
      info: "1-800-FINVERSE",
      availability: "Available 24/7",
      waitTime: "Average wait: 2-3 minutes",
      action: () => Linking.openURL("tel:+18003468377"),
      badge: "Fastest",
    },
    {
      id: "email",
      title: "Email Support",
      subtitle: "Detailed inquiries",
      icon: "email",
      color: "#3b82f6",
      gradient: ["#3b82f6", "#1d4ed8", "#1e40af"],
      info: "support@finverse.com",
      availability: "Response within 24 hours",
      waitTime: "Business hours priority",
      action: () => Linking.openURL("mailto:support@finverse.com"),
    },
    {
      id: "chat",
      title: "Live Chat",
      subtitle: "Instant assistance",
      icon: "chat",
      color: "#f59e0b",
      gradient: ["#f59e0b", "#d97706", "#b45309"],
      info: "Chat with an agent",
      availability: isOnline ? "Available now" : "Currently offline",
      waitTime: isOnline ? "Instant response" : "Next available: 9 AM EST",
      action: () => handleTabChange("chat"),
      badge: isOnline ? "Online" : "Offline",
    },
    {
      id: "appointment",
      title: "Video Call",
      subtitle: "Face-to-face support",
      icon: "video-call",
      color: "#8b5cf6",
      gradient: ["#8b5cf6", "#7c3aed", "#6d28d9"],
      info: "Schedule a meeting",
      availability: "Monday - Friday, 9 AM - 6 PM EST",
      waitTime: "Next available slot",
      action: () =>
        Alert.alert("Video Call", "Scheduling feature coming soon!"),
      badge: "Online",
    },
  ];

  // Enhanced support categories with better icons
  const supportCategories = [
    {
      id: "account",
      title: "Account Issues",
      icon: "account-circle",
      color: "#3b82f6",
    },
    {
      id: "payments",
      title: "Payments & Transfers",
      icon: "payment",
      color: "#10b981",
    },
    {
      id: "cards",
      title: "Card Problems",
      icon: "credit-card",
      color: "#f59e0b",
    },
    {
      id: "security",
      title: "Security Concerns",
      icon: "security",
      color: "#ef4444",
    },
    {
      id: "technical",
      title: "Technical Support",
      icon: "settings",
      color: "#8b5cf6",
    },
    { id: "other", title: "Other", icon: "help-outline", color: "#6b7280" },
  ];

  // Enhanced FAQ data
  const faqData = [
    {
      id: 1,
      category: "Account",
      question: "How do I reset my account password?",
      answer:
        'You can reset your password by going to Settings > Security > Change Password, or by using the "Forgot Password" link on the login screen. For additional security, we\'ll send a verification code to your registered email.',
      helpful: 156,
      tags: ["password", "security", "login"],
      priority: "high",
    },
    {
      id: 2,
      category: "Payments",
      question: "What are the transfer limits?",
      answer:
        "Daily transfer limits vary by account type: Basic ($5,000), Premium ($25,000), Elite ($100,000). International transfers have separate limits and may require additional verification.",
      helpful: 142,
      tags: ["transfer", "limits", "payments"],
      priority: "high",
    },
    {
      id: 3,
      category: "Cards",
      question: "How do I report a lost or stolen card?",
      answer:
        'Immediately freeze your card in the app using the "Freeze Card" button, then call our 24/7 hotline at 1-800-FINVERSE or use the "Report Card" feature in the Cards section. We\'ll expedite a replacement card to you.',
      helpful: 98,
      tags: ["card", "lost", "stolen", "security"],
      priority: "critical",
    },
    {
      id: 4,
      category: "Security",
      question: "How secure is biometric authentication?",
      answer:
        "Our biometric authentication uses military-grade encryption and stores biometric data locally on your device using secure hardware. We never store biometric data on our servers.",
      helpful: 87,
      tags: ["biometric", "security", "authentication"],
      priority: "medium",
    },
    {
      id: 5,
      category: "Technical",
      question: "Why is the app running slowly?",
      answer:
        "Try these steps: 1) Close and reopen the app, 2) Check your internet connection, 3) Update to the latest version, 4) Restart your device. Contact support if issues persist.",
      helpful: 76,
      tags: ["performance", "technical", "troubleshooting"],
      priority: "medium",
    },
  ];

  // Enhanced recent tickets
  const recentTickets = [
    {
      id: "TK-2025-001",
      subject: "Unable to transfer funds to international account",
      category: "Payments",
      status: "in_progress",
      priority: "high",
      created: "2025-01-04",
      lastUpdate: "2 hours ago",
      assignedAgent: "Mike Rodriguez",
      progress: 75,
    },
    {
      id: "TK-2025-002",
      subject: "Card transaction declined at merchant",
      category: "Cards",
      status: "resolved",
      priority: "medium",
      created: "2025-01-02",
      lastUpdate: "1 day ago",
      assignedAgent: "Lisa Chen",
      progress: 100,
    },
  ];

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      message: messageInput.trim(),
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setMessageInput("");
    setIsTyping(true);

    // Enhanced agent responses with more variety
    const responses = [
      "Thank you for your message. I understand your concern and I'll help you resolve this issue. Let me check your account details.",
      "I see what you're experiencing. This is a common issue and I have a solution for you. Give me just a moment.",
      "Perfect! I can definitely help you with that. Let me pull up the relevant information for your account.",
      "Great question! I'll walk you through the solution step by step. First, let me verify a few details.",
    ];

    setTimeout(
      () => {
        const agentMessage = {
          id: Date.now() + 1,
          type: "agent",
          message: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date(),
          agent: {
            name: "Sarah Johnson",
            avatar:
              "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=300",
            role: "Senior Support Agent",
          },
        };
        setChatMessages((prev) => [...prev, agentMessage]);
        setIsTyping(false);
      },
      2000 + Math.random() * 1000
    );
  };

  const handleCreateTicket = () => {
    if (!selectedCategory || !ticketSubject.trim() || !ticketMessage.trim()) {
      Alert.alert(
        "Missing Information",
        "Please fill in all required fields to create your support ticket."
      );
      return;
    }

    Alert.alert(
      "Ticket Created Successfully! 🎉",
      `Your support ticket has been created and assigned to our team.\n\n📋 Ticket ID: TK-2025-003\n📂 Category: ${selectedCategory}\n📝 Subject: ${ticketSubject}\n\n⏰ Expected response time: 2-4 hours\n👨‍💼 Assigned Agent: Will be notified shortly`,
      [
        {
          text: "View Ticket",
          style: "default",
          onPress: () => handleTabChange("ticket"),
        },
        {
          text: "Create Another",
          onPress: () => {
            setSelectedCategory("");
            setTicketSubject("");
            setTicketMessage("");
          },
        },
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "#f59e0b";
      case "in_progress":
        return "#3b82f6";
      case "resolved":
        return "#10b981";
      case "closed":
        return "#6b7280";
      default:
        return "#6b7280";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "critical":
        return "#dc2626";
      case "high":
        return "#ef4444";
      case "medium":
        return "#f59e0b";
      case "low":
        return "#10b981";
      default:
        return "#6b7280";
    }
  };

  const renderContactMethod = ({ item, index }) => (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
          transform: [
            {
              translateY: slideAnim.interpolate({
                inputRange: [0, 50],
                outputRange: [0, 50],
              }),
            },
            { scale: scaleAnim },
          ],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={item.action}
        className="mb-6"
      >
        <BlurView intensity={30} tint="light" style={styles.contactMethodCard}>
          <LinearGradient
            colors={item.gradient}
            style={styles.contactMethodGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View className="p-6">
              <View className="flex-row items-center justify-between mb-6">
                <View className="flex-row items-center flex-1">
                  <View className="relative">
                    <BlurView
                      intensity={25}
                      tint="light"
                      style={styles.contactIconContainer}
                    >
                      <MaterialIcons name={item.icon} size={28} color="white" />
                    </BlurView>
                    {item.badge && (
                      <View className="absolute -top-2 -right-2 bg-white px-2 py-1 rounded-full">
                        <Text
                          className="font-inter-bold text-xs text-nowrap"
                          style={{ color: item.color }}
                        >
                          {item.badge}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View className="ml-4 flex-1">
                    <Text className="font-inter-bold text-white text-xl mb-1">
                      {item.title}
                    </Text>
                    <Text className="font-inter text-white opacity-90 text-base">
                      {item.subtitle}
                    </Text>
                  </View>
                </View>
                {item.id === "chat" && (
                  <Animated.View
                    style={[
                      styles.onlineIndicator,
                      {
                        backgroundColor: isOnline ? "#10b981" : "#ef4444",
                        transform: [{ scale: isOnline ? pulseAnim : 1 }],
                      },
                    ]}
                  />
                )}
              </View>

              <BlurView
                intensity={20}
                tint="light"
                style={styles.contactInfoCard}
              >
                <View className="p-4">
                  <View className="flex-row justify-between items-center mb-3">
                    <Text className="font-inter text-white opacity-80 text-sm">
                      Contact Information
                    </Text>
                    <Text className="font-inter-bold text-white text-base">
                      {item.info}
                    </Text>
                  </View>
                  <View className="h-px bg-white opacity-20 mb-3" />
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="font-inter text-white opacity-80 text-sm">
                      Availability
                    </Text>
                    <Text className="font-inter-semibold text-white text-sm">
                      {item.availability}
                    </Text>
                  </View>
                  <View className="flex-row justify-between items-center">
                    <Text className="font-inter text-white opacity-80 text-sm">
                      Response Time
                    </Text>
                    <Text className="font-inter-semibold text-white text-sm">
                      {item.waitTime}
                    </Text>
                  </View>
                </View>
              </BlurView>
            </View>

            {/* Enhanced Shimmer Effect */}
            <Animated.View
              style={[
                styles.contactShimmer,
                { transform: [{ translateX: shimmerPosition }] },
              ]}
            >
              <LinearGradient
                colors={[
                  "transparent",
                  "rgba(255,255,255,0.25)",
                  "transparent",
                ]}
                style={styles.shimmer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </Animated.View>

            {/* Decorative Elements */}
            <View style={styles.decorativeCircle1} />
            <View style={styles.decorativeCircle2} />
          </LinearGradient>
        </BlurView>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderChatMessage = ({ item, index }) => (
    <Animated.View
      entering={() => ({
        opacity: 0,
        transform: [{ translateY: 20 }, { scale: 0.95 }],
      })}
      className={`mb-6 ${item.type === "user" ? "items-end" : "items-start"}`}
    >
      {item.type === "agent" && (
        <View className="flex-row items-center mb-3">
          <Image
            source={{ uri: item.agent.avatar }}
            className="w-10 h-10 rounded-full mr-3"
          />
          <View>
            <Text className="font-inter-bold text-gray-900 text-base">
              {item.agent.name}
            </Text>
            <View className="flex-row items-center">
              <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
              <Text className="font-inter text-gray-500 text-sm">
                {item.agent.role}
              </Text>
            </View>
          </View>
        </View>
      )}

      <BlurView
        intensity={25}
        tint={item.type === "user" ? "dark" : "light"}
        style={[
          styles.messageContainer,
          {
            maxWidth: wp(75),
          },
        ]}
      >
        {item.type === "user" ? (
          <LinearGradient
            colors={["#3b82f6", "#1d4ed8"]}
            style={styles.userMessageGradient}
          >
            <Text className="font-inter text-white text-base leading-6">
              {item.message}
            </Text>
          </LinearGradient>
        ) : (
          <View className="p-4">
            <Text className="font-inter text-gray-900 text-base leading-6">
              {item.message}
            </Text>
          </View>
        )}
      </BlurView>

      <Text className="font-inter text-gray-400 text-xs mt-2">
        {item.timestamp.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>
    </Animated.View>
  );

  const renderFAQ = ({ item, index }) => (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <BlurView intensity={25} tint="light" style={styles.faqItem}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => Alert.alert(item.question, item.answer)}
          className="p-5"
        >
          <View className="flex-row items-start justify-between mb-3">
            <Text className="font-inter-bold text-gray-900 text-base flex-1 mr-3 leading-6">
              {item.question}
            </Text>
            <View className="flex-row items-center space-x-2">
              <View
                className="px-3 py-1 rounded-full"
                style={{
                  backgroundColor: `${getPriorityColor(item.priority)}15`,
                }}
              >
                <Text
                  className="font-inter-bold text-xs"
                  style={{ color: getPriorityColor(item.priority) }}
                >
                  {item.priority?.toUpperCase()}
                </Text>
              </View>
              <View className="bg-blue-100 px-3 py-1 rounded-full">
                <Text className="font-inter-bold text-blue-600 text-xs">
                  {item.category}
                </Text>
              </View>
            </View>
          </View>

          <Text className="font-inter text-gray-600 text-sm mb-4 leading-5">
            {item.answer.length > 120
              ? `${item.answer.substring(0, 120)}...`
              : item.answer}
          </Text>

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <MaterialIcons name="thumb-up" size={18} color="#10b981" />
              <Text className="font-inter-medium text-gray-500 text-sm ml-2">
                {item.helpful} found helpful
              </Text>
            </View>
            <View className="flex-row items-center">
              <Text className="font-inter-medium text-blue-600 text-sm mr-1">
                Read More
              </Text>
              <MaterialIcons name="chevron-right" size={20} color="#3b82f6" />
            </View>
          </View>
        </TouchableOpacity>
      </BlurView>
    </Animated.View>
  );

  const renderTicket = ({ item, index }) => (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <BlurView intensity={25} tint="light" style={styles.ticketItem}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() =>
            Alert.alert(
              "Ticket Details",
              `Ticket ID: ${item.id}\nSubject: ${item.subject}\nStatus: ${item.status}\nProgress: ${item.progress}%\nAssigned Agent: ${item.assignedAgent}`
            )
          }
          className="p-5"
        >
          <View className="flex-row items-center justify-between mb-4">
            <Text className="font-inter-bold text-gray-900 text-lg">
              {item.id}
            </Text>
            <View className="flex-row items-center space-x-2">
              <View
                className="px-3 py-1 rounded-full"
                style={{
                  backgroundColor: `${getPriorityColor(item.priority)}15`,
                }}
              >
                <Text
                  className="font-inter-bold text-xs"
                  style={{ color: getPriorityColor(item.priority) }}
                >
                  {item.priority?.toUpperCase()}
                </Text>
              </View>
              <View
                className="px-3 py-1 rounded-full"
                style={{ backgroundColor: `${getStatusColor(item.status)}15` }}
              >
                <Text
                  className="font-inter-bold text-xs"
                  style={{ color: getStatusColor(item.status) }}
                >
                  {item.status.replace("_", " ").toUpperCase()}
                </Text>
              </View>
            </View>
          </View>

          <Text className="font-inter-bold text-gray-800 text-base mb-3">
            {item.subject}
          </Text>

          {/* Progress Bar */}
          {item.status === "in_progress" && (
            <View className="mb-4">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="font-inter-medium text-gray-600 text-sm">
                  Progress
                </Text>
                <Text className="font-inter-bold text-gray-900 text-sm">
                  {item.progress}%
                </Text>
              </View>
              <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <View
                  className="h-full rounded-full"
                  style={{
                    width: `${item.progress}%`,
                    backgroundColor: getStatusColor(item.status),
                  }}
                />
              </View>
            </View>
          )}

          <View className="flex-row justify-between items-center mb-3">
            <Text className="font-inter text-gray-500 text-sm">
              Created: {new Date(item.created).toLocaleDateString()}
            </Text>
            <Text className="font-inter text-gray-500 text-sm">
              Updated: {item.lastUpdate}
            </Text>
          </View>

          <View className="flex-row items-center justify-between">
            <Text className="font-inter-medium text-gray-600 text-sm">
              👨‍💼 {item.assignedAgent}
            </Text>
            <MaterialIcons name="open-in-new" size={18} color="#3b82f6" />
          </View>
        </TouchableOpacity>
      </BlurView>
    </Animated.View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "chat":
        return (
          <Animated.View
            className="flex-1"
            style={{ transform: [{ translateY: tabSlideAnim }] }}
          >
            {/* Enhanced Chat Header */}
            <BlurView intensity={30} tint="light" style={styles.chatHeader}>
              <LinearGradient
                colors={["rgba(255,255,255,0.9)", "rgba(248,250,252,0.8)"]}
                style={styles.chatHeaderGradient}
              >
                <View className="flex-row items-center p-5">
                  <Image
                    source={{
                      uri: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=300",
                    }}
                    className="w-14 h-14 rounded-2xl mr-4"
                  />
                  <View className="flex-1">
                    <Text className="font-inter-bold text-gray-900 text-lg">
                      Sarah Johnson
                    </Text>
                    <View className="flex-row items-center">
                      <Animated.View
                        className="w-3 h-3 bg-green-500 rounded-full mr-2"
                        style={{ transform: [{ scale: pulseAnim }] }}
                      />
                      <Text className="font-inter-medium text-gray-600 text-sm">
                        Online • Senior Support Agent
                      </Text>
                    </View>
                    <Text className="font-inter text-gray-500 text-xs mt-1">
                      Avg. response time: 30 seconds
                    </Text>
                  </View>
                  <TouchableOpacity activeOpacity={0.7} className="p-2">
                    <MaterialIcons name="more-vert" size={24} color="#6b7280" />
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </BlurView>

            {/* Chat Messages */}
            <FlatList
              data={chatMessages}
              renderItem={renderChatMessage}
              style={styles.chatMessages}
              contentContainerStyle={{ padding: 20 }}
              showsVerticalScrollIndicator={false}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: false }
              )}
            />

            {/* Enhanced Typing Indicator */}
            {isTyping && (
              <Animated.View
                className="px-5 mb-3"
                entering={() => ({
                  opacity: 0,
                  transform: [{ translateY: 20 }],
                })}
              >
                <BlurView
                  intensity={20}
                  tint="light"
                  style={styles.typingIndicator}
                >
                  <View className="flex-row items-center p-4">
                    <Image
                      source={{
                        uri: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=300",
                      }}
                      className="w-8 h-8 rounded-full mr-3"
                    />
                    <View className="flex-row space-x-1">
                      <Animated.View className="w-2 h-2 bg-gray-400 rounded-full" />
                      <Animated.View className="w-2 h-2 bg-gray-400 rounded-full" />
                      <Animated.View className="w-2 h-2 bg-gray-400 rounded-full" />
                    </View>
                    <Text className="font-inter-medium text-gray-500 text-sm ml-3">
                      Sarah is typing...
                    </Text>
                  </View>
                </BlurView>
              </Animated.View>
            )}

            {/* Enhanced Chat Input */}
            <BlurView
              intensity={40}
              tint="light"
              style={styles.chatInputContainer}
            >
              <LinearGradient
                colors={["rgba(255,255,255,0.95)", "rgba(248,250,252,0.9)"]}
                style={styles.chatInputGradient}
              >
                <View className="flex-row items-end p-5 space-x-3">
                  <TouchableOpacity
                    activeOpacity={0.7}
                    className="p-3 bg-gray-100 rounded-2xl"
                  >
                    <MaterialIcons name="add" size={20} color="#6b7280" />
                  </TouchableOpacity>

                  <BlurView
                    intensity={25}
                    tint="light"
                    style={styles.messageInputContainer}
                  >
                    <TextInput
                      value={messageInput}
                      onChangeText={setMessageInput}
                      placeholder="Type your message..."
                      placeholderTextColor="#9ca3af"
                      className="font-inter text-gray-900 text-base flex-1 p-4"
                      multiline
                      maxLength={500}
                      style={{ maxHeight: 100 }}
                    />
                  </BlurView>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleSendMessage}
                    disabled={!messageInput.trim()}
                  >
                    <LinearGradient
                      colors={
                        messageInput.trim()
                          ? ["#3b82f6", "#1d4ed8"]
                          : ["#e5e7eb", "#d1d5db"]
                      }
                      style={styles.sendButton}
                    >
                      <MaterialIcons
                        name="send"
                        size={22}
                        color={messageInput.trim() ? "white" : "#9ca3af"}
                      />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </BlurView>
          </Animated.View>
        );

      case "ticket":
        return (
          <Animated.View
            className="flex-1"
            style={{ transform: [{ translateY: tabSlideAnim }] }}
          >
            <ScrollView
              className="flex-1"
              contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
              showsVerticalScrollIndicator={false}
            >
              {/* Enhanced Create New Ticket */}
              <BlurView intensity={30} tint="light" style={styles.ticketForm}>
                <LinearGradient
                  colors={["rgba(255,255,255,0.9)", "rgba(248,250,252,0.8)"]}
                  style={styles.ticketFormGradient}
                >
                  <View className="p-6">
                    <View className="flex-row items-center mb-6">
                      <View className="w-12 h-12 bg-blue-600 rounded-2xl items-center justify-center mr-4">
                        <MaterialIcons
                          name="assignment"
                          size={24}
                          color="white"
                        />
                      </View>
                      <View>
                        <Text className="font-inter-bold text-gray-900 text-xl">
                          Create Support Ticket
                        </Text>
                        <Text className="font-inter text-gray-500 text-sm">
                          We'll get back to you within 2-4 hours
                        </Text>
                      </View>
                    </View>

                    {/* Enhanced Category Selection */}
                    <Text className="font-inter-bold text-gray-800 text-base mb-4">
                      Select Category *
                    </Text>
                    <View className="flex-row flex-wrap mb-6">
                      {supportCategories.map((category) => (
                        <TouchableOpacity
                          key={category.id}
                          activeOpacity={0.8}
                          onPress={() => setSelectedCategory(category.title)}
                          className={`mr-3 mb-3 px-4 py-3 rounded-2xl flex-row items-center ${
                            selectedCategory === category.title
                              ? "bg-blue-600"
                              : "bg-gray-100"
                          }`}
                        >
                          <MaterialIcons
                            name={category.icon}
                            size={18}
                            color={
                              selectedCategory === category.title
                                ? "white"
                                : category.color
                            }
                          />
                          <Text
                            className={`font-inter-semibold text-sm ml-2 ${
                              selectedCategory === category.title
                                ? "text-white"
                                : "text-gray-700"
                            }`}
                          >
                            {category.title}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    {/* Enhanced Subject Field */}
                    <Text className="font-inter-bold text-gray-800 text-base mb-3">
                      Subject *
                    </Text>
                    <BlurView
                      intensity={20}
                      tint="light"
                      style={styles.inputField}
                    >
                      <TextInput
                        value={ticketSubject}
                        onChangeText={setTicketSubject}
                        placeholder="Brief description of your issue"
                        placeholderTextColor="#9ca3af"
                        className="font-inter text-gray-900 text-base p-4"
                      />
                    </BlurView>

                    {/* Enhanced Message Field */}
                    <Text className="font-inter-bold text-gray-800 text-base mb-3 mt-5">
                      Description *
                    </Text>
                    <BlurView
                      intensity={20}
                      tint="light"
                      style={styles.textAreaField}
                    >
                      <TextInput
                        value={ticketMessage}
                        onChangeText={setTicketMessage}
                        placeholder="Please provide detailed information about your issue. Include any error messages, steps you've tried, and when the issue started..."
                        placeholderTextColor="#9ca3af"
                        className="font-inter text-gray-900 text-base p-4"
                        multiline
                        numberOfLines={6}
                        textAlignVertical="top"
                      />
                    </BlurView>

                    {/* Enhanced Submit Button */}
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={handleCreateTicket}
                      className="mt-8"
                    >
                      <LinearGradient
                        colors={["#10b981", "#059669", "#047857"]}
                        style={styles.submitButton}
                      >
                        <MaterialIcons
                          name="assignment"
                          size={22}
                          color="white"
                        />
                        <Text className="font-inter-bold text-white text-base ml-3">
                          Create Ticket
                        </Text>
                        <View className="absolute right-4">
                          <MaterialIcons
                            name="arrow-forward"
                            size={20}
                            color="rgba(255,255,255,0.8)"
                          />
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </BlurView>

              {/* Enhanced Recent Tickets */}
              <Text className="font-inter-bold text-gray-900 text-xl mt-8 mb-6">
                Your Recent Tickets
              </Text>
              {recentTickets.length > 0 ? (
                recentTickets.map((ticket, index) => (
                  <View key={ticket.id} className="mb-4">
                    {renderTicket({ item: ticket, index })}
                  </View>
                ))
              ) : (
                <BlurView intensity={20} tint="light" style={styles.emptyState}>
                  <View className="items-center p-8">
                    <MaterialIcons
                      name="assignment-turned-in"
                      size={48}
                      color="#9ca3af"
                    />
                    <Text className="font-inter-bold text-gray-600 text-lg mt-4">
                      No Recent Tickets
                    </Text>
                    <Text className="font-inter text-gray-500 text-center mt-2 leading-5">
                      You haven't created any support tickets recently. Create
                      your first ticket above!
                    </Text>
                  </View>
                </BlurView>
              )}
            </ScrollView>
          </Animated.View>
        );

      case "faq":
        return (
          <Animated.View
            className="flex-1"
            style={{ transform: [{ translateY: tabSlideAnim }] }}
          >
            <ScrollView
              className="flex-1"
              contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
              showsVerticalScrollIndicator={false}
            >
              <View className="flex-row items-center mb-6">
                <View className="w-12 h-12 bg-purple-600 rounded-2xl items-center justify-center mr-4">
                  <MaterialIcons name="help-outline" size={24} color="white" />
                </View>
                <View>
                  <Text className="font-inter-bold text-gray-900 text-xl">
                    Frequently Asked Questions
                  </Text>
                  <Text className="font-inter text-gray-500 text-sm">
                    Quick answers to common questions
                  </Text>
                </View>
              </View>

              {/* Search Bar */}
              <BlurView intensity={20} tint="light" style={styles.searchBar}>
                <View className="flex-row items-center p-4">
                  <MaterialIcons name="search" size={20} color="#9ca3af" />
                  <TextInput
                    placeholder="Search FAQs..."
                    placeholderTextColor="#9ca3af"
                    className="font-inter text-gray-900 text-base ml-3 flex-1"
                  />
                </View>
              </BlurView>

              {faqData.map((faq, index) => (
                <View key={faq.id} className="mb-4">
                  {renderFAQ({ item: faq, index })}
                </View>
              ))}
            </ScrollView>
          </Animated.View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <LinearGradient
        colors={["#f8fafc", "#f1f5f9", "#e2e8f0"]}
        className="flex-1"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="flex-1 pb-24">
              {/* Enhanced Header with Parallax Effect */}
              <Animated.View
                style={[
                  {
                    opacity: fadeAnim,
                    transform: [{ scale: scaleAnim }],
                  },
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
                        <BlurView
                          intensity={25}
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

                      <View className="items-center">
                        <Text className="font-inter-bold text-gray-900 text-xl">
                          Contact Support
                        </Text>
                        <View className="flex-row items-center mt-1">
                          <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                          <Text className="font-inter-medium text-gray-600 text-sm">
                            We're here to help 24/7
                          </Text>
                        </View>
                      </View>

                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() =>
                          Alert.alert(
                            "Emergency Support 🚨",
                            "For urgent security issues or emergencies:\n\n📞 Call: 1-800-FINVERSE\n💬 Text: HELP to 12345\n🔒 Freeze all accounts instantly in Settings\n\nOur emergency team is available 24/7.",
                            [
                              {
                                text: "Call Now",
                                onPress: () =>
                                  Linking.openURL("tel:+18003468377"),
                              },
                              { text: "OK", style: "cancel" },
                            ]
                          )
                        }
                      >
                        <BlurView
                          intensity={25}
                          tint="light"
                          style={styles.emergencyButton}
                        >
                          <MaterialIcons
                            name="emergency"
                            size={22}
                            color="#ef4444"
                          />
                        </BlurView>
                      </TouchableOpacity>
                    </View>
                  </LinearGradient>
                </BlurView>
              </Animated.View>

              {/* Main Content */}
              {activeTab === "contact" && (
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingTop: 20,
                    paddingHorizontal: 16,
                  }}
                >
                  <Animated.View
                    style={[
                      {
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }],
                      },
                    ]}
                  >
                    <Text className="font-inter-bold text-gray-900 text-2xl mb-2 text-center">
                      How can we help you? 🤝
                    </Text>
                    <Text className="font-inter text-gray-600 text-center text-base mb-8 leading-6">
                      Choose your preferred way to get support from our expert
                      team
                    </Text>
                    <FlatList
                      data={contactMethods}
                      renderItem={renderContactMethod}
                      scrollEnabled={false}
                    />
                  </Animated.View>
                </ScrollView>
              )}

              {/* Tab Content */}
              {activeTab !== "contact" && (
                <View
                  className="flex-1"
                >
                  {renderTabContent()}
                </View>
              )}

              {/* Enhanced Tab Navigation */}
              <View
                className="absolute bottom-0 left-0 right-0"
              >
                <BlurView
                  intensity={45}
                  tint="light"
                  style={styles.tabNavigation}
                >
                  <LinearGradient
                    colors={["rgba(255,255,255,0.95)", "rgba(248,250,252,0.9)"]}
                    style={styles.tabGradient}
                  >
                    <View className="flex-row items-center justify-around px-6 py-4">
                      {[
                        {
                          id: "contact",
                          icon: "support-agent",
                          label: "Contact",
                          color: "#10b981",
                        },
                        {
                          id: "chat",
                          icon: "chat",
                          label: "Live Chat",
                          color: "#f59e0b",
                        },
                        {
                          id: "ticket",
                          icon: "assignment",
                          label: "Tickets",
                          color: "#3b82f6",
                        },
                        {
                          id: "faq",
                          icon: "help-outline",
                          label: "FAQ",
                          color: "#8b5cf6",
                        },
                      ].map((tab) => (
                        <TouchableOpacity
                          key={tab.id}
                          activeOpacity={0.8}
                          onPress={() => handleTabChange(tab.id)}
                          className="items-center relative"
                        >
                          {activeTab === tab.id ? (
                            <LinearGradient
                              colors={[tab.color, `${tab.color}CC`]}
                              style={styles.activeTabButton}
                            >
                              <MaterialIcons
                                name={tab.icon}
                                size={24}
                                color="white"
                              />
                            </LinearGradient>
                          ) : (
                            <View className="w-12 h-12 rounded-2xl bg-gray-100 items-center justify-center">
                              <MaterialIcons
                                name={tab.icon}
                                size={24}
                                color="#9ca3af"
                              />
                            </View>
                          )}
                          <Text
                            className={`font-inter-semibold text-xs mt-2 ${
                              activeTab === tab.id
                                ? "text-gray-900"
                                : "text-gray-500"
                            }`}
                          >
                            {tab.label}
                          </Text>
                          {/* Active indicator */}
                          {activeTab === tab.id && (
                            <View
                              className="absolute -top-1 w-1 h-1 rounded-full"
                              style={{ backgroundColor: tab.color }}
                            />
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>
                  </LinearGradient>
                </BlurView>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default ContactSupport;

const styles = StyleSheet.create({
  // Header Styles
  header: {
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  headerGradient: {
    borderRadius: 24,
  },
  headerButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  emergencyButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.2)",
  },

  // Contact Method Cards
  contactMethodCard: {
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  contactMethodGradient: {
    borderRadius: 24,
    position: "relative",
    overflow: "hidden",
  },
  contactIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  contactInfoCard: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  contactShimmer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 120,
  },
  shimmer: {
    flex: 1,
    width: "100%",
  },
  decorativeCircle1: {
    position: "absolute",
    top: -20,
    right: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  decorativeCircle2: {
    position: "absolute",
    bottom: -30,
    left: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  onlineIndicator: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },

  // Tab Navigation
  tabNavigation: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    overflow: "hidden",
  },
  tabGradient: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  activeTabButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },

  // Chat Styles
  chatHeader: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.3)",
    overflow: "hidden",
  },
  chatHeaderGradient: {
    overflow: "hidden",
  },
  chatMessages: {
    flex: 1,
    backgroundColor: "transparent",
  },
  messageContainer: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  userMessageGradient: {
    padding: 16,
    borderRadius: 20,
  },
  typingIndicator: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    maxWidth: "70%",
  },
  chatInputContainer: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.3)",
    overflow: "hidden",
  },
  chatInputGradient: {
    overflow: "hidden",
  },
  messageInputContainer: {
    flex: 1,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },

  // Ticket Styles
  ticketForm: {
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  ticketFormGradient: {
    borderRadius: 24,
  },
  inputField: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  textAreaField: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  submitButton: {
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  ticketItem: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  emptyState: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },

  // FAQ Styles
  faqItem: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  searchBar: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    marginBottom: 20,
  },
});
