import { EuiSideNav, htmlIdGenerator } from '@elastic/eui';
import React, { useState } from 'react';

function SideNav() {

    const [isSideNavOpenOnMobile, setisSideNavOpenOnMobile] = useState(false);

    const toggleOpenOnMobile = () => {
        setisSideNavOpenOnMobile(!isSideNavOpenOnMobile);
    };

    const sideNavItems = [{
        name: 'Navigation',
        id: htmlIdGenerator('testExample0')(),
        items: [
            {
                name: 'Users',
                id: htmlIdGenerator('usersTab')(),
                href: '/users',
            },
            {
                name: 'Second Item with href',
                id: htmlIdGenerator('testExample2')(),
                href: '/#',
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