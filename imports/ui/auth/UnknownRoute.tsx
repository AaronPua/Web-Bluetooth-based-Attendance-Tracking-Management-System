import React from 'react';
import { useNavigate } from "react-router-dom";
import { EuiButton, EuiEmptyPrompt } from '@elastic/eui';

function UnknownRoute() {

    let navigate = useNavigate();

    return (
        <EuiEmptyPrompt
            title={<h2>You have arrived at an unknown page.</h2>}
            color="plain"
            body={
                <p>Click the button below to go back to the Home page.</p>
            }
            actions={
                <EuiButton fill color="primary" type="submit" onClick={() => navigate('/')}>Home</EuiButton>
            }
        />
    );
}

export default UnknownRoute;