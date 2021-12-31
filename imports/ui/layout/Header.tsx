import React from 'react';
import {
  EuiHeader,
  EuiHeaderLogo,
  EuiHeaderSectionItem
} from '@elastic/eui';

function Header() {
    return (
        <EuiHeader position="static">
            <EuiHeaderSectionItem border="right">
                <EuiHeaderLogo>Elastic</EuiHeaderLogo>
            </EuiHeaderSectionItem>
        </EuiHeader>
    );
}

export default Header;