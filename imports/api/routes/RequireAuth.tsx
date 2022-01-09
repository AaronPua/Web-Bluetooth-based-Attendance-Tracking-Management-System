import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Navigate } from 'react-router-dom';

export default function RequireAuth({children}: { children: JSX.Element }) {

    const user = useTracker(() => Meteor.user());
    
    return user ? children : <Navigate to='/login' />;
}