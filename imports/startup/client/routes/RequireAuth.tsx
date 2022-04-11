import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Navigate } from 'react-router-dom';

export default function RequireAuth({ children }: { children: JSX.Element }) {

    const userId = useTracker(() => Meteor.userId());

    if(Roles.userIsInRole(userId, 'student')) {
        Meteor.logout();
        return <Navigate to='/' state={{ accessDenied: 'You do not have proper access to login'}} />;
    }
    
    return userId ? children : <Navigate to='/' state={{ loginFirst: 'You need to log in first'}} />;
}