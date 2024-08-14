import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useChatRooms } from './MessageFunctions';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { StackParamList } from '../../navigation/types';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../FirebaseConfig';

interface MessagesProps {
  currentUserId: string;
}

const Messages: React.FC<MessagesProps> = () => {
  const [userDetails, setUserDetails] = useState<{ [key: string]: any }>({});
  const currentUserId = FIREBASE_AUTH.currentUser?.uid;
  const chatRooms = useChatRooms(currentUserId);
  const navigation = useNavigation<NavigationProp<StackParamList>>();

  const handleChatPress = async (chatRoom: any) => {
    if (!currentUserId) {
      console.error('Current user ID is not available.');
      return;
    }

    const otherUserId = chatRoom.users.find((id: string) => id !== currentUserId);
    if (!otherUserId) {
      console.error('Other user ID not found.');
      return;
    }

    const otherUserDocRef = doc(FIREBASE_DB, `users/${otherUserId}`);
    try {
      const otherUserDocSnapshot = await getDoc(otherUserDocRef);

      if (otherUserDocSnapshot.exists()) {
        const otherUserData = otherUserDocSnapshot.data();
        setUserDetails((prevDetails) => ({
          ...prevDetails,
          [otherUserId]: otherUserData,
        }));
        
        navigation.navigate('MessageScreen', {
          chatRoomId: chatRoom.id,
          userId: otherUserId,
          currentUserId,
          photoUrl: otherUserData.photoUrl,
          name: otherUserData.name,
          username: otherUserData.username,
        });
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching document:', error);
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const otherUser = userDetails[item.users.find((id: string) => id !== currentUserId)];
    
    return (
      <TouchableOpacity
        style={styles.chatRoomContainer}
        onPress={() => handleChatPress(item)}
      >
        <Image source={{ uri: otherUser?.photoUrl }} style={styles.profileImage} />
        <View style={styles.chatRoomText}>
          <Text style={styles.name}>{otherUser?.name}</Text>
          <Text style={styles.username}>{otherUser?.username || 'Username not available'}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {chatRooms.length === 0 ? (
        <Text style={styles.emptyText}>No chats available</Text>
      ) : (
        <FlatList
          data={chatRooms}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F3FA',
    padding: 10,
  },
  chatRoomContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  chatRoomText: {
    marginVertical: 20,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  username: {
    fontSize: 14,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
    fontSize: 16,
  },
});

export default Messages;
