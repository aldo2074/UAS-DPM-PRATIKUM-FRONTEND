import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  Platform
} from 'react-native';
import { Text, Card, Button, Modal, Portal } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Profile({ navigation }) {
  const [user, setUser] = useState({
    name: '',
    email: '',
    username: '',
    createdAt: ''
  });
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    loadProfile();

    const unsubscribe = navigation.addListener('focus', () => {
      loadProfile();
    });

    return unsubscribe;
  }, [navigation]);

  const loadProfile = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        console.log('Loaded user data:', parsedUser);
        setUser({
          name: parsedUser.name || '',
          email: parsedUser.email || '',
          username: parsedUser.username || '',
          createdAt: parsedUser.createdAt || ''
        });
      } else {
        console.log('No user data found in AsyncStorage');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Tidak tersedia';
    try {
      const options = { 
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      };
      return new Date(dateString).toLocaleDateString('id-ID', options);
    } catch (error) {
      return 'Format tanggal tidak valid';
    }
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    try {
      setShowLogoutModal(false);
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      navigation.replace('Login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Portal>
        <Modal
          visible={showLogoutModal}
          onDismiss={() => setShowLogoutModal(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <Icon name="logout" size={50} color="#FF3B30" />
            <Text style={styles.modalTitle}>Konfirmasi Keluar</Text>
            <Text style={styles.modalText}>
              Apakah Anda yakin ingin keluar dari akun?
            </Text>
            <View style={styles.modalButtons}>
              <Button
                mode="outlined"
                onPress={() => setShowLogoutModal(false)}
                style={[styles.modalButton, styles.cancelButton]}
                labelStyle={styles.cancelButtonLabel}
              >
                Batal
              </Button>
              <Button
                mode="contained"
                onPress={confirmLogout}
                style={[styles.modalButton, styles.confirmButton]}
                labelStyle={styles.confirmButtonLabel}
              >
                Ya, Keluar
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Icon 
              name="account-circle" 
              size={120}
              color="#1A1A1A" 
            />
          </View>
          <Text style={styles.welcomeText}>Hai {user.username}</Text>
          <Text style={styles.subText}>Lihat dan atur informasi akun Anda di sini</Text>
        </View>

        <Card style={styles.infoCard}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Data Pribadi</Text>
              <TouchableOpacity 
                style={styles.editProfileButton}
                onPress={() => navigation.navigate('EditProfile')}
              >
                <Icon name="pencil" size={20} color="#007AFF" />
                <Text style={[styles.editProfileText, { color: '#007AFF' }]}>Ubah</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.iconContainer}>
                <Icon name="card-account-details" size={24} color="#666666" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Nama Lengkap</Text>
                <Text style={[styles.infoValue, !user.name && styles.infoValueEmpty]}>
                  {user.name || 'Nama belum ditambahkan'}
                </Text>
              </View>
            </View>
            
            <View style={styles.divider} />

            <View style={styles.infoItem}>
              <View style={styles.iconContainer}>
                <Icon name="account" size={24} color="#666666" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Username</Text>
                <Text style={styles.infoValue}>{user.username}</Text>
              </View>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.infoItem}>
              <View style={styles.iconContainer}>
                <Icon name="email" size={24} color="#666666" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={[styles.infoValue, !user.email && styles.infoValueEmpty]}>
                  {user.email || 'Email belum ditambahkan'}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoItem}>
              <View style={styles.iconContainer}>
                <Icon name="calendar" size={24} color="#666666" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Bergabung Sejak</Text>
                <Text style={[styles.infoValue, !user.createdAt && styles.infoValueEmpty]}>
                  {formatDate(user.createdAt)}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('ChangePassword')}
        >
          <View style={styles.iconContainer}>
            <Icon name="lock" size={24} color="#007AFF" />
          </View>
          <Text style={styles.actionButtonText}>Ubah Kata Sandi</Text>
          <Icon name="chevron-right" size={24} color="#007AFF" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.logoutButton, { marginTop: 16 }]}
          onPress={handleLogout}
        >
          <Icon name="logout" size={24} color="#FF3B30" />
          <Text style={[styles.logoutText, { color: '#FF3B30' }]}>Keluar dari Akun</Text>
        </TouchableOpacity>
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
    paddingTop: Platform.OS === 'ios' ? 60 : 48,
    paddingBottom: Platform.OS === 'ios' ? 120 : 100,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
    textAlign: 'center',
  },
  subText: {
    fontSize: 15,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
  },
  infoCard: {
    borderRadius: 16,
    marginBottom: 16,
    elevation: 3,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    padding: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F0FE',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  editProfileText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
    marginLeft: 6,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
  infoValue: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    marginVertical: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  actionButtonText: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF2F2',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  logoutText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#F44336',
  },
  infoValueEmpty: {
    color: '#999999',
    fontStyle: 'italic'
  },
  modalContainer: {
    padding: 20,
    marginHorizontal: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginTop: 16,
    marginBottom: 8,
  },
  modalText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 8,
    height: 45,
    justifyContent: 'center',
  },
  cancelButton: {
    borderColor: '#007AFF',
    borderWidth: 1,
  },
  confirmButton: {
    backgroundColor: '#FF3B30',
  },
  cancelButtonLabel: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  confirmButtonLabel: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});