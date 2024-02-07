import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { Camera } from 'expo-camera';
import { Card } from 'react-native-paper';
import { firebase } from '../../firebaseconfig';
import { AuthContext } from '../../navigation/AuthProvider';
import FormInput from '../../components/FormInput';
import FormButton from '../../components/FormButton';
import {showAttendanceQRCodeModal, toggleModal} from '../volunteerScreens/Activity';
import { useNavigation } from '@react-navigation/native';
import {windowHeight, windowWidth} from '../../utils/Dimentions';

const ScannerScreen = () => {
  const { user } = useContext(AuthContext);
  const [scanning, setScanning] = useState(false);
  const [adminName, setAdminName] = useState('');
  const [hasCameraPermission, setHasCameraPermission] = useState(true);
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [data, setData] = useState(null); //QR Code Data
  const navigation = useNavigation();

  const requestCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasCameraPermission(status === 'granted');
    setScanning(true);
    if (status !== 'granted') {
      // Prompt the user to enable camera permission
      await Camera.requestCameraPermissionsAsync();
    }
  };

  useEffect(() => {
    console.log("(Seller Scan QR) useEffect running...")
    if (user && user.uid) {
      const fetchUserData = async () => {
        try {
          const snapshot = await firebase
            .firestore()
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .get();
    
          if (snapshot.exists) {
            setAdminName(snapshot.data().firstName);
          } else {
            console.log('User does not exist');
            Alert.alert('User does not exist');
          }
        } catch (err) {
          console.log('Error getting user:', err);
        }
      };
    
      fetchUserData();
      requestCameraPermission();
      
    } else {
      console.log("Seller has logged out (Scan QR Screen)");
    }
    
  }, [user]);

  const focusListener = navigation.addListener('focus', () => {
    // Handle camera activation when the screen comes into focus
    setScanning(true);
  });

  const blurListener = navigation.addListener('blur', () => {
    // Handle camera deactivation when the screen loses focus
    setScanning(false);
  });

  //Handling camera focus on Scanner screen
  useEffect(() => {
    return () => {
      // Cleanup function when component unmounts or navigation listener is removed
      focusListener();
      blurListener();
    };
  }, [navigation]);

  //Handle QR code scanning process
  const handleQRCodeScan = async ({ data }) => {
    setScanning(false);
    
    try {
      const qrCodeData = JSON.parse(data);
      setData(qrCodeData)
      setShowPromptModal(true)
    } catch (err) {
      Alert.alert("error scanning QR Code: ", err)
    }
  }

  //Handle creating an attendance object in Firebase Firestore
  const handleAttendanceTaking = async () => {
    const {
      volunteerName, // volunteer name
      volunteerId, 
      eventId,
      eventName,
      eventHours,
      eventDescription,
      beneficiaryName,
      showAttendanceQRCodeModal, // Modal in customer screen must be tracked
          } = data;

    // Create attendance object in Firestore
    const attendanceCollectionRef = firebase.firestore().collection('attendance');
    const attendanceDocRef = await attendanceCollectionRef.add({
      beneficiaryName: data.beneficiaryName,
      volunteerId: data.volunteerId,
      volunteerName: data.volunteerName,          
      volunteerHours: data.eventHours,
      eventName: data.eventName,
      timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
      eventId: data.eventId,
    });

    // update attendedBy array
    firebase
        .firestore()
        .collection('events')
        .doc(data.eventId)
        .update({
          attendedBy: firebase.firestore.FieldValue.arrayUnion(volunteerId),
        }).then(() => {
          console.log('Attendance marked successfully!');
        })
        .catch((error) => {
          console.log('Error updating attendance array:', error);
        });

    // Show success message
    Alert.alert('Success', `You have successfully recorded the attendance for ${volunteerName} for ${eventName}.`);
    setShowPromptModal(false);
  }


  const handleScanAgain = async () => {
    setScanning(true);
  }

  return (
    <View style={styles.container}>
      {/* Your content goes here */}
      <Text style={styles.title1}>Scanner</Text>
      {(scanning)  ? (
        <Camera
          onBarCodeScanned={handleQRCodeScan}
          style={StyleSheet.absoluteFillObject}
          testID="camera"
        >
        <View style={styles.mask}>
            <View style={styles.squareContainer}>
              <View style={styles.square} />
              <View style={[styles.corner, styles.cornerTopLeft]} />
              <View style={[styles.corner, styles.cornerTopRight]} />
              <View style={[styles.corner, styles.cornerBottomLeft]} />
              <View style={[styles.corner, styles.cornerBottomRight]} />
            </View>
        </View>
        </Camera>
      ) : (
        <View>
          <TouchableOpacity style={styles.scanAgainButton} onPress={handleScanAgain}>
            <Text style={styles.buttonText}>Launch Scanner</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Check for volunteer details with a Modal */}

      <Modal
        visible={showPromptModal}
        animationType = "slide"
        transparent={true}
      >
        <View style={styles.modalContent}>
          <View style={styles.titleContainer}>
              <Text style={styles.title}>Attendance Taking</Text>
          </View>
          {/* <Card>
            <Card.Content> */}

            {showPromptModal && (
            <Card>
              <Card.Content>
                <Text>Volunteer ID: {data.volunteerId}</Text> 
                <Text>Volunteer Name: {data.volunteerName}</Text>
                <Text>Event: {data.eventName}</Text> 
                <Text>Beneficiary: {data.beneficiaryName}</Text>
                <Text>No. of Volunteer Hours: {data.eventHours}</Text>
              </Card.Content>
            </Card>)}
          
          <FormButton
            buttonTitle="Confirm"
            onPress={() => handleAttendanceTaking()}
          />

          <TouchableOpacity style={styles.buttonContainer} onPress={() => setShowPromptModal(false)}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>

        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  button1: {
    marginTop: 20,
    backgroundColor: "red",
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
  },
  buttonContainer: {
    marginTop: 10,
    width: '95%',
    height: windowHeight / 15,
    backgroundColor: 'red',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff', // Set background color if needed
    justifyContent: 'center',
    alignItems: 'center',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderWidth: 10,
    borderColor: '#BF281F',
    transform: [{ rotate: '180deg' }],
    fontWeight: 'bold',
    borderRadius: 3,
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },
  mask: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    height: '100%',
    width: '100%',
    backgroundColor: '#FCF0F5',
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
    position: 'absolute',
    bottom: 0,
    alignItems: 'center', 
  },
  scanAgainButton: {
    backgroundColor: '#BF281F',
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
  },
  squareContainer: {
    position: 'relative',
    width: 280,
    height: 280,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  square: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    borderColor: '#fff',
  },
  titleContainer: {
    height: '10%',
    backgroundColor: '#BF281F',
    borderRadius: 10,
    paddingHorizontal: 50,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },

});

export default ScannerScreen;