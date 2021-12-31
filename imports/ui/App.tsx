import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { useNavigate } from "react-router-dom";
import LoginForm from './auth/LoginForm';

export const App = () => {

  const user = useTracker(() => Meteor.user());
  let navigate = useNavigate();

  return (
      <div>
          { user ? () => navigate("/home") : <LoginForm />}
      </div>
  );
};