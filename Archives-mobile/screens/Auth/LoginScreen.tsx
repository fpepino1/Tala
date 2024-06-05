import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AuthNavigator';
import Logo from '../../components/common/logo';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { createUserWithEmailAndPassword } from 'firebase/auth';
type LogInScreenNavigationProp = StackNavigationProp<RootStackParamList, 'LoginScreen'>;

type Props = {
  navigation: LogInScreenNavigationProp;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const auth = FIREBASE_AUTH;

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);
      alert('Welcome to Archives!');

    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
        alert('Login failed: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
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
      <Text style={styles.forgotPasswordText}>Forgot password?</Text>
      <TouchableOpacity style={styles.submit} onPress={handleLogin}>
        <Text style={styles.submitText}>Log in</Text>
      </TouchableOpacity>
      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.orText}>or</Text>
        <View style={styles.divider} />
      </View>
      <TouchableOpacity style={styles.submit} 
      onPress={() => navigation.navigate('RegisterScreen')}
      >
        <Text style={styles.submitText}>Create an account</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginLeft: 50,
    marginRight: 50,
  },
  input: {
    height: 51,
    borderRadius: 16,
    backgroundColor: '#E3E3E3',
    borderColor: '#E3E3E3',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  submit: {
    backgroundColor: '#0d0d0d',
    borderRadius: 16,
    height: 51,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  forgotPasswordText: {
    marginBottom: 20,
    marginRight: 16,
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
