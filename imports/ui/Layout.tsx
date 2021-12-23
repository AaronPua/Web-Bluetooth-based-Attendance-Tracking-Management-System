import React, { Fragment } from 'react';
import {
  EuiPage,
  EuiPageContent,
  EuiPageContentBody,
  EuiPageHeader,
  EuiPageSideBar,
  EuiPageBody,
} from '@elastic/eui';
import Header from './Header';

function Layout({ sideNav }: any){
    return (
        <Fragment>
            <Header />
            <EuiPage paddingSize="none">
                <EuiPageSideBar paddingSize="l" sticky>
                    {sideNav}
                </EuiPageSideBar>

                <EuiPageBody panelled>
                    <EuiPageHeader
                        restrictWidth
                        iconType="logoElastic"
                        pageTitle="Page title"
                        // rightSideItems={[button]}
                        tabs={[{ label: 'Tab 1', isSelected: true }, { label: 'Tab 2' }]}
                    />
                    <EuiPageContent
                        hasBorder={false}
                        hasShadow={false}
                        paddingSize="none"
                        color="transparent"
                        borderRadius="none"
                    >
                        <EuiPageContentBody restrictWidth>Test</EuiPageContentBody>
                    </EuiPageContent>
                </EuiPageBody>
            </EuiPage>
        </Fragment>
    );
}

export default Layout;