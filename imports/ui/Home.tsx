import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker, useSubscribe, useFind } from 'meteor/react-meteor-data';
import { EuiPageHeader, EuiPageContent, EuiPageContentBody } from '@elastic/eui';

function Home() {

    const isLoading = useSubscribe('users.all');
    const allUsers = useFind(() => Meteor.users.find({}));

    return (
        <>
            <EuiPageHeader
                pageTitle="Dashboard"
            />
            <EuiPageContent
                hasBorder={false}
                hasShadow={false}
                paddingSize="none"
                color="plain"
                borderRadius="none"
                grow={true}
            >
                <EuiPageContentBody>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    { isLoading() && <div className="loading">loading...</div> }
                    <ul className="tasks">
                        {allUsers.map(user => (
                            <li key={user._id}>
                                <span>{user.profile.firstName}</span>
                            </li>
                        ))}
                    </ul>
                </EuiPageContentBody>
            </EuiPageContent>
        </>
    );
}

export default Home;