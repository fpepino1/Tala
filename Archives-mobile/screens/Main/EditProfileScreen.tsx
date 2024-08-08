import React, { useState } from 'react';
import { View, SafeAreaView, TouchableOpacity, Text, StyleSheet, TextInput } from 'react-native';
import Avatar from './Avatar';
import { StackNavigationProp } from '@react-navigation/stack';
import {StackParamList } from '../../navigation/types';
import { useNavigation } from '@react-navigation/native';

export default function EditProfileScreen(){
    const navigation = useNavigation<StackNavigationProp<StackParamList>>();

  return (
    <SafeAreaView style={styles.container}>
        <View  style={styles.containerAvatar}>
            <Avatar/>
        </View>
      <TextInput
        style={styles.input}
        placeholder="Change name"
        keyboardType="default"
        autoCapitalize="none"
        />     
        <TextInput
        style={styles.input}
        placeholder="Change username"
        keyboardType="default"
        autoCapitalize="none"
        />       
        <TextInput
        style={styles.inputBio}
        placeholder="Change bio"
        keyboardType="default"
        autoCapitalize="none"
      />
      <View style={styles.containerButton}>
      <TouchableOpacity style={styles.submit}>
        <Text style={styles.submitText}>Save changes</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.submit, {backgroundColor:'#df3b47'}]}>
        <Text style={styles.submitText}>Delete account</Text>
      </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    containerAvatar:{
        marginBottom:'18%',
    },
   containerButton:{
    marginTop:'5%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
    width: '90%',
   },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginTop:'-20%',
    backgroundColor: '#F8F3FA',
  },
  biggerText: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: '10%',
  },
  nameText: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 2,
  },
  boldText: {
    fontWeight: 'bold',
  },
  normalText: {
    fontSize: 13,
    marginBottom: 20,
  },
  input:{
    width: '80%',
    borderRadius: 16,
    backgroundColor: '#E3E3E3',
    paddingHorizontal: '5%',
    paddingTop: '4%',
    paddingBottom: '4%',
    marginBottom: 10,

  },
  inputBio: {
    width: '80%',
    borderRadius: 16,
    backgroundColor: '#E3E3E3',
    paddingHorizontal: '5%',
    paddingTop: '4%',
    paddingBottom: '15%',
    marginBottom: 20,
  },
  submit: {
    backgroundColor: '#0d0d0d',
    borderRadius: 16,
    height: 50,
    width: '40%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
  },
});
