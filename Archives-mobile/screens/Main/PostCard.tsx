import * as React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, Image, View } from 'react-native';
import { Avatar, Card, Paragraph, ActivityIndicator } from 'react-native-paper';
import { fetchUserData } from './UserData';
import { doc, getDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../FirebaseConfig';

const PostCard = ({ uid, postId }) => {
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
    return <ActivityIndicator />;
  }

  if (!user || !post) {
    return <Paragraph>No data found.</Paragraph>;
  }

  return (
    <Card style={styles.card}>
      <Card.Title
        title={user.username}
        // subtitle={user.username}
        left={(props) => <Avatar.Image {...props} source={{ uri: user.photoUrl }} />}
      />
      <View style={styles.imageContainer}>
        <Image source={{ uri: post.postImage }} style={styles.image} />
      </View>
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
    marginHorizontal: 5, 
    borderRadius:0,
    shadowColor: 'transparent', 
    shadowOffset: { width: 0, height: 0 }, 
    shadowOpacity: 0, 
    shadowRadius: 0, 
 
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
    marginTop: 10,
    marginRight: 10,
    marginBottom: 10,
  },
});

export default PostCard;
