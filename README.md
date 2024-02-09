# Value Proposition
	
**Volunteer Hub** is a platform to seamlessly bridge both volunteers and event organizers. It allows volunteers to gain access to a wider array of volunteering activity, streamline the process of enrolling and getting a certificate, while at the same time simplifying the managerial role of the event organizers by providing a more efficient way of handling forms, attendance, and ultimately generating a report.

## User Stories
### Role: Volunteer

| No | Action  (I can ...)                             | Outcome  (So that I can ...)                                         |
|----|-------------------------------------------------|----------------------------------------------------------------------|
| 1  | Tap on list of available VAs                   | View details on each VAs like duration, date, description, eligibility, etc. |
| 2  | Enroll in a VA if eligible                     | Start volunteering                                                   |
| 3  | Request for cancellation of participation      | Opt out from the VA                                                  |
| 4  | Request for Certificate of Completion          | Keep it as a record                                                  |
| 5  | See how many hours clocked for VA               | Estimate my time and efforts in VAs                                   |
| 6  | Generate a Session QR Code for a VA            | Have my attendance recorded by NPO Administrators’ side              |



### Role: NPO Administrator

| No | Action  (I can ...)                                      | Outcome  (So that I can ...)                                                                 |
|----|----------------------------------------------------------|----------------------------------------------------------------------------------------------|
| 1  | Create a new VA in a particular category                 | Allow volunteers to browse for VAs available                                                |
| 2  | View each Volunteer’s details                            | Conduct verification checks if needed                                                        |
| 3  | Scan Unique Session QR Codes from Volunteers             | Mark Attendance of Volunteers                                                                |
| 4  | Generate CSV Report on a VA                              | Do record keeping efficiently                                                                |
| 5  | Customize Form Templates for Different VAs               | Collect specific information from volunteers based on the requirements of each activity, ensuring efficient coordination and resource allocation. |
| 6  | Review Volunteers Feedback and suggestion (To be implemented) | Evaluate the overall performance of the current system (To be implemented)               |

# Features
## Overview of Features

For our VolunteerHub App, there will be two main user types: Volunteers and Admins. The app works as a platform for the two to interact with each other. 
For both types, there are 3 key features.

# Key Feature of Volunteers
1. Activity Enrollment - Volunteers can look at the descriptions of each activity and enroll with a click of a button.
2. Attendance Submission - Volunteers can then attend these activities, and their attendance will be easily recorded by the admins through scanning their personal QR code.
3. Certificate Generation - Upon completion of the activity, volunteers can generate the certificates from _____. The level of participation will also be reflected in the certificates through recorded accumulation of volunteering hours.

# Key Feature of Administrators
1. Event Creation - Administrators can use a form template depending on the type of activity, and fill in the key details. Upon submission, it will be collated with other activities for interested volunteers to enroll in.
2. Attendance Tracking - On the activity day, the Administrator can use the app to record the attendance of interested volunteers by scanning their personal QR code. The attendance details will be uploaded back into the database
3. Report Generation - Administrators can generate a report of a volunteering activity to analyze how a particular activity has performed. 

## Completed Features
General
Onboarding Screen
For first time users
Overview of the key functions
Login Screen
Email and Password fields
“Forgot password” function (Changing password email will be sent)
Error checking:
Press Sign In w/o email or password (Login Error)
Press Sign In with key details incorrectly / filled halfway (Login Error) 
Press Forgot Password w/o filling up email textbox (Password Error)
Sign Up Screen
Email, Full Name, Password and Confirm Password fields
Include Password Constraints and Field Checking 
Volunteer or Admin option
Upon confirmation, Verification email will be sent
Volunteer
Home Screen
Welcome header with volunteer name
Search bar to find beneficiary name / activity name
List of available activities to be scrolled
Each activity shows picture, title, subtitle, description, number of hours to commit
Sign Up button to sign up activity
Read More button for more details
Activity Screen
Cumulative Hours indicator to show amount of volunteer hours done
Search bar to find enrolled beneficiary name / activity name
List of enrolled activities
Attendance personal QR code to be scanned by administrator
Request certificate button to request certificate after activity is completed
Read More button for more details
Personal ID Screen
Settings Screen
Logout button
Administrator
Home Screen
Welcome header with administrator name
Logout button
Volunteer Form template
Event Name, Beneficiary Name, Volunteer Hours, Event Description fields
Choose Image button
Create button
Scan QR button to be redirected to Scanner Screen
Activity Screen
Overview of created activities
Read More option and Cancel Event option
Scanner Screen
Request for camera permission
Scan QR code area
Account Screen

# Developers Guide

## 0. Prerequisites to be installed:
- “Expo Go” app on phone (install from Google Play Store or App Store)
- npm
- Node.js
- git
- gitbash

## 1. Clone this repository

On gitbash, navigate to the folder you would like to place the cloned repository in. After doing so, run the command:

```
git clone https://github.com/cedricyeeky/dsc-app.git
```

## 2. Install dependencies

Open up the project in VScode or any preferred code editor. In the terminal, run:

```
npm install
```

This should install all the node.js dependencies required for the project. Also ensure you install the react-native-dot-env package using the command:

```
npm i react-native-dotenv
```

This package is required to run the .env file which contains the API keys to access and use our firebase database. Please contact either Freddy or Cedric for the .env file.

After installing the react-native-dot-env package, place the .env file in the root directory of the project folder.

(NOTE: Only proceed to the next step once you have uploaded the .env file)

## 3. Download the Expo Go app on IOS / Android

In the terminal, input the command:

```
npx expo start --tunnel
```

(NOTE: Please only start the tunnel after you have put in the .env file in the root directory; else it will render invalid API keys due to the file not being read yet)

Scan the QR code on your phone camera app and wait for the project to build.
You may start using and testing our app after that!

# Tech Stack

## React Native (Front End)
It was decided that the product is going to come in the form of a mobile app since many of the volunteers would likely find it more convenient to have a separate phone app for managing volunteer activity on the go rather than having to log into a website. React Native was chosen for the framework to develop the phone app. 

## Firebase (Back End)
Google Firebase has also been successfully incorporated into the app to store and manage user data for authentication (email and password login). Firebase is utilized for authentication of new users and password recovery of old users through verification emails. Furthermore, Firebase’s Firestore Feature was employed to group user data into different collections and Storage Feature was used to store photos.

# Limitations
## Limited Firebase Storage space, bandwidth, and other API calls
The application has a restrictive daily limit of 1GB of bandwidth for using Firebase Cloud Storage. The bandwidth is used to render images of the activities. Hence, this will be an issue when the amount of created activities increases or the number of Administrators and Volunteers users to login and view the activities increases. The consequence of exceeding the bandwidth is the halt of image rendering. Although the application will not crash or hang, this can impact QR code generations. It means that volunteers will not be able to render QR code images to be scanned for attendance. 

The current solution is to maximize the usage of the FlatList component for rendering the images. This ensures the images are loaded only when scrolling and to be viewed on a device’s screen. However, this is not a permanent solution as the user base grows. Another workaround is to only allow images with small file sizes.  

Another potential restriction is the overall storage space limit of 5GB. Currently, about ____ of space has been occupied. As the user base increases and the application usage progresses, it will exceed the storage space limit soon. Image uploading will be disabled and user sign ups will have errors.

A general solution to these issues is to upgrade the project in the Firebase into a paid-account version (Firebase Spark Account). This will lift the bandwidth and storage usage limits, and also limits on API calls such as retrieving and reading user data from Firestore. This solution can be explored if this project can be recognised for its potential.

## Restrictive Requirement of iOS Build
Expo Go was used as the host server to build this application. While it was seamless to build for Android APK, there were obstacles in building the application in the iOS version. To have an iOS build, the application has to be submitted to the Apple App Store to publish it. This process requires an Apple Developer Account, which requires payment. Furthermore, publishing an app to Apple Play Store requires app credentials and the signing of certain policy agreements with the Apple App Store. Hence, building in the iOS version is too restrictive and time consuming to build this application within the given timeframe. This would only be explored in the future if the project is chosen to be explored further for public use.

Therefore, only an Android APK version of the VolunteerHub app is possible, and anyone with iOS devices will need to clone or download the source code from the GitHub repository. They also need to request environment variable files from us (developers) to be able to use the application. Any inconvenience caused is sincerely regretted.

## Additional optional limitations (To be deleted if necessary):
### No form to include a volunteer’s interests and skill sets such as:
- On ground volunteering
- Photography, Videography
- Art
- Craft
- Language skills – English/mandarin/Malay/Bengali/Tamil/Telugu/Others
- Performing skills (vocal, instruments, dance, etc)
- Sports
- Teaching (academics, skills they possess, computer literacy, art, craft, languages, reading, public speaking, others)
- Leading an activity, planning
- Driving, with or without own vehicle
- Admin backend tasks such as digital marketing, volunteer engagement, video/photo editing, website management (WIX), managing the volunteer management tool, accounting, content writing, Publicity material creation (posters, videos, reels, blogs), sign up forms (jotform, wix forms), others

### Have not captured other volunteer fields such as:
- Name (as in NRIC/FIN/Passport)
- Email
- Whatsapp ph no
- Date of birth
- Gender
- Occupation
- School if studying
- Educational background
- Availability (in terms of days of the week, time of the day, other ad-hoc etc)
- Driving/ non driving
- Own vehicle / not
- Skills you possess that are relevant
- Interests in volunteering (what type of volunteering do you want to do)
- Commitment level – ad hoc/regular If regular – weekly, monthly, How many hours
- Immigration status : Citizen, PR, EP, DP, LOC, WP, Visitor

### Does not have deadline to register for activity
The attendance report of one volunteer across a time period
Reports by available demographics (age, gender, work status, immigration status, interests or skills) to understand volunteer behavior and response,
Generate volunteer activity report by months or types of volunteering activities
