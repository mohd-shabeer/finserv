import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Tabs } from 'expo-router';
import { useEffect, useRef } from "react";
import {
    Animated,
    Dimensions,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get("window");

// Banking app tab configuration
const bankingTabs = [
  {
    name: "home",
    icon: "home",
    iconType: "MaterialIcons",
    label: "Home",
    gradient: ["#3b82f6", "#1d4ed8"],
    color: "#3b82f6",
  },
  {
    name: "accounts",
    icon: "account-balance",
    iconType: "MaterialIcons", 
    label: "Accounts",
    gradient: ["#10b981", "#059669"],
    color: "#10b981",
  },
  {
    name: "transfer",
    icon: "send",
    iconType: "MaterialIcons",
    label: "Transfer",
    gradient: ["#f59e0b", "#d97706"],
    color: "#f59e0b",
    isCenter: true, // Special center button
  },
  {
    name: "cards",
    icon: "credit-card",
    iconType: "MaterialIcons",
    label: "Cards", 
    gradient: ["#8b5cf6", "#7c3aed"],
    color: "#8b5cf6",
  },
  {
    name: "profile",
    icon: "person",
    iconType: "MaterialIcons",
    label: "Profile",
    gradient: ["#6b7280", "#4b5563"],
    color: "#6b7280",
  },
];

const CustomBankingTabBar = ({ state, descriptors, navigation }) => {
  const animatedValues = useRef(
    bankingTabs.map(() => new Animated.Value(0))
  ).current;
  const scaleValues = useRef(
    bankingTabs.map(() => new Animated.Value(1))
  ).current;
  const centerButtonScale = useRef(new Animated.Value(1)).current;
  const shimmerPosition = useRef(new Animated.Value(-200)).current;
  const floatingAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate tabs
    animatedValues.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: state.index === index ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });

    // Scale animation for active tab
    scaleValues.forEach((scale, index) => {
      Animated.spring(scale, {
        toValue: state.index === index ? 1.1 : 1,
        useNativeDriver: true,
        tension: 120,
        friction: 8,
      }).start();
    });

    // Special animation for center transfer button
    if (state.index === 2) { // Transfer tab index
      Animated.spring(centerButtonScale, {
        toValue: 1.05,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    } else {
      Animated.spring(centerButtonScale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    }
  }, [state.index]);

  useEffect(() => {
    // Shimmer effect animation
    const shimmerAnimation = Animated.loop(
      Animated.timing(shimmerPosition, {
        toValue: 200,
        duration: 3000,
        useNativeDriver: true,
      })
    );

    // Floating animation for center button
    const floatingAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatingAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    shimmerAnimation.start();
    floatingAnimation.start();

    return () => {
      shimmerAnimation.stop();
      floatingAnimation.stop();
    };
  }, []);

  const getIconComponent = (iconType, iconName, size, color) => {
    switch (iconType) {
      case "MaterialIcons":
        return <MaterialIcons name={iconName} size={size} color={color} />;
      case "Ionicons":
        return <Ionicons name={iconName} size={size} color={color} />;
      default:
        return <MaterialIcons name={iconName} size={size} color={color} />;
    }
  };

  const onTabPress = (route, index) => {
    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });

    if (!event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };

  const renderRegularTab = (route, index, tab) => {
    const isFocused = state.index === index;
    const animatedValue = animatedValues[index];
    const scaleValue = scaleValues[index];

    return (
      <TouchableOpacity
        key={route.key}
        style={styles.regularTabItem}
        onPress={() => onTabPress(route, index)}
        activeOpacity={0.8}
      >
        <Animated.View
          style={[
            styles.regularTabButton,
            {
              transform: [{ scale: scaleValue }],
            },
          ]}
        >
          {/* Icon Container */}
          <View style={styles.iconContainer}>
            {isFocused ? (
              <BlurView intensity={20} tint="light" style={styles.activeIconBlur}>
                <LinearGradient
                  colors={tab.gradient}
                  style={styles.activeIconGradient}
                >
                  {getIconComponent(tab.iconType, tab.icon, 22, "white")}
                  
                  {/* Shimmer effect for active tab */}
                  <Animated.View
                    style={[
                      styles.shimmerEffect,
                      {
                        transform: [{ translateX: shimmerPosition }],
                      },
                    ]}
                  >
                    <LinearGradient
                      colors={['transparent', 'rgba(255,255,255,0.4)', 'transparent']}
                      style={styles.shimmer}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    />
                  </Animated.View>
                </LinearGradient>
              </BlurView>
            ) : (
              <View style={styles.inactiveIconContainer}>
                {getIconComponent(tab.iconType, tab.icon, 20, "#9ca3af")}
              </View>
            )}
          </View>

          {/* Label */}
          <Animated.Text
            style={[
              styles.tabLabel,
              {
                opacity: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.7, 1],
                }),
                color: isFocused ? tab.color : "#9ca3af",
              },
            ]}
          >
            {tab.label}
          </Animated.Text>

          {/* Active indicator dot */}
          {isFocused && (
            <Animated.View
              style={[
                styles.activeIndicator,
                { backgroundColor: tab.color },
                {
                  opacity: animatedValue,
                  transform: [
                    {
                      scale: animatedValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1],
                      }),
                    },
                  ],
                },
              ]}
            />
          )}
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const renderCenterTab = (route, index, tab) => {
    const isFocused = state.index === index;

    return (
      <TouchableOpacity
        key={route.key}
        style={styles.centerTabContainer}
        onPress={() => onTabPress(route, index)}
        activeOpacity={0.9}
      >
        <Animated.View
          style={[
            styles.centerTabButton,
            {
              transform: [
                { scale: centerButtonScale },
                {
                  translateY: floatingAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -3],
                  }),
                },
              ],
            },
          ]}
        >
          <BlurView intensity={30} tint="light" style={styles.centerButtonBlur}>
            <LinearGradient
              colors={isFocused ? ["#f59e0b", "#d97706"] : ["#f8fafc", "#e2e8f0"]}
              style={styles.centerButtonGradient}
            >
              {getIconComponent(
                tab.iconType, 
                tab.icon, 
                24, 
                isFocused ? "white" : "#6b7280"
              )}
              
              {/* Pulse ring effect for center button */}
              {isFocused && (
                <View style={styles.pulseRing}>
                  <Animated.View
                    style={[
                      styles.pulseRingInner,
                      {
                        transform: [
                          {
                            scale: floatingAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [1, 1.3],
                            }),
                          },
                        ],
                        opacity: floatingAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.5, 0],
                        }),
                      },
                    ]}
                  />
                </View>
              )}
            </LinearGradient>
          </BlurView>
        </Animated.View>
        
        {/* Center tab label */}
        <Text
          style={[
            styles.centerTabLabel,
            { color: isFocused ? "#f59e0b" : "#9ca3af" },
          ]}
        >
          {tab.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <BlurView intensity={40} tint="light" style={styles.blurContainer}>
        <LinearGradient
          colors={["rgba(255, 255, 255, 0.95)", "rgba(248, 250, 252, 0.9)"]}
          style={styles.gradientBackground}
        >
          {/* Security indicator */}
          <View style={styles.securityIndicator}>
            <View style={styles.securityDot} />
            <Text style={styles.securityText}>Secured Connection</Text>
          </View>

          {/* Tab Container */}
          <View style={styles.tabContainer}>
            {state.routes.map((route, index) => {
              const tab = bankingTabs.find((t) => t.name === route.name);
              if (!tab) return null;

              // Render center transfer button differently
              if (tab.isCenter) {
                return renderCenterTab(route, index, tab);
              }

              return renderRegularTab(route, index, tab);
            })}
          </View>

          {/* Banking features indicators */}
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <MaterialIcons name="security" size={12} color="#10b981" />
              <Text style={styles.featureText}>256-bit SSL</Text>
            </View>
            <View style={styles.featureItem}>
              <MaterialIcons name="verified" size={12} color="#3b82f6" />
              <Text style={styles.featureText}>FDIC Insured</Text>
            </View>
          </View>
        </LinearGradient>
      </BlurView>
    </View>
  );
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
      tabBar={(props) => <CustomBankingTabBar {...props} />}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="accounts"
        options={{
          title: 'Accounts',
        }}
      />
      <Tabs.Screen
        name="transfer"
        options={{
          title: 'Transfer',
        }}
      />
      <Tabs.Screen
        name="cards"
        options={{
          title: 'Cards',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
    zIndex: 999,
  },
  blurContainer: {
    overflow: "hidden",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  gradientBackground: {
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 28 : 16,
    paddingHorizontal: 20,
    minHeight: Platform.OS === "ios" ? 80 : 70,
  },
  securityIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  securityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10b981",
    marginRight: 6,
  },
  securityText: {
    fontSize: 10,
    color: "#6b7280",
    fontFamily: "inter-medium",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  regularTabItem: {
    flex: 1,
    alignItems: "center",
  },
  regularTabButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    minHeight: 50,
  },
  iconContainer: {
    marginBottom: 4,
    position: "relative",
  },
  activeIconBlur: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
  },
  activeIconGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    position: "relative",
    overflow: "hidden",
  },
  shimmerEffect: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  shimmer: {
    flex: 1,
    width: 60,
  },
  inactiveIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(156, 163, 175, 0.1)",
  },
  tabLabel: {
    fontSize: 11,
    fontFamily: "inter-medium",
    textAlign: "center",
    marginTop: 2,
  },
  activeIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 4,
  },
  centerTabContainer: {
    alignItems: "center",
    marginTop: -10,
  },
  centerTabButton: {
    marginBottom: 4,
  },
  centerButtonBlur: {
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.8)",
  },
  centerButtonGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
    position: "relative",
  },
  pulseRing: {
    position: "absolute",
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
  },
  pulseRingInner: {
    flex: 1,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#f59e0b",
  },
  centerTabLabel: {
    fontSize: 11,
    fontFamily: "inter-semibold",
    textAlign: "center",
  },
  featuresContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 6,
    gap: 20,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  featureText: {
    fontSize: 9,
    color: "#6b7280",
    fontFamily: "inter-medium",
    marginLeft: 4,
  },
});