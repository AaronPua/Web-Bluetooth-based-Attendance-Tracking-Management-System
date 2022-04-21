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

export const Header = () => {

    let navigate = useNavigate();

    const logout = () => { 
        Meteor.logout(() => {
            navigate('/');
        });
    };

    return (
        <EuiHeader position="static">
            <EuiHeaderSectionItem border="right">
                <EuiHeaderLogo iconType="managementApp" type='button' onClick={() => navigate('/home')} style={{ cursor: "pointer" }}>
                    COMP8047
                </EuiHeaderLogo>
            </EuiHeaderSectionItem>

            <EuiHeaderSectionItem>
                <EuiHeaderLinks>
                    <EuiHeaderLink iconType="exit" onClick={logout}>Log Out</EuiHeaderLink>
                </EuiHeaderLinks>
            </EuiHeaderSectionItem>
        </EuiHeader>
    );
}