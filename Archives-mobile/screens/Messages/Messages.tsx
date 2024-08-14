import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useChatRooms } from './MessageFunctions';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { StackParamList } from '../../navigation/types'; // Adjust this import according to your file structure
import { FIREBASE_AUTH } from '../../FirebaseConfig';
interface MessagesProps {
  currentUserId: string;
}

const Messages: React.FC<MessagesProps> = () => {
  const currentUserId = FIREBASE_AUTH.currentUser?.uid;
  const chatRooms = useChatRooms(currentUserId);
  const navigation = useNavigation<NavigationProp<StackParamList>>();

  const handleChatPress = (chatRoom: any) => {
    const otherUserId = chatRoom.users.find((id: string) => id !== currentUserId);
    navigation.navigate('MessageScreen', {
      chatRoomId: chatRoom.id,
      userId: otherUserId,
      currentUserId,
      photoUrl: chatRoom.photoUrl,
      name: chatRoom.name,
      username: chatRoom.username,
    });
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.chatRoomContainer}
      onPress={() => handleChatPress(item)}
    >
      <Image source={{ uri: item.photoUrl }} style={styles.profileImage} />
      <View style={styles.chatRoomText}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.username}>{item.username}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {chatRooms.length === 0 ? (
        <Text style={styles.emptyText}>No chats available</Text>
      ) : (
        <FlatList
          data={chatRooms}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F3FA',
    padding: 10,
  },
  chatRoomContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  chatRoomText: {
    marginVertical: 20,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  username: {
    fontSize: 14,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
    fontSize: 16,
  },
});

export default Messages;
