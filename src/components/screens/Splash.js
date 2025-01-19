import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Splash() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Icon name="wallet-outline" size={90} color="#1A1A1A" />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.title}>Dompetku</Text>
          <Text style={styles.subtitle}>Kelola Keuangan Anda</Text>
        </View>
        
        <ActivityIndicator 
          size="large"
          color="#1A1A1A" 
          style={styles.loader} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: '85%',
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 24,
    padding: 24,
    backgroundColor: '#F5F5F5',
    borderRadius: 24,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 36,
    color: "#1A1A1A",
    fontWeight: "bold",
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 18,
    color: "#666666",
    opacity: 0.8,
    textAlign: 'center',
    lineHeight: 24,
  },
  loader: {
    transform: [{ scale: 1.2 }],
  },
});