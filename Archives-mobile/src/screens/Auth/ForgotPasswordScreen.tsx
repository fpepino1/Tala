import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { FIREBASE_AUTH } from '../../../FirebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const auth = FIREBASE_AUTH;

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Success', 'Password reset email sent!');
      navigation.goBack(); 
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Ionicons name="lock-closed-outline" style={{marginHorizontal:'auto', marginBottom: 20}} size={80} color="black" /> 
      <Text style={styles.header}>Trouble logging in?</Text>
      <Text style={{marginBottom: '10%', opacity: 0.5, paddingHorizontal: 20, width:'80%', marginHorizontal:'auto'}}>Enter your email and we'll send you a link to reset your password.</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={handleForgotPassword}>
        <Text style={styles.buttonText}>Send link</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F8F3FA',
    width: '100%',
    marginTop:'-35%',
    marginHorizontal:'auto'
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 51,
    borderRadius: 16,
    backgroundColor: '#E3E3E3',
    borderColor: '#E3E3E3',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 20,
    width:'90%',
    marginHorizontal:'auto'
  },
  button: {
    backgroundColor: '#0d0d0d',
    borderRadius: 16,
    height: 51,
    justifyContent: 'center',
    alignItems: 'center',
    width:'90%',
    marginHorizontal:'auto'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
