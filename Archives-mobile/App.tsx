import { SafeAreaView } from 'react-native-safe-area-context';
import AuthNavigator from './navigation/RootNavigator';
import { Image, Text, TouchableOpacity, ScrollViewBase, StyleSheet, TextInput, ScrollView } from 'react-native';
import ProfileScreen from './screens/Profile/ProfileScreen';
export default function App() {
 
      return (
          <AuthNavigator  />   
     // <ProfileSetUpScreen />
        );


}
