import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ScrollView, StyleSheet, View, Text, LayoutChangeEvent } from 'react-native';
import { FIREBASE_DB } from '../../../FirebaseConfig';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import PostCard from './PostCard';
import { RouteProp } from '@react-navigation/native';

type PostDetailScreenRouteProp = RouteProp<any, 'PostDetailScreen'>;

interface Props {
  route: PostDetailScreenRouteProp;
  navigation: any; 
}

export default function PostDetailScreen({ route, navigation }: Props) {
  const { userId, postId, postImage, description } = route.params;
  const [posts, setPosts] = useState<any[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);
  const [targetPostLayout, setTargetPostLayout] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const userPostsQuery = query(
      collection(FIREBASE_DB, 'users', userId, 'posts'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(userPostsQuery, (snapshot) => {
      const userPosts = snapshot.docs.map(doc => ({
        id: doc.id,
        userId: userId,
        ...doc.data(),
      }));
      setPosts(userPosts);
    }, (error) => {
      console.error('Error fetching posts: ', error);
    });

    return () => unsubscribe();
  }, [userId]);

  const scrollToPost = useCallback(() => {
    if (scrollViewRef.current && postId && targetPostLayout[postId] !== undefined) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          y: targetPostLayout[postId],
          animated: false,  
        });
      }, 0); 
    }
  }, [targetPostLayout, postId]);

  useEffect(() => {
    scrollToPost();
  }, [scrollToPost]);

  const handleLayout = (postId: string) => (event: LayoutChangeEvent) => {
    const { y } = event.nativeEvent.layout;
    setTargetPostLayout(prevLayout => ({
      ...prevLayout,
      [postId]: y,
    }));
  };

  return (
    <ScrollView style={styles.container} ref={scrollViewRef} scrollEventThrottle={0}>
      {posts.length > 0 ? (
        posts.map((post) => (
          <View
            key={post.id}
            onLayout={post.id === postId ? handleLayout(post.id) : undefined}
          >
            <PostCard
              postData={post}
              uid={post.userId}
              postId={post.id}
            />
          </View>
        ))
      ) : (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>No posts available</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flex: 1,
    backgroundColor: '#F8F3FA',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F3FA',
  },
  emptyStateText: {
    fontSize: 18,
    color: '#888',
  },
});
