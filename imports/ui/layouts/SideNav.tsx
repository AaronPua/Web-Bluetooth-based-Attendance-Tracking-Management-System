import { EuiIcon, EuiSideNav, htmlIdGenerator } from '@elastic/eui';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';

function SideNav() {

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
                // forceOpen: true,
                // items: [
                //     {
                //         name: 'Instructors',
                //         id: htmlIdGenerator('instructorsPage')(),
                //         href: '/users',
                //     },
                //     {
                //         name: 'Students',
                //         id: htmlIdGenerator('studentsPage')(),
                //         href: '/users',
                //     }
                // ]
            },
            {
                name: 'Courses',
                id: htmlIdGenerator('coursesPage')(),
                icon: <EuiIcon type="list" />,
                onClick: (() => navigate('/courses')),
            }
        ],
    }];

    const instructorSideNavItems = [{
        name: 'Navigation',
        id: htmlIdGenerator('instructorNavigation')(),
        items: [
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

export default SideNav;