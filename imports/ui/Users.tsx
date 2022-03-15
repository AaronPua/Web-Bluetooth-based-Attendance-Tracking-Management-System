import { Meteor } from 'meteor/meteor';
import { useSubscribe, useFind } from 'meteor/react-meteor-data';
import React from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';

export default function Users() {

    const isLoading = useSubscribe('users.all');
    const allUsers = useFind(() => Meteor.users.find());
    // console.log(allUsers);

    const columns: TableColumn<Meteor.User>[] = [
        {
            name: 'First Name',
            selector: row => row.profile.firstName,
        },
        {
            name: 'Last Name',
            selector: row => row.profile.lastName,
        },
        {
            name: 'Email',
            selector: row => row.emails[0].address,
        },
        {
            name: 'Email Verified?',
            selector: row => row.emails[0].verified,
            format: row => (row.emails[0].verified).toString() == 'true' ? 'yes' : 'no'
        },
        {
            name: 'Gender',
            selector: row => row.profile.gender,
        },
    ];

    return (
        <>
            <DataTable
                columns={columns}
                data={allUsers}
                progressPending={isLoading()}
                pagination
                striped
                responsive
            />
        </>
    );
}