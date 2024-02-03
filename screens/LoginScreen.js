import React, {useContext, useState} from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet, Alert
} from 'react-native';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import SocialButton from '../components/SocialButton';
import { AuthContext } from '../navigation/AuthProvider';
import { firebase } from '../firebaseconfig';

/**
 * The main LoginScreen component.
 * @component
 * @param {object} navigation - React Navigation prop to enable navigation to other screens.
 * @returns {JSX.Element} - The rendered LoginScreen component.
 */
const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()

  const {login} = useContext(AuthContext)

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require('../assets/big_at_heart.jpg')}
        style={styles.logo}
      />
      <Text style={styles.text}>Login</Text>

      <FormInput
        labelValue={email}
        onChangeText={(userEmail) => setEmail(userEmail)}
        placeholderText="Email"
        iconType="user"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        testID="email-input" //testID prop
      />

      <FormInput
        labelValue={password}
        onChangeText={(userPassword) => setPassword(userPassword)}
        placeholderText="Password"
        iconType="lock"
        secureTextEntry={true}
        testID="password-input" // Add testID prop
      />

      <FormButton
        buttonTitle="Sign In"
        onPress={() => login(email, password)}
        testID="sign-in-button" // Add testID prop
      />

      <TouchableOpacity 
        style={styles.forgotButton} 
        onPress={() => {forgetPassword(email)}}
        testID='forgot-password-button' // Add testID prop
        >
        <Text style={styles.navButtonText}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* <SocialButton
        buttonTitle="Sign In with Google"
        btnType="google"
        color="#de4d41"
        backgroundColor="#f5e7ea"
        onPress={() => {}}
      />  */}

      <TouchableOpacity 
        style={styles.createAccountButton} 
        onPress={() => navigation.navigate('Signup')}
        testID='sign-up-button' // Add testID prop
        > 
        <Text style={styles.navButtonText}>Don't have an account? Create here!</Text>
      </TouchableOpacity>

      <Text style={styles.whiteSpaceText}>White Space.</Text>

    </ScrollView>
  );
};

export default LoginScreen;

/**
   * Sends a password reset email to the provided email address.
   * @function
   */
const forgetPassword = (email) => {
  firebase.auth().sendPasswordResetEmail(email) //this email is from the email input bar. check if it is correct
  .then(() => {
    showPasswordResetSuccessMessage();
    console.log("After using show mock function: Password Reset Email Sent!")
  }).catch((err) => {
    showAlert(err);
  })
}

/**
   * Custom function to display an alert message.
   * @function
   * @param {string} message - The message to be displayed in the alert.
   */
const showAlert = (message) => {
  console.log('Alert:', message);
  Alert.alert("Forgot Password?", 
    "Please enter your email first before pressing 'Forgot Password?' button.",
    [{text: 'ok', style: 'cancel'}],
    {cancelable: true},
  );
};

  /**
   * Custom function to display a success message for password reset.
   * @function
   */
  const showPasswordResetSuccessMessage = () => {
    Alert.alert("Password Reset Email Sent!");
    console.log('Password Reset Email Sent!');
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  logo: {
    height: 250,
    width: 380,
    resizeMode: 'contain',
  },
  text: {
    fontSize: 28,
    marginBottom: 10,
    color: '#051d5f',
    fontWeight: 'bold',
  },
  navButton: {
    marginTop: 15,
  },
  forgotButton: {
    marginTop: 20,
    marginBottom: 10,
  },
  createAccountButton: {
    marginTop: 10,
    marginBottom: 10,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#BF281F',
  },
  whiteSpaceText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});