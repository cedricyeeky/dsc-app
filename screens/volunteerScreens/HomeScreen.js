import React, { useContext, useEffect, useState } from 'react';
import { Alert, Image, Dimensions, Modal, Pressable, FlatList, View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
// import FormButton from '../../components/FormButton';
import { AuthContext } from '../../navigation/AuthProvider';
import { firebase } from '../../firebaseconfig';
import { Card, Searchbar, Button, Paragraph } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

export const CardItem = ({item, onSignUp}) => {

  const handleSignUp = (item) => {
    onSignUp(item); // Pass the event ID to the parent component to handle sign-up
  };
  
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
      <Button onPress={() => onSignUp(item)}>Sign Up</Button>
      <Button onPress={() => setShowMore(!showMore)}>{showMore ? "Show Less" : "Read More"}</Button>
    </Card.Actions>
  </Card>
  )
}

const fetchEvents = (setEvents) => {
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
        if (!eventData.usedBy || !eventData.usedBy.includes(userUid)) {
          data.push(eventData);
        }
      });
      setEvents(data);
    });
    return unsubscribe;
};

// export const fetchEvents = (setEvents) => {
//   const unsubscribe = firebase
//       .firestore()
//       .collection('events')
//       .orderBy('beneficiaryName', 'asc')
//       .onSnapshot((snapshot) => {
//         const data = [];
//         const userUid = firebase.auth().currentUser.uid; 
//         snapshot.forEach((doc) => {
//           data.push({ id: doc.id, ...doc.data()} );
//         });
//         if (!eventData.usedBy || !eventData.usedBy.includes(userUid)) {
//           data.push(eventData);
//         }
//       });
//       setEvents(data);
//         // console.log(data);
//     });

//   return unsubscribe;
// };

export const filteredEvents = (events, searchQuery) => {
  return events.filter((event) =>
    event.beneficiaryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.eventName.toLowerCase().includes(searchQuery.toLowerCase())
  );
};

const HomeScreen = () => {
  const {user, logout} = useContext(AuthContext)
  const [firstName, setFirstName] = useState('');
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const onChangeSearch = query => setSearchQuery(query);

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
      console.log("Seller has logged out!(Activity Screen)");
    }
  }, [user]);

  const handleSignUp = (item) => {
    const userUid = firebase.auth().currentUser.uid;
  
    // Update the Firebase document to add the user UID to the usedBy array
    firebase.firestore().collection('events').doc(item.eventId).update({
      usedBy: firebase.firestore.FieldValue.arrayUnion(userUid)
    })
    .then(() => {
      console.log('User signed up for event successfully');
      // After updating the document, remove the signed-up event from the events list
      setEvents(events.filter(event => event.id !== item.eventId));
    })
    .catch(error => {
      console.error('Error signing up for event:', error);
      // Handle error, if any
    });
    Alert.alert("You have pressed on sign up!", "Event Name is: " + item.eventName)
  };

  return (
     <View style={styles.container}>
      <View style={styles.textView}>
        <Text style={styles.text}>Welcome! {firstName}</Text>
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
          <CardItem item={item} onSignUp={handleSignUp}/>
        )}
        contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text style={styles.noEvents}>No Available Events found. Check out your enrolled/completed activities in Activity Screen.</Text>
      )}

    <Text style={styles.whiteSpaceText}>White Space.</Text>
    <Text style={styles.whiteSpaceText}>White Space.</Text>
      
    </View> 
  )
}


export default HomeScreen;

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
  },
  noEvents: {
    fontSize: 16,
    textAlign: 'center',
  },
  searchBar: {
    backgroundColor: '#f6eee3',
  }
})