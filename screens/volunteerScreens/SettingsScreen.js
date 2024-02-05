import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { AuthContext } from '../../navigation/AuthProvider';
import { firebase } from '../../firebaseconfig';
import FormButton from '../../components/FormButton';

const SettingsScreen = () => {
  const {user, logout} = useContext(AuthContext)
  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    if (user && user.uid) {
      firebase.firestore().collection('users')
      .doc(firebase.auth().currentUser.uid).get()
      .then((snapshot) => {
          if (snapshot.exists) {
              setFirstName(snapshot.data().firstName)
          } else {
              console.log('User does not exist')
          }
      })
      .catch((error) => {
          console.log("Error getting user: ", error)
      })
    } else {
      console.log("User has logged out! Stop fetching UID (HomeScreen)")
    }
  }, [user])

  return (
    <View style={styles.container}>
      <FormButton buttonTitle='Logout' onPress={logout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Set background color if needed
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SettingsScreen;