import { Meteor } from 'meteor/meteor';
import React from 'react';
import { useNavigate } from "react-router-dom";
import {
  EuiHeader,
  EuiHeaderLink,
  EuiHeaderLinks,
  EuiHeaderLogo,
  EuiHeaderSectionItem
} from '@elastic/eui';

export default function Header() {

    let navigate = useNavigate();

    const logout = () => { 
        Meteor.logout();
        navigate('/');
    };

    return (
        <EuiHeader position="static">
            <EuiHeaderSectionItem border="right">
                <EuiHeaderLogo>Elastic</EuiHeaderLogo>
            </EuiHeaderSectionItem>

            <EuiHeaderSectionItem>
                <EuiHeaderLinks aria-label="App navigation links example">
                    <EuiHeaderLink onClick={logout}>Log Out</EuiHeaderLink>
                </EuiHeaderLinks>
            </EuiHeaderSectionItem>
        </EuiHeader>
    );
}