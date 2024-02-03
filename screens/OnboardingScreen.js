import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';

//Props
/**
 * Dots component used as dot indicators for the onboarding screens.
 *
 * @param {Object} selected - Indicates if the dot is currently selected.
 * @returns {JSX.Element} Dot indicator.
 */
const Dots = ({ selected }) => {
  let backgroundColor;

  backgroundColor = selected ? 'rgba(255, 55, 255, 0.8)' : 'rgba(150, 150, 150, 0.5)'
  
  return (
      <View 
        style = {{
          width: 6,
          height: 6,
          marginHorizontal: 3,
          backgroundColor,
          borderRadius: 5,
        }}
        testID='dot-0'
      />
  )
}

/**
 * Skip button component with customized styling.
 *
 * @param {Object} props - Button properties.
 * @returns {JSX.Element} Skip button.
 */
const Skip = ({...props}) => (
<TouchableOpacity 
  style = {{
    marginHorizontal : 15,
    backgroundColor: 'red',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  }}
  {...props}
  testID="skip-button"
>
  <Text style = {{
      fontSize : 16,
      color: 'white',
      fontWeight: 'bold',
    }}>SKIP</Text>
</TouchableOpacity>
)

/**
 * Next button component with customized styling.
 *
 * @param {Object} props - Button properties.
 * @returns {JSX.Element} Next button.
 */
const Next = ({...props}) => (
<TouchableOpacity 
  style = {{
    marginHorizontal : 15,
    backgroundColor: '#D27678',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  }}
  {...props}
  testID="next-button"
>
  <Text 
    style = {{
      fontSize : 16,
      color: 'white',
      fontWeight: 'bold',
    }}>Next</Text>
</TouchableOpacity>
)

/**
 * Done button component with customized styling.
 *
 * @param {Object} props - Button properties.
 * @returns {JSX.Element} Done button.
 */
const Done = ({...props}) => (
<TouchableOpacity 
    style = {{
      marginHorizontal : 15,
      backgroundColor: 'green',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 10,
    }}
    {...props}
    testID="done-button"
>
    <Text style = {{
      fontSize : 16,
      color: 'white',
      fontWeight: 'bold',
    }}>Done</Text>
</TouchableOpacity>
)

//Main Onboarding Screen Codes
/**
 * Main OnboardingScreen component.
 *
 * @param {Object} navigation - Navigation object.
 * @returns {JSX.Element} Onboarding screen component.
 */
const OnboardingScreen = ({navigation}) => {
    return (
        <Onboarding
        SkipButtonComponent={Skip}
        NextButtonComponent={Next}
        DoneButtonComponent={Done}
        DotComponent={Dots}
        onSkip={() => navigation.replace("Login")}
        onDone={() => navigation.navigate("Login")}
        pages={[
          {
            backgroundColor: "#ffffff",
            image: 
              <Image 
                source = {require('../assets/VolunteerHub.png')} 
                style={{
                  resizeMode: "contain",
                  height: 240,
                  width: 700,
                }}
              />,
            // title: 'Welcome to VolunteerHub!',
            subtitle: 'By Volunteers, For Volunteers.',
          },
          {
            backgroundColor: '#ffffff',
            image: <Image 
            source={require('../assets/Personalised_qr_crop.png')} 
            style={{
              resizeMode: "contain",
              height: 240,
              width: 480,
            }}
            />,
            title: 'Personal QR/ID',
            subtitle: 'Easy Attendance Taking',
          },
          {
            backgroundColor: '#ffffff',
            image: <Image 
            source={require('../assets/SampleCertificate.png')} 
            style={{
              resizeMode: "contain",
              height: 240,
              width: 360,
              borderColor: 'black',
              borderWidth: 3,
            }}
            />,
            title: 'Simple and Reliable Certification',
            subtitle: 'Get credited for your efforts!',
          },
          {
            backgroundColor: '#ffffff',
            image: <Image 
            source={require('../assets/ActivityManagement.jpg')} 
            style={{
              resizeMode: "contain",
              height: 240,
              width: 360,
              borderColor: 'black',
              borderWidth: 3,
            }}
            />,
            title: 'Manage your Volunteer Activities',
            subtitle: 'Enroll, Volunteer, Repeat.',
          },
          {
            backgroundColor: '#ffffff',
            image: <Image 
            source={require('../assets/VolunteerHub.png')} 
            style={{
              resizeMode: "contain",
              height: 240,
              width: 700,
            }}
            />,
            title: 'Welcome to VolunteerHub!',
            subtitle: '',
          },
        ]}
        />
    );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});