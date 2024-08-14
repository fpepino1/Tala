import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../FirebaseConfig';

export default function ConnectionsList({ route }) {
  const { userId, type } = route.params;
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userDocRef = doc(FIREBASE_DB, 'users', userId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const userIds = type === 'followers' ? userData.followers : userData.following;
          if (userIds && userIds.length > 0) {
            const userPromises = userIds.map(async (uid) => {
              const userSnapshot = await getDoc(doc(FIREBASE_DB, 'users', uid));
              return userSnapshot.exists() ? { id: uid, ...userSnapshot.data() } : null;
            });
            const usersData = (await Promise.all(userPromises)).filter(Boolean);
            setUserList(usersData);
          }
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, [userId, type]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={userList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.userContainer}>
            <Image source={{ uri: item.photoUrl }} style={styles.avatar} />
            <View>
              <Text>{item.username}</Text>
              <Text style={styles.name}>{item.name}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F3FA',  
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 100,
    marginRight: 10,
  },
  name: {
    opacity: 0.6,
  },
  errorText: {
    color: 'red',
    fontWeight: 'bold',
  },
});
