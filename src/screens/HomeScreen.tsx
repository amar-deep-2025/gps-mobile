import React from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import type { RootStackParamList } from "../navigation/AppNavigator";

import {useSelector} from "react-redux";

import type { RootState } from "../store/store";


type HomeNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;

export default function HomeScreen() {

  const isLoggedIn=useSelector((state:RootState)=>state.auth.isLoggedIn)
  const navigation = useNavigation<HomeNavigationProp>();

  return (
    <View style={styles.screen}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#173B8F"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>G</Text>
            </View>

            <View>
              <Text style={styles.brandName}>GPS Tracker</Text>
              <Text style={styles.brandSubtitle}>
                Smart tracking, simplified
              </Text>
            </View>
          </View>

          {/* Welcome section */}
          <View style={styles.welcomeSection}>
            <Text style={styles.eyebrow}>
              WELCOME TO GPS TRACKER
            </Text>

            <Text style={styles.welcomeTitle}>
              Track smarter.{"\n"}Travel safer.
            </Text>

            <Text style={styles.welcomeSubtitle}>
              Monitor your vehicles and manage your GPS
              tracking devices from one place.
            </Text>

            {/* Single primary button */}
            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.8}
              onPress={() => navigation.navigate("Register")}
            >
              <Text style={styles.primaryButtonText}>
                Get Started →
              </Text>
            </TouchableOpacity>

            {/* Login link for existing users */}
            <TouchableOpacity
              style={styles.loginLink}
              activeOpacity={0.8}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.loginLinkText}>
                Already have an account?{" "}
                <Text style={styles.loginLinkHighlight}>
                  Log in
                </Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* Highlight card - informational only */}
          <View style={styles.highlightCard}>
            <View style={styles.highlightIcon}>
              <Text style={styles.highlightIconText}>⌖</Text>
            </View>

            <View style={styles.highlightContent}>
              <Text style={styles.highlightTitle}>
                GPS Device Management
              </Text>

              <Text style={styles.highlightDescription}>
                Keep your tracking devices organized and access
                location information when available.
              </Text>
            </View>
          </View>
        </View>

        {/* Features */}
        <View style={styles.main}>
          <Text style={styles.sectionTitle}>
            What You Can Do
          </Text>

          <Text style={styles.sectionSubtitle}>
            Everything you need to manage your GPS devices.
          </Text>

          {/* Feature 1 */}
          <View style={styles.featureCard}>
            <View
              style={[
                styles.featureIcon,
                { backgroundColor: "#DBEAFE" },
              ]}
            >
              <Text style={styles.featureIconText}>⌖</Text>
            </View>

            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>
                Live Tracking
              </Text>

              <Text style={styles.featureDescription}>
                View the latest available location data from
                your registered GPS devices.
              </Text>
            </View>
          </View>

          {/* Feature 2 */}
          <View style={styles.featureCard}>
            <View
              style={[
                styles.featureIcon,
                { backgroundColor: "#CCFBF1" },
              ]}
            >
              <Text style={styles.featureIconText}>▣</Text>
            </View>
            <TouchableOpacity style={styles.featureCard}
             onPress={()=>{
                navigation.navigate(isLoggedIn ? "DeviceList":"Login")
              }}>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>
                Device Management
              </Text>

              <Text style={styles.featureDescription}>
                Register your GPS devices and manage your
                device inventory after signing in.
              </Text>
            </View>
            </TouchableOpacity>
          </View>

          {/* Feature 3 */}
          <View style={styles.featureCard}>
            <View
              style={[
                styles.featureIcon,
                { backgroundColor: "#EDE9FE" },
              ]}
            >
              <Text style={styles.featureIconText}>✓</Text>
            </View>

            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>
                Secure Access
              </Text>

              <Text style={styles.featureDescription}>
                Access your account and protected features
                through authentication.
              </Text>
            </View>
          </View>

          {/* Bottom information card - no extra button */}
          <View style={styles.bottomCard}>
            <Text style={styles.bottomTitle}>
              Ready to get started?
            </Text>

            <Text style={styles.bottomDescription}>
              Create your account to start managing your
              GPS tracking devices.
            </Text>
          </View>

          <Text style={styles.footer}>
            GPS Tracker · Smart vehicle monitoring
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },

  content: {
    flexGrow: 1,
    paddingBottom: 20,
  },

  header: {
    backgroundColor: "#173B8F",
    paddingHorizontal: 22,
    paddingTop: 58,
    paddingBottom: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  logo: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  logoText: {
    fontSize: 26,
    fontWeight: "800",
    color: "#173B8F",
  },

  brandName: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "700",
  },

  brandSubtitle: {
    color: "#D5E2FF",
    fontSize: 12,
    marginTop: 3,
  },

  welcomeSection: {
    marginTop: 38,
  },

  eyebrow: {
    color: "#BFD2FF",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.2,
  },

  welcomeTitle: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "800",
    lineHeight: 42,
    marginTop: 12,
  },

  welcomeSubtitle: {
    color: "#D5E2FF",
    fontSize: 14,
    lineHeight: 22,
    marginTop: 12,
  },

  primaryButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },

  primaryButtonText: {
    color: "#173B8F",
    fontSize: 16,
    fontWeight: "800",
  },

  loginLink: {
    alignItems: "center",
    marginTop: 16,
    paddingVertical: 8,
  },

  loginLinkText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "500",
  },

  loginLinkHighlight: {
    color: "#FFFFFF",
    fontWeight: "800",
    textDecorationLine: "underline",
  },

  highlightCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF18",
    borderWidth: 1,
    borderColor: "#FFFFFF30",
    padding: 15,
    borderRadius: 16,
    marginTop: 28,
    gap: 13,
  },

  highlightIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  highlightIconText: {
    color: "#173B8F",
    fontSize: 29,
    fontWeight: "700",
  },

  highlightContent: {
    flex: 1,
  },

  highlightTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  highlightDescription: {
    color: "#D5E2FF",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },

  main: {
    paddingHorizontal: 20,
    paddingTop: 28,
  },

  sectionTitle: {
    color: "#172554",
    fontSize: 22,
    fontWeight: "800",
  },

  sectionSubtitle: {
    color: "#64748B",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 6,
    marginBottom: 18,
  },

  featureCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E8EDF5",
    gap: 13,
  },

  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  featureIconText: {
    color: "#173B8F",
    fontSize: 25,
    fontWeight: "700",
  },

  featureContent: {
    flex: 1,
  },

  featureTitle: {
    color: "#172554",
    fontSize: 15,
    fontWeight: "700",
  },

  featureDescription: {
    color: "#64748B",
    fontSize: 12,
    lineHeight: 19,
    marginTop: 5,
  },

  bottomCard: {
    backgroundColor: "#EAF1FF",
    borderRadius: 18,
    padding: 20,
    marginTop: 12,
  },

  bottomTitle: {
    color: "#1E3A8A",
    fontSize: 18,
    fontWeight: "800",
  },

  bottomDescription: {
    color: "#475569",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 7,
  },

  footer: {
    color: "#94A3B8",
    textAlign: "center",
    fontSize: 11,
    marginTop: 24,
  },
});
