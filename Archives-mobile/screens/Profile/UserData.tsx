import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { FIREBASE_AUTH } from '../../FirebaseConfig';// Adjust the path as per your project structure

export interface UserData {
  name: string;
  username: string;
  email: string;
  createdAt: Date;
  bio: string; 
}


// Function to fetch user data by UID
export const UserData = async (uid: string): Promise<UserData | null> => {
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
