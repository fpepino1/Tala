import React, { useEffect, useState, useCallback } from 'react';
import { ScrollView, StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../FirebaseConfig';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import PostCard from './PostCard';

export default function PostDetailScreen() {
  const [userId, setUserId] = useState<string | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async (userId: string) => {
      try {
        const followingQuery = collection(FIREBASE_DB, "users", userId, "following");
        const followingSnapshot = await getDocs(followingQuery);
        const followingIds = followingSnapshot.docs.map(doc => doc.id);

        followingIds.push(userId);

        const postsData: any[] = [];
        for (const id of followingIds) {
          const userPostsQuery = query(
            collection(FIREBASE_DB, "users", id, "posts"),
            orderBy("timestamp", "desc")
          );
          const userPostsSnapshot = await getDocs(userPostsQuery);
          const userPosts = userPostsSnapshot.docs.map(doc => ({
            id: doc.id,
            userId: id,
            ...doc.data(),
          }));
          postsData.push(...userPosts);
        }

        postsData.sort((a, b) => b.timestamp - a.timestamp);
        setPosts(postsData);
      } catch (error) {
        console.error("Error fetching posts: ", error);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchPosts(user.uid);
      } else {
        console.error("User is not authenticated.");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // if (loading) {
  //   return (
  //     <View style={styles.loadingContainer}>
  //       <ActivityIndicator size="large" />
  //     </View>
  //   );
  // }

  return (
    <ScrollView style={styles.container}>
      {posts.length > 0 ? (
        posts.map((post) => (
          <PostCard key={post.id} postData={post} uid={post.userId} postId={post.id} />
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
    marginTop: '20%',
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 18,
    color: '#888',
  },
});
