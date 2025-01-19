import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateProfile } from '../../../Api';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Card } from 'react-native-paper';

export default function EditProfile({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        setName(user.name || '');
        setEmail(user.email || '');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setError('Gagal memuat data profil');
    }
  };

  const validateInputs = () => {
    setEmailError('');
    
    if (!name.trim()) {
      Alert.alert('Error', 'Nama tidak boleh kosong');
      return false;
    }
    
    if (!email.trim()) {
      setEmailError('Email tidak boleh kosong');
      return false;
    }
    
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!email.match(emailRegex)) {
      setEmailError('Format email tidak valid');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    try {
      setError(null);
      setEmailError('');
      
      if (!validateInputs()) return;

      setLoading(true);
      const response = await updateProfile({
        name: name.trim(),
        email: email.trim()
      });
      
      if (response.success) {
        Alert.alert('Sukses', 'Profil berhasil diperbarui', [
          { 
            text: 'OK', 
            onPress: () => navigation.goBack()
          }
        ]);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Update profile error:', error);
      
      // Handle email already exists error
      if (error.message.includes('Email sudah digunakan') || 
          error.message.includes('already exists') ||
          error.message.includes('duplicate key')) {
        setEmailError('Email sudah digunakan, silakan gunakan email lain');
      } else {
        Alert.alert(
          'Error',
          error.message || 'Terjadi kesalahan saat memperbarui profil'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.formCard}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Edit Data Pribadi</Text>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.infoItem}>
                <View style={styles.iconContainer}>
                  <Icon name="account" size={24} color="#666666" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Nama Lengkap</Text>
                  <TextInput
                    mode="outlined"
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Masukkan nama lengkap"
                    error={!name.trim()}
                    theme={{ colors: { primary: '#007AFF' } }}
                    outlineColor="#E0E0E0"
                  />
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoItem}>
                <View style={styles.iconContainer}>
                  <Icon name="email" size={24} color="#666666" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <TextInput
                    mode="outlined"
                    style={styles.input}
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      setEmailError('');
                    }}
                    placeholder="Masukkan email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    error={!!emailError || !email.trim()}
                    theme={{ colors: { primary: '#007AFF' } }}
                    outlineColor="#E0E0E0"
                  />
                  {emailError && (
                    <Text style={styles.errorText}>{emailError}</Text>
                  )}
                </View>
              </View>
            </View>

            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={loading}
              disabled={loading || !!emailError}
              style={styles.submitButton}
              labelStyle={styles.buttonLabel}
              icon="content-save"
              theme={{ colors: { primary: '#007AFF' } }}
            >
              {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
  },
  formCard: {
    borderRadius: 16,
    elevation: 3,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    padding: 8,
  },
  cardHeader: {
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  inputContainer: {
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#FFFFFF',
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    marginVertical: 12,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  submitButton: {
    height: 50,
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'none',
  },
}); 