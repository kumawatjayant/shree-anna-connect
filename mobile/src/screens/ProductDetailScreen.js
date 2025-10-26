import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';

const ProductDetailScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    Alert.alert('Success', `Added ${quantity}kg to cart!`, [
      { text: 'Continue Shopping', style: 'cancel' },
      { text: 'View Cart', onPress: () => navigation.navigate('Cart') },
    ]);
  };

  const handleBuyNow = () => {
    Alert.alert('Buy Now', 'Proceeding to checkout...');
    // navigation.navigate('Checkout', { product, quantity });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
        <TouchableOpacity>
          <MaterialCommunityIcons name="share-variant" size={28} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Text style={styles.productImageEmoji}>🌾</Text>
          <View style={styles.certificationBadge}>
            <MaterialCommunityIcons name="certificate" size={16} color="#4CAF50" />
            <Text style={styles.certificationText}>Organic</Text>
          </View>
        </View>

        {/* Product Info */}
        <View style={styles.infoSection}>
          <Text style={styles.productName}>{product.name}</Text>
          <View style={styles.ratingRow}>
            <MaterialCommunityIcons name="star" size={20} color="#FFC107" />
            <Text style={styles.ratingText}>4.5 (120 reviews)</Text>
          </View>

          <View style={styles.priceSection}>
            <Text style={styles.price}>₹{product.price}</Text>
            <Text style={styles.priceUnit}>/kg</Text>
            <View style={styles.stockBadge}>
              <Text style={styles.stockText}>{product.quantity}kg available</Text>
            </View>
          </View>

          {/* Seller Info */}
          <View style={styles.sellerCard}>
            <View style={styles.sellerAvatar}>
              <MaterialCommunityIcons name="account" size={30} color="#2E7D32" />
            </View>
            <View style={styles.sellerInfo}>
              <Text style={styles.sellerName}>{product.seller?.name || 'Farmer'}</Text>
              <View style={styles.locationRow}>
                <MaterialCommunityIcons name="map-marker" size={14} color="#666" />
                <Text style={styles.locationText}>
                  {product.seller?.region?.district}, {product.seller?.region?.state}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.contactButton}>
              <MaterialCommunityIcons name="phone" size={20} color="#2E7D32" />
            </TouchableOpacity>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>
              {product.description || 'Fresh, high-quality millets directly from the farm. Rich in nutrients and perfect for a healthy diet.'}
            </Text>
          </View>

          {/* Nutritional Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Nutritional Benefits</Text>
            <View style={styles.benefitsGrid}>
              <View style={styles.benefitItem}>
                <MaterialCommunityIcons name="heart-pulse" size={24} color="#F44336" />
                <Text style={styles.benefitText}>Heart Healthy</Text>
              </View>
              <View style={styles.benefitItem}>
                <MaterialCommunityIcons name="weight-lifter" size={24} color="#FF9800" />
                <Text style={styles.benefitText}>High Protein</Text>
              </View>
              <View style={styles.benefitItem}>
                <MaterialCommunityIcons name="leaf" size={24} color="#4CAF50" />
                <Text style={styles.benefitText}>Gluten Free</Text>
              </View>
              <View style={styles.benefitItem}>
                <MaterialCommunityIcons name="water" size={24} color="#2196F3" />
                <Text style={styles.benefitText}>High Fiber</Text>
              </View>
            </View>
          </View>

          {/* Certifications */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            <View style={styles.certRow}>
              <View style={styles.certBadge}>
                <MaterialCommunityIcons name="certificate" size={20} color="#4CAF50" />
                <Text style={styles.certText}>Organic</Text>
              </View>
              <View style={styles.certBadge}>
                <MaterialCommunityIcons name="shield-check" size={20} color="#2196F3" />
                <Text style={styles.certText}>Quality Tested</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.quantitySelector}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <MaterialCommunityIcons name="minus" size={20} color="#333" />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity} kg</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => setQuantity(Math.min(product.quantity, quantity + 1))}
          >
            <MaterialCommunityIcons name="plus" size={20} color="#333" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
          <MaterialCommunityIcons name="cart-plus" size={24} color="#FFF" />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buyNowButton} onPress={handleBuyNow}>
          <Text style={styles.buyNowText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  imageContainer: {
    height: 250,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  productImageEmoji: {
    fontSize: 100,
  },
  certificationBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    elevation: 2,
  },
  certificationText: {
    marginLeft: 5,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  infoSection: {
    backgroundColor: '#FFF',
    padding: 20,
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#666',
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  priceUnit: {
    fontSize: 16,
    color: '#666',
    marginLeft: 5,
  },
  stockBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginLeft: 15,
  },
  stockText: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '600',
  },
  sellerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  sellerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sellerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  contactButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  benefitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  benefitItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  benefitText: {
    marginLeft: 8,
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
  },
  certRow: {
    flexDirection: 'row',
  },
  certBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  certText: {
    marginLeft: 5,
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    elevation: 5,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    paddingHorizontal: 5,
  },
  quantityButton: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 10,
  },
  addToCartButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2E7D32',
    padding: 12,
    borderRadius: 10,
    marginLeft: 10,
  },
  addToCartText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  buyNowButton: {
    backgroundColor: '#FF9800',
    padding: 12,
    borderRadius: 10,
    marginLeft: 10,
  },
  buyNowText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ProductDetailScreen;
