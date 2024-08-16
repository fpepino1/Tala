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
