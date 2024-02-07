import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { AuthContext } from '../../navigation/AuthProvider';
import { firebase } from '../../firebaseconfig';
import { Card, Searchbar, Button, Paragraph, FAB } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

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
        color='#003d7c'
      />
      <Button onPress={() => setShowMore(!showMore)}>{showMore ? "Show Less" : "Read More"}</Button>
    </Card.Actions>
  </Card>
  )
}

export const takeAttendance = ({ item }) => {
  return;
  // Modal and QR Code
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
  const {user, logout} = useContext(AuthContext);
  const [firstName, setFirstName] = useState('');
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
      console.log("Volunteer has logged out!(Activity Screen)");
    }
  }, [user]);

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
          <CardItem item={item} />
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
  }
})


export default ActivityScreen;