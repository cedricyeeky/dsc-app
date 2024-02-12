import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Modal, Dimensions, Pressable } from 'react-native';
import { Camera } from 'expo-camera';
import { FAB, Card, TextInput, RadioButton, PaperProvider, Button } from 'react-native-paper';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';

import { firebase } from '../../firebaseconfig';
import { AuthContext } from '../../navigation/AuthProvider';
import FormInput from '../../components/FormInput';
import FormButton from '../../components/FormButton';
import DateTimePicker from '@react-native-community/datetimepicker';

const SettingsScreen = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [eventName, setEventName] = useState('');
  const [report, setReport] = useState(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  useEffect(() => {
    generateReport();
  }, []);

  const generateReport = async () => {
    try {
      console.log("Generating Report...")
      // Prepare the start and end timestamps for the chosen time period
      const startTimestamp = startDate ? firebase.firestore.Timestamp.fromDate(startDate) : null;
      const endTimestamp = endDate ? firebase.firestore.Timestamp.fromDate(endDate) : null;
      
      console.log("Selected startDate: " + startDate)
      console.log("Selected endDate: " + endDate)
      console.log("Selected endTimestamp: " + endTimestamp)
      console.log("Selected endTimestamp: " + endTimestamp)
      // Query events collection based on filters
      let eventsQuery = firebase.firestore().collection('events');
      if (startTimestamp && endTimestamp) {
        eventsQuery = eventsQuery.where('eventStartDateTime', '>=', startTimestamp).where('eventStartDateTime', '<=', endTimestamp);
        console.log(eventsQuery)
      }

      const unsubscribe = eventsQuery.onSnapshot((snapshot) => {
        let numberOfEnrollments = 0;
        let numberOfAttendance = 0;
        let numberOfCertificatesRequested = 0;
        const data = [];

        snapshot.forEach((doc) => {
          const eventData = { id: doc.id, ...doc.data() };
          // Check if the user's UID is not in the usedBy array of the event
          data.push(eventData);

          // Count number of enrollments
          numberOfEnrollments += eventData.usedBy.length;

          // Count number of attendance
          numberOfAttendance += eventData.attendedBy.length;

          // Count number of certificates requested
          numberOfCertificatesRequested += eventData.requestCertificate.length;
        });

        const newReport = {
          numberOfEvents: data.length,
          numberOfEnrollments: numberOfEnrollments,
          numberOfAttendance: numberOfAttendance,
          numberOfCertificatesRequested: numberOfCertificatesRequested,
          events: data,
        };
        setReport(newReport);
      });

      return unsubscribe;
      
      // Update the state with the generated report
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  return (
    <GestureHandlerRootView>
      <ScrollView>
        <View style={styles.container} testID="test-id-container">
          <Text style={styles.text}>Welcome! </Text>

          <Text style={styles.radioButtonTitle}>Generate Volunteerism Insights here!</Text>

          <Card style={styles.volunteerCard} testID="dollar-card">
            <Card.Title title="Search your queries" titleStyle={styles.titleVoucher} testID="dollar-card"/>
            <Card.Content>
              {/* Input fields */}
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                <Card.Actions>
                  <Pressable style={styles.button2} onPress={() => setShowStartDatePicker(true)}>
                    <Text style={styles.text1}>Select Start Date</Text>
                  </Pressable>
                </Card.Actions>

                <Card.Actions>
                  <Pressable style={styles.button2} onPress={() => setShowEndDatePicker(true)}>
                    <Text style={styles.text1}>Select End Date</Text>
                  </Pressable>
                </Card.Actions>

                {showStartDatePicker && (
                  <DateTimePicker
                    testID="startDatePicker"
                    value={startDate || new Date()}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowStartDatePicker(false);
                      setStartDate(selectedDate);
                      Alert.alert("Start Date selected:", selectedDate.toDateString())
                    }}
                  />
                )}
                {startDate &&
                  <TextInput
                    style={styles.textInput3}
                    label="Selected Start Date"
                    value={startDate.toDateString()}
                    selectionColor='white'
                    cursorColor='white'
                    activeUnderlineColor='white'
                    textColor='black'
                    textAlign="center"
                    multiline= {true}
                  />
                }

                {showEndDatePicker && (
                  <DateTimePicker
                    testID="endDatePicker"
                    value={endDate || new Date()}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowEndDatePicker(false);
                      setEndDate(selectedDate);
                      Alert.alert("End Date selected:", selectedDate.toDateString())
                    }}
                  />
                )}

                {endDate &&
                  <TextInput
                    style={styles.textInput3}
                    label="Selected End Date"
                    value={endDate.toDateString()}
                    selectionColor='white'
                    cursorColor='white'
                    activeUnderlineColor='white'
                    textColor='black'
                    textAlign="center"
                    multiline= {true}
                  />
                }
              </View>

              <Card.Actions>
                  <Pressable style={styles.button2} onPress={() => generateReport()}>
                    <Text style={styles.text1}>Generate Report</Text>
                  </Pressable>
                </Card.Actions>
            </Card.Content>
          </Card>

          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'left' }}>
          {report ? (
            <>
            <Text style={styles.whiteSpaceText}>White Space.</Text>
            <Text style={styles.text2}>Number of Events: {report.numberOfEvents}</Text>
            <Text style={styles.text2}>Number of Enrollments: {report.numberOfEnrollments}</Text>
            <Text style={styles.text2}>Number of Attendance: {report.numberOfAttendance}</Text>
            <Text style={styles.text2}>Number of Certificates Requested: {report.numberOfCertificatesRequested}</Text>
            <Text style={styles.whiteSpaceText}>White Space.</Text>
              
              <Text style={styles.text2}>List of Events:</Text>
              {report.events.map((event) => (
              <View key={event.eventId}>
                <Card style={styles.cardStyle}>
              <Card.Content>
                <Text style={styles.title}>{event.eventName}</Text>
                <Text style={styles.title}>Participants: {event.attendedBy.join(', ')}</Text>
            </Card.Content>

            </Card>
              </View>
            



      
           
              ))}
            </>
          ) : (
            <Text>Loading report...</Text>
          )}
          </View>

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
    marginTop: 10,
    backgroundColor: "#bf281f",
    alignItems: 'center',
    padding: 15,
    borderRadius: 15,
  },
  cardStyle: {
    marginTop: 20,
    width: '90%',
    marginHorizontal: 15,
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
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  text1: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  text2: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black',
    marginVertical: 5,
  },
  title: {
    fontWeight: 'bold',
    marginVertical: 6,
  },
  textInput3: {
    backgroundColor: 'white',
    fontSize: 15,
    fontWeight: "bold",
    width: '100%',
    marginVertical: 10,
  },
  radioButtonTitle: {
    marginTop: 40,
    marginBottom: 5,
    fontSize: 20,
    fontWeight: 'bold',
  },
  titleVoucher: {
    fontSize: 20,
    color: 'white',
    marginTop: 20,
  },
  whiteSpaceText: {
    fontSize: 16,
    marginVertical: 15,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
