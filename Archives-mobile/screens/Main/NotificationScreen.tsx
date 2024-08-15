import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import { GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, onSnapshot, query, where, getDoc, doc } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../FirebaseConfig';

interface Notification {
  id: string;
  fromUserId: string;
  type: 'like' | 'comment';
  fromUsername?: string;
  fromUserPhotoUrl?: string;
}

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = FIREBASE_AUTH.currentUser?.uid;
    if (!userId) return;

    const notificationRef = collection(FIREBASE_DB, 'notifications');
    const q = query(notificationRef, where('userId', '==', userId));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const notificationsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));

      const notificationDetails = await Promise.all(notificationsData.map(async (notification) => {
        const userRef = doc(FIREBASE_DB, 'users', notification.fromUserId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          return {
            ...notification,
            fromUsername: userData.username,
            fromUserPhotoUrl: userData.photoUrl,
          };
        }
        return notification;
      }));

      setNotifications(notificationDetails);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView>
        <View style={styles.container}>
        <FlatList
          data={notifications}
          renderItem={({ item }) => (
            <TouchableOpacity>
              <View style={styles.notificationItem}>
                <Image source={{ uri: item.fromUserPhotoUrl }} style={styles.avatar} />
                <Text style={styles.notificationText}>
                  <Text style={styles.username}>{item.fromUsername}</Text>
                  {item.type === 'like' ? ' liked your post' : ' commented on your post'}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F3FA',
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
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
  notificationText: {
    fontSize: 14,
  },
});

export default NotificationsScreen;
