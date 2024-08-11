import { collection, addDoc, setDoc, serverTimestamp, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { FIREBASE_DB } from '../../FirebaseConfig';
import { useState, useEffect } from 'react';
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
    const messagesRef = collection(FIREBASE_DB, `chats/${chatRoomId}/messages`);
    await addDoc(messagesRef, {
      message,
      timestamp: serverTimestamp(),
      senderId: currentUserId, // Use senderId to distinguish between messages
      receiverId: userId,
      photoUrl,
      name,
      username,
    });
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

// Format Firestore timestamp to JavaScript Date object
const formatTimestamp = (timestamp: any) => {
  if (!timestamp) return '';
  const date = timestamp.toDate(); // Converts Firestore Timestamp to JavaScript Date object
  return date.toLocaleString(); // Format date as needed
};

// Custom hook to use messages from a chat room
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
        const loadedMessages = snapshot.docs.map(doc => {
          const data = doc.data();
          console.log('Message data:', data); // Log message data
          return {
            id: doc.id,
            ...data,
            timestamp: formatTimestamp(data.timestamp),
          };
        });
        
        console.log('Loaded messages:', loadedMessages);
        setMessages(loadedMessages);
      }
    }, (err) => {
      console.error('Error fetching messages:', err);
      setError('Failed to fetch messages');
    });

    return () => unsubscribe();
  }, [chatRoomId]);

  return messages;
};
