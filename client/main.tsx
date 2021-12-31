import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { App } from '/imports/ui/App';
import '@elastic/eui/dist/eui_theme_light.css';
import { EuiProvider } from '@elastic/eui';
import RegistrationForm from '/imports/ui/auth/RegistrationForm';
import Home from '/imports/ui/Home';

Meteor.startup(() => {
    render(
        <EuiProvider colorMode="light">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App />} />
                    <Route path="/sign-up" element={<RegistrationForm />} />
                    <Route path="/home" element={<Home />} />
                </Routes>
            </BrowserRouter>
        </EuiProvider>
      , document.getElementById('react-target'));
});
