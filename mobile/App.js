import React from 'react';
import { StatusBar } from 'expo-status-bar';
// import './src/i18n'; // Temporarily disabled
import AppNavigator from './src/navigation/AppNavigator';
import { CartProvider } from './src/context/CartContext';

export default function App() {
  return (
    <CartProvider>
      <AppNavigator />
      <StatusBar style="auto" />
    </CartProvider>
  );
}
