import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Alert,
  Platform
} from 'react-native';
import {
  Text,
  Card,
  Button,
  Chip,
  FAB,
  Portal,
  Modal,
  ActivityIndicator,
  Divider
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { fetchTransactions, deleteTransaction } from '../../../Api';

export default function TransactionScreen({ navigation }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [totals, setTotals] = useState({
    income: 0,
    expense: 0
  });

  const loadTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchTransactions({ type: selectedType });
      
      if (response && response.success) {
        const transactionData = response.transactions || [];
        setTransactions(transactionData);
        
        const newTotals = transactionData.reduce((acc, curr) => {
          const amount = parseFloat(curr.amount) || 0;
          if (curr.type === 'income') {
            acc.income += amount;
          } else {
            acc.expense += amount;
          }
          return acc;
        }, { income: 0, expense: 0 });
        
        setTotals(newTotals);
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
      Alert.alert('Error', 'Gagal memuat transaksi');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedType]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadTransactions();
    });

    return unsubscribe;
  }, [navigation, loadTransactions]);

  const handleDeleteTransaction = async (id) => {
    Alert.alert(
      'Konfirmasi',
      'Apakah Anda yakin ingin menghapus transaksi ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await deleteTransaction(id);
              if (response.success) {
                loadTransactions();
                Alert.alert('Sukses', 'Transaksi berhasil dihapus');
              } else {
                throw new Error(response.message);
              }
            } catch (error) {
              Alert.alert('Error', error.message || 'Gagal menghapus transaksi');
            }
          },
        },
      ]
    );
  };

  const renderTransactionItem = (transaction) => (
    <Card 
      style={styles.transactionCard}
      key={transaction._id}
    >
      <Card.Content style={styles.cardContent}>
        <View style={styles.transactionHeader}>
          <View style={styles.typeIndicator}>
            <Icon 
              name={transaction.type === 'income' ? 'arrow-down-circle' : 'arrow-up-circle'} 
              size={28} 
              color={transaction.type === 'income' ? '#2E7D32' : '#C62828'} 
            />
            <View style={styles.transactionInfo}>
              <Text style={styles.description}>{transaction.description}</Text>
              <Text style={styles.transactionDate}>
                {new Date(transaction.date).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </Text>
            </View>
          </View>
          <Text style={[
            styles.amount,
            { color: transaction.type === 'income' ? '#2E7D32' : '#C62828' }
          ]}>
            {transaction.type === 'income' ? '+ ' : '- '}
            Rp {parseFloat(transaction.amount).toLocaleString('id-ID')}
          </Text>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity
            onPress={() => navigation.navigate('EditTransaction', { transaction })}
            style={styles.actionButton}
          >
            <Icon name="pencil-outline" size={20} color="#757575" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDeleteTransaction(transaction._id)}
            style={styles.actionButton}
          >
            <Icon name="trash-can-outline" size={20} color="#D32F2F" />
          </TouchableOpacity>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <View style={styles.titleTextContainer}>
              <Text style={styles.appName}>Transaksi</Text>
              <Text style={styles.subtitle}>Kelola transaksi keuangan Anda</Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setFilterVisible(true)}
            >
              <Icon name="filter-variant" size={24} color="#1A1A1A" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('AddTransaction')}
            >
              <Icon name="plus-circle" size={32} color="#1976D2" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.summarySection}>
        <Text style={styles.sectionTitle}>Ringkasan Keuangan</Text>
        <View style={styles.summaryContainer}>
          <Card style={[styles.summaryCard, { backgroundColor: '#F1F8E9' }]}>
            <Card.Content>
              <View style={styles.summaryHeader}>
                <Icon name="arrow-down-circle-outline" size={24} color="#2E7D32" />
                <Text style={styles.summaryLabel}>Total Pemasukan</Text>
              </View>
              <Text style={[styles.summaryAmount, { color: '#2E7D32' }]}>
                Rp {totals.income.toLocaleString('id-ID')}
              </Text>
            </Card.Content>
          </Card>
          <Card style={[styles.summaryCard, { backgroundColor: '#FFEBEE' }]}>
            <Card.Content>
              <View style={styles.summaryHeader}>
                <Icon name="arrow-up-circle-outline" size={24} color="#C62828" />
                <Text style={styles.summaryLabel}>Total Pengeluaran</Text>
              </View>
              <Text style={[styles.summaryAmount, { color: '#C62828' }]}>
                Rp {totals.expense.toLocaleString('id-ID')}
              </Text>
            </Card.Content>
          </Card>
        </View>
      </View>

      <View style={styles.transactionSection}>
        <Text style={styles.sectionTitle}>Daftar Transaksi</Text>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={loadTransactions} />
          }
          style={styles.transactionList}
          contentContainerStyle={styles.transactionListContent}
        >
          {loading ? (
            <ActivityIndicator style={styles.loader} color="#424242" size="large" />
          ) : transactions.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon name="note-text-outline" size={48} color="#BDBDBD" />
              <Text style={styles.emptyText}>Belum ada transaksi</Text>
            </View>
          ) : (
            transactions.map((transaction) => renderTransactionItem(transaction))
          )}
        </ScrollView>
      </View>

      <Portal>
        <Modal
          visible={filterVisible}
          onDismiss={() => setFilterVisible(false)}
          contentContainerStyle={styles.modalContent}
        >
          <Text style={styles.modalTitle}>Filter Transaksi</Text>
          
          <View style={styles.filterOptions}>
            <Text style={styles.filterLabel}>Jenis Transaksi</Text>
            <View style={styles.typeButtons}>
              <Button
                mode={selectedType === 'income' ? 'contained' : 'outlined'}
                onPress={() => setSelectedType(
                  selectedType === 'income' ? null : 'income'
                )}
                style={styles.typeButton}
              >
                Pemasukan
              </Button>
              <Button
                mode={selectedType === 'expense' ? 'contained' : 'outlined'}
                onPress={() => setSelectedType(
                  selectedType === 'expense' ? null : 'expense'
                )}
                style={styles.typeButton}
              >
                Pengeluaran
              </Button>
            </View>
          </View>

          <Button
            mode="contained"
            onPress={() => {
              setFilterVisible(false);
              loadTransactions();
            }}
            style={styles.applyButton}
          >
            Terapkan Filter
          </Button>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  headerContainer: {
    padding: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 32,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleTextContainer: {
    marginLeft: 12,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '400',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButton: {
    padding: 8,
    marginRight: 8,
  },
  addButton: {
    padding: 4,
  },
  summarySection: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  transactionSection: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 16,
    letterSpacing: 0.15,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  summaryCard: {
    flex: 1,
    marginHorizontal: 4,
    elevation: 1,
    borderRadius: 12,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#616161',
    marginLeft: 8,
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  transactionList: {
    flex: 1,
  },
  transactionListContent: {
    padding: 16,
    paddingBottom: 80,
  },
  transactionCard: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 1,
    backgroundColor: '#FFFFFF',
  },
  cardContent: {
    padding: 16,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionInfo: {
    marginLeft: 12,
    flex: 1,
  },
  description: {
    fontSize: 16,
    color: '#212121',
    fontWeight: '500',
  },
  transactionDate: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  actionButton: {
    padding: 8,
    marginLeft: 16,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#1976D2',
    borderRadius: 28,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#757575',
  },
  loader: {
    marginTop: 32,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1A1A1A',
  },
  filterLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  typeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  applyButton: {
    marginTop: 8,
    backgroundColor: '#1A1A1A',
  },
}); 