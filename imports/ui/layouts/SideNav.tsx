import { EuiIcon, EuiSideNav, htmlIdGenerator } from '@elastic/eui';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

export const SideNav = () => {

    const navigate = useNavigate();

    const [isSideNavOpenOnMobile, setisSideNavOpenOnMobile] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const toggleOpenOnMobile = () => {
        setisSideNavOpenOnMobile(!isSideNavOpenOnMobile);
    };

    const adminSideNavItems = [{
        name: 'Navigation',
        id: htmlIdGenerator('adminNavigation')(),
        items: [
            {
                name: 'Users',
                id: htmlIdGenerator('usersPage')(),
                icon: <EuiIcon type="users" />,
                onClick: (() => navigate('/users')),
                forceOpen: true,
                items: [
                    {
                        name: 'Admins',
                        id: htmlIdGenerator('adminsPage')(),
                        onClick: (() => navigate('/users/admins')),
                    },
                    {
                        name: 'Instructors',
                        id: htmlIdGenerator('instructorsPage')(),
                        onClick: (() => navigate('/users/instructors')),
                    },
                    {
                        name: 'Students',
                        id: htmlIdGenerator('studentsPage')(),
                        onClick: (() => navigate('/users/students')),
                    }
                ]
            },
            {
                name: 'Beacons',
                id: htmlIdGenerator('beaconsPage')(),
                icon: <EuiIcon type="online" />,
                onClick: (() => navigate('/beacons')),
            },
            {
                name: 'Lessons',
                id: htmlIdGenerator('lessonsPage')(),
                icon: <EuiIcon type="editorOrderedList" />,
                onClick: (() => navigate('/lessons')),
            },
            {
                name: 'Courses',
                id: htmlIdGenerator('coursesPage')(),
                icon: <EuiIcon type="list" />,
                onClick: (() => navigate('/courses')),
            },
        ],
    }];

    const instructorSideNavItems = [{
        name: 'Navigation',
        id: htmlIdGenerator('instructorNavigation')(),
        items: [
            {
                name: 'Beacons',
                id: htmlIdGenerator('beaconsPage')(),
                icon: <EuiIcon type="online" />,
                onClick: (() => navigate('/beacons')),
            },
            {
                name: 'Lessons',
                id: htmlIdGenerator('lessonsPage')(),
                icon: <EuiIcon type="editorOrderedList" />,
                onClick: (() => navigate('/lessons')),
            },
            {
                name: 'Courses',
                id: htmlIdGenerator('coursesPage')(),
                icon: <EuiIcon type="list" />,
                onClick: (() => navigate('/courses')),
            }
        ],
    }];

    Meteor.setTimeout(() => {
        if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
            setIsAdmin(true);
        }
    }, 1000);

    const sideNavItems = isAdmin ? adminSideNavItems : instructorSideNavItems;

    return (
        <EuiSideNav
            aria-label="Navigation"
            mobileTitle="Navigation"
            toggleOpenOnMobile={() => toggleOpenOnMobile()}
            isOpenOnMobile={isSideNavOpenOnMobile}
            items={sideNavItems}
        />
    );
}