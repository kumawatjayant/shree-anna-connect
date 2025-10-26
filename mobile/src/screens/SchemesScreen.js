import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const SchemesScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const schemes = [
    {
      id: '1',
      name: 'PM-KISAN 2025',
      description: 'Direct income support of ₹6000/year to 12 crore farmer families',
      category: 'Financial Support',
      icon: 'cash-multiple',
      color: '#4CAF50',
      eligibility: 'All landholding farmer families',
      benefits: '₹2000 every 4 months (21st installment released)',
    },
    {
      id: '2',
      name: 'PM Dhan-Dhaanya Krishi Yojana 2025',
      description: 'Comprehensive scheme for 100 low-productivity districts',
      category: 'Productivity Enhancement',
      icon: 'sprout',
      color: '#FF9800',
      eligibility: '1.7 crore farmers in targeted districts',
      benefits: 'Modern techniques, crop diversification, irrigation',
    },
    {
      id: '3',
      name: 'Pradhan Mantri Fasal Bima Yojana 2025',
      description: 'Comprehensive crop insurance with enhanced coverage',
      category: 'Insurance',
      icon: 'shield-check',
      color: '#2196F3',
      eligibility: 'All farmers (voluntary)',
      benefits: 'Low premium, high coverage for crop losses',
    },
    {
      id: '4',
      name: 'Kisan Credit Card 2025',
      description: 'Enhanced credit limit from ₹3 lakh to ₹5 lakh',
      category: 'Credit',
      icon: 'credit-card',
      color: '#9C27B0',
      eligibility: '7.7 crore farmers',
      benefits: 'Up to ₹5 lakh at 4% interest with subvention',
    },
    {
      id: '5',
      name: 'National Mission for Edible Oils 2025',
      description: '6-year mission for self-sufficiency in oilseeds',
      category: 'Crop Support',
      icon: 'seed',
      color: '#795548',
      eligibility: 'Oilseed farmers',
      benefits: 'Procurement support, better prices, storage',
    },
    {
      id: '6',
      name: 'Makhana Board Bihar 2025',
      description: 'Special board for Makhana processing and value addition',
      category: 'Regional Support',
      icon: 'factory',
      color: '#00BCD4',
      eligibility: 'Makhana farmers in Bihar',
      benefits: 'Processing facilities, market access, R&D',
    },
    {
      id: '7',
      name: 'Digital Agriculture Mission 2025',
      description: 'Precision farming with AI and satellite technology',
      category: 'Technology',
      icon: 'satellite-variant',
      color: '#E91E63',
      eligibility: 'All farmers',
      benefits: 'Free satellite monitoring, AI advisory, weather alerts',
    },
    {
      id: '8',
      name: 'Soil Health Card Scheme 2025',
      description: 'Free soil testing and nutrient management',
      category: 'Technical Support',
      icon: 'test-tube',
      color: '#009688',
      eligibility: 'All farmers',
      benefits: 'Free soil analysis, customized fertilizer recommendations',
    },
  ];

  const filteredSchemes = schemes.filter((scheme) =>
    scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    scheme.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderScheme = ({ item }) => (
    <TouchableOpacity
      style={styles.schemeCard}
      onPress={() => navigation.navigate('SchemeDetail', { scheme: item })}
    >
      <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
        <MaterialCommunityIcons name={item.icon} size={32} color={item.color} />
      </View>

      <View style={styles.schemeInfo}>
        <Text style={styles.schemeName}>{item.name}</Text>
        <Text style={styles.schemeDesc} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
      </View>

      <MaterialCommunityIcons name="chevron-right" size={24} color="#999" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={28} color="#2E7D32" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Government Schemes</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={24} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search schemes..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Info Banner */}
      <View style={styles.infoBanner}>
        <MaterialCommunityIcons name="information" size={24} color="#2196F3" />
        <Text style={styles.infoText}>
          Explore government schemes for farmers and apply directly
        </Text>
      </View>

      {/* Schemes List */}
      <FlatList
        data={filteredSchemes}
        renderItem={renderScheme}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No schemes found</Text>
          </View>
        }
      />
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
    padding: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    margin: 15,
    padding: 12,
    borderRadius: 10,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 12,
    borderRadius: 10,
  },
  infoText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    color: '#1976D2',
  },
  listContainer: {
    padding: 15,
  },
  schemeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  schemeInfo: {
    flex: 1,
    marginLeft: 15,
  },
  schemeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  schemeDesc: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default SchemesScreen;
