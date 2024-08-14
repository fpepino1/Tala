import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../FirebaseConfig';
import { StackParamList } from '../../navigation/types';
import { ConnectionsListScreenNavigationProp, ConnectionsListProps } from '../../navigation/types';
export default function ConnectionsList({ route }) {
  const { userId, type } = route.params;
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userDocRef = doc(FIREBASE_DB, "users", userId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const userIds = type === 'followers' ? userData.followers : userData.following;
          if (userIds && userIds.length > 0) {
            const userPromises = userIds.map(uid => getDoc(doc(FIREBASE_DB, "users", uid)));
            const userSnapshots = await Promise.all(userPromises);
            const usersData = userSnapshots.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
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
    <FlatList
      data={userList}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.userContainer}>
          <Image source={{ uri: item.photoUrl }} style={styles.avatar} />
          <View>
            <Text style={styles.username}>{item.username}</Text>
            <Text>{item.name}</Text>
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontWeight: 'bold',
  },
});
