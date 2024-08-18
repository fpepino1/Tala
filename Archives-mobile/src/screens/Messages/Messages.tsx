import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useChatRooms } from './MessageFunctions';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { StackParamList } from '../../navigation/types';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../../FirebaseConfig';
import { doc, onSnapshot, collection, query, orderBy, writeBatch, Timestamp, getDocs, getDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import ActiveUsersList from '../Main/ActiveUsersList';
interface MessagesProps {
  currentUserId: string;
}

const Messages: React.FC<MessagesProps> = () => {
  const [userDetails, setUserDetails] = useState<{ [key: string]: any }>({});
  const [latestMessages, setLatestMessages] = useState<{ [key: string]: { message: string, senderId: string, timestamp: Timestamp | null, seen: boolean, flagged: boolean } }>({});
  const currentUserId = FIREBASE_AUTH.currentUser?.uid;
  const chatRooms = useChatRooms(currentUserId);
  const navigation = useNavigation<NavigationProp<StackParamList>>();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const details: { [key: string]: any } = {};
      for (const chatRoom of chatRooms) {
        const otherUserId = chatRoom.users.find((id: string) => id !== currentUserId);
        if (otherUserId) {
          const otherUserDocRef = doc(FIREBASE_DB, `users/${otherUserId}`);
          const otherUserDocSnapshot = await getDoc(otherUserDocRef);
          if (otherUserDocSnapshot.exists()) {
            details[otherUserId] = otherUserDocSnapshot.data();
          }
        }
      }
      setUserDetails(details);
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

  const handleChatPress = async (chatRoom: any) => {
    const otherUserId = chatRoom.users.find((id: string) => id !== currentUserId);
    if (otherUserId && userDetails[otherUserId]) {
      const otherUserData = userDetails[otherUserId];
      
      const messagesRef = collection(FIREBASE_DB, `chats/${chatRoom.id}/messages`);
      const messagesQuery = query(messagesRef, orderBy('timestamp'));
      const snapshot = await getDocs(messagesQuery);

      const batch = writeBatch(FIREBASE_DB);
      snapshot.docs.forEach(doc => {
        batch.update(doc.ref, { seen: true });
      });
      await batch.commit();

      navigation.navigate('MessageScreen', {
        chatRoomId: chatRoom.id,
        userId: otherUserId,
        currentUserId,
        photoUrl: otherUserData.photoUrl,
        name: otherUserData.name,
        username: otherUserData.username,
      });
    } else {
      console.error('User details not available.');
    }
  };

  const formatTimestamp = (timestamp: Timestamp | null) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDateHeader = (timestamp: Timestamp | null) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    const today = new Date();
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const yesterdayDate = new Date(todayDate);
    yesterdayDate.setDate(todayDate.getDate() - 1);

    if (messageDate.getTime() === todayDate.getTime()) {
      return 'Today';
    } else if (messageDate.getTime() === yesterdayDate.getTime()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString(undefined, { month: 'long', day: 'numeric' });
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const otherUserId = item.users.find((id: string) => id !== currentUserId);
    const otherUser = userDetails[otherUserId];
    const messageDetails = latestMessages[item.id] || { message: 'No messages yet', senderId: '', timestamp: null, seen: false, flagged: false };

    const senderUsername = messageDetails.senderId === currentUserId
      ? 'You'
      : userDetails[messageDetails.senderId]?.username || 'Unknown';

    if (!otherUser) {
      return null;
    }

    return (
      <TouchableOpacity style={styles.chatRoomContainer} onPress={() => handleChatPress(item)}>
        <Image source={{ uri: otherUser.photoUrl }} style={styles.profileImage} />
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={[styles.chatRoomText, { marginRight: '43%' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontWeight: 'bold' }}>
                {otherUser.username}
              </Text>
              {!messageDetails.seen && (
              <Ionicons name="ellipse" size={10} color="#DE3B48"  />
              )}
            </View>
            <Text style={{ opacity: 0.7 }}>
              {senderUsername}: {messageDetails.message}
            </Text>
          </View>
          <View style={{ flexDirection: 'column', alignItems: 'flex-end', marginLeft: 'auto' }}>
            <Text style={{ opacity: 0.5 }}>{formatTimestamp(messageDetails.timestamp)}</Text>
            <Text style={{ opacity: 0.4 }}>{formatDateHeader(messageDetails.timestamp)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
  <ActiveUsersList currentUserId={FIREBASE_AUTH.currentUser?.uid} />
      {chatRooms.length === 0 ? (
        <Text style={styles.emptyText}>Follow a friend to start messaging</Text>
      ) : (
       <View>
        <FlatList data={chatRooms} renderItem={renderItem} keyExtractor={(item) => item.id} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F3FA',
  },
  chatRoomContainer: {
    flexDirection: 'row',
    padding: 15,
    marginTop: '-3%',
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
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
    fontSize: 16,
  },
  redMark: {
    color: 'red',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default Messages;
