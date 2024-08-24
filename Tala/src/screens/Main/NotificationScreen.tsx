import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import { GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler';
import { collection, onSnapshot, query, where, getDoc, doc, Timestamp, orderBy } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../../FirebaseConfig';
import { useNavigation, NavigationProp } from '@react-navigation/native'; 
import { StackParamList } from '../../navigation/types';
import { timeAgo } from './functions';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/Ionicons';  
import AsyncStorage from '@react-native-async-storage/async-storage'; 

interface Notification {
  id: string;
  fromUserId: string;
  type: 'like' | 'comment' | 'follow'; 
  fromUsername?: string;
  fromUserPhotoUrl?: string;
  postId?: string;
  postImage?: string;
  description?: string;
  timestamp: string ;
  hasBeenViewed: boolean;  
}

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastViewed, setLastViewed] = useState<number>(Date.now());  
  const navigation = useNavigation<NavigationProp<StackParamList>>(); 
  const userId = FIREBASE_AUTH.currentUser?.uid;  

  useEffect(() => {
    if (!userId) return;

    const notificationRef = collection(FIREBASE_DB, 'notifications');
    const q = query(notificationRef, where('userId', '==', userId), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const notificationsData = await Promise.all(snapshot.docs.map(async (doc) => {
        const data = doc.data();
        const postDetails = data.postId ? await getPostDetails(data.postId) : {};

        return {
          id: doc.id,
          fromUserId: data.fromUserId, 
          type: data.type, 
          postId: data.postId,
          postImage: postDetails.postImage,
          description: data.description,
          timestamp: data.timestamp,
          hasBeenViewed: false,
        } as Notification;
      }));

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

      const updatedNotifications = filteredNotifications.map(notification => ({
        ...notification,
        hasBeenViewed: new Date(notification.timestamp).getTime() <= lastViewed,
      }));

      setNotifications(updatedNotifications);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId, lastViewed]);

  const getPostDetails = async (postId: string) => {
    try {
      const postRef = doc(FIREBASE_DB, 'users', FIREBASE_AUTH.currentUser?.uid || '', 'posts', postId);
      const postSnap = await getDoc(postRef);
      if (postSnap.exists()) {
        return postSnap.data() as { postImage?: string };
      }
      return {};
    } catch (error) {
      console.error('Error fetching post details:', error);
      return {};
    }
  };

  useEffect(() => {
    const updateLastViewed = async () => {
      const currentTimestamp = Date.now();
      setLastViewed(currentTimestamp);
      await AsyncStorage.setItem('lastViewedNotifications', currentTimestamp.toString());
    };
    updateLastViewed();
  }, []);

  if (loading) {
    return <View style={styles.container}></View>;
  }

  const handlePress = (item: Notification) => {
    if (!userId) {
      console.error('User is not authenticated');
      return;
    }

    const updatedNotifications = notifications.map(notification => 
      notification.id === item.id ? { ...notification, hasBeenViewed: true } : notification
    );
    setNotifications(updatedNotifications);

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
                <View style={styles.textContainer}>
                  <Text style={styles.notificationText}>
                    <Text style={styles.username}>{item.fromUsername}</Text>
                    {item.type === 'like' ? ' liked your post.' :
                     item.type === 'comment' ? ` commented on your post.` :
                     ' started following you.'}
                  </Text>
                  {(item.type === 'like' || item.type === 'comment') && item.postImage ? (
                    <Image source={{ uri: item.postImage }} style={styles.postImage} />) : null}
                </View>
                <View style={styles.timestampContainer}>
                  <Text style={{opacity: 0.5}}>
                    {item.timestamp ? timeAgo(item.timestamp) : 'No date available'}
                  </Text>
                  {!item.hasBeenViewed && (
              <Ionicons name="ellipse" size={10} color="#DE3B48"  />
              )}
                </View>
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
    paddingTop: '20%',
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
  textContainer: {
    flex: 1,
  },
  username: {
    fontWeight: 'bold',
  },
  notificationText: {
    fontSize: 14,
  },
  postImage: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 8,
  },
  timestampContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagIcon: {
    marginLeft: 10,
  },
});

export default NotificationsScreen;
