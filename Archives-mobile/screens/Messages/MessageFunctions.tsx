import { collection, addDoc, setDoc, serverTimestamp, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { FIREBASE_DB } from '../../FirebaseConfig';
import { useState, useEffect } from 'react';
import { getFirestore } from 'firebase/firestore';

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
      senderId: currentUserId,
      receiverId: userId,
      photoUrl,
      name,
      username,
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