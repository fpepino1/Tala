import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import { GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler';
import { collection, onSnapshot, query, where, getDoc, doc } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../FirebaseConfig';
import { useNavigation, NavigationProp } from '@react-navigation/native'; 
import { StackParamList } from '../../navigation/types';

interface Notification {
  id: string;
  fromUserId: string;
  type: 'like' | 'comment';
  fromUsername?: string;
  fromUserPhotoUrl?: string;
  postId?: string;
  postImage?: string;
  description?: string;
}

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NavigationProp<StackParamList>>(); 
  const userId = FIREBASE_AUTH.currentUser?.uid;  

  useEffect(() => {
    if (!userId) return;

    const notificationRef = collection(FIREBASE_DB, 'notifications');
    const q = query(notificationRef, where('userId', '==', userId));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const notificationsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          fromUserId: data.fromUserId,
          type: data.type,
          postId: data.postId,
          postImage: data.postImage,
          description: data.description,
          fromUsername: undefined,
          fromUserPhotoUrl: undefined,
        } as Notification;
      });

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

      const filteredNotifications = notificationDetails.filter(notification => notification.fromUserId !== userId);

      setNotifications(filteredNotifications);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  if (loading) {
    return <View style={styles.container}></View>;
  }

  const handlePress = (item: Notification) => {
    if (!userId) {
      console.error('User is not authenticated');
      return;
    }
  
    navigation.navigate('PostDetailScreen', {
      postId: item.postId!,
      userId: userId, 
      postImage: item.postImage!,
      description: item.description!,
      posts: []  
    });
  };

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#F8F3FA' }}>
      <View style={styles.container}>
        <FlatList
          data={notifications}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handlePress(item)}>
              <View style={styles.notificationItem}>
                <Image source={{ uri: item.fromUserPhotoUrl }} style={styles.avatar} />
                <Text style={styles.notificationText}>
                  <Text style={styles.username}>{item.fromUsername}</Text>
                  {item.type === 'like' ? ' liked your post.' : ' commented on your post.'}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: '20%',
    backgroundColor: '#F8F3FA',
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 100,
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
