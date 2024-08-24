import React, { useState, useEffect } from 'react';
import { Image, TouchableOpacity, StyleSheet, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { FIREBASE_DB, FIREBASE_STORAGE, FIREBASE_AUTH } from '../../../FirebaseConfig';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

interface AvatarProps {
  initialPhotoUrl?: string; 
}

export default function Avatar({ initialPhotoUrl }: AvatarProps) {
    const [image, setImage] = useState<string | null>(null);
    const [user, setUser] = useState(FIREBASE_AUTH.currentUser);
    const [progress, setProgress] = useState(0); 

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(FIREBASE_AUTH, (currentUser) => {
            setUser(currentUser);
        });

        return () => {
            unsubscribeAuth();
        };
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const uri = result.assets[0].uri;
            setImage(uri);
            const downloadURL = await uploadImage(uri, "image");
            if (downloadURL && user) {
                await updateUserProfileImage(downloadURL);
            }
        }
    };

    async function uploadImage(uri: string, fileType: string): Promise<string | null> {
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

            const storageRef = ref(FIREBASE_STORAGE, `users/${user.uid}/profile_pictures/ProfileImage_${new Date().getTime()}.jpg`);
            const uploadTask = uploadBytesResumable(storageRef, blob);

            return new Promise((resolve, reject) => {
                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        setProgress(Math.round(progress)); 
                    },
                    (error: any) => {
                        console.error("Upload failed: ", error);
                        reject(null);
                    },
                    async () => {
                        try {
                            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
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
    }

    async function updateUserProfileImage(url: string) {
        if (!user) {
            console.error("No authenticated user");
            return;
        }

        const userRef = doc(FIREBASE_DB, "users", user.uid);
        try {
            await setDoc(userRef, { photoUrl: url }, { merge: true });
        } catch (error) {
            console.error("Error updating profile image: ", error);
        }
    }

    return (
        <View>
            <TouchableOpacity onPress={pickImage}>
                <Image
                    resizeMode='contain'
                    source={
                        image ? { uri: image } : 
                        initialPhotoUrl ? { uri: initialPhotoUrl } : 
                        require('../../../assets/images/D9D9D9.png')
                      }                    style={[styles.image, !image && initialPhotoUrl ? { opacity: 0.7 } : {}]} // Adjust opacity based on image state
                    accessibilityLabel="Profile image"
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    image: {
        width: 130,
        height: 130,
        marginBottom: 10,
        borderRadius: 100,
    },
});
