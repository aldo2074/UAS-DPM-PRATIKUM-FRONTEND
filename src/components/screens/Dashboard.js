import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl, Alert, Platform, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getDashboardData } from '../../../Api';
import { useFocusEffect } from '@react-navigation/native';

export default function Dashboard({ navigation }) {
  const [dashboardData, setDashboardData] = useState({
    summary: {
      totalIncome: 0,
      totalExpense: 0
    },
    recentTransactions: []
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const theme = useTheme();

  const loadDashboardData = async () => {
    try {
      const data = await getDashboardData();
      setDashboardData(data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleTransactionUpdated = () => {
    loadDashboardData();
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadDashboardData();
    });

    return unsubscribe;
  }, [navigation]);

  const handleTransactionAdded = () => {
    loadDashboardData();
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadDashboardData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const options = { 
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const getTransactionIcon = (type) => {
    return type === 'income' ? 'arrow-down-circle' : 'arrow-up-circle';
  };

  const getTransactionColor = (type) => {
    return type === 'income' ? '#4CAF50' : '#F44336';
  };

  useFocusEffect(
    React.useCallback(() => {
      loadDashboardData();
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <Icon name="wallet" size={32} color="#1A1A1A" style={styles.walletIcon} />
            <View style={styles.titleTextContainer}>
              <Text style={styles.appName}>Dompetku</Text>
              <Text style={styles.subtitle}>Mari kelola keuangan Anda dengan bijak</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.summaryContainer}>
        <Card style={styles.summaryCard}>
          <Card.Content>
            <View style={styles.balanceContainer}>
              <Text style={styles.balanceLabel}>Total Saldo Anda</Text>
              <Text style={styles.balanceAmount}>
                {formatCurrency(dashboardData.summary.totalIncome - dashboardData.summary.totalExpense)}
              </Text>
            </View>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <View style={styles.statHeader}>
                  <Icon name="arrow-down-circle" size={20} color="#4CAF50" />
                  <Text style={styles.statLabel}>Pemasukan</Text>
                </View>
                <Text style={[styles.statAmount, { color: '#4CAF50' }]}>
                  {formatCurrency(dashboardData.summary.totalIncome)}
                </Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <View style={styles.statHeader}>
                  <Icon name="arrow-up-circle" size={20} color="#F44336" />
                  <Text style={styles.statLabel}>Pengeluaran</Text>
                </View>
                <Text style={[styles.statAmount, { color: '#F44336' }]}>
                  {formatCurrency(dashboardData.summary.totalExpense)}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </View>

      <View style={styles.transactionsContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Riwayat Transaksi</Text>
          <Text style={styles.sectionSubtitle}>
            {dashboardData.recentTransactions.length > 0 
              ? `${dashboardData.recentTransactions.length} Transaksi Terakhir`
              : 'Belum ada transaksi'}
          </Text>
        </View>

        <ScrollView 
          style={styles.transactionList}
          contentContainerStyle={styles.transactionListContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {dashboardData.recentTransactions.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Card.Content style={styles.emptyContent}>
                <Icon name="information" size={48} color="#666666" />
                <Text style={styles.emptyText}>Belum ada transaksi</Text>
                <Text style={styles.emptySubtext}>Mulai catat transaksi keuangan Anda</Text>
              </Card.Content>
            </Card>
          ) : (
            dashboardData.recentTransactions.map((transaction, index) => (
              <Card 
                key={transaction._id || index}
                style={styles.transactionCard}
                onPress={() => navigation.getParent().navigate('EditTransaction', {
                  transaction,
                  onTransactionUpdated: handleTransactionUpdated
                })}
              >
                <Card.Content style={styles.transactionContent}>
                  <View style={[
                    styles.iconContainer,
                    { backgroundColor: transaction.type === 'income' ? '#E8F5E9' : '#FFEBEE' }
                  ]}>
                    <Icon 
                      name={transaction.type === 'income' ? 'arrow-down-circle' : 'arrow-up-circle'}
                      size={24}
                      color={transaction.type === 'income' ? '#4CAF50' : '#F44336'}
                    />
                  </View>
                  <View style={styles.transactionDetails}>
                    <View style={styles.transactionInfo}>
                      <Text style={styles.transactionDescription}>
                        {transaction.description}
                      </Text>
                      <Text style={styles.transactionDate}>
                        {formatDate(transaction.date || transaction.createdAt)}
                      </Text>
                    </View>
                    <Text style={[
                      styles.transactionAmount,
                      { color: transaction.type === 'income' ? '#4CAF50' : '#F44336' }
                    ]}>
                      {formatCurrency(transaction.amount)}
                    </Text>
                  </View>
                </Card.Content>
              </Card>
            ))
          )}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleTextContainer: {
    marginLeft: 12,
  },
  walletIcon: {
    marginRight: 4,
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
  summaryContainer: {
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  summaryCard: {
    borderRadius: 20,
    elevation: 4,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  balanceContainer: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 8,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 8,
  },
  statItem: {
    flex: 1,
    padding: 12,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666666',
  },
  statAmount: {
    fontSize: 18,
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E8E8E8',
  },
  transactionsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  transactionCard: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
    backgroundColor: '#FFFFFF',
  },
  transactionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  transactionDetails: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionInfo: {
    flex: 1,
    marginRight: 16,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#666666',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyCard: {
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  emptyContent: {
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  transactionList: {
    flex: 1,
  },
  transactionListContent: {
    paddingBottom: Platform.OS === 'ios' ? 120 : 100,
  },
  bottomSpacer: {
    height: Platform.OS === 'ios' ? 100 : 80,
  },
}); 