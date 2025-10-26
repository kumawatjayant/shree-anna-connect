import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Image,
  RefreshControl,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCart } from '../../context/CartContext';
import api from '../../services/api';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40;

const HomeScreen = () => {
  const navigation = useNavigation();
  const { getCartCount } = useCart();
  const [user, setUser] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(0);

  const banners = [
    { id: 1, title: 'Fresh Millets', subtitle: 'Direct from Farmers', color: '#4CAF50', icon: 'sprout' },
    { id: 2, title: 'Organic Certified', subtitle: 'Quality Assured', color: '#FF9800', icon: 'certificate' },
    { id: 3, title: 'Fast Delivery', subtitle: 'Within 24 Hours', color: '#2196F3', icon: 'truck-fast' },
  ];

  const categories = [
    { id: 1, name: 'Foxtail\nMillet', icon: 'grain', color: '#4CAF50' },
    { id: 2, name: 'Pearl\nMillet', icon: 'barley', color: '#FF9800' },
    { id: 3, name: 'Finger\nMillet', icon: 'sprout', color: '#2196F3' },
    { id: 4, name: 'Little\nMillet', icon: 'seed', color: '#9C27B0' },
    { id: 5, name: 'Organic', icon: 'leaf', color: '#4CAF50' },
    { id: 6, name: 'Ready to\nCook', icon: 'food', color: '#FF5722' },
  ];

  const quickActions = [
    { id: 1, title: 'Schemes', icon: 'file-document', color: '#4CAF50', screen: 'Schemes' },
    { id: 2, title: 'My Products', icon: 'package-variant', color: '#FF9800', screen: 'MyProducts' },
    { id: 3, title: 'Sell', icon: 'cash-multiple', color: '#2196F3', screen: 'AddProduct' },
    { id: 4, title: 'Track Order', icon: 'map-marker-path', color: '#9C27B0', screen: 'Orders' },
  ];

  useEffect(() => {
    loadUser();
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) setUser(JSON.parse(userData));
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUser();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
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
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Search Bar */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => navigation.navigate('Shop')}
        >
          <MaterialCommunityIcons name="magnify" size={24} color="#666" />
          <Text style={styles.searchText}>Search for millets, products...</Text>
        </TouchableOpacity>

        {/* Banner Slider */}
        <View style={styles.bannerSection}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / CARD_WIDTH);
              setCurrentBanner(index);
            }}
          >
            {banners.map((banner) => (
              <View
                key={banner.id}
                style={[styles.banner, { backgroundColor: banner.color }]}
              >
                <MaterialCommunityIcons name={banner.icon} size={60} color="#FFF" />
                <Text style={styles.bannerTitle}>{banner.title}</Text>
                <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
              </View>
            ))}
          </ScrollView>
          <View style={styles.pagination}>
            {banners.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  currentBanner === index && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Shop by Category</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Shop')}>
              <Text style={styles.seeAll}>See All →</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryCard}
                onPress={() => navigation.navigate('Shop', { category: category.name })}
              >
                <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
                  <MaterialCommunityIcons name={category.icon} size={32} color={category.color} />
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.quickActionCard}
                onPress={() => navigation.navigate(action.screen)}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                  <MaterialCommunityIcons name={action.icon} size={28} color="#FFF" />
                </View>
                <Text style={styles.quickActionTitle}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Featured Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🔥 Trending Products</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Shop')}>
              <Text style={styles.seeAll}>See All →</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.comingSoon}>Loading products...</Text>
        </View>

        {/* Government Schemes Banner */}
        <TouchableOpacity
          style={styles.schemesBanner}
          onPress={() => navigation.navigate('Schemes')}
        >
          <MaterialCommunityIcons name="file-document" size={40} color="#FFF" />
          <View style={styles.schemesBannerText}>
            <Text style={styles.schemesBannerTitle}>Government Schemes 2025</Text>
            <Text style={styles.schemesBannerSubtitle}>
              Explore latest schemes for farmers
            </Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={28} color="#FFF" />
        </TouchableOpacity>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>🌾 Why Choose Shree Anna?</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoCard}>
              <MaterialCommunityIcons name="certificate" size={32} color="#4CAF50" />
              <Text style={styles.infoCardTitle}>Certified</Text>
              <Text style={styles.infoCardText}>100% Organic</Text>
            </View>
            <View style={styles.infoCard}>
              <MaterialCommunityIcons name="truck-fast" size={32} color="#2196F3" />
              <Text style={styles.infoCardTitle}>Fast Delivery</Text>
              <Text style={styles.infoCardText}>24 Hours</Text>
            </View>
            <View style={styles.infoCard}>
              <MaterialCommunityIcons name="shield-check" size={32} color="#FF9800" />
              <Text style={styles.infoCardTitle}>Quality</Text>
              <Text style={styles.infoCardText}>Assured</Text>
            </View>
          </View>
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
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
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
    position: 'relative',
    marginLeft: 15,
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    margin: 16,
    padding: 12,
    borderRadius: 12,
    elevation: 2,
  },
  searchText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#999',
  },
  bannerSection: {
    marginBottom: 20,
  },
  banner: {
    width: CARD_WIDTH,
    height: 150,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 10,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.9,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
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
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAll: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '600',
  },
  categoryCard: {
    alignItems: 'center',
    marginRight: 16,
    width: 80,
  },
  categoryIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 11,
    color: '#333',
    textAlign: 'center',
    fontWeight: '600',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  comingSoon: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    padding: 20,
  },
  schemesBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E7D32',
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 20,
    borderRadius: 12,
  },
  schemesBannerText: {
    flex: 1,
    marginLeft: 16,
  },
  schemesBannerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  schemesBannerSubtitle: {
    fontSize: 12,
    color: '#FFF',
    opacity: 0.9,
    marginTop: 4,
  },
  infoSection: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 20,
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoCard: {
    alignItems: 'center',
    flex: 1,
  },
  infoCardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
  },
  infoCardText: {
    fontSize: 11,
    color: '#666',
    marginTop: 4,
  },
});

export default HomeScreen;
