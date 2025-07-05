import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const Index = () => {
  // Animation refs
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const titleSlide = useRef(new Animated.Value(30)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const iconPulse = useRef(new Animated.Value(1)).current;
  const shimmerPosition = useRef(new Animated.Value(-200)).current;
  const floatingElements = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  useEffect(() => {
    // Main animation sequence
    const animationSequence = Animated.sequence([
      // Logo entrance with spring
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 80,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
      
      // Title entrance
      Animated.delay(300),
      Animated.parallel([
        Animated.spring(titleSlide, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      
      // Tagline entrance
      Animated.delay(200),
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]);

    // Icon pulse animation
    const iconPulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(iconPulse, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(iconPulse, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );

    // Shimmer effect
    const shimmerAnimation = Animated.loop(
      Animated.timing(shimmerPosition, {
        toValue: 200,
        duration: 2000,
        useNativeDriver: true,
      })
    );

    // Floating elements animation
    const floatingAnimations = floatingElements.map((element, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(element, {
            toValue: 1,
            duration: 3000 + index * 500,
            useNativeDriver: true,
          }),
          Animated.timing(element, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      )
    );

    // Start animations
    animationSequence.start();
    iconPulseAnimation.start();
    shimmerAnimation.start();
    
    // Staggered floating elements
    floatingAnimations.forEach((animation, index) => {
      setTimeout(() => animation.start(), index * 600);
    });

    // Navigation timer - redirect to tabs (main app)
    const timer = setTimeout(() => {
      router.replace('/home');
    }, 3500);

    return () => {
      clearTimeout(timer);
      iconPulseAnimation.stop();
      shimmerAnimation.stop();
      floatingAnimations.forEach(animation => animation.stop());
    };
  }, []);

  const renderFloatingElement = (animValue, icon, startX, startY, color) => (
    <Animated.View
      style={[
        styles.floatingElement,
        {
          left: startX,
          top: startY,
          transform: [
            {
              translateY: animValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -120],
              }),
            },
            {
              scale: animValue.interpolate({
                inputRange: [0, 0.3, 0.7, 1],
                outputRange: [0, 1, 1, 0],
              }),
            },
            {
              rotate: animValue.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '180deg'],
              }),
            },
          ],
          opacity: animValue.interpolate({
            inputRange: [0, 0.2, 0.8, 1],
            outputRange: [0, 0.8, 0.8, 0],
          }),
        },
      ]}
    >
      <View style={[styles.floatingIconContainer, { backgroundColor: color }]}>
        <MaterialIcons name={icon} size={20} color="white" />
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2', '#667eea']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Floating Elements */}
        {renderFloatingElement(floatingElements[0], "account-balance", width * 0.15, height * 0.25, "#4f46e5")}
        {renderFloatingElement(floatingElements[1], "credit-card", width * 0.8, height * 0.3, "#06b6d4")}
        {renderFloatingElement(floatingElements[2], "trending-up", width * 0.7, height * 0.15, "#10b981")}
        {renderFloatingElement(floatingElements[3], "security", width * 0.2, height * 0.4, "#f59e0b")}

        {/* Background Pattern */}
        <View style={styles.backgroundPattern}>
          {[...Array(6)].map((_, i) => (
            <View key={i} style={[styles.patternCircle, { 
              top: (i % 3) * height * 0.3,
              left: Math.floor(i / 3) * width * 0.5,
            }]} />
          ))}
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Logo Section */}
          <Animated.View
            style={[
              styles.logoContainer,
              {
                opacity: logoOpacity,
                transform: [{ scale: logoScale }],
              },
            ]}
          >
            {/* Main Logo Circle with Glass Effect */}
            <View style={styles.logoGlassContainer}>
              <LinearGradient
                colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.1)']}
                style={styles.logoCircle}
              >
                {/* Shimmer Effect */}
                <Animated.View
                  style={[
                    styles.shimmerContainer,
                    {
                      transform: [
                        {
                          translateX: shimmerPosition,
                        },
                      ],
                    },
                  ]}
                >
                  <LinearGradient
                    colors={['transparent', 'rgba(255,255,255,0.3)', 'transparent']}
                    style={styles.shimmer}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  />
                </Animated.View>

                {/* Main Bank Icon */}
                <Animated.View
                  style={[
                    styles.bankIcon,
                    {
                      transform: [{ scale: iconPulse }],
                    },
                  ]}
                >
                  <MaterialIcons name="account-balance" size={60} color="white" />
                </Animated.View>

                {/* Security Badge */}
                <View style={styles.securityBadge}>
                  <MaterialIcons name="verified-user" size={18} color="#10b981" />
                </View>
              </LinearGradient>

              {/* Outer Ring */}
              <View style={styles.outerRing} />
            </View>
          </Animated.View>

          {/* App Name */}
          <Animated.View
            style={[
              styles.titleContainer,
              {
                opacity: titleOpacity,
                transform: [{ translateY: titleSlide }],
              },
            ]}
          >
            <Text style={styles.appName}>Finverse</Text>
            <View style={styles.titleAccent}>
              <LinearGradient
                colors={['#60a5fa', '#3b82f6']}
                style={styles.accentGradient}
              />
            </View>
          </Animated.View>

          {/* Tagline */}
          <Animated.View
            style={[
              styles.taglineContainer,
              {
                opacity: taglineOpacity,
              },
            ]}
          >
            <Text style={styles.tagline}>Your Universe of Finance</Text>
            <View style={styles.taglineIcons}>
              <MaterialIcons name="stars" size={16} color="rgba(255,255,255,0.8)" />
              <View style={styles.iconSpacer} />
              <MaterialIcons name="trending-up" size={16} color="rgba(255,255,255,0.8)" />
              <View style={styles.iconSpacer} />
              <MaterialIcons name="security" size={16} color="rgba(255,255,255,0.8)" />
            </View>
          </Animated.View>

          {/* Loading Section */}
          <View style={styles.loadingContainer}>
            <View style={styles.loadingBar}>
              <LinearGradient
                colors={['#60a5fa', '#3b82f6', '#1d4ed8']}
                style={styles.loadingProgress}
              />
            </View>
            <Text style={styles.loadingText}>Securing your financial universe...</Text>
          </View>
        </View>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <View style={styles.trustBadges}>
            <View style={styles.trustBadge}>
              <MaterialIcons name="lock" size={16} color="rgba(255,255,255,0.9)" />
              <Text style={styles.trustText}>Bank Grade Security</Text>
            </View>
            <View style={styles.trustBadge}>
              <MaterialIcons name="verified" size={16} color="rgba(255,255,255,0.9)" />
              <Text style={styles.trustText}>FDIC Insured</Text>
            </View>
          </View>
          
          <View style={styles.versionInfo}>
            <Text style={styles.versionText}>Version 2.1.0</Text>
            <Text style={styles.copyrightText}>© 2025 Finverse • Built with 💙 for your financial freedom</Text>
          </View>
        </View>
      </LinearGradient>
      <StatusBar style="light" />
    </SafeAreaView>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  backgroundPattern: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.1,
  },
  patternCircle: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logoGlassContainer: {
    position: 'relative',
  },
  logoCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    overflow: 'hidden',
    elevation: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
  },
  shimmerContainer: {
    position: 'absolute',
    width: 60,
    height: '100%',
    zIndex: 1,
  },
  shimmer: {
    width: '100%',
    height: '100%',
  },
  bankIcon: {
    zIndex: 2,
  },
  securityBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    padding: 4,
    zIndex: 3,
  },
  outerRing: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    top: -10,
    left: -10,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  appName: {
    fontSize: 52,
    fontFamily: 'inter-bold',
    color: 'white',
    textAlign: 'center',
    letterSpacing: 3,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  titleAccent: {
    width: 100,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 12,
  },
  accentGradient: {
    flex: 1,
  },
  taglineContainer: {
    alignItems: 'center',
    marginBottom: 80,
  },
  tagline: {
    fontSize: 18,
    fontFamily: 'inter-medium',
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
  taglineIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconSpacer: {
    width: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    width: '100%',
  },
  loadingBar: {
    width: 240,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 16,
  },
  loadingProgress: {
    width: '75%',
    height: '100%',
    borderRadius: 2,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: 'inter',
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  floatingElement: {
    position: 'absolute',
    zIndex: 1,
  },
  floatingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  bottomSection: {
    paddingBottom: 40,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  trustBadges: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 30,
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  trustText: {
    fontSize: 12,
    fontFamily: 'inter-medium',
    color: 'rgba(255,255,255,0.9)',
    marginLeft: 6,
  },
  versionInfo: {
    alignItems: 'center',
  },
  versionText: {
    fontSize: 12,
    fontFamily: 'inter',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 6,
  },
  copyrightText: {
    fontSize: 11,
    fontFamily: 'inter',
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
  },
});