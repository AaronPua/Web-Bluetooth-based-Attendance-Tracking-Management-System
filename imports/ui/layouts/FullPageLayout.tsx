import React from 'react';
import { Outlet } from 'react-router';
import { EuiPage, EuiPageSideBar, EuiPageBody } from '@elastic/eui';
import Header from './Header';
import SideNav from './SideNav';

export default function FullPageLayout() {
    return (
        <>
            <Header />
            <EuiPage paddingSize="none" grow={true} style={{ minHeight: '100vh' }}>
                <EuiPageSideBar paddingSize="l" sticky>
                    <SideNav />
                </EuiPageSideBar>

                <EuiPageBody panelled>
                    <Outlet/>
                </EuiPageBody>
            </EuiPage>
        </>
    );
}