import React, { Fragment } from 'react';
import FullPageLayout from './layout/FullPageLayout';
import Header from './layout/Header';
import SideNav from './layout/SideNav';

function Home() {

    return (
        <Fragment>
            <Header />
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
        </Fragment>
    );
}

export default Home;