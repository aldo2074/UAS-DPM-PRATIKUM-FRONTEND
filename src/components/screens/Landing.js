import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Landing({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.mainContainer}>
          <View style={styles.topSection}>
            <View style={styles.iconContainer}>
              <Icon name="wallet-outline" size={80} color="#1A1A1A" />
            </View>
            
            <View style={styles.textContainer}>
              <Text style={styles.title}>Dompetku</Text>
              <Text style={styles.subtitle}>
                Solusi Cerdas untuk{'\n'}Mengelola Keuangan Anda
              </Text>
            </View>
          </View>

          <View style={styles.featureContainer}>
            <View style={styles.featureItem}>
              <Icon name="cash-register" size={32} color="#1A1A1A" />
              <Text style={styles.featureText}>
                Catat{'\n'}Transaksi
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="history" size={32} color="#1A1A1A" />
              <Text style={styles.featureText}>
                Riwayat{'\n'}Transaksi
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="account-cog" size={32} color="#1A1A1A" />
              <Text style={styles.featureText}>
                Kelola{'\n'}Profil
              </Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.button}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.buttonText}>Mulai Sekarang</Text>
              <Icon name="chevron-right" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContainer: {
    width: '85%',
    alignItems: 'center',
  },
  topSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    padding: 24,
    backgroundColor: '#F5F5F5',
    borderRadius: 24,
    marginBottom: 24,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 18,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 28,
  },
  featureContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    gap: 16,
    marginBottom: 40,
  },
  featureItem: {
    alignItems: 'center',
    padding: 16,
    width: '28%',
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  featureText: {
    marginTop: 12,
    fontSize: 13,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 18,
    fontWeight: '500',
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A1A1A',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
}); 