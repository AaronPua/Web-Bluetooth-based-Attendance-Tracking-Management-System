import { EuiSideNav, htmlIdGenerator } from '@elastic/eui';
import React, { useState } from 'react';

function SideNav() {

    const [isSideNavOpenOnMobile, setisSideNavOpenOnMobile] = useState(false);

    const toggleOpenOnMobile = () => {
        setisSideNavOpenOnMobile(!isSideNavOpenOnMobile);
    };

    const sideNavItems = [{
        name: 'Navigation',
        id: htmlIdGenerator('navigation')(),
        items: [
            {
                name: 'Users',
                id: htmlIdGenerator('usersPage')(),
                href: '/users',
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
                href: '/courses',
            }
        ],
    }];

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