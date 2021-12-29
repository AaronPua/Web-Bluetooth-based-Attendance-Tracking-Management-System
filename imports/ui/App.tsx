import { Meteor } from 'meteor/meteor';
import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import LoginForm from './login/LoginForm';
import Layout from './Layout';
import SideNav from './SideNav';

export const App = () => {

  const user = useTracker(() => Meteor.user());

  return (
    <div>
      { user ? (
        // <h1>Welcome to Meteor!</h1>
        <Layout sideNav={<SideNav/>}/>
      ) : (
        <LoginForm/>
      )}
    </div>
  );
};