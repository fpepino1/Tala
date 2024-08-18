import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import { fetchActiveFollowedUsers } from './functions';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { StackParamList } from '../../navigation/types';
import { FIREBASE_DB } from '../../../FirebaseConfig';
import { doc, onSnapshot, Timestamp, getDocs, query, orderBy, writeBatch, collection } from 'firebase/firestore';
import { useChatRooms } from '../Messages/MessageFunctions';

interface User {
  id: string;
  name: string;
  username: string;
  photoUrl: string;
  chatRoomId?: string; 
}

const ActiveUsersList = ({ currentUserId }: { currentUserId: string }) => {
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const [userDetails, setUserDetails] = useState<{ [key: string]: User }>({});
  const [latestMessages, setLatestMessages] = useState<{ [key: string]: { message: string, senderId: string, timestamp: Timestamp | null, seen: boolean, flagged: boolean } }>({});
  const navigation = useNavigation<NavigationProp<StackParamList>>();
  const chatRooms = useChatRooms(currentUserId);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const details: { [key: string]: User } = {};
      for (const chatRoom of chatRooms) {
        const otherUserId = chatRoom.users.find((id: string) => id !== currentUserId);
        if (otherUserId) {
          const otherUserDocRef = doc(FIREBASE_DB, `users/${otherUserId}`);
          const unsubscribe = onSnapshot(otherUserDocRef, snapshot => {
            if (snapshot.exists()) {
              details[otherUserId] = { ...snapshot.data(), chatRoomId: chatRoom.id } as User;
              setUserDetails(prevDetails => ({ ...prevDetails, [otherUserId]: details[otherUserId] }));
            }
          });
          return () => unsubscribe();
        }
      }
    };

    fetchUserDetails();
  }, [chatRooms, currentUserId]);

  useEffect(() => {
    const unsubscribe = chatRooms.map(chatRoom => {
      const messagesRef = collection(FIREBASE_DB, `chats/${chatRoom.id}/messages`);
      const messagesQuery = query(messagesRef, orderBy('timestamp'));

      return onSnapshot(messagesQuery, snapshot => {
        const messages: { [key: string]: { message: string, senderId: string, timestamp: Timestamp | null, seen: boolean, flagged: boolean } } = {};

        snapshot.docs.forEach(doc => {
          const data = doc.data();
          messages[chatRoom.id] = {
            message: data.message,
            senderId: data.senderId,
            timestamp: data.timestamp as Timestamp || null,
            seen: data.seen || false,
            flagged: data.flagged || false,
          };
        });

        setLatestMessages(prevMessages => ({
          ...prevMessages,
          ...messages
        }));
      });
    });

    return () => {
      unsubscribe.forEach(unsub => unsub());
    };
  }, [chatRooms]);

  const handleChatPress = async (user: User) => {
    if (user.chatRoomId) {
      const chatRoomId = user.chatRoomId;

      const messagesRef = collection(FIREBASE_DB, `chats/${chatRoomId}/messages`);
      const messagesQuery = query(messagesRef, orderBy('timestamp'));
      const snapshot = await getDocs(messagesQuery);

      const batch = writeBatch(FIREBASE_DB);
      snapshot.docs.forEach(doc => {
        batch.update(doc.ref, { seen: true });
      });
      await batch.commit();

      navigation.navigate('MessageScreen', {
        chatRoomId,
        userId: user.id,
        currentUserId,
        photoUrl: user.photoUrl,
        name: user.name,
        username: user.username,
      });
    } else {
      console.error('Chat room ID not available for this user.');
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await fetchActiveFollowedUsers(currentUserId);
      console.log('Fetched users:', users);
      setActiveUsers(users);
    };
    fetchUsers();
  }, [currentUserId]);

  const renderItem = ({ item }: { item: User }) => {
    return (
      <GestureHandlerRootView>
        <View style={styles.userItem}>
          <TouchableOpacity onPress={() => handleChatPress(item)}>
            <View style={{ alignItems: 'center' }}>
              <Image source={{ uri: item.photoUrl }} style={styles.userPhoto} />
              <Text>
                <Text style={styles.userUsername}>{item.username}</Text> <Ionicons name="ellipse" size={10} color="green" />
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </GestureHandlerRootView>
    );
  };

  return (
    <View>
      {activeUsers.length > 0 ? (
        <View style={[styles.container, { marginBottom: 10 }]}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: '2%', marginBottom: '5%' }}>Active</Text>
          <FlatList
            data={activeUsers}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        </View>
      ) : (
        <Text></Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    backgroundColor: '#F8F3FA',
    paddingLeft: '3%',
  },
  userItem: {
    flexDirection: 'column',
    marginHorizontal: 'auto',
    paddingBottom: 10,
  },
  userPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 5,
  },
  userUsername: {
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 10,
  },
});

export default ActiveUsersList;
