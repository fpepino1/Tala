import { collection, addDoc, setDoc, serverTimestamp, doc, onSnapshot, orderBy, query, writeBatch, getDocs, limit, updateDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../../FirebaseConfig';
import { useState, useEffect } from 'react';
import { getFirestore } from 'firebase/firestore';

const clearLatestFlags = async (chatRoomId: string) => {
  try {
    const messagesRef = collection(FIREBASE_DB, `chats/${chatRoomId}/messages`);
    const allMessagesQuery = query(messagesRef, orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(allMessagesQuery);
    const batch = writeBatch(FIREBASE_DB);

    querySnapshot.docs.forEach(doc => {
      if (doc.data().isLatest) {
        batch.update(doc.ref, { isLatest: false });
      }
    });

    await batch.commit();
  } catch (error) {
    console.error("Error clearing latest flags:", error);
  }
};
export const sendMessage = async (
  chatRoomId: string,
  currentUserId: string,
  userId: string,
  message: string,
  photoUrl: string,
  name: string,
  username: string
) => {
  try {
    await clearLatestFlags(chatRoomId);  
    const messagesRef = collection(FIREBASE_DB, `chats/${chatRoomId}/messages`);
    await addDoc(messagesRef, {
      message,
      timestamp: serverTimestamp(), 
      senderId: currentUserId,
      receiverId: userId,
      photoUrl,
      name,
      username,
      isLatest: true 
    });
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

export const useMessages = (chatRoomId: string) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!chatRoomId) return;

    const messagesRef = collection(FIREBASE_DB, `chats/${chatRoomId}/messages`);
    const messagesQuery = query(messagesRef, orderBy('timestamp'));

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      if (snapshot.empty) {
        console.log('No messages found in chat room:', chatRoomId);
        setMessages([]);
      } else {
        const loadedMessages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setMessages(loadedMessages);
      }
    }, (err) => {
      console.error('Error fetching messages:', err);
      setError('Failed to fetch messages');
    });

    return () => unsubscribe();
  }, [chatRoomId]);

  if (error) {
    console.error(error);
  }

  return messages;
};


export const useChatRooms = (currentUserId: string) => {
  const [chatRooms, setChatRooms] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!currentUserId) return;

    const chatRoomsRef = collection(FIREBASE_DB, 'users', currentUserId, 'chats');
    const chatRoomsQuery = query(chatRoomsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(chatRoomsQuery, (snapshot) => {
      if (snapshot.empty) {
        console.log('No chat rooms found for user:', currentUserId);
        setChatRooms([]);
      } else {
        const loadedChatRooms = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setChatRooms(loadedChatRooms);
      }
    }, (err) => {
      console.error('Error fetching chat rooms:', err);
      setError('Failed to fetch chat rooms');
    });

    return () => unsubscribe();
  }, [currentUserId]);

  if (error) {
    console.error(error);
  }

  return chatRooms;
};
export const updateMessageSeenStatus = async (chatRoomId: string, messageId: string) => {
  const messageDocRef = doc(FIREBASE_DB, `chatRooms/${chatRoomId}/messages/${messageId}`);
  await updateDoc(messageDocRef, { seen: true });
};export const getLatestMessage = async (chatRoomId: string) => {
  try {
    const messagesRef = collection(FIREBASE_DB, `chats/${chatRoomId}/messages`);
    const latestMessageQuery = query(messagesRef, orderBy('timestamp', 'desc'), limit(1));
    const querySnapshot = await getDocs(latestMessageQuery);
    
    if (!querySnapshot.empty) {
      const latestMessage = querySnapshot.docs[0].data();
      return latestMessage;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching latest message:", error);
    return null;
  }
};
