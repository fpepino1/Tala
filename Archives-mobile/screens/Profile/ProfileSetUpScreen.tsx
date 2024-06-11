import React, { useState } from 'react';
import { SafeAreaView, Image, TouchableOpacity, Text, StyleSheet, TextInput } from 'react-native';
import { useFonts, Inter_400Regular } from '@expo-google-fonts/inter';
import * as ImagePicker from 'expo-image-picker';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootNavigator'
import { RouteProp } from '@react-navigation/native';
import Avatar from './Avatar';


type ProfileSetUpScreenRouteProp = RouteProp<RootStackParamList, 'ProfileSetUpScreen'>;
type ProfileSetUpScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ProfileSetUpScreen'>;

type Props = {
  route: ProfileSetUpScreenRouteProp;
  navigation: ProfileSetUpScreenNavigationProp;
};


export default function ProfileSetUpScreen({ route, navigation }: Props) {
  const handleNext = async () => {   
    console.log('Navigating to ProfileScreen');
    navigation.navigate('ProfileScreen', { name, username, bio });
  }
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
  });
  const [bio, setBio] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const { name, username } = route.params;


  

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64:true,
      
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
      console.log(image);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.biggerText}>Finish setting up your account</Text>
        < Avatar />
        <Text style={[styles.nameText, styles.boldText]}>{name}</Text>
        <Text style={styles.normalText}>{username}</Text>
        <TextInput
          style={styles.input}
          placeholder='Add a bio'
          keyboardType="default"
          value={bio}
          autoCapitalize="sentences"
          onChangeText={(text) => setBio(text)}
        />
        <TouchableOpacity style={styles.submit} 
  >
          <Text style={styles.submitText} onPress={handleNext}>    
            Next</Text>
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