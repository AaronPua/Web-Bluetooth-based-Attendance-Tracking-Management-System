import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import './Icons';
import { FullPageLayout, CenteredBody } from './layouts/index';
import { Login, Home, Registration, UnknownRoute, RequireAuth, VerifyEmail, VerifiedEmail, 
    ForgotPassword, ResetPassword, Users, User, Courses, Course, Lessons, Lesson, Students, 
    Beacons, Beacon, Instructors, Attendance } from './components/index';

export const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<FullPageLayout />} >
                    <Route path="home" element={<RequireAuth><Home /></RequireAuth>} />
                    <Route path="users" element={<RequireAuth><Users /></RequireAuth>} />
                    <Route path="user/:userId" element={<RequireAuth><User /></RequireAuth>} />
                    <Route path="courses" element={<Outlet />} >
                        <Route index element={<RequireAuth><Courses /></RequireAuth>} />
                        <Route path=":courseId" element={<RequireAuth><Course /></RequireAuth>} />
                        <Route path=":courseId/lessons/" element={<RequireAuth><Lessons /></RequireAuth>} />
                        <Route path=":courseId/lessons/:lessonId" element={<RequireAuth><Lesson /></RequireAuth>} />
                        <Route path=":courseId/students/" element={<RequireAuth><Students /></RequireAuth>} />
                        <Route path=":courseId/students/:userId/attendance" element={<RequireAuth><Attendance /></RequireAuth>} />
                        <Route path=":courseId/instructors/" element={<RequireAuth><Instructors /></RequireAuth>} />
                        <Route path=":courseId/beacons/" element={<RequireAuth><Beacons /></RequireAuth>} />
                        <Route path=":courseId/beacons/:beaconId" element={<RequireAuth><Beacon /></RequireAuth>} />
                    </Route>
                </Route>
                <Route element={<CenteredBody />} >
                    <Route path="/" element={<Login />} />
                    <Route path="register" element={<Registration />} />
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