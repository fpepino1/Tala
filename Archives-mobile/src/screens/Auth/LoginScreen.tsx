import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Logo from '../Main/logo';
import { FIREBASE_AUTH } from '../../../FirebaseConfig';
import { FIREBASE_DB } from '../../../FirebaseConfig';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { LoginScreenProps } from '../../navigation/types';
import { doc, getDoc } from 'firebase/firestore';
import { updateUserActivity } from '../Main/functions';
export default function LoginScreen ({ navigation, route }: LoginScreenProps) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

 const auth = FIREBASE_AUTH;
  const ARCHIVES_DB = FIREBASE_DB;
  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in:', response.user);

      const userId = response.user.uid;
      const userDocRef = doc(ARCHIVES_DB, 'users', userId);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        console.log('User data:', userData);
    
        await updateUserActivity(userId, { status: 'active' });

        navigation.navigate('TabNav', {
          screen: 'ProfileScreen',
          params: {
            name: userData.name,
            username: userData.username,
            bio: userData.bio,
          },
        });

        checkAuthState();

      } else {
        console.log('No such document.');
        alert('User data not found.');
      }
    } catch (error:any) {
      console.error('Login failed:', error.message);
      alert('Login failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  const checkAuthState = () => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (user) {
        console.log("User is signed in:", user.uid);
      } else {
        console.log("No user is signed in.");
      }
    });
  };
  

  
  return (
    <SafeAreaView style={styles.container}>
      <Logo />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry={true}
      />
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPasswordScreen')}>
          <Text style={styles.forgotPasswordText}>Forgot password?</Text>
        </TouchableOpacity>
      <TouchableOpacity style={styles.submit} onPress={handleLogin}>
        <Text style={styles.submitText}>Log in</Text>
      </TouchableOpacity>
      <View style={styles.dividerContainer}>
        <View style={[styles.divider, {marginLeft: 50}]} />
        <Text style={styles.orText}>or</Text>
        <View style={[styles.divider, {marginRight: 50}]} />
      </View>
      <TouchableOpacity
        style={styles.submit}
        onPress={() => navigation.navigate('RegisterScreen')}
      >
        <Text style={styles.submitText}>Create an account</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
   
    flex: 1,
    marginTop:'-50%',
    backgroundColor: '#F8F3FA',

  },
  input: {
    height: 51,
    borderRadius: 16,
    backgroundColor: '#E3E3E3',
    borderColor: '#E3E3E3',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 20,
    marginLeft: 50,
    marginRight: 50,
  },
  submit: {
    backgroundColor: '#0d0d0d',
    borderRadius: 16,
    height: 51,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    marginLeft: 50,
    marginRight: 50,
  },
  forgotPasswordText: {
    marginBottom: 20,
    marginRight: 70,
    fontSize: 11,
    textAlign: 'right',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#0d0d0d',
   
  },
  orText: {
    marginHorizontal: 10,
    fontSize: 13,
    color: '#0d0d0d',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
});