import React, { useEffect, useState } from 'react';
import { Text, FlatList, TouchableOpacity, StyleSheet, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, query, onSnapshot, orderBy, doc, getDocs } from 'firebase/firestore';
import { FIREBASE_DB } from '../../FirebaseConfig';
import { StackParamList } from '../../navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';

export default function Messages() {
  return(<Text>Hello</Text>)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F3FA',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  photo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
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
