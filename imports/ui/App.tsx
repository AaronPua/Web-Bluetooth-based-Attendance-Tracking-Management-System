import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginForm from './auth/LoginForm';
import Home from './Home';
import RegistrationForm from './auth/RegistrationForm';
import UnknownRoute from './auth/UnknownRoute';
import FullPageLayout from './layout/FullPageLayout';
import CenteredBody from './layout/CenteredBody';
import RequireAuth from '../api/routes/RequireAuth';
import VerifyEmail from './auth/VerifyEmail';
import VerifiedEmail from './auth/VerifiedEmail';

export const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<FullPageLayout />} >
                    <Route path="/home" element={<RequireAuth><Home /></RequireAuth>} />
                </Route>
                <Route element={<CenteredBody />} >
                    <Route path="/" element={<LoginForm />} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/sign-up" element={<RegistrationForm />} />
                    <Route path="/verify-email" element={<VerifyEmail />}>
                        <Route path="/verify-email/:token" element={<VerifiedEmail />} />
                    </Route>

                    {/* Using a "*" route (aka "splat route") to render a "not found" page when someone visits an unrecognized URL. */}
                    <Route path="*" element={<UnknownRoute />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};