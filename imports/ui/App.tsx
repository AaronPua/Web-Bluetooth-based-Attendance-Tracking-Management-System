import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import LoginForm from './components/auth/Login';
import Home from './Home';
import RegistrationForm from './components/auth/Registration';
import UnknownRoute from './components/auth/UnknownRoute';
import FullPageLayout from './layouts/FullPageLayout';
import CenteredBody from './layouts/CenteredBody';
import RequireAuth from '../startup/client/routes/RequireAuth';
import VerifyEmail from './components/auth/VerifyEmail';
import VerifiedEmail from './components/auth/VerifiedEmail';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import Users from './components/users/Users';
import Courses from './components/courses/Courses';
import Course from './components/courses/Course';
import Lesson from './components/lessons/Lesson';
import Lessons from './components/lessons/Lessons';
import Students from './components/users/Students';
import Beacons from './components/beacons/Beacons';
import Beacon from './components/beacons/Beacon';
import User from './components/users/User';
import Instructors from './components/users/Instructors';

export const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<FullPageLayout />} >
                    <Route path="home" element={<RequireAuth><Home /></RequireAuth>} />
                    <Route path="users" element={<Users />} />
                    <Route path="user/:userId" element={<User />} />
                    <Route path="courses" element={<Outlet />} >
                        <Route index element={<Courses />} />
                        <Route path=":courseId" element={<Course />} />
                        <Route path=":courseId/lessons/" element={<Lessons />} />
                        <Route path=":courseId/lessons/:lessonId" element={<Lesson />} />
                        <Route path=":courseId/students/" element={<Students />} />
                        <Route path=":courseId/instructors/" element={<Instructors />} />
                        <Route path=":courseId/beacons/" element={<Beacons />} />
                        <Route path=":courseId/beacons/:beaconId" element={<Beacon />} />
                    </Route>
                </Route>
                <Route element={<CenteredBody />} >
                    <Route path="/" element={<LoginForm />} />
                    <Route path="register" element={<RegistrationForm />} />
                    <Route path="verify-email" element={<VerifyEmail />} />
                    <Route path="verify-email/:token" element={<VerifiedEmail />} />
                    <Route path="forgot-password" element={<ForgotPassword />} />
                    <Route path="reset-password/:token" element={<ResetPassword />} />

                    {/* Using a "*" route (aka "splat route") to render a "not found" page when someone visits an unrecognized URL. */}
                    <Route path="*" element={<UnknownRoute />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};