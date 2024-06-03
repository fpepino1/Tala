import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AuthNavigator'
import Logo from '../../components/common/logo';


type LogInScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
  navigation: LogInScreenNavigationProp;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {

  const [value, setValue] = useState({
    email: "",
    password: "",
    error: "" as string | undefined, 
  });

  const { email, password, error } = value;

  async function signIn() {
    if (email === "" || password === "") {
      setValue((prevState) => ({
        ...prevState,
        error: "Email and password are mandatory.",
      }));
      return;
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Logo />
      <TextInput
        style={styles.input}
        placeholder="Username or email"
        value={email}
        onChangeText={(text) => setValue((prevState) => ({ ...prevState, email: text }))}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={(text) => setValue((prevState) => ({ ...prevState, password: text }))}
        secureTextEntry
      />
      <Text style={styles.forgotPasswordText}>Forgot password?</Text>
      <TouchableOpacity style={styles.submit} onPress={signIn}>
        <Text style={styles.submitText}>Log in</Text>
      </TouchableOpacity>
      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.orText}>or</Text>
        <View style={styles.divider} />
      </View>
      <TouchableOpacity style={styles.submit} onPress={() => navigation.navigate('Register')}>
        <Text style={styles.submitText}>Create an account</Text>
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    margin: 20,
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
    marginTop: 10,
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