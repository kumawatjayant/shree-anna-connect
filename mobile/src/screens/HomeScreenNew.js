import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { useCart } from '../context/CartContext';

const { width } = Dimensions.get('window');

const HomeScreenNew = ({ navigation }) => {
  const { getCartCount } = useCart();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [currentScheme, setCurrentScheme] = useState(0);

  const govtSchemes = [
    {
      id: 1,
      title: 'PM-KISAN 2025',
      description: '₹6000/year to 12 crore farmers',
      color: '#4CAF50',
      icon: 'cash-multiple',
    },
    {
      id: 2,
      title: 'PM Dhan-Dhaanya Krishi Yojana',
      description: 'Boost productivity in 100 districts',
      color: '#FF9800',
      icon: 'sprout',
    },
    {
      id: 3,
      title: 'Kisan Credit Card',
      description: 'Loan limit increased to ₹5 lakh',
      color: '#2196F3',
      icon: 'credit-card',
    },
    {
      id: 4,
      title: 'Fasal Bima Yojana',
      description: 'Enhanced crop insurance',
      color: '#9C27B0',
      icon: 'shield-check',
    },
  ];

  useEffect(() => {
    loadUserData();
    fetchStats();
    
    // Auto-scroll schemes
    const interval = setInterval(() => {
      setCurrentScheme((prev) => (prev + 1) % govtSchemes.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/dashboard/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadUserData(), fetchStats()]);
    setRefreshing(false);
  };

  const menuItems = [
    {
      id: 1,
      title: 'Buy Products',
      icon: 'cart',
      color: '#4CAF50',
      action: () => navigation.navigate('Products'),
    },
    {
      id: 2,
      title: 'Sell Products',
      icon: 'cash-multiple',
      color: '#FF9800',
      action: () => navigation.navigate('MyProducts'),
    },
    {
      id: 3,
      title: 'My Orders',
      icon: 'package-variant',
      color: '#2196F3',
      action: () => navigation.navigate('Orders'),
    },
    {
      id: 4,
      title: 'Profile',
      icon: 'account',
      color: '#9C27B0',
      action: () => navigation.navigate('Profile'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Namaste 🙏</Text>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <MaterialCommunityIcons name="bell" size={24} color="#333" />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => navigation.navigate('Cart')}
            >
              <MaterialCommunityIcons name="cart" size={24} color="#333" />
              {getCartCount() > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{getCartCount()}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Government Schemes Slider */}
        <View style={styles.schemesSection}>
          <Text style={styles.sectionTitle}>Government Schemes</Text>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / (width - 40));
              setCurrentScheme(index);
            }}
          >
            {govtSchemes.map((scheme) => (
              <TouchableOpacity
                key={scheme.id}
                style={[styles.schemeCard, { backgroundColor: scheme.color }]}
                onPress={() => navigation.navigate('Schemes')}
              >
                <MaterialCommunityIcons name={scheme.icon} size={40} color="#FFF" />
                <Text style={styles.schemeTitle}>{scheme.title}</Text>
                <Text style={styles.schemeDesc}>{scheme.description}</Text>
                <Text style={styles.schemeLink}>Learn More →</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.pagination}>
            {govtSchemes.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  currentScheme === index && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.menuGrid}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.menuCard, { backgroundColor: item.color }]}
                onPress={item.action}
              >
                <MaterialCommunityIcons name={item.icon} size={40} color="#FFF" />
                <Text style={styles.menuText}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Stats Cards (for farmers) */}
        {user?.role === 'farmer' && (
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Your Dashboard</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <MaterialCommunityIcons name="package-variant" size={30} color="#4CAF50" />
                <Text style={styles.statNumber}>{stats?.totalProducts || 0}</Text>
                <Text style={styles.statLabel}>Products</Text>
              </View>
              <View style={styles.statCard}>
                <MaterialCommunityIcons name="cart-check" size={30} color="#2196F3" />
                <Text style={styles.statNumber}>{stats?.totalOrders || 0}</Text>
                <Text style={styles.statLabel}>Orders</Text>
              </View>
              <View style={styles.statCard}>
                <MaterialCommunityIcons name="currency-inr" size={30} color="#FF9800" />
                <Text style={styles.statNumber}>₹{stats?.totalRevenue || 0}</Text>
                <Text style={styles.statLabel}>Revenue</Text>
              </View>
              <View style={styles.statCard}>
                <MaterialCommunityIcons name="star" size={30} color="#FFC107" />
                <Text style={styles.statNumber}>{stats?.rating || '4.5'}</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
            </View>
          </View>
        )}

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>🌾 About Shree Anna</Text>
          <Text style={styles.infoText}>
            Millets are nutritious superfoods that support sustainable farming and healthy living.
            Join us in promoting millet cultivation and consumption!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF',
  },
  greeting: {
    fontSize: 14,
    color: '#666',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 15,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#F44336',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  schemesSection: {
    marginTop: 15,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  schemeCard: {
    width: width - 40,
    padding: 25,
    borderRadius: 15,
    marginRight: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  schemeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 10,
  },
  schemeDesc: {
    fontSize: 14,
    color: '#FFF',
    marginTop: 5,
    opacity: 0.9,
  },
  schemeLink: {
    fontSize: 14,
    color: '#FFF',
    marginTop: 15,
    fontWeight: 'bold',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DDD',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#2E7D32',
    width: 20,
  },
  quickActions: {
    marginTop: 25,
    paddingHorizontal: 20,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuCard: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  menuText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  statsSection: {
    marginTop: 25,
    paddingHorizontal: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  infoCard: {
    margin: 20,
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default HomeScreenNew;
