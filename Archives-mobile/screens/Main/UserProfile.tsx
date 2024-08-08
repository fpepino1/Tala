import React, { useState } from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProfileStats from './ProfileStats';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import PostGrid from '../Posts/PostGrid';

export default function UserProfile({ route }) {
    const { username, name, photoUrl, bio, userId } = route.params;
    const navigation = useNavigation();
    const [isFollowing, setIsFollowing] = useState(false);

    const handleFollow = () => {
      setIsFollowing(!isFollowing);
      console.log(`${isFollowing ? 'Unfollowed' : 'Followed'} user`);
    };

   

    return (
        <ScrollView style={{ backgroundColor: '#F8F3FA'}}>
        <View style={styles.container}>
                <Image source={{ uri: photoUrl }} style={[styles.profile]} />
                <Text style={styles.nameText}>{name}</Text>
                <Text style={[styles.normalText, { opacity: 0.6 }]}>{username}</Text>
                <Text style={[styles.bioText, styles.bioContainer]}>{bio}</Text>
                <View style={styles.actionsContainer}>
                <TouchableOpacity 
        style={[styles.submit, { backgroundColor: isFollowing ? '#d9d9d9' : '#0d0d0d' }]} 
        onPress={handleFollow}
      >
        <Text style={[styles.submitText, { color: isFollowing ? '#0d0d0d' : '#fff' }]}>
          {isFollowing ? 'Following' : 'Follow'}
        </Text>
      </TouchableOpacity>
                    <TouchableOpacity style={styles.messageButton} onPress={handleFollow}>
                        <Ionicons name="chatbubble-outline" size={30} color="#0d0d0d" />
                    </TouchableOpacity>
                </View>
                <ProfileStats userId={userId}/>
                <PostGrid userId={userId} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flex: 1,
        backgroundColor: '#F8F3FA',
        justifyContent: 'center',
        width: '100%',
    },
    nameText: {
        fontSize: 24,
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
    bioContainer: {
        marginLeft: 40,
        marginRight: 50,
    },
    profile: {
        width: 130,
        height: 130,
        marginTop: '4%',
        marginBottom: 10,
        borderRadius: 100,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop:'3%',
    },
    submit: {
        backgroundColor: '#0d0d0d',
        borderRadius: 16,
        height: 51,
        justifyContent: 'center',
        alignItems: 'center',
        width: '40%',
    },
    submitText: {
        color: '#fff',
        fontSize: 16,
    },
    messageButton: {
        marginLeft: '5%',
        paddingBottom: '1.5%',
    },
    viewPostsText: {
        fontSize: 16,
        color: '#007BFF',
        marginTop: 10,
    },
});
