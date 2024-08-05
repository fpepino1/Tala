import React from 'react';
import { SafeAreaView, TouchableOpacity, View, Text, StyleSheet, Image } from 'react-native';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '../../navigation/types';
import { useNavigation } from '@react-navigation/native';

export default function MenuScreen() {
    const auth = FIREBASE_AUTH;
    const navigation = useNavigation<StackNavigationProp<AppStackParamList>>();

    async function editProfile() {
        navigation.navigate('EditProfileScreen');
    }

    async function handleLogout() {
        try {
            await auth.signOut();
            console.log('User signed out!');
            navigation.replace('LoginScreen');
        } catch (error) {
            console.error('Error signing out: ', error);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={editProfile} style={styles.touchable}>
                <Image style={styles.icon} source={require('../../assets/images/image 18.png')} />
                <Text style={styles.text}>Edit profile</Text>
            </TouchableOpacity>
            <View style={styles.dividerContainer}>
                    <View style={styles.divider} />
                </View>
            <TouchableOpacity onPress={handleLogout} style={styles.touchable}>
                <Image style={styles.icon} source={require('../../assets/images/image 30.png')} />
                <Text style={styles.text}>Log out</Text>
               
            </TouchableOpacity>
            <View style={styles.dividerContainer}>
                    <View style={styles.divider} />
                </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F3FA',
    },
    touchable: {
        flexDirection: 'row',
        alignItems: 'center', // Vertically align items
        paddingVertical: '5%',
    },
    icon: {
        width: 40,
        height: 40,
        marginLeft:'5%',
        marginRight:'5%',
    },
    text: {
        fontSize: 16,
        color: '#333',
    },
    dividerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
     
    },
    divider: {
        height: 1,
        backgroundColor: '#D9D9D9',
        width: '100%',
    },
});
