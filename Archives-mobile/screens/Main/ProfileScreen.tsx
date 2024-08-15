import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { fetchUserData } from "./UserData";
import { getAuth } from 'firebase/auth';
import ProfileStats from "./ProfileStats";
import { UserData } from "../../navigation/types";
import MenuButton from "./MenuButton";
import PostGrid from "../Posts/PostGrid";

export default function ProfileScreen(){
  
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const defaultPhoto = require('../../assets/images/D9D9D9.png');


  useEffect(() => {
    const loadUserData = async () => {
      const auth = getAuth(); 

      try {
        const uid = auth.currentUser?.uid;
        if (uid) {
          const data = await fetchUserData(uid); 
          setUserData(data);
        } else {
          console.error('User not authenticated.');
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>  
      </SafeAreaView>
    );
  }

  if (!userData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Error loading user data.</Text>
      </SafeAreaView>
    );
  }

  return (
    <ScrollView style={{ backgroundColor: '#F8F3FA'}}>
      
        <View style={[styles.containerCenter, {marginTop:'15%'}]}>
    <MenuButton/>
          <Image
            resizeMode='contain'
            source={userData.photoUrl ? { uri: userData.photoUrl } : defaultPhoto}
            style={styles.profile}
            accessibilityLabel="Profile image"
          />
          <Text style={[styles.nameText, styles.boldText]}>{userData.name}</Text>
          <Text style={{ ...styles.normalText, opacity: 0.6 }}>{userData.username}</Text>
          <Text style={[styles.bioText, styles.bioContainer]}>{userData.bio}</Text>
          <ProfileStats userId={userData.userId}/>
        </View>
        <PostGrid userId={userData.userId}/>
       </ScrollView>
      
     
  );
}

const styles = StyleSheet.create({

  containerCenter: {
    alignItems: 'center',
   
  },
  nameText: {
    fontSize: 24,
  },
  boldText: {
    fontWeight: 'bold',
  },
  normalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  bioText: {
    fontSize: 16,
    marginTop: 20,
    marginBottom: 15,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#d9d9d9',
    marginVertical: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F3FA',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bioContainer:{
    marginLeft:40,
    marginRight: 50,
  },
  iconContainer: {
   marginLeft: '85%',
   marginBottom:'5%',
  },
  profile: {
    width: 130,
    height: 130,
    marginBottom: 10,
    borderRadius: 100,
  },
});

