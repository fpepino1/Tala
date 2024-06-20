import React, { useState } from 'react';
import { SafeAreaView, Image, TouchableOpacity, Text, StyleSheet, TextInput, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as AWS from 'aws-sdk';

export default function Avatar(){
    const [image, setImage] = useState<string | null>(null);
  
    const handleUpdate = async () => {
      
    }

  
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
  
   // get secure url from our serve

    // post the image directky to the s3 bucket

    //post request to my server to store


    return(
        <View>
        <TouchableOpacity onPress={pickImage}>
          <Image
            resizeMode='contain'
            source={image ? { uri: image } : require('../../assets/images/D9D9D9.png')}
            style={styles.image}
            accessibilityLabel="Profile image"
          />
        </TouchableOpacity>
        </View>
    );
}


const styles = StyleSheet.create({
    image: {
      width: 130,
      height: 130,
      marginBottom: 10,
      borderRadius: 100,
    },
  });