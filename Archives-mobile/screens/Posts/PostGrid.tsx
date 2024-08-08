import React, { useEffect, useState, useCallback } from 'react';
import { View, Image, FlatList, StyleSheet, Dimensions, Text, TouchableOpacity } from 'react-native';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../FirebaseConfig'; 
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { PostGridNavigationProp } from '../../navigation/types';
const numColumns = 3;
const screenWidth = Dimensions.get('window').width;
const itemWidth = screenWidth / numColumns;

const PostGrid = ({userId}) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<PostGridNavigationProp>();

  const fetchPosts = useCallback(async () => {
    if (userId) {
        try {
            const postsQuery = query(
                collection(FIREBASE_DB, "users", userId, "posts"),
                orderBy("timestamp", "desc")
            );
            const querySnapshot = await getDocs(postsQuery);
            console.log('Query Snapshot:', querySnapshot);
            
            if (querySnapshot.empty) {
                console.log('No posts found for userId:', userId);
            }
            
            const postsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            console.log('Posts Data:', postsData);
            setPosts(postsData);
        } catch (error) {
            console.error("Error fetching posts: ", error);
        } finally {
            setLoading(false);
        }
    } else {
        console.warn('No userId provided');
        setLoading(false);
    }
}, [userId]);

useEffect(() => {
    fetchPosts();
}, [fetchPosts]);

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [fetchPosts])
  );

  const handlePress = (item) => {
    navigation.navigate('PostDetailScreen', {
      postId: item.id,
      userId: userId,
      postImage: item.postImage,
      description: item.description,
      posts: posts, 
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => handlePress(item)}>
      {item.postImage ? (
        <Image source={{ uri: item.postImage }} style={styles.image} />
      ) : (
        <View style={styles.placeholder}>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
        </View>
      ) : posts.length > 0 ? (
        <FlatList
          data={posts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          contentContainerStyle={styles.container}
        />
      ) : (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>No posts available</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    width: itemWidth,
    height: itemWidth,
    margin: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  placeholderText: {
    color: '#888',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#000',
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

export default PostGrid;