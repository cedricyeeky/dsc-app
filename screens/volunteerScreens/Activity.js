import React, { useContext, useEffect, useState } from 'react';
import { Alert, View, Text, Modal, StyleSheet, Pressable, FlatList } from 'react-native';
import { AuthContext } from '../../navigation/AuthProvider';
import { firebase } from '../../firebaseconfig';
import { Card, Searchbar, Button, Paragraph, FAB } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import QRCodeWithLogo from '../../components/QRCodeWithLogo';

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

export const CardItem = ({item, takeAttendance}) => {

  const [showMore, setShowMore] = useState(false)
  return (
    <Card style={styles.cardStyle}>
    <Card.Cover source={{ uri: item.eventImage }} />
      <Card.Content>
        <Text style={styles.title}>{item.beneficiaryName}</Text>
        <Text style={styles.title}>{item.eventName}</Text>
        <Text style={styles.title}>No. of Hours: {item.eventHours}</Text>
        <Paragraph numberOfLines={showMore ? 0 : 2}>{item.eventDescription}</Paragraph>
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
      <Button onPress={() => setShowMore(!showMore)}>{showMore ? "Show Less" : "Read More"}</Button>
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

  const takeAttendance = (event) => {

    //Checks if user is logged in.
    const currentUser = firebase.auth().currentUser;
    if (!currentUser) {
      console.log("User is not logged in!");
      return;
    }
    
    if (!event.usedBy.includes(currentUser.uid)) {
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
          <CardItem item={item} takeAttendance={takeAttendance}/>
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
    marginTop: 15,
    padding: 2,
    backgroundColor: 'white',
  },
  modalContent: {
    height: '50%',
    width: '100%',
    backgroundColor: '#f07b10',
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
    position: 'absolute',
    bottom: 0,
    alignItems: 'center', 
  },
  titleContainer: {
    height: '16%',
    backgroundColor: '#f07b10',
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