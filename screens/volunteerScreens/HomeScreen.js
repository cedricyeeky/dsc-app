import React, { useContext, useEffect, useState } from 'react';
import { Alert, Image, Dimensions, Modal, Pressable, FlatList, View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import FormButton from '../../components/FormButton';
import { AuthContext } from '../../navigation/AuthProvider';
import { firebase } from '../../firebaseconfig';
import { Card, Searchbar, Button, Paragraph } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

export const CardItem = ({item}) => {
  
  const [showMore, setShowMore] = useState(false)
  return (
    <Card style={styles.cardStyle}>
    <Card.Cover source={{ uri: item.eventImage }} />
      <Card.Content>
        <Card.Title title={item.beneficiaryName} />
        <Card.Title title={item.eventName} />
        <Text>{item.eventHours}</Text>
        <Paragraph numberOfLines={3}>{item.eventDescription}</Paragraph>
    </Card.Content>
    <Card.Actions>
      <Button onPress={() => setShowMore(!showMore)}>{showMore ? "Show Less" : "Read More"}</Button>
    </Card.Actions>
  </Card>
  )
}

export const fetchEvents = (setEvents) => {
  const unsubscribe = firebase
      .firestore()
      .collection('events')
      .orderBy('beneficiaryName', 'asc')
      .onSnapshot((snapshot) => {
        const data = [];
        snapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data()} );
        });
        // console.log(data);
        setEvents(data);
      });

  return unsubscribe;
};

export const filteredEvents = (events, searchQuery) => {
  return events.filter((event) =>
    event.beneficiaryName.toLowerCase().includes(searchQuery.toLowerCase())
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



  return (
     <View>
      <Text style={styles.text}>Welcome! {firstName}</Text>
          <Text style={styles.whiteSpaceText}>White Space.</Text>
          <FormButton buttonTitle='Logout' onPress={logout} />
          <Text style={styles.whiteSpaceText}>White Space.</Text>
      {events.length > 0 ? (
        <FlatList
        data={events}
        keyExtractor={(item) => item.id }
        renderItem={({item}) => (
          <CardItem item={item} />
        )}
        />
      ) : (
        <Text style={styles.noEvents}>No Events found.</Text>
      )}
      
    </View> 
  )
}


export default HomeScreen;

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    color: '#333333',
    fontWeight: 'bold',
  },
  whiteSpaceText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  cardStyle: {
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 10
  },
  noEvents: {
    fontSize: 16,
    textAlign: 'center',
  }
})