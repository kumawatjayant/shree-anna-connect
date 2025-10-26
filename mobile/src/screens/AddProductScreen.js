import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import api from '../services/api';

const AddProductScreen = ({ navigation, route }) => {
  const editProduct = route.params?.product;
  const [formData, setFormData] = useState({
    name: editProduct?.name || '',
    category: editProduct?.category || 'foxtail',
    price: editProduct?.price?.toString() || '',
    quantity: editProduct?.quantity?.toString() || '',
    description: editProduct?.description || '',
    unit: 'kg',
  });
  const [loading, setLoading] = useState(false);

  const categories = [
    { label: 'Foxtail Millet', value: 'foxtail' },
    { label: 'Pearl Millet', value: 'pearl' },
    { label: 'Finger Millet', value: 'finger' },
    { label: 'Little Millet', value: 'little' },
    { label: 'Proso Millet', value: 'proso' },
    { label: 'Barnyard Millet', value: 'barnyard' },
    { label: 'Kodo Millet', value: 'kodo' },
  ];

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.price || !formData.quantity) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const productData = {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        quantity: parseFloat(formData.quantity),
        description: formData.description,
        unit: formData.unit,
      };

      if (editProduct) {
        await api.put(`/products/${editProduct._id}`, productData);
        Alert.alert('Success', 'Product updated successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        await api.post('/products', productData);
        Alert.alert('Success', 'Product added successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={28} color="#2E7D32" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {editProduct ? 'Edit Product' : 'Add Product'}
        </Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          <Text style={styles.label}>Product Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Organic Foxtail Millet"
            value={formData.name}
            onChangeText={(value) => handleChange('name', value)}
          />

          <Text style={styles.label}>Category *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.category}
              onValueChange={(value) => handleChange('category', value)}
              style={styles.picker}
            >
              {categories.map((cat) => (
                <Picker.Item key={cat.value} label={cat.label} value={cat.value} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Price per kg *</Text>
          <View style={styles.inputWithIcon}>
            <Text style={styles.inputIcon}>₹</Text>
            <TextInput
              style={[styles.input, styles.inputWithPadding]}
              placeholder="0"
              value={formData.price}
              onChangeText={(value) => handleChange('price', value)}
              keyboardType="decimal-pad"
            />
          </View>

          <Text style={styles.label}>Available Quantity (kg) *</Text>
          <TextInput
            style={styles.input}
            placeholder="0"
            value={formData.quantity}
            onChangeText={(value) => handleChange('quantity', value)}
            keyboardType="decimal-pad"
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe your product..."
            value={formData.description}
            onChangeText={(value) => handleChange('description', value)}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <View style={styles.infoBox}>
            <MaterialCommunityIcons name="information" size={20} color="#2196F3" />
            <Text style={styles.infoText}>
              Add accurate details to attract more buyers. High-quality products get better visibility.
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <MaterialCommunityIcons name="check" size={24} color="#FFF" />
            <Text style={styles.submitButtonText}>
              {loading ? 'Saving...' : editProduct ? 'Update Product' : 'Add Product'}
            </Text>
          </TouchableOpacity>
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
  scrollContent: {
    padding: 20,
  },
  form: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  inputWithIcon: {
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: 15,
    top: 15,
    fontSize: 16,
    color: '#666',
    zIndex: 1,
  },
  inputWithPadding: {
    paddingLeft: 35,
  },
  pickerContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  picker: {
    height: 50,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  infoText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 12,
    color: '#1976D2',
    lineHeight: 18,
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: '#2E7D32',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
  },
  buttonDisabled: {
    backgroundColor: '#A5D6A7',
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default AddProductScreen;
