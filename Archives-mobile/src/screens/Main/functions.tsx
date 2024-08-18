import { FIREBASE_DB, FIREBASE_AUTH } from '../../../FirebaseConfig';
import { doc, getDoc, collection, getDocs, onSnapshot, query, where, setDoc, updateDoc} from 'firebase/firestore';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../../navigation/types';
import { onAuthStateChanged } from 'firebase/auth';
import ActiveUsersList from './ActiveUsersList';
export const getChatRoomId = async (currentUserId: string, otherUserId: string): Promise<string | null> => {
  try {
    const sortedUserIds = [currentUserId, otherUserId].sort();
    const chatRoomId = `${sortedUserIds[0]}_${sortedUserIds[1]}`;

    const chatRoomRef1 = doc(FIREBASE_DB, 'users', sortedUserIds[0], 'chats', chatRoomId);
    const chatRoomRef2 = doc(FIREBASE_DB, 'users', sortedUserIds[1], 'chats', chatRoomId);

    const [chatRoomDoc1, chatRoomDoc2] = await Promise.all([
      getDoc(chatRoomRef1),
      getDoc(chatRoomRef2)
    ]);

    if (chatRoomDoc1.exists() || chatRoomDoc2.exists()) {
      return chatRoomId;
    }

    return null;
  } catch (error) {
    console.error("Error fetching chat room ID:", error);
    return null;
  }
};
export const goToUserProfile = async (
  navigation: StackNavigationProp<StackParamList, 'UserProfile'>,
  uid: string
) => {
  console.log('uid:', uid);
  try {
    const userRef = doc(FIREBASE_DB, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      const postsRef = collection(FIREBASE_DB, 'users', uid, 'posts');
      const postsSnapshot = await getDocs(postsRef);

      const userPosts: any[] = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      navigation.navigate('UserProfile', {
        username: userData.username,
        name: userData.name,
        photoUrl: userData.photoUrl,
        bio: userData.bio,
        userId: uid,
        posts: userPosts,
      });
    }
  } catch (error) {
    console.error('Error fetching user posts:', error);
  }
};


export const timeAgo = (timestamp: string) => {
  const now = new Date();
  const past = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  const seconds = diffInSeconds;
  const minutes = Math.floor(diffInSeconds / 60);
  const hours = Math.floor(diffInSeconds / 3600);
  const days = Math.floor(diffInSeconds / 86400);
  const weeks = Math.floor(diffInSeconds / 604800);
  const months = Math.floor(diffInSeconds / 2628000);
  const years = Math.floor(diffInSeconds / 31536000);

  if (years > 0) return `${years}y`;
  if (months > 0) return `${months}m`;
  if (weeks > 0) return `${weeks}w`;
  if (days > 0) return `${days}d`;
  if (hours > 0) return `${hours}h`;
  if (minutes > 0) return `${minutes}m`;
  return `${seconds}s`;
};

export const updateUserActivity = async (userId: string, updates: any) => {
  if (!userId) {
    console.error('User ID is undefined or null');
    return;
  }

  try {
    const userRef = doc(FIREBASE_DB, 'users', userId);
    console.log(`Updating user ${userId} with data:`, updates);

    // Ensure the document exists before updating
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      console.error(`Document for user ${userId} does not exist`);
      return;
    }

    await updateDoc(userRef, updates);
    console.log('User activity updated successfully');

    // Verify the update
    const updatedDoc = await getDoc(userRef);
    if (updatedDoc.exists()) {
      console.log('Updated document data:', updatedDoc.data());
    } else {
      console.warn('Updated document does not exist');
    }
  } catch (error) {
    console.error('Error updating user activity:', error);
  }
};
interface ChatRoom {
  id: string;
  users: string[];
}
export const fetchActiveFollowedUsers = async (currentUserId: string) => {
  try {
    const userRef = doc(FIREBASE_DB, 'users', currentUserId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      throw new Error('User does not exist');
    }

    const userData = userDoc.data();
    const followingList = userData?.following || [];

    if (followingList.length === 0) {
      console.log('No users to fetch');
      return [];
    }


  

    const activeUsers = [];
    
    for (const userId of followingList) {
      const userRef = doc(FIREBASE_DB, 'users', userId);
      const userDoc = await getDoc(userRef);
      const chatRoomId= await getChatRoomId(currentUserId, userId);
      const userData = userDoc.data();
      if (userData && userData.status === 'active') {
        
    
        activeUsers.push({
          id: userId,
          name: userData.name,
          username: userData.username,
          photoUrl: userData.photoUrl,
          chatRoomId: chatRoomId
        });
      }
    }

    console.log('Active users:', activeUsers);
    return activeUsers;
  } catch (error) {
    console.error('Error fetching active followed users:', error);
    return [];
  }
};