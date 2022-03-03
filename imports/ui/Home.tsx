import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker, useFind } from 'meteor/react-meteor-data';
import { EuiPageHeader, EuiPageContent, EuiPageContentBody } from '@elastic/eui';

function Home() {

    const user = useTracker(() => Meteor.user());
    // const allUsers = useFind(() => Meteor.users.find());

    return (
        <>
            <EuiPageHeader
                // restrictWidth
                iconType="logoElastic"
                pageTitle="Dashboard"
                // rightSideItems={[button]}
            />
            <EuiPageContent
                hasBorder={false}
                hasShadow={false}
                paddingSize="none"
                color="plain"
                borderRadius="none"
                grow={true}
            >
                {/* <EuiPageContentBody>{content}</EuiPageContentBody> */}
                <EuiPageContentBody>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <ul>
                        { user.profile.firstName }
                    </ul>
                </EuiPageContentBody>
            </EuiPageContent>
        </>
    );
}

export default Home;