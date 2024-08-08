import React, { useState } from "react";
import { SafeAreaView, TouchableOpacity, FlatList, Text, TextInput, StyleSheet, View, Image } from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; 
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from "@react-navigation/native";
import { StackParamList } from "../../navigation/types";
type SearchScreenNavigationProp = StackNavigationProp<StackParamList, 'SearchScreen'>;

export default function SearchScreen() {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const firestore = getFirestore();
    const navigation = useNavigation<SearchScreenNavigationProp>();

    const searchUsers = async () => {
        const usersRef = collection(firestore, 'users');
        const q = query(
            usersRef, 
            where('username', '>=', searchTerm),
            where('username', '<=', searchTerm + '\uf8ff')
        );

        try {
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setResults(data);
        } catch (error) {
            console.error("Error searching users: ", error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.searchSection, { marginHorizontal: 'auto' }]}>
                <Icon style={styles.searchIcon} name="search-outline" size={15} color="#8A8A8A"/>
                <TextInput
                    style={styles.input}
                    placeholder="Search"
                    autoCapitalize="none"
                    value={searchTerm}
                    onChangeText={text => {
                        setSearchTerm(text);
                        if (text.length > 0) {
                            searchUsers();
                        } else {
                            setResults([]);
                        }
                    }}
                />
            </View>
            <FlatList
                data={results}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.resultItem}>
                        <TouchableOpacity 
                            onPress={() => {
                                navigation.navigate('UserProfile', {
                                    username: item.username,
                                    name: item.name,
                                    photoUrl: item.photoUrl,
                                    bio: item.bio,
                                    posts: item.posts,
                                    userId: item.id
                                });

                            }} 
                            style={[styles.resultItemContent, { marginLeft: '5%', marginTop: '8%' }]}
                        >
                            <Image source={{ uri: item.photoUrl }} style={styles.avatar} />
                            <Text style={styles.username}>{item.username}</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F3FA',
    },
    searchSection: {
        marginTop: '5%',
        flexDirection: 'row',
        height: 51,
        borderRadius: 16,
        backgroundColor: '#E3E3E3',
        borderColor: '#E3E3E3',
        borderWidth: 1,
        marginBottom: 10,
        width: '95%',
    },
    searchIcon: {
        padding: 18,
    },
    input: {
        height: 51,
        marginBottom: 10,
        flex: 1,
    },
    resultItem: {
        flexDirection: 'row',
    },
    resultItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 20,
    },
    username: {
        fontSize: 16,
        color: '#333',
    },
});
