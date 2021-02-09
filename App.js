/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import 'react-native-gesture-handler';
import Navigation from './src/navigation'

import  {withAuthenticator} from 'aws-amplify-react-native';
import {Auth, API, graphqlOperation} from 'aws-amplify';

import {createUser} from './src/graphql/mutations';
import {getUser} from './src/graphql/queries';

const randomImages = [
  'https://hieumobile.com/wp-content/uploads/avatar-among-us-2.jpg',
  'https://hieumobile.com/wp-content/uploads/avatar-among-us-3.jpg',
  'https://hieumobile.com/wp-content/uploads/avatar-among-us-6.jpg',
  'https://hieumobile.com/wp-content/uploads/avatar-among-us-9.jpg',
];

const getRandomImage = () => {
  return randomImages[Math.floor(Math.random() * randomImages.length)];
}


const App: () => React$Node = () => {
  useEffect(() =>{
    const fetchUser = async () => {
      //get currently user
      const userInfo = await Auth.currentAuthenticatedUser({bypassCache: true})
     if(!userInfo) {
        return;
      }

      //check if the user exists in DB
      const getUserResponse = await API.graphql(
        graphqlOperation(getUser,{id: userInfo.attributes.sub}),
        );

      if(getUserResponse.data.getUser) {
        console.log("User Alredy exist in DB");
        return;
      }
      //if doesn't its newly registered user
      //Then, create a new user in DB
      const newUser = {
        id: userInfo.attributes.sub,
        username: userInfo.username,
        email: userInfo.attributes.email,
        imageUri: getRandomImage(),
      };
      await API.graphql(
        graphqlOperation(
          createUser,
          {input: newUser}
        )
      )
    };
    
    fetchUser();
  }, []);

  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{flex: 1, backgroundColor: 'black'}}>
              <Navigation />
      </SafeAreaView>
    </>
  );
};


export default withAuthenticator(App);
