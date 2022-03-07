import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginForm from './components/auth/LoginForm';
import Home from './Home';
import RegistrationForm from './components/auth/RegistrationForm';
import UnknownRoute from './components/auth/UnknownRoute';
import FullPageLayout from './layouts/FullPageLayout';
import CenteredBody from './layouts/CenteredBody';
import RequireAuth from '../startup/client/routes/RequireAuth';
import VerifyEmail from './components/auth/VerifyEmail';
import VerifiedEmail from './components/auth/VerifiedEmail';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import Users from './Users';

export const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<FullPageLayout />} >
                    <Route path="/home" element={<RequireAuth><Home /></RequireAuth>} />
                    <Route path="/users" element={<Users />} />
                </Route>
                <Route element={<CenteredBody />} >
                    <Route path="/" element={<LoginForm />} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/sign-up" element={<RegistrationForm />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                    <Route path="/verify-email/:token" element={<VerifiedEmail />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />

                    {/* Using a "*" route (aka "splat route") to render a "not found" page when someone visits an unrecognized URL. */}
                    <Route path="*" element={<UnknownRoute />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};