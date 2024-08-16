import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, FlatList, Text, StyleSheet, KeyboardAvoidingView, Platform, Keyboard, Image } from 'react-native';
import { sendMessage, useMessages } from './MessageFunctions';
import { StackParamList } from '../../navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

const MessageScreen = ({ route }) => {
  const navigation = useNavigation<StackNavigationProp<StackParamList, 'MessageScreen'>>();
  const { userId, chatRoomId, photoUrl, name, username, currentUserId } = route.params;
  const messages = useMessages(chatRoomId);
  const [message, setMessage] = useState('');

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();  
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); 
  };

  useEffect(() => {
    console.log('Chat Room ID:', chatRoomId);
    console.log('User ID:', userId);
    console.log('Current User ID:', currentUserId);
    console.log('Messages:', messages);
  }, [messages]);
  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
     
        <View style={{marginHorizontal:'auto', alignItems: 'center'}}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.username}>{username}</Text>
        </View>

      ),
    });
  }, [navigation, photoUrl, name, username]);
  const handleSend = () => {
    if (message.trim()) {
      sendMessage(chatRoomId, currentUserId, userId, message, photoUrl, name, username);  
      setMessage('');
    }
  };

  const reversedMessages = Array.isArray(messages) ? [...messages].reverse() : [];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 20}
    >
      <View style={styles.container}>
        {/* <View style={styles.header}>
          <Image source={{ uri: photoUrl }} style={styles.profileImage} />
          <View style={styles.headerText}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.username}>{username}</Text>
          </View>
        </View> */}

        <FlatList
          data={reversedMessages}
          renderItem={({ item }) => (
            <View style={[
              styles.messageContainer,
              item.senderId === currentUserId ? styles.messageSent : styles.messageReceived
            ]}>
              <View style={[
                styles.messageBubble,
                { backgroundColor: item.senderId === currentUserId ? '#0d0d0d' : '#d9d9d9' },
              ]}>
                <Text style={[styles.messageText, { color: item.senderId === currentUserId ? '#fff' : '#000' }]}>{item.message}</Text>
                <Text style={[styles.messageTimestamp, { color: item.senderId === currentUserId ? '#fff' : '#000' }]}>
                  {formatTimestamp(item.timestamp)}
                </Text>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text style={styles.emptyMessage}>Start a conversation</Text>}
          keyboardDismissMode="on-drag"   
          inverted
          showsVerticalScrollIndicator={false}  
          contentInsetAdjustmentBehavior="automatic"  
          style={{ flex: 1 }}  
        />

        <View style={styles.inputWrapper}>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Type your message"
            style={styles.input}
          />
          {message.trim().length > 0 && (
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSend}
            >
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F3FA',
  },
  header: {
    alignItems: 'center',
    padding: '1%',
    paddingHorizontal: '3%',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  headerText: {
    marginVertical: 20,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  username: {
    fontSize: 14,
    color: '#888',
  },
  messageContainer: {
    flexDirection: 'row',
    paddingVertical: 2,
  },
  messageSent: {
    justifyContent: 'flex-end',
  },
  messageReceived: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  messageText: {
    fontSize: 16,
  },
  messageTimestamp: {
    fontSize: 12,
    marginTop: 0,
    opacity: 0.5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '3%',
    paddingVertical: '5%',
    width: '100%',
  },
  input: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginHorizontal: 'auto',
    backgroundColor: 'transparent',
  },
  sendButton: {
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#007BFF',
    marginLeft: 10,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyMessage: {
    textAlign: 'center',
    marginVertical: 20,
    color: '#888',
  },
});

export default MessageScreen;
