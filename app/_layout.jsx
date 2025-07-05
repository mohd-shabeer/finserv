import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import "react-native-reanimated";
import "../global.css";

export default function RootLayout() {
  const [loaded] = useFonts({
    // Inter fonts - Essential weights for banking app
    "Inter-Light": require("../assets/fonts/Inter_18pt-Light.ttf"),
    "Inter-Regular": require("../assets/fonts/Inter_18pt-Regular.ttf"),
    "Inter-Medium": require("../assets/fonts/Inter_18pt-Medium.ttf"),
    "Inter-SemiBold": require("../assets/fonts/Inter_18pt-SemiBold.ttf"),
    "Inter-Bold": require("../assets/fonts/Inter_18pt-Bold.ttf"),

    // Space Mono for account numbers, codes, etc.
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="+not-found" />
      <Stack.Screen name="personal-info" />
      <Stack.Screen name="add-card" />
      <Stack.Screen name="documents" />
      <Stack.Screen name="contact-support" />
      <Stack.Screen name="addresses" />
      <Stack.Screen name="add-address" />
      <Stack.Screen name="edit-address" />
      <Stack.Screen name="scan" />
      <Stack.Screen name="bills" />
      <Stack.Screen name="bill-history" />
      <Stack.Screen name="loans" />
      <Stack.Screen name="transactions" />
      <Stack.Screen name="fixed-deposits" />
      <Stack.Screen name="insurance" />
      <Stack.Screen name="services" />
      <Stack.Screen name="linked-accounts" />
      <Stack.Screen name="security-settings" />
      <Stack.Screen name="privacy-settings" />
      <Stack.Screen name="language-settings" />
      <Stack.Screen name="currency-settings" />
      <Stack.Screen name="help-center" />
      <Stack.Screen name="feedback" />
      <Stack.Screen name="about" />
      <Stack.Screen name="edit-profile" />
    </Stack>
  );
}
