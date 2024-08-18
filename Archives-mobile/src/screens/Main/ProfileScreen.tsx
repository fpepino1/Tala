import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
import ProfileStats from "./ProfileStats";
import { UserData } from "../../navigation/types";
import MenuButton from "./MenuButton";
import PostGrid from "../Posts/PostGrid";
import { FIREBASE_AUTH } from "../../../FirebaseConfig";

export default function ProfileScreen() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const defaultPhoto = require('../../../assets/images/D9D9D9.png');

  useEffect(() => {
    const auth = getAuth();
    const firestore = getFirestore();
    const uid = auth.currentUser?.uid;

    if (uid) {
      const userDocRef = doc(firestore, `users/${uid}`);

      const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          setUserData(docSnapshot.data() as UserData);
        } else {
          console.error('No such document!');
        }
        setLoading(false);
      }, (error) => {
        console.error('Error fetching user data:', error);
        setLoading(false);
      });

      return () => unsubscribe();  
    } else {
      console.error('User not authenticated.');
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>  
        <ActivityIndicator size="large" color="#0000ff" />
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
    <ScrollView style={{ backgroundColor: '#F8F3FA' }}>
      <View style={[styles.containerCenter, {marginTop:'15%'}]}>
        <MenuButton />
        <Image
          resizeMode='contain'
          source={userData.photoUrl ? { uri: userData.photoUrl } : defaultPhoto}
          style={styles.profile}
          accessibilityLabel="Profile image"
        />
        <Text style={[styles.nameText, styles.boldText]}>{userData.name}</Text>
        <Text style={{ ...styles.normalText, opacity: 0.6 }}>{userData.username}</Text>
        <Text style={[styles.bioText, styles.bioContainer]}>{userData.bio}</Text>
        <ProfileStats userId={FIREBASE_AUTH.currentUser?.uid} />
      </View>
      <PostGrid userId={FIREBASE_AUTH.currentUser?.uid} />
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
  bioContainer: {
    marginLeft: 40,
    marginRight: 50,
  },
  iconContainer: {
    marginLeft: '85%',
    marginBottom: '5%',
  },
  profile: {
    width: 130,
    height: 130,
    marginBottom: 10,
    borderRadius: 100,
  },
});
