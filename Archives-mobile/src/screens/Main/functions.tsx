import { FIREBASE_DB } from '../../../FirebaseConfig';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../../navigation/types';

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