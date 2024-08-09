import React from 'react';
import  { Text, FlatList, TouchableOpacity, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Messages = [
    {
      "chatId": "1",
      "userName": "Alice Johnson",
      "lastMessage": "Hey, are we still on for the meeting tomorrow?",
      "time": "2024-08-09T14:23:00Z",
      "unreadCount": 2
    },
    {
      "chatId": "2",
      "userName": "Bob Smith",
      "lastMessage": "Sure, I’ll send you the files later today.",
      "time": "2024-08-09T13:45:00Z",
      "unreadCount": 0
    },
    {
      "chatId": "3",
      "userName": "Charlie Adams",
      "lastMessage": "Thanks for your help earlier!",
      "time": "2024-08-09T12:30:00Z",
      "unreadCount": 1
    },
    {
      "chatId": "4",
      "userName": "Diana Cooper",
      "lastMessage": "Let's catch up soon!",
      "time": "2024-08-09T11:15:00Z",
      "unreadCount": 0
    },
    {
      "chatId": "5",
      "userName": "Eve Walker",
      "lastMessage": "Can you review this document?",
      "time": "2024-08-08T18:45:00Z",
      "unreadCount": 3
    }
  ];
  

export default function MessageListScreen(){
    const navigation = useNavigation();
    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.itemContainer} 
        onPress={() => navigation.navigate( 'MessageScreen', { chatId: item.chatId })}>
          <Text style={styles.userName}>{item.userName}</Text>
          <Text style={styles.lastMessage}>{item.lastMessage}</Text>
          <Text style={styles.time}>{new Date(item.time).toLocaleTimeString()}</Text>
        </TouchableOpacity>
      );
    
      return (
        <View style={styles.container}>
          <FlatList
            data={Messages}
            renderItem={renderItem}
            keyExtractor={item => item.chatId}
          />
        </View>
      );
    }


const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: '#F8F3FA',
    }, itemContainer: {
        padding: 15,
        marginVertical: 8,
        borderRadius: 10,
      },
      userName: {
        fontSize: 18,
        fontWeight: 'bold',
      },
      lastMessage: {
        fontSize: 16,
        color: '#666',
        marginTop: 5,
      },
      time: {
        fontSize: 12,
        color: '#999',
        marginTop: 5,
      },
      
});
