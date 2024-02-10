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
      // if (eventName) {
      //   eventsQuery = eventsQuery.where('eventName', '==', eventName);
      // }
      const eventsQuerySnapshot = await eventsQuery.get();

      console.log("Events Query Snapshot: " + String(eventsQuerySnapshot))

      // Process the events and generate the report
      // Initialize report object
      const newReport = {
        numberOfEvents: eventsQuerySnapshot.size,
        numberOfEnrollments: 0,
        numberOfAttendance: 0,
        numberOfCertificatesRequested: 0,
        events: [],
      };

      // Process each event
      await Promise.all(eventsQuerySnapshot.docs.map(async (eventDoc) => {
        const eventData = eventDoc.data();
        const eventId = eventDoc.eventId;
        console.log("Event being reviewed: " + eventData)
        console.log("Event ID: " + eventId)
        console.log("Event Name: " + eventDoc.eventName)

        // Count number of enrollments
        newReport.numberOfEnrollments += eventData.usedBy.length;

        // Count number of attendance
        newReport.numberOfAttendance += eventData.attendedBy.length;

        // Count number of certificates requested
        newReport.numberOfCertificatesRequested += eventData.requestCertificate.length;

        // Query attendance collection for the event
        const attendanceQuerySnapshot = await firebase.firestore().collection('attendance')
          .where('eventId', '==', eventId)
          .get();

        // Retrieve participants for the event
        const participants = attendanceQuerySnapshot.docs.map((doc) => doc.data().uid);
        console.log("Participants: " + participants)

        // Add event details to the report
        newReport.events.push({
          eventId,
          eventName: eventData.name,
          participants,
        });
      }));

      // Update the state with the generated report
      setReport(newReport);
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  return (
    <GestureHandlerRootView>
      <ScrollView>
        <View style={styles.container} testID="test-id-container">
          <Text style={styles.text}>Welcome! </Text>

          <Text style={styles.radioButtonTitle}>Create your Volunteer Event here!</Text>

          <Card style={styles.volunteerCard} testID="dollar-card">
            <Card.Title title="Search your queries" titleStyle={styles.titleVoucher} testID="dollar-card"/>
            <Card.Content>
              {/* Input fields */}
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <TextInput
                  placeholder="Enter Event Name"
                  value={eventName}
                  onChangeText={setEventName}
                  style={{ marginBottom: 10 }}
                />

                <Card.Actions>
                  <Pressable style={styles.button2} onPress={() => setShowStartDatePicker(true)}>
                    <Text style={styles.text1}>Select Start Date</Text>
                  </Pressable>
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
                    textColor='white'
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
                    textColor='white'
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

          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {report ? (
            <>
              <Text>Number of Events: {report.numberOfEvents}</Text>
              <Text>Number of Enrollments: {report.numberOfEnrollments}</Text>
              <Text>Number of Attendance: {report.numberOfAttendance}</Text>
              <Text>Number of Certificates Requested: {report.numberOfCertificatesRequested}</Text>
              <Text>List of Events:</Text>
              {report.events.map((event) => (
                <View key={event.eventId}>
                  <Text>{event.eventName}</Text>
                  <Text>Participants: {event.participants.join(', ')}</Text>
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







    // <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    //   <TextInput
    //     placeholder="Enter Event Name"
    //     value={eventName}
    //     onChangeText={setEventName}
    //     style={{ marginBottom: 10 }}
    //   />
    //   <View style={{ flexDirection: 'row', marginBottom: 10 }}>
    //     <Button title="Select Start Date" onPress={() => setShowStartDatePicker(true)} />
    //     <Button title="Select End Date" onPress={() => setShowEndDatePicker(true)} />
    //   </View>
    //   {showStartDatePicker && (
    //     <DateTimePicker
    //       testID="startDatePicker"
    //       value={startDate || new Date()}
    //       mode="date"
    //       is24Hour={true}
    //       display="default"
    //       onChange={(event, selectedDate) => {
    //         setShowStartDatePicker(false);
    //         setStartDate(selectedDate);
    //         Alert.alert("Start Date selected: " + selectedDate)
    //       }}
    //     />
    //   )}
    //   {showEndDatePicker && (
    //     <DateTimePicker
    //       testID="endDatePicker"
    //       value={endDate || new Date()}
    //       mode="date"
    //       is24Hour={true}
    //       display="default"
    //       onChange={(event, selectedDate) => {
    //         setShowEndDatePicker(false);
    //         setEndDate(selectedDate);
    //       }}
    //     />
    //   )}


      // <Button title="Generate Report" onPress={generateReport} />

      // <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      // {report ? (
      //   <>
      //     <Text>Number of Events: {report.numberOfEvents}</Text>
      //     <Text>Number of Enrollments: {report.numberOfEnrollments}</Text>
      //     <Text>Number of Attendance: {report.numberOfAttendance}</Text>
      //     <Text>Number of Certificates Requested: {report.numberOfCertificatesRequested}</Text>
      //     <Text>List of Events:</Text>
      //     {report.events.map((event) => (
      //       <View key={event.eventId}>
      //         <Text>{event.eventName}</Text>
      //         <Text>Participants: {event.participants.join(', ')}</Text>
      //       </View>
      //     ))}
      //   </>
      // ) : (
      //   <Text>Loading report...</Text>
      // )}
      // </View>
  //   </View>
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
    padding: 15,
    borderRadius: 15,
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
    backgroundColor: 'blue',
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
  textInput3: {
    backgroundColor: '#f26b8a',
    fontSize: 15,
    fontWeight: "bold",
    width: '100%'
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
    marginVertical: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SettingsScreen;