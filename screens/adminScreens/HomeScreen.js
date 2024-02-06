import React, { useContext, useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View, Alert, Button, Pressable, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../../firebaseconfig';
import { FAB, Card, TextInput, RadioButton, PaperProvider } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import FormInput from '../../components/FormInput';
import FormButton from '../../components/FormButton';
import { AuthContext } from '../../navigation/AuthProvider';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';


// export const createVoucherInFirestore = async (eventData) => {
//   // try {
//     const voucherId = firebase.firestore().collection('vouchers').doc().id;
//     console.log("voucherId:", voucherId);

//     await firebase.firestore().collection('vouchers').doc(voucherId).set({
//       ...voucherData,
//       voucherId
//       // timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
//       // sellerId: firebase.auth().currentUser.uid,
//     });

//     console.log('Voucher created successfully!');
//     return voucherId; 
//   // } catch (error) {
//   //   console.log('Error creating voucher:', error);
//   //   throw new Error('Failed to create voucher.');
//   // }
// };


const HomeScreen = () => {
  const navigation = useNavigation();
  const { user, logout } = useContext(AuthContext)
  const [firstName, setFirstName] = useState('');
  const [eventImage, setEventImage] = useState(null);
  const [eventName, setEventName] = useState('');
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [eventHours, setEventHours] = useState(''); //Code somehow reads this as a String. We then TypeCast into Integer
  const [eventDescription, setEventDescription] = useState('');
  const [checked, setChecked] = React.useState('first');
  // const [voucherType, setVoucherType] = useState('dollar');
  const [selectedOption, setSelectedOption] = useState(null);

  

  useEffect(() => {
    console.log("(Seller Home) useEffect running...");

    if (user && user.uid) {
      const fetchUserData = async () => {
        try {
          const userCollectionRef = firebase.firestore().collection('users');
          const userData = await userCollectionRef.doc(user.uid).get();
          if (userData.exists) {
            const { firstName } = userData.data();
            setFirstName(firstName);
          }
        } catch (error) {
          console.log('Error fetching user data:', error);
        }
      };

      fetchUserData();

    } else {
        console.log("Seller has logged out! (Homescreen)");
    } 
    
  }, [user]);

  const createEvent = () => {
    //Added try-catch to handle negative voucherAmount input
    try {

      if (eventHours < 0 || eventHours == '') {
        Alert.alert('Error!', 'Volunteer Hours must be non-negative!');
        throw new Error('Error!, Volunteer Hours must be non-negative!');
      } else if (eventName == '') {
        Alert.alert('Error!', 'Please fill in a Event Name!' );
        throw new Error('Error!, Event Name must be filled in!');
      } else if (eventDescription == '') {
        Alert.alert('Error!', 'Please fill in a Event Description!' );
        throw new Error('Error!, Event Description must be filled in!');
      } else if (eventImage == null) {
        Alert.alert('Error! Please Upload a valid Event Image', "WARNING: All Customers can see your uploaded image. The developers will not condone inappropriate images.");
        throw new Error('Error!, Please Upload a valid Voucher Image');
      }

        // Generate a unique event ID
        const eventId = firebase.firestore().collection('events').doc().id;
        console.log("voucherId:", eventId);
      
        // Get a reference to the Firebase Storage bucket
        const storageRef = firebase.storage().ref();
        console.log('storageRef:', storageRef);
      
        // Create a reference to the voucher image file in the Storage bucket
        const imageRef = storageRef.child(`eventImages/${eventId}`);
        console.log('imageRef:', imageRef);
      
        // Convert the voucher image URI to a Blob object
        const xhr = new XMLHttpRequest();
        xhr.onload = async () => {
          const blob = xhr.response;
      
          // Upload the image file to Firebase Storage
          const uploadTask = imageRef.put(blob);
      
          // Listen for upload progress or completion
          uploadTask.on(
            firebase.storage.TaskEvent.STATE_CHANGED,
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log(`Upload progress: ${progress}%`);
            },
            (error) => {
              console.log('Error uploading image:', error);
            },
            async () => {

              const downloadURL = await imageRef.getDownloadURL();
              console.log('Image download URL:', downloadURL);

                  // Create the voucher document in Firestore
                  firebase
                    .firestore()
                    .collection('events')
                    .doc(eventId)
                    .set({
                      beneficiaryName,
                      timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
                      usedBy: [], // Initialize the usedBy array as empty
                      eventHours,
                      eventDescription,
                      eventId,
                      eventImage: downloadURL, 
                      eventName
                    })
                    .then(() => {
                      console.log('Volunteer Event created successfully!');
                      Alert.alert('Success! Volunteer Event successfully!');
                      // Reset the input fields
                      setEventImage(null);
                      setEventHours('');
                      setEventDescription('');
                      setEventName('');
                      setBeneficiaryName('')
                    })
                    .catch((error) => {
                      console.log('Error creating event:', error);
                      Alert.alert('Error!', 'Failed to create Volunteer Event.');
                    });

            }
          );
        };
        xhr.onerror = (error) => {
          console.log('Error creating Blob:', error);
        };
        xhr.responseType = 'blob';
        xhr.open('GET', eventImage.uri, true);
        xhr.send();

        Alert.alert('Vounteer Event Created', 'Your Volunteer Event has been successfully created!')
      

    } catch (err) {
      console.log(err);
    }
    
  };
  
  /**
   * Prompts the user to select an image from the device's media library.
   * Requests media library permissions and opens the image picker dialog.
   * If an image is selected, updates the state with the selected image URI.
   * @returns {Promise<void>} A promise that resolves when the image is selected.
   */
  const selectImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
    if (permissionResult.granted === false) {
      console.log('Camera roll permission denied');
      return;
    }
  
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
  
    if (!pickerResult.canceled) {
      console.log(pickerResult.uri);
      setEventImage({ uri: pickerResult.uri });
    }
  }

  /**
   * Uploads the selected voucher image to Firebase Storage.
   * Fetches the image as a blob and stores it in the storage bucket.
   * Updates the state to indicate uploading progress and completion.
   * @returns {Promise<void>} A promise that resolves when the image is uploaded.
   */
  const uploadImage = async () => {
      setUploading(true);
      const response = await fetch(eventImage.uri)
      const blob = await response.blob();
      const fileName = eventImage.uri.substring(voucherImage.uri.lastIndexOf('/')+1);
      var ref = firebase.storage().ref().child(fileName).put(blob);

      try {
        await ref; 
      } catch (error) {
        console.log(error);
      }
      setUploading(false);
      Alert.alert('Event Image Uploaded!');
      setEventImage(null);
    }

  return (
    <GestureHandlerRootView>
      <ScrollView>
      <View style={styles.container} testID="test-id-container">
          <Text style={styles.text}>Welcome! {firstName}</Text>
          <FormButton buttonTitle='Logout' onPress={logout} />


      <Text style={styles.radioButtonTitle}>Create your Volunteer Event here!</Text>

        <Card style={styles.volunteerCard} testID="dollar-card">
          <Card.Title title="Volunteer Event" titleStyle={styles.titleVoucher} testID="dollar-card"/>
          <Card.Content>
            {/* Input fields */}

            <TextInput
              style={styles.textInput1}
              label="Event Name"
              value={eventName}
              onChangeText={(text) => setEventName(text)}
              selectionColor='white'
              cursorColor='white'
              activeUnderlineColor='white'
              textColor='white'
              multiline= {true}
            />

            <TextInput
              style={styles.textInput1}
              label="Beneficiary Name"
              value={beneficiaryName}
              onChangeText={(text) => setBeneficiaryName(text)}
              selectionColor='white'
              cursorColor='white'
              activeUnderlineColor='white'
              textColor='white'
              multiline= {true}
            />

            <TextInput
              style={styles.textInput1}
              label="Vounteer Hours"
              value={String(eventHours)}
              keyboardType='numeric'
              onChangeText={(text) => setEventHours(text)}
              selectionColor='white'
              cursorColor='white'
              activeUnderlineColor='white'
              textColor='white'
            />
            
            <TextInput
              style={styles.textInput1}
              label="Event Description"
              value={eventDescription}
              onChangeText={(text) => setEventDescription(text)}
              selectionColor='white'
              cursorColor='white'
              activeUnderlineColor='white'
              textColor='white'
              multiline= {true}
            />


            {/* Upload voucher image */}
            <Pressable style={styles.button2} onPress={selectImage} testID='voucher-image-button'>
              <Text style={styles.text1}>Choose Image From Library</Text>
            </Pressable>

            {/* Display selected image */}
            {eventImage && (
              <Image 
                source={{ uri: eventImage.uri }} 
                style={styles.selectedImage}
                testID='selected-image' />
            )}

          </Card.Content>
          <Card.Actions>
            <Pressable style={styles.button2} onPress={createEvent}>
              <Text style={styles.text1}>Create</Text>

            </Pressable>
          </Card.Actions>
        </Card>

      <FAB
        icon={() => <Ionicons name="scan-outline" size={20}/>}
        style={styles.fab}
        label="Scan QR"
        onPress={() => navigation.navigate('Scan QR')}
        color='#003d7c'
      />

      


      <Text style={styles.whiteSpaceText}>White Space.</Text>
      <Text style={styles.whiteSpaceText}>White Space.</Text>

    </View>
    </ScrollView>
    </GestureHandlerRootView>
    
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
    backgroundColor: "#f07b10",
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 40,
  },
  button2: {
    marginTop: 30,
    backgroundColor: "#bf281f",
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
  },
  container: {
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  volunteerCard: {
    width: '100%',
    marginTop: 10,
    backgroundColor: '#f26b8a',
    color: 'white',
    borderRadius: 20,
    padding: 10,
  },
  fab: {
    marginTop: 25,
    padding: 2,
    backgroundColor: 'white',
  },
  logo: {
    height: 150,
    width: '100%',
    resizeMode: 'contain',
  },
  percentageCard: {
    width: '100%',
    marginTop: 10,
    backgroundColor: '#db7b98',
    color: 'white',
    borderRadius: 20,
    padding: 10,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    marginTop: 15,
    width: '80%',
    fontSize: 12,
    justifyContent: 'center',
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  radioButtonTitle: {
    marginTop: 40,
    marginBottom: 5,
    fontSize: 20,
    fontWeight: 'bold',
  },
  radioLabel: {
    marginLeft:20,
  },
  selectedImage: {
    width: 200,
    height: 200,
    marginTop: 10,
    resizeMode: 'cover',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  text1: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  textInput1: {
    backgroundColor: '#f26b8a',  
  },
  textInput2: {
    backgroundColor: '#db7b98',
  },
  titleVoucher: {
    fontSize: 20,
    color: 'white',
    marginTop: 20,
  },
  whiteSpaceText: {
    fontSize: 16,
    marginVertical: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
