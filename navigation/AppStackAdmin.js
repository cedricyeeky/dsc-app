import React from 'react';
import { Dimensions } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

//Screens for Customers to see
import HomeScreen from '../screens/adminScreens/HomeScreen';
import ActivityScreen from '../screens/adminScreens/Activity';
import Scanner from '../screens/adminScreens/Scanner';
import SettingsScreen from '../screens/adminScreens/SettingsScreen';

//Screen Names
const homeName = "Home";
const activityName = "Activity";
const scannerName = "Scan QR";
const accountName = "Account";

//const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const deviceWidth = Math.round(Dimensions.get('window').width);
const deviceHeight = Math.round(Dimensions.get('window').height);

const AppStackAdmin = () => {
    return (
    
      <Tab.Navigator 
        initialRouteName={homeName}
        screenOptions={{
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: '#fec5e5',
          tabBarLabelStyle: { fontSize: 14},
          tabBarStyle: { 
            padding: 10,
            paddingBottom: 20,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            elevation: 0,
            backgroundColor: '#f26b8a',
            borderRadius: 0,
            height: deviceHeight * 0.10,
          }

        }}
          
        >

        <Tab.Screen 
          name={homeName} 
          component={HomeScreen} 
          options={{
            tabBarActiveTintColor: 'white',
            tabBarInactiveTintColor: '#fec5e5',
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              iconName = focused ? 'home' : 'home-outline';
              return <Ionicons name={iconName} size={size} color={color} />;
            }
            
          }}/>
        <Tab.Screen 
          name={activityName}
          component={ActivityScreen}
          options={{
            tabBarActiveTintColor: 'white',
            tabBarInactiveTintColor: '#fec5e5',
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              iconName = focused ? 'receipt' : 'receipt-outline';
              return <Ionicons name={iconName} size={size} color={color} />;
            }
          }} />
        <Tab.Screen 
          name={scannerName} 
          component={Scanner}
          options={{
            tabBarActiveTintColor: 'white',
            tabBarInactiveTintColor: '#fec5e5',
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              iconName = focused ? 'scan' : 'scan-outline';
              return <Ionicons name={iconName} size={size} color={color} />;
            }
          }} />
        <Tab.Screen 
          name={accountName} 
          component={SettingsScreen}
          options={{
            tabBarActiveTintColor: 'white',
            tabBarInactiveTintColor: '#fec5e5',
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              iconName = focused ? 'person-circle' : 'person-circle-outline';
              return <Ionicons name={iconName} size={size} color={color} />;
            }
          }} />

        </Tab.Navigator>
    
  )
}

export default AppStackAdmin;