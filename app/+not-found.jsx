import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const NotFound = () => {
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const shimmerPosition = useRef(new Animated.Value(-200)).current;
  
  // Floating elements animation
  const floatingElements = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  useEffect(() => {
    // Main entrance animations
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

    // Bounce animation for the 404 icon
    const bounceAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    // Shimmer effect
    const shimmerAnimation = Animated.loop(
      Animated.timing(shimmerPosition, {
        toValue: 200,
        duration: 3000,
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

    bounceAnimation.start();
    shimmerAnimation.start();
    
    // Staggered floating elements
    floatingAnimations.forEach((animation, index) => {
      setTimeout(() => animation.start(), index * 800);
    });

    return () => {
      bounceAnimation.stop();
      shimmerAnimation.stop();
      floatingAnimations.forEach(animation => animation.stop());
    };
  }, []);

  const handleGoHome = () => {
    router.replace('/(tabs)/home');
  };

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/home');
    }
  };

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
        <MaterialIcons name={icon} size={16} color="white" />
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2', '#667eea']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Floating Elements */}
        {renderFloatingElement(floatingElements[0], "error-outline", width * 0.15, height * 0.25, "#ef4444")}
        {renderFloatingElement(floatingElements[1], "search-off", width * 0.8, height * 0.3, "#f59e0b")}
        {renderFloatingElement(floatingElements[2], "home", width * 0.7, height * 0.15, "#10b981")}
        {renderFloatingElement(floatingElements[3], "help-outline", width * 0.2, height * 0.4, "#8b5cf6")}

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
          {/* 404 Icon */}
          <Animated.View
            style={[
              styles.iconContainer,
              {
                opacity: fadeAnim,
                transform: [
                  { scale: scaleAnim },
                  {
                    translateY: bounceAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -20],
                    }),
                  },
                ],
              },
            ]}
          >
            <BlurView intensity={30} tint="light" style={styles.iconBlur}>
              <LinearGradient
                colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.1)']}
                style={styles.iconCircle}
              >
                {/* Shimmer Effect */}
                <Animated.View
                  style={[
                    styles.shimmerContainer,
                    {
                      transform: [{ translateX: shimmerPosition }],
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

                {/* 404 Text */}
                <Text style={styles.errorCode}>404</Text>
              </LinearGradient>
            </BlurView>
          </Animated.View>

          {/* Error Message */}
          <Animated.View
            style={[
              styles.messageContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.errorTitle}>Page Not Found</Text>
            <Text style={styles.errorSubtitle}>
              Oops! The page you're looking for seems to have gone on a financial adventure.
            </Text>
            <Text style={styles.errorDescription}>
              Don't worry, your money is safe with us. Let's get you back to managing your finances.
            </Text>
          </Animated.View>

          {/* Action Buttons */}
          <Animated.View
            style={[
              styles.buttonsContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Go Home Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleGoHome}
              style={styles.primaryButton}
            >
              <BlurView intensity={40} tint="light" style={styles.buttonBlur}>
                <LinearGradient
                  colors={['#3b82f6', '#1d4ed8']}
                  style={styles.buttonGradient}
                >
                  <MaterialIcons name="home" size={20} color="white" />
                  <Text style={styles.primaryButtonText}>Go to Home</Text>
                  
                  {/* Button Shimmer */}
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

            {/* Go Back Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleGoBack}
              style={styles.secondaryButton}
            >
              <BlurView intensity={30} tint="light" style={styles.secondaryButtonBlur}>
                <View style={styles.secondaryButtonContent}>
                  <MaterialIcons name="arrow-back" size={20} color="#374151" />
                  <Text style={styles.secondaryButtonText}>Go Back</Text>
                </View>
              </BlurView>
            </TouchableOpacity>
          </Animated.View>

          {/* Help Section */}
          <Animated.View
            style={[
              styles.helpContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.helpText}>Need assistance?</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push('/contact-support')}
              style={styles.helpButton}
            >
              <MaterialIcons name="support-agent" size={16} color="#60a5fa" />
              <Text style={styles.helpButtonText}>Contact Support</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <View style={styles.trustBadges}>
            <View style={styles.trustBadge}>
              <MaterialIcons name="security" size={16} color="rgba(255,255,255,0.9)" />
              <Text style={styles.trustText}>Your data is secure</Text>
            </View>
            <View style={styles.trustBadge}>
              <MaterialIcons name="verified" size={16} color="rgba(255,255,255,0.9)" />
              <Text style={styles.trustText}>FDIC Insured</Text>
            </View>
          </View>
          
          <View style={styles.versionInfo}>
            <Text style={styles.versionText}>Finverse Banking</Text>
            <Text style={styles.copyrightText}>© 2025 Finverse • Secure banking you can trust</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

export default NotFound;

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
  iconContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconBlur: {
    width: 160,
    height: 160,
    borderRadius: 80,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  iconCircle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 80,
    position: 'relative',
    overflow: 'hidden',
  },
  shimmerContainer: {
    position: 'absolute',
    width: 80,
    height: '100%',
    zIndex: 1,
  },
  shimmer: {
    width: '100%',
    height: '100%',
  },
  errorCode: {
    fontSize: 48,
    fontFamily: 'inter-bold',
    color: 'white',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
    zIndex: 2,
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  errorTitle: {
    fontSize: 32,
    fontFamily: 'inter-bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  errorSubtitle: {
    fontSize: 18,
    fontFamily: 'inter-medium',
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 24,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
  errorDescription: {
    fontSize: 16,
    fontFamily: 'inter',
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 22,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
  buttonsContainer: {
    width: '100%',
    marginBottom: 40,
  },
  primaryButton: {
    marginBottom: 16,
  },
  buttonBlur: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    flexDirection: 'row',
    position: 'relative',
    overflow: 'hidden',
  },
  primaryButtonText: {
    fontSize: 18,
    fontFamily: 'inter-semibold',
    color: 'white',
    marginLeft: 8,
  },
  buttonShimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 100,
  },
  secondaryButton: {
    marginBottom: 16,
  },
  secondaryButtonBlur: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  secondaryButtonContent: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  secondaryButtonText: {
    fontSize: 18,
    fontFamily: 'inter-semibold',
    color: '#374151',
    marginLeft: 8,
  },
  helpContainer: {
    alignItems: 'center',
  },
  helpText: {
    fontSize: 14,
    fontFamily: 'inter',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 12,
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  helpButtonText: {
    fontSize: 14,
    fontFamily: 'inter-medium',
    color: '#60a5fa',
    marginLeft: 6,
  },
  floatingElement: {
    position: 'absolute',
    zIndex: 1,
  },
  floatingIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
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
    fontSize: 14,
    fontFamily: 'inter-semibold',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 6,
  },
  copyrightText: {
    fontSize: 11,
    fontFamily: 'inter',
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
  },
});