import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { UserData } from '../../navigation/types';


export const fetchUserData = async (uid: string): Promise<UserData | null> => {
  const firestore = getFirestore();
  const userRef = doc(firestore, 'users', uid);

  try {
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      return {
        name: userData.name,
        username: userData.username,
        email: userData.email,
        createdAt: userData.createdAt.toDate(), 
        bio: userData.bio,
        photoUrl: userData.photoUrl || ''
      } as UserData;
    } else {
      console.log('No such document!');
      return null;
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};

