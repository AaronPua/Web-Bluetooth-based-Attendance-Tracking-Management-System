import React from 'react';
import FullPageLayout from './layout/FullPageLayout';
import SideNav from './layout/SideNav';

function Home() {

    return (
        <FullPageLayout 
            sideNav={<SideNav />} 
            content={
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
            }
        />
    );
}

export default Home;