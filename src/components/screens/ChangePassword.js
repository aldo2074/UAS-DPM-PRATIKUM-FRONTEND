import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { changePassword } from '../../../Api';
import { Card } from 'react-native-paper';

export default function ChangePassword({ navigation }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Semua field harus diisi');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Konfirmasi kata sandi baru tidak sesuai');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'Kata sandi baru minimal 6 karakter');
      return;
    }

    try {
      setLoading(true);
      await changePassword(currentPassword, newPassword);
      Alert.alert('Sukses', 'Kata sandi berhasil diubah', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', error.message);
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
              <Text style={styles.cardTitle}>Ubah Kata Sandi</Text>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.infoItem}>
                <View style={styles.iconContainer}>
                  <Icon name="lock" size={24} color="#666666" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Kata Sandi Saat Ini</Text>
                  <TextInput
                    mode="outlined"
                    style={styles.input}
                    secureTextEntry={!showCurrentPassword}
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    placeholder="Masukkan kata sandi saat ini"
                    theme={{ colors: { primary: '#007AFF' } }}
                    outlineColor="#E0E0E0"
                    right={
                      <TextInput.Icon
                        icon={showCurrentPassword ? "eye-off" : "eye"}
                        onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                      />
                    }
                  />
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoItem}>
                <View style={styles.iconContainer}>
                  <Icon name="lock-plus" size={24} color="#666666" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Kata Sandi Baru</Text>
                  <TextInput
                    mode="outlined"
                    style={styles.input}
                    secureTextEntry={!showNewPassword}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="Masukkan kata sandi baru"
                    theme={{ colors: { primary: '#007AFF' } }}
                    outlineColor="#E0E0E0"
                    right={
                      <TextInput.Icon
                        icon={showNewPassword ? "eye-off" : "eye"}
                        onPress={() => setShowNewPassword(!showNewPassword)}
                      />
                    }
                  />
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoItem}>
                <View style={styles.iconContainer}>
                  <Icon name="lock-check" size={24} color="#666666" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Konfirmasi Kata Sandi Baru</Text>
                  <TextInput
                    mode="outlined"
                    style={styles.input}
                    secureTextEntry={!showConfirmPassword}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Konfirmasi kata sandi baru"
                    theme={{ colors: { primary: '#007AFF' } }}
                    outlineColor="#E0E0E0"
                    right={
                      <TextInput.Icon
                        icon={showConfirmPassword ? "eye-off" : "eye"}
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      />
                    }
                  />
                </View>
              </View>
            </View>

            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={loading}
              disabled={loading}
              style={styles.submitButton}
              labelStyle={styles.buttonLabel}
              icon="content-save"
              theme={{ colors: { primary: '#007AFF' } }}
            >
              {loading ? 'Menyimpan...' : 'Ubah Kata Sandi'}
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