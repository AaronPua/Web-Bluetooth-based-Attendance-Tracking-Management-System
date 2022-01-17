import React, { Fragment } from 'react';
import { Outlet } from 'react-router';
import {
  EuiPage,
  EuiPageContent,
  EuiPageContentBody,
  EuiPageHeader,
  EuiPageSideBar,
  EuiPageBody,
} from '@elastic/eui';
import Header from './Header';
import SideNav from './SideNav';

export default function FullPageLayout() {
    return (
        <Fragment>
            <Header />
            <EuiPage paddingSize="none">
                <EuiPageSideBar paddingSize="l" sticky>
                    <SideNav />
                </EuiPageSideBar>

                <EuiPageBody panelled>
                    <EuiPageHeader
                        // restrictWidth
                        iconType="logoElastic"
                        pageTitle="Page title"
                        // rightSideItems={[button]}
                    />
                    <EuiPageContent
                        hasBorder={false}
                        hasShadow={false}
                        paddingSize="none"
                        color="plain"
                        borderRadius="none"
                    >
                        {/* <EuiPageContentBody>{content}</EuiPageContentBody> */}
                        <EuiPageContentBody>
                            <Outlet />
                        </EuiPageContentBody>
                    </EuiPageContent>
                </EuiPageBody>
            </EuiPage>
        </Fragment>
    );
}