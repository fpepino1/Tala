import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { FIREBASE_DB } from '../../FirebaseConfig';

export const createChatRoom = async (userId1: string, userId2: string): Promise<string> => {
  try {
    const chatRoomId = `${userId1}_${userId2}`;

    // Create references for the chat rooms for both users
    const chatRoomRef1 = doc(FIREBASE_DB, 'users', userId1, 'chats', chatRoomId);
    const chatRoomRef2 = doc(FIREBASE_DB, 'users', userId2, 'chats', chatRoomId);

    // Set document data in Firestore for both users
    await Promise.all([
      setDoc(chatRoomRef1, { users: [userId1, userId2], createdAt: serverTimestamp() }),
      setDoc(chatRoomRef2, { users: [userId1, userId2], createdAt: serverTimestamp() })
    ]);

    return chatRoomId;
  } catch (error) {
    console.error("Error creating chat room:", error);
    throw error;
  }
};
