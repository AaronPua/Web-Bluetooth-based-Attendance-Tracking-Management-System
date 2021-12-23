import { EuiSideNav, htmlIdGenerator } from '@elastic/eui';
import React, { useState } from 'react';

function SideNav() {

    const [isSideNavOpenOnMobile, setisSideNavOpenOnMobile] = useState(false);

    const toggleOpenOnMobile = () => {
        setisSideNavOpenOnMobile(!isSideNavOpenOnMobile);
    };

    const id = htmlIdGenerator('testExample')();

    const sideNavItems = [{
        name: 'Root item',
        id: id,
        items: [
            {
                name: 'First Item with href',
                id: id,
                href: '/#',
            },
            {
                name: 'Second Item with href',
                id: id,
                href: '/#',
            }
        ],
    }];

    return (
        <EuiSideNav
            aria-label="Basic example"
            mobileTitle="Basic example"
            toggleOpenOnMobile={() => toggleOpenOnMobile()}
            isOpenOnMobile={isSideNavOpenOnMobile}
            items={sideNavItems}
        />
    );
}

export default SideNav;