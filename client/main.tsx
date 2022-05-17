import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { App } from '/imports/ui/App';
import '@elastic/eui/dist/eui_theme_light.css';
import { EuiProvider } from '@elastic/eui';

Meteor.startup(() => {
    render(
        <EuiProvider colorMode="light">
            <App />
        </EuiProvider>
      , document.getElementById('react-target'));
});
