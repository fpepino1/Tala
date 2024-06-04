import React, { useState } from 'react';
import { SafeAreaView, Image, TouchableOpacity, Text, StyleSheet, TextInput } from 'react-native';
import { useFonts, Inter_400Regular } from '@expo-google-fonts/inter';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AuthNavigator'
import Logo from '../../components/common/logo';

type LogInScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ProfileSetUpScreen'>;

type Props = {
  navigation: LogInScreenNavigationProp;
};

export default function ProfileSetUpScreen() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
  });

  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.biggerText}>Finish setting up your account</Text>
        <TouchableOpacity onPress={pickImage}>
          <Image
            resizeMode='contain'
            source={image ? { uri: image } : require('../../assets/images/D9D9D9.png')}
            style={styles.image}
            accessibilityLabel="Profile image"
          />
        </TouchableOpacity>
        <Text style={[styles.nameText, styles.boldText]}>FARRAH</Text>
        <Text style={styles.normalText}>farrah_alyssa</Text>
        <TextInput
          style={styles.input}
          placeholder='Add a bio'
          keyboardType="default"
          autoCapitalize="sentences"
        />
        <TouchableOpacity style={styles.submit}>
          <Text style={styles.submitText}>Next</Text>
        </TouchableOpacity>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Inter_400Regular',
  },
  biggerText: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: '10%',
  },
  nameText: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 2,
  },
  boldText: {
    fontWeight: 'bold',
  },
  normalText: {
    fontSize: 13,
    marginBottom: 20,
  },
  input: {
  width: '80%',
  borderRadius: 16,
  backgroundColor: '#E3E3E3',
  borderColor: '#E3E3E3',
  borderWidth: 1,
  paddingHorizontal: '5%',
  paddingTop: '5%', 
  paddingBottom: '19%', 
  marginBottom: 30,
  },
  submit: {
    backgroundColor: '#0d0d0d',
    borderRadius: 16,
    height: 50,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
  },
  image: {
    width: 130,
    height: 130,
    marginBottom: 10,
    borderRadius: 100,
  },
});