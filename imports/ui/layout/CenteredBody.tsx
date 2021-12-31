import React from 'react';
import {
  EuiPage,
  EuiPageContent,
  EuiEmptyPrompt,
  EuiPageBody,
} from '@elastic/eui';

function CenteredBody({title, body, color, actions, footer}: any) {
    return (
        <EuiPage paddingSize="none">
            <EuiPageBody paddingSize="l">
                <EuiPageContent
                    verticalPosition="center"
                    horizontalPosition="center"
                    paddingSize="none"
                >
                <EuiEmptyPrompt
                    title={title}
                    body={body}
                    color={color}
                    actions={actions}
                    footer={footer}
                />
                </EuiPageContent>
            </EuiPageBody>
        </EuiPage>
    );
}

export default CenteredBody;