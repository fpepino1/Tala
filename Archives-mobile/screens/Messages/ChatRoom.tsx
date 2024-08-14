import { doc, setDoc, serverTimestamp, onSnapshot, query, where, getDocs, collection, getDoc } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../FirebaseConfig';
import { useState, useEffect } from 'react';

export const createChatRoom = async (userId1: string, userId2: string): Promise<string> => {
  try {
    const sortedUserIds = [userId1, userId2].sort(); 
    const chatRoomId = `${sortedUserIds[0]}_${sortedUserIds[1]}`;

    const chatRoomRef1 = doc(FIREBASE_DB, 'users', sortedUserIds[0], 'chats', chatRoomId);
    const chatRoomRef2 = doc(FIREBASE_DB, 'users', sortedUserIds[1], 'chats', chatRoomId);

    await Promise.all([
      setDoc(chatRoomRef1, { users: sortedUserIds, createdAt: serverTimestamp() }),
      setDoc(chatRoomRef2, { users: sortedUserIds, createdAt: serverTimestamp() }),
    ]);

    return chatRoomId;
  } catch (error) {
    console.error("Error creating chat room:", error);
    throw error;
  }
};

export const useChatRooms = (currentUserId: string) => {
  const auth = FIREBASE_AUTH;
  const [chatRooms, setChatRooms] = useState<any[]>([]);

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        // Get the chat rooms for the current user
        const chatRoomSnapshots = await getDocs(collection(FIREBASE_DB, `users/${auth.currentUser.uid}/chats`));
        const chatRoomIds = chatRoomSnapshots.docs.map(doc => doc.id);

        // Fetch chat room details
        const chatRoomsData = await Promise.all(chatRoomIds.map(async (chatRoomId) => {
          const chatRoomDocRef = doc(FIREBASE_DB, `chats/${chatRoomId}`);
          const chatRoomDoc = await getDoc(chatRoomDocRef);
          if  (chatRoomDoc.exists()) {
            const chatRoomData = chatRoomDoc.data();
            const otherUserId = chatRoomData.users.find((id: string) => id !== currentUserId);
            
            if (otherUserId) {
              const otherUserDocRef = doc(FIREBASE_DB, `users/${otherUserId}`);
              const otherUserDoc = await getDoc(otherUserDocRef);
              
              let otherUserData = {};
              if (otherUserDoc.exists()) {
                otherUserData = otherUserDoc.data();
              }
              console.log('Other User Data:', otherUserData);

              return { id: chatRoomId, ...chatRoomData, otherUser: otherUserData };
            }
          }

          return null;
        }));

        setChatRooms(chatRoomsData.filter(room => room !== null));
      } catch (error) {
        console.error("Error fetching chat rooms:", error);
      }
    };

    fetchChatRooms();
  }, [currentUserId]);

  return chatRooms;
};