import React, { useContext, useEffect, useState } from 'react';
import { Alert, View, Text, Modal, StyleSheet, Pressable, FlatList } from 'react-native';
import { AuthContext } from '../../navigation/AuthProvider';
import { firebase } from '../../firebaseconfig';
import { Card, Searchbar, Button, Paragraph, FAB } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import QRCodeWithLogo from '../../components/QRCodeWithLogo';
import { getDateOfEvent } from '../adminScreens/Activity';


//Certificate imports
import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing';

export const fetchEvents = (setEvents) => {
  const unsubscribe =  firebase
    .firestore()
    .collection('events')
    .orderBy('beneficiaryName', 'asc')
    .onSnapshot((snapshot) => {
      const data = [];
      const userUid = firebase.auth().currentUser.uid; // Get the current user's UID
      snapshot.forEach((doc) => {
        const eventData = { id: doc.id, ...doc.data() };
        // Check if the user's UID is not in the usedBy array of the event
        if (eventData.usedBy && eventData.usedBy.includes(userUid)) {
          data.push(eventData);
        }
      });
      setEvents(data);
    });
    return unsubscribe;
};

export const CardItem = ({item, takeAttendance, requestCertificate}) => {

  const [showMore, setShowMore] = useState(false)
  return (
    <Card style={styles.cardStyle}>
    <Card.Cover source={{ uri: item.eventImage }} />
      <Card.Content>
        <Text style={styles.title1}>Beneficiary: {item.beneficiaryName}</Text>
        <Text style={styles.title1}>Event: {item.eventName}</Text>
        <Text style={styles.title}>Location: {item.eventLocation}</Text>
        <Text style={styles.title}>Date of Event: {getDateOfEvent(item.eventStartDate)}</Text>
        <Text style={styles.title1}>No. of Hours: {item.eventHours}</Text>
        <Paragraph numberOfLines={showMore ? 0 : 2}>Event Description: {item.eventDescription}</Paragraph>
    </Card.Content>
    <Card.Actions>
      <FAB
        icon={() => <Ionicons name="scan-outline" size={20}/>}
        style={styles.fab}
        label="Attendance"
        // onPress={() => navigation.navigate('Scan QR')}
        onPress={() => takeAttendance(item)}
        color='#003d7c'
      />
    </Card.Actions>
    <Card.Actions>
      <Button onPress={() => requestCertificate(item)} buttonColor='white'>Request Certificate</Button>
    </Card.Actions>
    <Card.Actions>
      <Button onPress={() => setShowMore(!showMore)} buttonColor='white'>{showMore ? "Show Less" : "Read More"}</Button>
    </Card.Actions>
  </Card>
  )
}

export const filteredEvents = (events, searchQuery) => {
  return events.filter((event) =>
    event.beneficiaryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.eventName.toLowerCase().includes(searchQuery.toLowerCase())
  );
};

export const calculateTotalHours = (events) => {
  let totalHours = 0;

  events.forEach((event) => {
    totalHours += Number(event.eventHours);
  });

  //totalHours = Number(totalHours.toFixed(2));
  console.log(totalHours);

  return totalHours;
};



const ActivityScreen = () => {
  const [events, setEvents] = useState([]);
  const [event, setEvent] = useState(null); // For taking attendance
  const {user, logout} = useContext(AuthContext);
  const [firstName, setFirstName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const onChangeSearch = query => setSearchQuery(query);

  //Modal
  const [showAttendanceQRCodeModal, setShowAttendanceQRCodeModal] = useState(false);

  const toggleModal = () => {
    setShowAttendanceQRCodeModal(!showAttendanceQRCodeModal);
  };

  const toggleFalse = () => {
    setShowAttendanceQRCodeModal(false);
  }
  
  const toggleTrue = () => {
    setShowAttendanceQRCodeModal(true);
  }

  const requestCertificate = (event) => {

    //Checks if user is logged in.
    const currentUser = firebase.auth().currentUser;
    if (!currentUser) {
      console.log("User is not logged in!");
      return;
    }
    
    if (!event.attendedBy.includes(currentUser.uid)) {
      Alert.alert("Hey There!", "You cannot request for a certificate yet since your attendance is not taken.");
    } else {
      // Confirm with the user if they want to take attendance
      Alert.alert(
        'Request Certificate',
        'Are you sure you want to request certificate of completion for this event?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Confirm',
            onPress: () => {
              handleCertificate(user, event, setEvent);
            },
          },
        ]
      );
    }
  };

  const handleCertificate = (user, event, setEvent) => {
    console.log("Event is:", event.eventId);

    // update requestCertificate array in Events Collection
    firebase
        .firestore()
        .collection('events')
        .doc(event.eventId)
        .update({
          requestCertificate: firebase.firestore.FieldValue.arrayUnion(user.uid),
        }).then(() => {
          console.log('Certificate request submitted!');
        })
        .catch((error) => {
          console.log('Error updating requestCertificate array:', error);
        });

    setEvent(event);

    // Produce PDF HTML file 
    const certificateHtml = `
    <html>
      <head>
        <style>
          body {
            font-family: 'Brush Script MT', cursive;
            text-align: center;
            border: 5px solid #BF281F;
            padding: 50px; /* Adjust the padding as needed */
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            align-items: center;
            background-color: #FCF0F5;
          }

          .content {
            /* Additional styling for the content if needed */
          }

          .logo {
            max-width: 100%;
            height: auto;
          }

          .signatures {
            display: flex;
            justify-content: space-around;
            font-family: 'Times New Roman';
            width: 100%;
            margin-top: 20px; 
          }

          h1 {
            color: #BF281F;
          }

          .first-name {
            margin: 10px 0; /* Adjust the margin as needed */
          }
        </style>
      </head>

      <body>
        <div class="content">
          <br />
          <br />
          <h1>CERTIFICATE OF COMPLETION</h1>
          <br />
          <h1>This certificate is awarded to</h1>
          <h1 class="first-name">${firstName}</h1>
          <h2>for completing the Volunteering Program ${event.eventName} for ${event.beneficiaryName}.</h2>
          <br />
          <h3>Number of hours contributed: ${event.eventHours}</h3>
          <p>Start Date: //Start date//</p>
          <p>End Date: //End date//</p>

          <p>May ${firstName}'s active participation be the drive to continue contributing</p>
          <p>meaningfully to the society!</p>
        </div>

        <br />
        <br />

        <div class="signatures">
            <!-- Left signature content goes here -->
            <p>VolunteerHub Management</p>

            <!-- Right signature content goes here -->
            <p>${event.beneficiaryName} Management</p>
        </div>
      </body>
    </html>
  `;
  
    let generatePdf = async () => {
      const file = await printToFileAsync({
        html: certificateHtml,
        base64: false
      });
      await shareAsync(file.uri);
    }

    try {
      generatePdf()
    } catch (certError) {
      Alert.alert("Error in generating Certificate!, " + certError)
    }

    Alert.alert(
      "Thank You",
      "Your request for Certificate of Completion for this event is successfully submitted."
    );
  }

  const takeAttendance = (event) => {

    //Checks if user is logged in.
    const currentUser = firebase.auth().currentUser;
    if (!currentUser) {
      console.log("User is not logged in!");
      return;
    }
    
    if (event.attendedBy.includes(currentUser.uid)) {
      Alert.alert("Hey There!", "You have already taken attendance for this event! If this is wrong, please contact the person in charge.");
    } else {
      // Confirm with the user if they want to take attendance
      Alert.alert(
        'Take Attendance',
        'Are you sure you want to take attendance for this event?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Confirm',
            onPress: () => {
              handleAttendanceTaking(event, setEvent, toggleTrue, setIsAttendanceButtonClicked, toggleFalse);
            },
          },
        ]
      );
    }
  };
  
  const handleAttendanceTaking = (event, setEvent, toggleTrue, setIsAttendanceButtonClicked, toggleFalse) => {
    console.log("Event is:", event.eventId);
    setEvent(event);
    toggleTrue();
    setIsAttendanceButtonClicked(true);
  
    Alert.alert(
      "Attendance QR Code",
      "Show the QR Code to the Organizer to mark your attendance!"
    );
  }

  const [isAttendanceButtonClicked, setIsAttendanceButtonClicked] = useState(false);

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

      // const eventsCollectionRef = firebase.firestore().collection('events');
      // const eventsDocRef = eventsCollectionRef.doc('eventId');
      // const unsubscribe = eventsDocRef.onSnapshot((snapshot) => {
      // const eventsData = snapshot.data();
      // const currentUser = firebase.auth().currentUser;
      // if (eventsData.attendedBy) {
      //   if (eventsData.attendedBy.includes(currentUser.uid)) {
      //     setShowAttendanceQRCodeModal(false);
      //   }
      //   setShowAttendanceQRCodeModal(false);
      // }
      // });
      // return unsubscribe;
    } else {
      console.log("User has logged out! Stop fetching UID (HomeScreen)")
    }
  }, [user])

  useEffect(() => {
    if (user && user.uid) {

      const unsubscribe = fetchEvents(setEvents);

      return () => unsubscribe();
    } else {
      console.log("Volunteer has logged out!(Activity Screen)");
    }
  }, [user]);

  //Data for Attendance QR Code
  const generateQRCodeData = () => {
    if (user && user.uid) {
      const qrCodeData = {
          volunteerId: firebase.auth().currentUser.uid,
          volunteerName: firstName,
          beneficiaryName: event.beneficiaryName,
          eventHours: event.eventHours,
          eventName: event.eventName,
          eventDescription: event.eventDescription,
          eventId: event.eventId,
      };
      return JSON.stringify(qrCodeData);
    } else {
      console.log("User has logged out. (generateQRCode Data)");
    }
  };

  return (
     <View style={styles.container}>
      <View style={styles.textView}>
        <Text style={styles.text}>Your Activites</Text>
        <Text style={styles.text}>Cumulative Hours Contributed: {calculateTotalHours(events)}</Text>
      </View>
          <Text style={styles.whiteSpaceText}>White Space.</Text>
          {/* {Platform.OS === "android" && ( */}
            <Searchbar
            placeholder="Search Beneficiary Name / Event"
            onChangeText={onChangeSearch}
            value={searchQuery}
            style={styles.searchBar}
            icon={() => <Ionicons name="search" size={20} />}
            clearIcon={() => <Ionicons name="close" size={20} />}
            />
          {/* )} */}
      {events.length > 0 ? (
        <FlatList
        data={filteredEvents(events, searchQuery)}
        keyExtractor={(item) => item.id }
        renderItem={({item}) => (
          <CardItem item={item} takeAttendance={takeAttendance} requestCertificate={requestCertificate}/>
        )}
        contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text style={styles.noEvents}>No Available Events found. Check out your enrolled/completed activities in Activity Screen.</Text>
      )}

      {/* Modal for Voucher QR Code */}
      {isAttendanceButtonClicked && (
                 
                 <Modal
                   visible={showAttendanceQRCodeModal}
                   animationType = "slide"
                   transparent={true}
                 >
                   <View style={styles.modalContent}>
                     <View style={styles.titleContainer}>
                         <Text style={styles.title}>Scan this QR code to Take your Attendance</Text>
                     </View>
                     <QRCodeWithLogo value={generateQRCodeData()} />
                     <Pressable onPress={() => toggleFalse()}>
                       <Text style={styles.closeButtonText}>Cancel</Text>
                     </Pressable>
                   </View>
                 </Modal>
                       
      )}

    <Text style={styles.whiteSpaceText}>White Space.</Text>
    <Text style={styles.whiteSpaceText}>White Space.</Text>
      
    </View> 
  )
};

const styles = StyleSheet.create({
  container: {
    alignContent: 'center',
    backgroundColor: 'white',
    justifyContent: 'center',
    flex: 0.95
  },
  listContainer: {
    flexGrow: 1,
  },
  text: {
    fontSize: 20,
    color: '#333333',
    fontWeight: 'bold',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textView: {
    alignItems: 'center'
  },
  title: {
    fontWeight: 'bold',
    marginVertical: 6,
    color: 'white',
  },
  title1: {
    fontWeight: 'bold',
    marginVertical: 6,
  },
  whiteSpaceText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  cardStyle: {
    marginTop: 20,
    marginHorizontal: 15,
    borderRadius: 10,
    backgroundColor: '#f6eee3',
  },
  noEvents: {
    fontSize: 16,
    textAlign: 'center',
  },
  
  searchBar: {
    backgroundColor: '#f6eee3',
  },
  fab: {
    marginTop: 5,
    backgroundColor: 'white',
  },
  modalContent: {
    height: '50%',
    width: '100%',
    backgroundColor: '#f26b8a',
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
    position: 'absolute',
    bottom: 0,
    alignItems: 'center', 
  },
  titleContainer: {
    height: '16%',
    backgroundColor: '#f26b8a',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    marginTop: 20,
    fontWeight: 'bold',
    padding: 15,
    backgroundColor: '#003d7c',
  }
})


export default ActivityScreen;