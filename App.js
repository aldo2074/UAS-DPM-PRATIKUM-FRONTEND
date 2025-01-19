import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Provider as PaperProvider } from 'react-native-paper';
import { TouchableOpacity, Platform, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import LoginScreen from "./src/components/auth/Login";
import RegisterScreen from "./src/components/auth/Register";
import DashboardScreen from "./src/components/screens/Dashboard";
import ProfileScreen from "./src/components/screens/Profile";
import AddTransactionScreen from "./src/components/screens/AddTransaction";
import TransactionScreen from "./src/components/screens/Transaction";
import EditTransactionScreen from "./src/components/screens/EditTransaction";
import ChangePasswordScreen from "./src/components/screens/ChangePassword";
import EditProfileScreen from "./src/components/screens/EditProfile";
import SplashScreen from "./src/components/screens/Splash";
import LandingScreen from "./src/components/screens/Landing";


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs({ navigation }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'view-dashboard' : 'view-dashboard-outline';
          } else if (route.name === 'Transaction') {
            iconName = focused ? 'credit-card' : 'credit-card-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'account-circle' : 'account-circle-outline';
          }

          return (
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: 32,
            }}>
              <Icon 
                name={iconName} 
                size={28} 
                color={focused ? '#1A1A1A' : '#666666'}
              />
            </View>
          );
        },
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          elevation: 8,
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingHorizontal: 10,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -4,
          },
          shadowOpacity: 0.1,
          shadowRadius: 12,
        },
        tabBarLabel: ({ focused, color }) => (
          <Text style={{
            fontSize: 12,
            fontWeight: focused ? '600' : '400',
            color: focused ? '#1A1A1A' : '#666666',
            marginTop: 4,
          }}>
            {route.name === 'Dashboard' ? 'Beranda' :
             route.name === 'Transaction' ? 'Transaksi' : 'Profil'}
          </Text>
        ),
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen 
        name="Transaction" 
        component={TransactionScreen}
        options={({ navigation }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color }) => (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                navigation.navigate('Transaction');
              }}
              style={{
                backgroundColor: '#1A1A1A',
                width: 48,
                height: 48,
                borderRadius: 16,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: -32,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 4,
                },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 5,
                transform: [{ scale: focused ? 0.95 : 1 }],
              }}>
              <Icon name="plus" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          ),
          tabBarLabel: ({ focused }) => (
            <Text style={{
              fontSize: 12,
              fontWeight: focused ? '600' : '500',
              color: focused ? '#1A1A1A' : '#666666',
              marginTop: 4,
            }}>
              Transaksi
            </Text>
          ),
          tabBarButton: (props) => (
            <View {...props} style={{ flex: 1, alignItems: 'center' }} />
          ),
        })}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate splash screen loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Changed to 3 seconds

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator 
          screenOptions={{ 
            headerShown: false,
            cardStyle: { backgroundColor: '#FFFFFF' },
          }}
        >
          <Stack.Screen name="Landing" component={LandingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen 
            name="AddTransaction" 
            component={AddTransactionScreen}
            options={{
              headerShown: true,
              title: "Tambah Transaksi",
              headerStyle: {
                backgroundColor: '#FFFFFF',
                elevation: 0,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.05,
                shadowRadius: 15,
                borderBottomWidth: 1,
                borderBottomColor: 'rgba(0, 0, 0, 0.05)',
              },
              headerTitleStyle: {
                fontSize: 17,
                fontWeight: '600',
                letterSpacing: -0.4,
                color: '#000000',
              },
              headerTitleAlign: 'center',
              headerTintColor: '#007AFF',
              headerBackTitle: 'Kembali',
              headerBackTitleVisible: Platform.OS === 'ios',
            }}
          />
          <Stack.Screen 
            name="EditTransaction" 
            component={EditTransactionScreen}
            options={{
              headerShown: true,
              title: "Edit Transaksi",
              headerStyle: {
                backgroundColor: '#FFFFFF',
                elevation: 0,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 15,
                borderBottomWidth: 1,
                borderBottomColor: 'rgba(0, 0, 0, 0.05)',
              },
              headerTitleStyle: {
                fontSize: 17,
                fontWeight: '600',
                letterSpacing: -0.4,
                color: '#000000',
              },
              headerTitleAlign: 'center',
              headerTintColor: '#007AFF',
              headerBackTitle: 'Kembali',
              headerBackTitleVisible: Platform.OS === 'ios',
            }}
          />
          <Stack.Screen
            name="ChangePassword"
            component={ChangePasswordScreen}
            options={{
              headerShown: true,
              title: "Ubah Kata Sandi",
              headerStyle: {
                backgroundColor: '#FFFFFF',
                elevation: 0,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 15,
                borderBottomWidth: 1,
                borderBottomColor: 'rgba(0, 0, 0, 0.05)',
              },
              headerTitleStyle: {
                fontSize: 17,
                fontWeight: '600',
                letterSpacing: -0.4,
                color: '#000000',
              },
              headerTitleAlign: 'center',
              headerTintColor: '#007AFF',
              headerBackTitle: 'Kembali',
              headerBackTitleVisible: Platform.OS === 'ios',
            }}
          />
          <Stack.Screen
            name="EditProfile"
            component={EditProfileScreen}
            options={{
              headerShown: true,
              title: "Edit Profil",
              headerStyle: {
                backgroundColor: '#FFFFFF',
                elevation: 0,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 15,
                borderBottomWidth: 1,
                borderBottomColor: 'rgba(0, 0, 0, 0.05)',
              },
              headerTitleStyle: {
                fontSize: 17,
                fontWeight: '600',
                letterSpacing: -0.4,
                color: '#000000',
              },
              headerTitleAlign: 'center',
              headerTintColor: '#007AFF',
              headerBackTitle: 'Kembali',
              headerBackTitleVisible: Platform.OS === 'ios',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}