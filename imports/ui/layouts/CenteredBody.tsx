import React from 'react';
import { Outlet } from 'react-router';
import {
  EuiPage,
  EuiPageContent,
  EuiPageBody,
} from '@elastic/eui';

export const CenteredBody = () => {
    return (
        <EuiPage paddingSize="none">
            <EuiPageBody paddingSize="l">
                <EuiPageContent
                    verticalPosition="center"
                    horizontalPosition="center"
                    paddingSize="none"
                >
                    <Outlet />
                </EuiPageContent>
            </EuiPageBody>
        </EuiPage>
    );
}