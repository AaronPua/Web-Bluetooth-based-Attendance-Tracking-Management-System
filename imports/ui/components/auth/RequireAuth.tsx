import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Navigate } from 'react-router-dom';

export const RequireAuth = ({ children }: { children: JSX.Element }) => {

    const userId = useTracker(() => Meteor.userId());

    if(Roles.userIsInRole(userId, 'student')) {
        Meteor.logout();
        return <Navigate to='/' state={{ accessDenied: 'You do not have proper permissions to access' }} />;
    }
    
    return userId ? children : <Navigate to='/' state={{ loginFirst: 'You must log in to access this area' }} />;
}