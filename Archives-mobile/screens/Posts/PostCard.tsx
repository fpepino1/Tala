import * as React from 'react';
import { useEffect, useState } from 'react';
import {  StyleSheet, Image, View, Text, TouchableOpacity, Button, TextInput, FlatList } from 'react-native';
import { Surface, Avatar, Card, Paragraph, ActivityIndicator } from 'react-native-paper';
import { fetchUserData } from '../Main/UserData';
import { doc, getDoc, onSnapshot, setDoc, updateDoc, getFirestore,arrayUnion } from 'firebase/firestore';
import { FIREBASE_DB } from '../../FirebaseConfig';

interface PostData {
  postImage: string;
  description?: string;
  likes?: string[];
  comments?: { userId: string; text: string }[];  
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
  const [liked, setLiked] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<{ userId: string; text: string }[]>([]);



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
  const handleLike = async () => {
    if (post) {
      const postRef = doc(FIREBASE_DB, 'users', uid, 'posts', postId);
      const newLikes = liked ? post.likes?.filter(id => id !== uid) : [...(post.likes || []), uid];
      setLiked(!liked);
      await updateDoc(postRef, { likes: newLikes });
    }
  };

  const handleComment = async () => {
    if (newComment.trim() && post) {
      const postRef = doc(FIREBASE_DB, 'users', uid, 'posts', postId);
      const comment = { userId: uid, text: newComment.trim() };
      setComments([...comments, comment]);
      setNewComment('');
      await updateDoc(postRef, { comments: arrayUnion(comment) });
    }
  };
  if (loading) {
    return
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
        <View style={styles.interactions}>
          <TouchableOpacity onPress={handleLike}>
            <Text style={styles.likeButton}>{liked ? '❤️' : '🤍'} Like</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.commentInput}
            placeholder="Add a comment..."
            value={newComment}
            onChangeText={setNewComment}
          />
          <Button onPress={handleComment} title="Comment" />
        </View>
        <FlatList
          data={comments}
          renderItem={({ item }) => (
            <View style={styles.comment}>
              <Text style={styles.commentText}><Text style={styles.commentUser}>{item.userId}:</Text> {item.text}</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
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
  interactions: {
    marginTop: 10,
  },
  likeButton: {
    fontSize: 18,
  },
  commentInput: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    marginTop: 8,
  },
  comment: {
    marginTop: 8,
  },
  commentText: {
    fontSize: 16,
  },
  commentUser: {
    fontWeight: 'bold',
  },
});

export default PostCard;
