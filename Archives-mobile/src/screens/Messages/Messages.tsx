import React, { useState, useEffect } from'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from'react-native';
import { useChatRooms } from'./MessageFunctions';
import { useNavigation, NavigationProp } from'@react-navigation/native';
import { StackParamList } from'../../navigation/types';
import { FIREBASE_AUTH } from'../../../FirebaseConfig';
import { doc, getDoc, Timestamp, onSnapshot,updateDoc } from'firebase/firestore';
import { FIREBASE_DB } from'../../../FirebaseConfig';
import { getLatestMessage } from'./MessageFunctions';
import Ionicons from 'react-native-vector-icons/Ionicons';


interface MessagesProps {
  currentUserId: string;
}

const Messages: React.FC<MessagesProps> = () => {
  const [userDetails, setUserDetails] = useState<{ [key: string]: any }>({});
  const [latestMessages, setLatestMessages] = useState<{ [key: string]: { message: string, seen: boolean, senderId: string, timestamp: Timestamp | null } }>({});
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
    const fetchLatestMessages = async () => {
      const messages: { [key: string]: { message: string, seen: boolean, senderId: string, timestamp: Timestamp | null } } = {};
      for (const chatRoom of chatRooms) {
        const latestMessage = await getLatestMessage(chatRoom.id);
        messages[chatRoom.id] = latestMessage
          ? { message: latestMessage.message, seen: latestMessage.seen, senderId: latestMessage.senderId, timestamp: latestMessage.timestamp }
          : { message: 'No messages yet', seen: false, senderId: '', timestamp: null };
      }
      setLatestMessages(messages);
    };

    if (chatRooms.length) {
      fetchLatestMessages();
    }
  }, [chatRooms]);

  const handleChatPress = async (chatRoom: any) => {
    const otherUserId = chatRoom.users.find((id: string) => id !== currentUserId);
    if (otherUserId && userDetails[otherUserId]) {
      const otherUserData = userDetails[otherUserId];
      navigation.navigate('MessageScreen', {
        chatRoomId: chatRoom.id,
        userId: otherUserId,
        currentUserId,
        photoUrl: otherUserData.photoUrl,
        name: otherUserData.name,
        username: otherUserData.username,
      });
     
      // Update the `seen` status of the latest message
      setLatestMessages((prevMessages) => {
        const updatedMessages = { ...prevMessages };
        if (updatedMessages[chatRoom.id]) {
          updatedMessages[chatRoom.id].seen = true;
        }
        return updatedMessages;
      });

      // Optionally, update `seen` status in Firebase// 
      const chatRoomDocRef = doc(FIREBASE_DB, `chatRooms/${chatRoom.id}`);// 
      await updateDoc(chatRoomDocRef, { seen: true });
    } else {
      console.error('User details not available.');
    }
  };

  const formatTimestamp = (timestamp: Timestamp | null) => {
    if (!timestamp) return'';
    const date = timestamp.toDate();
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDateHeader = (timestamp: Timestamp | null) => {
    if (!timestamp) return'';
    const date = timestamp.toDate();
    const today = new Date();
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const yesterdayDate = new Date(todayDate);
    yesterdayDate.setDate(todayDate.getDate() - 1);

    if (messageDate.getTime() === todayDate.getTime()) {
      return'Today';
    } else if (messageDate.getTime() === yesterdayDate.getTime()) {
      return'Yesterday';
    } else {
      return date.toLocaleDateString(undefined, { month: 'long', day: 'numeric' });
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const otherUserId = item.users.find((id: string) => id !== currentUserId);
    const otherUser = userDetails[otherUserId];
    const messageDetails = latestMessages[item.id] || { message: 'No messages yet', seen: false, senderId: '', timestamp: null };
  
    const senderUsername = messageDetails.senderId === currentUserId
      ? 'You'
      : userDetails[messageDetails.senderId]?.username || 'Unknown';

    if (!otherUser) {
      return null;
    }

    return (
      <TouchableOpacity style={styles.chatRoomContainer}onPress={() => handleChatPress(item)}>
        <Image source={{uri:otherUser.photoUrl }} style={styles.profileImage} />
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={[styles.chatRoomText, { marginRight: '43%'}]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontWeight:'bold' }}>
              {otherUser.username}
            </Text>
            {!messageDetails.seen && (
          <Ionicons style={{ marginLeft: 5 }} name="ellipse"size={10}color="#DE3B48" />
          
        )}
          </View>
         <Text style={{ opacity: 0.7 }}>
              {senderUsername}: {messageDetails.message}
            </Text>
          
      
        </View>
            <View style={{ flexDirection: 'column', alignItems: 'flex-end', marginLeft: 'auto' }}>
              <Text style={{ opacity: 0.5 }}>{formatTimestamp(messageDetails.timestamp)}
              </Text><Text style={{ opacity: 0.4 }}>{formatDateHeader(messageDetails.timestamp)}</Text>
              </View></View></TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {chatRooms.length === 0 ? (
        <Text style={styles.emptyText}>Follow a friend to start messaging</Text>
      ) : (
        <FlatList data={chatRooms}renderItem={renderItem}keyExtractor={(item) => item.id} />
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
