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

  backgroundColor = selected ? 'rgba(255, 255, 255, 0.8)' : 'rgba(150, 150, 150, 0.5)'
  
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
    backgroundColor: '#F07B10',
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
            // image: 
            //   <Image 
            //     source = {require('../assets/NUShopLah!-logo.png')} 
            //     style={{
            //       resizeMode: "contain",
            //       height: 120,
            //       width: 350,
            //     }}
            //   />,
            title: 'Welcome to NUShopLah!',
            subtitle: 'Shopping in NUS has never been so enjoyable!',
          },
          {
            backgroundColor: '#ffffff',
            // image: <Image 
            // source={require('../assets/onboarding1.png')} 
            // style={{
            //   resizeMode: "contain",
            //   height: 100,
            //   width: 200,
            // }}
            // />,
            title: 'Personal QR/Barcode',
            subtitle: 'Just 1 scan away from earning points',
          },
          {
            backgroundColor: '#ffffff',
            // image: <Image 
            // source={require('../assets/onboarding2.png')} 
            // style={{
            //   resizeMode: "contain",
            //   height: 100,
            //   width: 200,
            // }}
            // />,
            title: 'Exchange Points for Rewards',
            subtitle: 'Get rewarded as you shop',
          },
          {
            backgroundColor: '#ffffff',
            // image: <Image 
            // source={require('../assets/onboarding3.png')} 
            // style={{
            //   resizeMode: "contain",
            //   height: 100,
            //   width: 200,
            // }}
            // />,
            title: 'Climb up the loyalty tier',
            subtitle: 'Shop more, Earn more',
          },
          {
            backgroundColor: '#ffffff',
            // image: <Image 
            // source={require('../assets/NUShopLah!.png')} 
            // style={{
            //   resizeMode: "contain",
            //   height: 100,
            //   width: 200,
            // }}
            // />,
            title: 'Welcome to Volunteer Hub!',
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