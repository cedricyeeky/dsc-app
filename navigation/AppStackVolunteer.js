import React from 'react';
import { Dimensions } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

//Screens for Customers to see
import HomeScreen from '../screens/volunteerScreens/HomeScreen';
import ActivityScreen from '../screens/volunteerScreens/Activity';
import IdScreen from '../screens/volunteerScreens/IdScreen';
import SettingsScreen from '../screens/volunteerScreens/SettingsScreen';

//Screen Names
const homeName = "Home";
const activityName = "Activity";
const idName = "Personal ID";
const accountName = "Account";

const Tab = createBottomTabNavigator();

const deviceWidth = Math.round(Dimensions.get('window').width);
const deviceHeight = Math.round(Dimensions.get('window').height);

const AppStackVolunteer = () => {
    return (

      <Tab.Navigator 
        initialRouteName={homeName}
        screenOptions={{
          tabBarActiveTintColor: '#f07b10',
          tabBarInactiveTintColor: 'white',
          tabBarLabelStyle: { fontSize: 12 , justifyContent: 'center', alignItems: 'center',},
          tabBarStyle: { 
            padding: 10,
            paddingBottom: 20,
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            elevation: 0,
            backgroundColor: '#003d7c',
            borderRadius: 0,
            height: deviceHeight * 0.10,
            alignItems: 'center',
            justifyContent: 'center',
          }
        }}
          
        >

        <Tab.Screen 
          name={homeName} 
          component={HomeScreen} 
          options={{
            tabBarActiveTintColor: '#f07b10',
            tabBarInactiveTintColor: 'white',
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              iconName = focused ? 'home' : 'home-outline';
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarTestID:'TEST_ID_HOME_BUTTON',
          }}
          />
        <Tab.Screen 
          name={activityName}
          component={ActivityScreen}
          options={{
            tabBarActiveTintColor: '#f07b10',
            tabBarInactiveTintColor: 'white',
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              iconName = focused ? 'receipt' : 'receipt-outline';
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarTestID:'TEST_ID_ACTIVITY_BUTTON',
          }} />
        <Tab.Screen 
          name={idName} 
          component={IdScreen}
          options={{
            tabBarActiveTintColor: '#f07b10',
            tabBarInactiveTintColor: 'white',
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              iconName = focused ? 'qr-code' : 'qr-code-outline';
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarTestID:'TEST_ID_PERSONALID_BUTTON',
          }} />
        <Tab.Screen 
          name={accountName} 
          component={SettingsScreen}
          options={{
            tabBarActiveTintColor: '#f07b10',
            tabBarInactiveTintColor: 'white',
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              iconName = focused ? 'person-circle' : 'person-circle-outline';
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarTestID:'TEST_ID_ACCOUNT_BUTTON',
          }} />

        </Tab.Navigator>
    )
}

export default AppStackVolunteer;
