import React from 'react';
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

const SchemeDetailScreen = ({ route, navigation }) => {
  const { scheme } = route.params;

  const handleApply = () => {
    Alert.alert(
      'Apply for Scheme',
      `You are about to apply for ${scheme.name}. This will redirect you to the official portal.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: () => Alert.alert('Success', 'Application submitted!') },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scheme Details</Text>
        <TouchableOpacity>
          <MaterialCommunityIcons name="share-variant" size={28} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView>
        {/* Hero Section */}
        <View style={[styles.heroSection, { backgroundColor: scheme.color }]}>
          <MaterialCommunityIcons name={scheme.icon} size={60} color="#FFF" />
          <Text style={styles.schemeName}>{scheme.name}</Text>
          <Text style={styles.schemeCategory}>{scheme.category}</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Description */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="information" size={24} color="#2E7D32" />
              <Text style={styles.sectionTitle}>About</Text>
            </View>
            <Text style={styles.sectionText}>{scheme.description}</Text>
          </View>

          {/* Eligibility */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="account-check" size={24} color="#2E7D32" />
              <Text style={styles.sectionTitle}>Eligibility</Text>
            </View>
            <Text style={styles.sectionText}>{scheme.eligibility}</Text>
          </View>

          {/* Benefits */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="gift" size={24} color="#2E7D32" />
              <Text style={styles.sectionTitle}>Benefits</Text>
            </View>
            <Text style={styles.sectionText}>{scheme.benefits}</Text>
          </View>

          {/* How to Apply */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="clipboard-text" size={24} color="#2E7D32" />
              <Text style={styles.sectionTitle}>How to Apply</Text>
            </View>
            <View style={styles.stepContainer}>
              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>1</Text>
                </View>
                <Text style={styles.stepText}>Visit official portal or nearest bank/CSC/agriculture office</Text>
              </View>
              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <Text style={styles.stepText}>Complete eKYC with Aadhaar authentication</Text>
              </View>
              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>3</Text>
                </View>
                <Text style={styles.stepText}>Fill application form with land/bank details</Text>
              </View>
              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>4</Text>
                </View>
                <Text style={styles.stepText}>Submit documents and track status online</Text>
              </View>
            </View>
          </View>

          {/* Required Documents */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="file-document" size={24} color="#2E7D32" />
              <Text style={styles.sectionTitle}>Required Documents</Text>
            </View>
            <View style={styles.documentList}>
              <View style={styles.documentItem}>
                <MaterialCommunityIcons name="check-circle" size={20} color="#4CAF50" />
                <Text style={styles.documentText}>Aadhaar Card</Text>
              </View>
              <View style={styles.documentItem}>
                <MaterialCommunityIcons name="check-circle" size={20} color="#4CAF50" />
                <Text style={styles.documentText}>Land Records</Text>
              </View>
              <View style={styles.documentItem}>
                <MaterialCommunityIcons name="check-circle" size={20} color="#4CAF50" />
                <Text style={styles.documentText}>Bank Account Details</Text>
              </View>
              <View style={styles.documentItem}>
                <MaterialCommunityIcons name="check-circle" size={20} color="#4CAF50" />
                <Text style={styles.documentText}>Passport Size Photo</Text>
              </View>
            </View>
          </View>

          {/* Contact Info */}
          <View style={styles.contactCard}>
            <MaterialCommunityIcons name="phone" size={24} color="#2E7D32" />
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Kisan Call Center</Text>
              <Text style={styles.contactValue}>1800-180-1551</Text>
            </View>
          </View>
          
          <View style={styles.contactCard}>
            <MaterialCommunityIcons name="web" size={24} color="#2E7D32" />
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Official Portal</Text>
              <Text style={styles.contactValue}>agricoop.nic.in</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Apply Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
          <MaterialCommunityIcons name="send" size={24} color="#FFF" />
          <Text style={styles.applyButtonText}>Apply Now</Text>
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
    backgroundColor: '#2E7D32',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  heroSection: {
    alignItems: 'center',
    padding: 40,
  },
  schemeName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 15,
    textAlign: 'center',
  },
  schemeCategory: {
    fontSize: 14,
    color: '#FFF',
    marginTop: 5,
    opacity: 0.9,
  },
  content: {
    padding: 20,
  },
  section: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  sectionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  stepContainer: {
    marginTop: 10,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    paddingTop: 5,
  },
  documentList: {
    marginTop: 10,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  documentText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 10,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 15,
    borderRadius: 12,
  },
  contactInfo: {
    marginLeft: 15,
  },
  contactLabel: {
    fontSize: 12,
    color: '#666',
  },
  contactValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  bottomBar: {
    backgroundColor: '#FFF',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  applyButton: {
    flexDirection: 'row',
    backgroundColor: '#2E7D32',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default SchemeDetailScreen;
