import * as React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, Image, View, Text, TouchableOpacity, TextInput, FlatList, Modal, TouchableWithoutFeedback } from 'react-native';
import { Avatar, Card, Paragraph } from 'react-native-paper';
import { fetchUserData } from '../Main/UserData';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { FIREBASE_DB } from '../../FirebaseConfig';
import { Ionicons } from '@expo/vector-icons';

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
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); 

  useEffect(() => {
    const fetchData = async () => {
      const userData = await fetchUserData(uid);
      setUser(userData);

      const postRef = doc(FIREBASE_DB, 'users', uid, 'posts', postId);
      const postSnap = await getDoc(postRef);

      if (postSnap.exists()) {
        setPost(postSnap.data());
        setComments(postSnap.data()?.comments || []);
      }
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
    return null; 
  } else if (!user || !post) {
    return <Paragraph>No data found.</Paragraph>;
  }

  return (
    <Card 
    style={[styles.card]}>
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
          <Ionicons style={{ paddingRight: 10 }} name="chatbubble-outline" size={25} color="#0d0d0d" />
        </TouchableOpacity>
        {/* <TouchableOpacity>
          <Ionicons name="send-outline" size={23} color="#0d0d0d" />
        </TouchableOpacity> */}
      </View>
      <Card.Content>
        <Text style={{ fontWeight: 'bold', marginTop: 10 }}>
          {post.likes?.length > 0 ? `${post.likes.length} likes` : ''}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: post.likes?.length > 0 ? '-1%' : '-4%' }}>
          <TouchableOpacity>
            <Text style={{ fontWeight: 'bold', marginRight: '2%' }}>{user.username}</Text>
          </TouchableOpacity>
          <Paragraph style={styles.description}>{post.description}</Paragraph>
        </View>
        {comments.length === 0 ? (
          showCommentInput && (
            <View style={styles.commentInputContainer}>
              <TextInput
                style={[styles.commentInput, {width: comments.length > 0 ? '95%' : '100%'}]}
                placeholder="Add a comment..."
                value={newComment}
                onChangeText={setNewComment}
                onSubmitEditing={handleComment}
              />
               {newComment.trim().length > 0 && (
                <TouchableOpacity onPress={handleComment} style={styles.submitButton}>
        <Ionicons name="arrow-forward" size={20} color="#0D0D0D" />
              </TouchableOpacity>
              )}
             
            </View>
          )
        ) : (
          <View>
            {comments.length > 0 && (
              <View style={styles.comment}>
                <Text style={styles.commentText}>
                  <Text style={styles.commentUser}>{comments[0].userId} </Text> {comments[0].text}
                </Text>
              </View>
            )}
            <View style={styles.commentInputContainer}>
            <TextInput
                style={[styles.commentInput, {width: comments.length > 0 ? '95%' : '100%'}]}
                placeholder="Add a comment..."
              value={newComment}
              onChangeText={setNewComment}
              onSubmitEditing={handleComment}
            />
           {newComment.trim().length > 0 && (
            <TouchableOpacity onPress={handleComment} style={styles.submitButton}>
        <Ionicons name="arrow-forward" size={20} color="#0D0D0D" />
            </TouchableOpacity>)}
            </View>
          </View>
        )}

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
          <Text style={[styles.modalTitle,{marginBottom: '10%'}]}>Comments</Text>
            <FlatList
              data={comments}
              renderItem={({ item }) => (
                <View style={styles.comment}>
                  <Text style={styles.commentText}>
                    <Text style={styles.commentUser}>{item.userId}:</Text> {item.text}
                  </Text>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
            <View style={[styles.commentInputContainer,{ marginBottom: '10%'}]}>
            <TextInput
                style={[styles.commentInput, {width: comments.length > 0 ? '95%' : '100%'}]}
                placeholder="Add a comment..."
              value={newComment}
              onChangeText={setNewComment}
              onSubmitEditing={handleComment}
            />
          {newComment.trim().length > 0 && (
            <TouchableOpacity onPress={handleComment} style={styles.submitButton}>
        <Ionicons name="arrow-forward" size={20} color="#0D0D0D" />
            </TouchableOpacity>)}
            </View>
          </View>
        </Modal>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderWidth: 0, 
    marginVertical:2,
    shadowColor: 'rgba(0,0,0, 0.0)', 
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0 
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
    padding: 8,
    marginTop: '3%',
    borderWidth: 1,
    borderRadius: 18,
    marginHorizontal:'auto',
    borderColor: '#E3E3E3',
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
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    height: '60%',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  submitButton: {
    alignItems: 'center',
    paddingLeft: 10,
    justifyContent: 'center',
    alignContent: 'center',
    marginBottom:'-3%'
  },
 
  commentInputContainer: {
    flexDirection: 'row', 
    alignContent: 'center', 
    alignItems: 'center',
    marginTop:'2%',
    justifyContent: 'space-between', 
    marginHorizontal:'auto', 
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    marginHorizontal:'auto',
  },
});

export default PostCard;
