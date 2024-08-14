import React, { useEffect, useState, useCallback } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, TextInput, ActivityIndicator } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_DB, FIREBASE_STORAGE, FIREBASE_AUTH } from '../../FirebaseConfig';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, addDoc, collection } from 'firebase/firestore';
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from '@react-navigation/native';

const Post = ({ navigation }) => {
    const [user, setUser] = useState(FIREBASE_AUTH.currentUser);
    const [image, setImage] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false); 

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (result.canceled) {
            navigation.goBack();
        } else if (result.assets && result.assets.length > 0) {
            const uri = result.assets[0].uri;
            setImage(uri);
        }
    };

    const uploadImage = async (uri: string): Promise<string | null> => {
        try {
            const fileInfo = await FileSystem.getInfoAsync(uri);
            if (!fileInfo.exists) {
                throw new Error("File does not exist");
            }

            const blob = await new Promise<Blob>((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = function() {
                    resolve(xhr.response);
                };
                xhr.onerror = function() {
                    reject(new Error("Failed to fetch image"));
                };
                xhr.responseType = 'blob';
                xhr.open('GET', uri, true);
                xhr.send(null);
            });

            const storageRef = ref(FIREBASE_STORAGE, `users/${user.uid}/Posts/Image_${new Date().getTime()}.jpg`);
            const uploadTask = uploadBytesResumable(storageRef, blob);

            return new Promise((resolve, reject) => {
                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log(`Upload is ${progress}% done`);
                        setProgress(Math.round(progress));
                    },
                    (error: any) => {
                        console.error("Upload failed: ", error);
                        reject(null);
                    },
                    async () => {
                        try {
                            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                            console.log("File available at", downloadURL);
                            resolve(downloadURL);
                        } catch (error: any) {
                            console.error("Error getting download URL: ", error);
                            reject(null);
                        }
                    }
                );
            });
        } catch (error) {
            console.error("Error uploading image: ", error);
            return null;
        }
    };

    const postImage = async () => {
        if (!image) {
            return;
        }

        setLoading(true);

        const downloadURL = await uploadImage(image);
        if (downloadURL && user) {
            try {
                const postsRef = collection(FIREBASE_DB, "users", user.uid, "posts");
                await addDoc(postsRef, {
                    postImage: downloadURL,
                    description: description || "",
                    timestamp: new Date(),
                });
                setImage(null);
                setDescription("");
                navigation.navigate('ProfileScreen');
            } catch (error) {
                console.error("Error: ", error);
            } finally {
                setLoading(false); 
            }
        }
    };

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(FIREBASE_AUTH, (currentUser) => {
            setUser(currentUser);
        });

        return () => {
            unsubscribeAuth();
        };
    }, []);

    useFocusEffect(
        useCallback(() => {
            pickImage();
        }, [])
    );

    return (
        <SafeAreaView style={styles.container}>
            {image && (
                <>
                    <TouchableOpacity>
                        <Image
                            resizeMode='cover' 
                            source={{ uri: image }}
                            style={styles.image}
                            accessibilityLabel="Image posted"
                        />
                    </TouchableOpacity>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Type something..."
                            value={description}
                            onChangeText={setDescription}
                        />
                        <TouchableOpacity style={styles.button} onPress={postImage}>
                            <Text style={styles.buttonText}>Post</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8F3FA',

    },
    image: {
        width: 330,
        height: 330,
        marginBottom: 10,
        borderRadius: 10,
    },
    inputContainer: {
        width: '80%',
        height: '20%',
        alignItems: 'center',
    },
    input: {
        marginTop: '5%',
        marginBottom: '10%',
        padding: 10,
        borderRadius: 16,
        height: 51,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    button: {
        backgroundColor: '#0d0d0d',
        padding: 10,
        borderRadius: 16,
        height: 51,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
        width: '100%',
    },
    buttonText: {
        color: '#fff',
    },
});

export default Post;
