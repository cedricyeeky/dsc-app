import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { AuthContext } from '../../navigation/AuthProvider';
import { firebase } from '../../firebaseconfig';
import { Card, Button, Paragraph } from 'react-native-paper';

export const CardItem = ({item}) => {

  const [showMore, setShowMore] = useState(false)
  return (
    <Card style={styles.cardStyle}>
    <Card.Cover source={{ uri: item.eventImage }} />
      <Card.Content>
        <Text style={styles.title}>Beneficiary: {item.beneficiaryName}</Text>
        <Text style={styles.title}>Event: {item.eventName}</Text>
        <Text style={styles.title}>No. of Hours: {item.eventHours}</Text>
        <Text style={styles.title}>Created On: {getDateOfEvent(item.timeStamp)}</Text>
        <Paragraph numberOfLines={showMore ? 0 : 2}>Event Description: {item.eventDescription}</Paragraph>
    </Card.Content>
    <Card.Actions>
      <Button onPress={() => handleCancelEvent(item.id)} buttonColor='red' textColor='white'>Cancel Event</Button>
    </Card.Actions>
    <Card.Actions>
      <Button onPress={() => setShowMore(!showMore)} buttonColor='white'>{showMore ? "Show Less" : "Read More"}</Button>
    </Card.Actions>
  </Card>
  )
}

export const getDateOfEvent = (timestamp) => {
  //console.log(timestamp);
  if (timestamp) {
    // return timestamp.toDate().toLocaleString();
    return timestamp.toDate().toDateString();
  } else {
    console.log("timestamp does not exist for this voucher YET. Might be due to lagging. Try again a few seconds later")
  }
}

export const handleCancelEvent = (eventId) => {
  Alert.alert(
    'Cancel Event',
    'Are you sure you want to cancel this event?',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Confirm',
        onPress: () => deleteEvent(eventId),
        style: 'destructive',
      },
    ],
    { cancelable: true }
  );
};

export const deleteEvent = (eventId) => {
  firebase
    .firestore()
    .collection('events')
    .doc(eventId)
    .delete()
    .then(() => {
      console.log('Event deleted successfully.');
    })
    .catch((error) => {
      console.log('Error deleting voucher:', error);
    });
};

export const fetchEvents = (setEvents) => {
  const unsubscribe = firebase
      .firestore()
      .collection('events')
      .orderBy('timeStamp', 'desc')
      .onSnapshot((snapshot) => {
        const data = [];
        snapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() });
        });
        setEvents(data);
      });

  return unsubscribe;
}

const ActivityScreen = () => {
  const { user, logout } = useContext(AuthContext);
  const [firstName, setFirstName] = useState('');
  const [events, setEvents] = useState([]);

  useEffect(() => {
    console.log("(Seller Accounts) useEffect1 running...");
    if (user && user.uid) {
      firebase
      .firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          setFirstName(snapshot.data().firstName);
          console.log(firstName);
        } else {
          console.log('User does not exist');
        }
      })
      .catch((error) => {
        console.log('Error getting user:', error);
      });
    } else {
      console.log("Seller has logged out. (Activity Screen)");
    }
  }, [user]);

  useEffect(() => {
    console.log("(Seller Account) sorting vouchers useEffect running...");
    if (user && user.uid) {

      const unsubscribe = fetchEvents(setEvents);

      return () => unsubscribe();
    } else {
      console.log("Seller has logged out. No need to load vouchers (Activity Screen)")
    }
  }, [user]);

  return (
      <View style={styles.container}>
        <Text style={styles.text}>Events</Text>
        {events.length > 0 ? (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={({item}) => (
            <CardItem item={item}/>
          )}
          contentContainerStyle={styles.listContainer}
        />

        ) : (
          <Text style={styles.noEvents}>No Events found.</Text>
        )}

      </View>
   
  );
};

const styles = StyleSheet.create({
  button: {
    marginHorizontal: 20,
    borderRadius: 10,
  },
  cancelText: {
    marginTop: 20,
    marginHorizontal: 20,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 20,
    textAlign: 'center',
  },
  container: {
    backgroundColor: '#fff',
    padding: 15,
    flex: 0.9,
  },
  listContainer: {
    flexGrow: 1,
  },
  noEvents: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20,
    marginLeft: 16,
  },
  whiteSpaceText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#fff',
    fontWeight: 'bold',
  },
  cardStyle: {
    marginTop: 20,
    marginHorizontal: 15,
    borderRadius: 10,
  },
  title: {
    fontWeight: 'bold',
    marginVertical: 6,
    color: 'black',
  },
});

export default ActivityScreen;