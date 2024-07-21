import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import PostCard from './PostCard';
export default function FeedScreen() {
  const userId = 'DuqXbPpXd0fDUIB8oPMoOPkN6053'; 
  const postId = 'fIHaxw74eej8FfeJtWBD'; 

  return (
    <ScrollView style={styles.container}>
      <PostCard uid={userId}  postId={postId} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: '20%',
    flexGrow:1,
  },
});
