import * as React from 'react';
import { useEffect, useState } from 'react';
import {  StyleSheet, Image, View } from 'react-native';
import { Surface, Avatar, Card, Paragraph, ActivityIndicator } from 'react-native-paper';
import { fetchUserData } from './UserData';
import { doc, getDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../FirebaseConfig';

interface PostData {
  postImage: string;
  description?: string;
}

interface PostCardProps {
  postData: PostData;
  uid: string;
  postId: string;
}

const PostCard = ({ postData, uid, postId }: PostCardProps) => {
  const [user, setUser] = useState(null);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      const userData = await fetchUserData(uid);
      setUser(userData);
    };

    const getPostData = async () => {
      const postRef = doc(FIREBASE_DB, 'users', uid, 'posts', postId);
      const postSnap = await getDoc(postRef);

      if (postSnap.exists()) {
        setPost(postSnap.data());
      }
    };

    const fetchData = async () => {
      await getUserData();
      await getPostData();
      setLoading(false);
    };

    fetchData();
  }, [uid, postId]);

  if (loading) {
    return
    <ActivityIndicator animating={true} color="#000" />      ;
  } else if (!user || !post) {
    return <Paragraph>No data found.</Paragraph>;
  }

  return (

    <Card style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: post.postImage }} style={styles.image} />
      </View>
      <Card.Title
        title={user.username}
        left={(props) => <Avatar.Image {...props} source={{ uri: user.photoUrl }} />}
      />
      <Card.Content>
        <Paragraph style={styles.description}>{post.description}</Paragraph>
      </Card.Content>
    </Card>
  

    
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    overflow: 'hidden', 
    borderRadius: 12,
    shadowColor: 'transparent', 
    shadowOffset: { width: 0, height: 0 }, 
    shadowOpacity: 0, 
    shadowRadius: 0, 
    marginVertical: 10,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1, 
    backgroundColor: '#f0f0f0', 
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', 
  },
  description: {
    marginLeft: '14%',
    marginBottom: 10,
  },
});

export default PostCard;
