import React, { useState } from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity, Button, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';

export const PostModal = () => {
  const [postModalVisible, setPostModalVisible] = useState(false);

  const openModal = () => setPostModalVisible(true);
  const closeModal = () => setPostModalVisible(false);

  return (
    <View style={styles.container}>
      <Button title="Open Modal" onPress={openModal} />

      <Modal
        animationType="slide"
        transparent={true}
        visible={postModalVisible}
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={() => {
          Keyboard.dismiss();
          closeModal();
        }}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContent}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          <View style={styles.modalInner}>
            <Text style={styles.modalText}>This is an empty modal.</Text>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    height: '40%',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  modalInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

