import { EuiSideNav, htmlIdGenerator } from '@elastic/eui';
import React, { useState } from 'react';

function SideNav() {

    const [isSideNavOpenOnMobile, setisSideNavOpenOnMobile] = useState(false);

    const toggleOpenOnMobile = () => {
        setisSideNavOpenOnMobile(!isSideNavOpenOnMobile);
    };

    const sideNavItems = [{
        name: 'Root item',
        id: htmlIdGenerator('testExample0')(),
        items: [
            {
                name: 'First Item with href',
                id: htmlIdGenerator('testExample1')(),
                href: '/#',
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
            aria-label="Basic example"
            mobileTitle="Basic example"
            toggleOpenOnMobile={() => toggleOpenOnMobile()}
            isOpenOnMobile={isSideNavOpenOnMobile}
            items={sideNavItems}
        />
    );
}

export default SideNav;