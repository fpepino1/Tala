import * as React from 'react';
import { useEffect, useState } from 'react';
import {  StyleSheet, Image, View, Text, TouchableOpacity, Button, TextInput, FlatList, Modal, TouchableWithoutFeedback } from 'react-native';
import { Surface, Avatar, Card, Paragraph, ActivityIndicator } from 'react-native-paper';
import { fetchUserData } from '../Main/UserData';
import { doc, getDoc, onSnapshot, setDoc, updateDoc, getFirestore,arrayUnion } from 'firebase/firestore';
import { FIREBASE_DB } from '../../FirebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
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
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<{ userId: string; text: string }[]>([]);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // Modal state



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
      setPost(prevPost => prevPost ? { ...prevPost, likes: newLikes } : null);
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

  const toggleCommentInput = () => {
    setShowCommentInput(!showCommentInput);
  };

  const openCommentModal = () => {
    setModalVisible(true);
  };

  const closeCommentModal = () => {
    setModalVisible(false);
  };
  if (loading) {
    return ;
  } else if (!user || !post) {
    return <Paragraph>No data found.</Paragraph>;
  }

  return (

    <Card style={styles.card}>
      <TouchableOpacity>
        <Card.Title
        title={user.username}
        left={(props) => <Avatar.Image {...props} source={{ uri: user.photoUrl }} />}
      />
      </TouchableOpacity>
      <View style={styles.imageContainer}>
        <Image source={{ uri: post.postImage }} style={styles.image} />
      </View>
      <View style={styles.interactions}>
        <TouchableOpacity onPress={handleLike}>
            <Text style={styles.likeButton}>
              {liked ? <Ionicons name="heart" size={29} color="#0D0D0D" /> : <Ionicons name="heart-outline" size={29} color="#0d0d0d" />} 
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={openCommentModal}>
            <Ionicons style= {{paddingRight: 10}}name="chatbubble-outline" size={25} color="#0d0d0d" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="send-outline" size={23} color="#0d0d0d" />
          </TouchableOpacity>
        </View>
      <Card.Content>
      <Text style={{ fontWeight: 'bold', marginTop: 10 }}>
  {post.likes?.length > 0 ? `${post.likes.length} likes` : ''}
</Text>
        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: post.likes?.length > 0 ? '-1%' : '-4%'}}>
        <TouchableOpacity>
        <Text style={{fontWeight: 'bold', marginRight: '2%'}}>{user.username}</Text>
        </TouchableOpacity>
        <Paragraph style={styles.description}>{post.description}</Paragraph>
        </View>
        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeCommentModal}
      >
        <TouchableWithoutFeedback onPress={closeCommentModal}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContent}>
          <FlatList
            data={comments}
            renderItem={({ item }) => (
              <View style={styles.comment}>
                <Text style={styles.commentText}><Text style={styles.commentUser}>{item.userId}:</Text> {item.text}</Text>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
          <TextInput
            style={styles.commentInput}
            placeholder="Add a comment..."
            value={newComment}
            onChangeText={setNewComment}
            onSubmitEditing={handleComment}
          />
          <TouchableOpacity onPress={handleComment} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Post</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
    marginVertical: 10,
  },
  interactions: {
    marginLeft: '2%',
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    },
  likeButton: {
    fontSize: 18,
    paddingRight: 10,
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

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    height: '50%',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  submitButton: {
    backgroundColor: '#007BFF',
    borderRadius: 4,
    padding: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default PostCard;