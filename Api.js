import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://172.20.10.3:5000/api';

// Authentication APIs
export const login = async (username, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // Ensure we have all required user data
    const userData = {
      id: data.user?._id || data.user?.id,
      username: data.user?.username || username,
      email: data.user?.email || '',
      name: data.user?.name || '',
      createdAt: data.user?.createdAt || new Date().toISOString()
    };

    // Save complete user data
    await AsyncStorage.setItem('userData', JSON.stringify(userData));
    await AsyncStorage.setItem('token', JSON.stringify({ token: data.token }));

    return {
      token: data.token,
      user: userData
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const register = async (username, password, name, email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, name, email }),
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Protected APIs
const authHeader = (token) => ({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
});

// Profile APIs
export const getProfile = async () => {
  try {
    const tokenData = await AsyncStorage.getItem('token');
    if (!tokenData) throw new Error('No auth token');
    
    const { token } = JSON.parse(tokenData);
    const response = await fetch(`${API_BASE_URL}/profile`, {
      headers: authHeader(token)
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const updateProfile = async (profileData) => {
  try {
    const tokenData = await AsyncStorage.getItem('token');
    if (!tokenData) throw new Error('Token tidak ditemukan');
    
    const { token } = JSON.parse(tokenData);
    
    console.log('Updating profile with data:', profileData);

    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Gagal mengupdate profil');
    }

    // Update local storage with new user data
    const currentUserData = await AsyncStorage.getItem('userData');
    if (currentUserData) {
      const currentUser = JSON.parse(currentUserData);
      const updatedUser = {
        ...currentUser,
        name: data.user.name,
        email: data.user.email,
        username: data.user.username
      };
      console.log('Saving updated user data:', updatedUser);
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
    }

    return data;
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
};

// Transaction APIs
export const fetchTransactions = async (filters = {}) => {
  try {
    const tokenData = await AsyncStorage.getItem('token');
    if (!tokenData) throw new Error('No token found');

    let url = `${API_BASE_URL}/transactions`;
    
    // Add query parameters for filters
    const queryParams = new URLSearchParams();
    if (filters.type) queryParams.append('type', filters.type);
    
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${JSON.parse(tokenData).token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch transactions');
    }

    const data = await response.json();
    return {
      success: true,
      transactions: data.transactions || [],
      summary: data.summary || { totalIncome: 0, totalExpense: 0 }
    };
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      message: error.message,
      transactions: [],
      summary: { totalIncome: 0, totalExpense: 0 }
    };
  }
};

export const createTransaction = async (transactionData) => {
  try {
    const tokenData = await AsyncStorage.getItem('token');
    if (!tokenData) throw new Error('Token tidak ditemukan');

    const { token } = JSON.parse(tokenData);

    const response = await fetch(`${API_BASE_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(transactionData)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Gagal membuat transaksi');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Update transaction
export const updateTransaction = async (id, transactionData) => {
  try {
    const tokenData = await AsyncStorage.getItem('token');
    if (!tokenData) throw new Error('Token tidak ditemukan');

    const { token } = JSON.parse(tokenData);

    const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(transactionData)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Gagal mengupdate transaksi');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Delete transaction
export const deleteTransaction = async (id) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${JSON.parse(token).token}`
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Gagal menghapus transaksi');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Category APIs
export const fetchCategories = async () => {
  try {
    const headers = await authHeader();
    const response = await fetch(`${API_BASE_URL}/categories`, {
      headers
    });

    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const createCategory = async (categoryData) => {
  try {
    const headers = await authHeader();
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers,
      body: JSON.stringify(categoryData),
    });

    if (!response.ok) {
      throw new Error('Failed to create category');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const deleteCategory = async (categoryId) => {
  try {
    const headers = await authHeader();
    const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      throw new Error('Failed to delete category');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

// Add this function to fetch dashboard data
export const getDashboardData = async () => {
  try {
    const tokenData = await AsyncStorage.getItem('token');
    if (!tokenData) throw new Error('No token found');

    const response = await fetch(`${API_BASE_URL}/transactions/dashboard`, {
      headers: {
        'Authorization': `Bearer ${JSON.parse(tokenData).token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });

    // Check if response is ok before trying to parse JSON
    if (!response.ok) {
      const text = await response.text(); // Get response as text for debugging
      console.error('Server response:', text);
      throw new Error('Failed to fetch dashboard data');
    }

    const data = await response.json();
    return {
      success: true,
      ...data
    };
  } catch (error) {
    console.error('Dashboard error:', error);
    return {
      success: false,
      message: error.message,
      summary: {
        totalIncome: 0,
        totalExpense: 0
      },
      recentTransactions: []
    };
  }
};

export const changePassword = async (currentPassword, newPassword) => {
  try {
    const tokenData = await AsyncStorage.getItem('token');
    if (!tokenData) throw new Error('Token tidak ditemukan');
    
    const { token } = JSON.parse(tokenData);
    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ currentPassword, newPassword })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Gagal mengubah kata sandi');
    }

    return data;
  } catch (error) {
    throw error;
  }
};
