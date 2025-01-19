import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import {
  TextInput,
  Button,
  Card
} from 'react-native-paper';
import { updateTransaction } from '../../../Api';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SegmentedButtons } from 'react-native-paper';

export default function EditTransaction({ route, navigation }) {
  const { transaction } = route.params;
  const [type, setType] = useState(transaction.type);
  const [amount, setAmount] = useState(transaction.amount.toString());
  const [description, setDescription] = useState(transaction.description);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!amount || !description) {
      Alert.alert('Error', 'Semua field harus diisi');
      return;
    }

    try {
      setLoading(true);
      const transactionData = {
        type,
        amount: parseFloat(amount),
        description,
        date: new Date()
      };

      const response = await updateTransaction(transaction._id, transactionData);

      if (response.success) {
        Alert.alert('Sukses', 'Transaksi berhasil diupdate', [
          {
            text: 'OK',
            onPress: () => {
              if (route.params?.onTransactionUpdated) {
                route.params.onTransactionUpdated();
              }
              navigation.goBack();
            }
          }
        ]);
      } else {
        throw new Error(response.message || 'Gagal mengupdate transaksi');
      }
    } catch (error) {
      console.error('Edit transaction error:', error);
      Alert.alert('Error', error.message || 'Gagal mengupdate transaksi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.typeSelector}>
              <SegmentedButtons
                value={type}
                onValueChange={setType}
                buttons={[
                  {
                    value: 'expense',
                    label: 'Pengeluaran',
                    icon: () => <Icon name="arrow-up" size={20} color={type === 'expense' ? '#FFFFFF' : '#666666'} />,
                    style: type === 'expense' ? styles.activeExpense : styles.inactiveButton,
                    labelStyle: type === 'expense' ? styles.activeButtonLabel : styles.inactiveButtonLabel,
                  },
                  {
                    value: 'income',
                    label: 'Pemasukan',
                    icon: () => <Icon name="arrow-down" size={20} color={type === 'income' ? '#FFFFFF' : '#666666'} />,
                    style: type === 'income' ? styles.activeIncome : styles.inactiveButton,
                    labelStyle: type === 'income' ? styles.activeButtonLabel : styles.inactiveButtonLabel,
                  }
                ]}
              />
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Icon name="cash" size={20} color="#666666" style={styles.inputIcon} />
                <TextInput
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                  style={styles.input}
                  placeholder="Jumlah"
                  placeholderTextColor="#666"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Icon name="text" size={20} color="#666666" style={styles.inputIcon} />
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  style={[styles.input, styles.descriptionInput]}
                  placeholder="Deskripsi"
                  placeholderTextColor="#666"
                  multiline
                  numberOfLines={3}
                />
              </View>
            </View>
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
          style={styles.submitButton}
          contentStyle={styles.submitButtonContent}
          labelStyle={styles.submitButtonLabel}
          icon={({size, color}) => (
            <Icon name="check" size={20} color={color} />
          )}
        >
          UPDATE
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    padding: 16,
  },
  card: {
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  cardContent: {
    padding: 16,
  },
  typeSelector: {
    marginBottom: 16,
  },
  activeExpense: {
    backgroundColor: '#FF3B30',
  },
  activeIncome: {
    backgroundColor: '#34C759',
  },
  inactiveButton: {
    backgroundColor: '#FAFAFA',
  },
  activeButtonLabel: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  inactiveButtonLabel: {
    color: '#666666',
  },
  inputContainer: {
    marginBottom: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 15,
    color: '#1A1A1A',
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
  },
  descriptionInput: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  submitButton: {
    height: 50,
    backgroundColor: '#000000',
    borderRadius: 12,
    marginTop: 8,
  },
  submitButtonContent: {
    height: 50,
    flexDirection: 'row-reverse',
  },
  submitButtonLabel: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#FFFFFF',
  },
}); 