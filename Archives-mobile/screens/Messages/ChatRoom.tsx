import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { FIREBASE_DB } from '../../FirebaseConfig';
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
