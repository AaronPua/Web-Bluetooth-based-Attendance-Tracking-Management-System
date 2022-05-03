import React, { useEffect, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { EuiPageHeader, EuiPageContent, EuiPageContentBody, EuiFlexGroup, EuiFlexItem,
    EuiPanel, EuiTitle, EuiSpacer, EuiStat, EuiSplitPanel, EuiButton } from '@elastic/eui';
import { BeaconsCollection } from '../../../api/beacons/BeaconsCollection';
import { CoursesCollection } from '../../../api/courses/CoursesCollection';
import { LessonsCollection } from '../../../api/lessons/LessonsCollection';
import { useNavigate } from 'react-router-dom';
import _ from 'underscore';
import { Roles } from 'meteor/alanning:roles';

export const Home = () => {

    let navigate = useNavigate();

    const [isUserAdmin, setIsUserAdmin] = useState(false);

    const { usersCount, adminsCount, instructorsCount, studentsCount, coursesCount, lessonsCount, beaconsCount,
            userCoursesCount, userCoursesLessonsCount, userCoursesBeaconsCount } = useTracker(() => {
        Meteor.subscribe('users.all');
        const usersCount = Meteor.users.find().count();

        Meteor.subscribe('users.admins');
        const adminsCount = Meteor.users.find({ 'role.role._id': 'admin' }).count();

        Meteor.subscribe('users.instructors');
        const instructorsCount = Meteor.users.find({ 'role.role._id': 'instructor' }).count();

        Meteor.subscribe('users.students');
        const studentsCount = Meteor.users.find({ 'role.role._id': 'student' }).count();

        Meteor.subscribe('courses.all');
        const coursesCount = CoursesCollection.find().count();

        Meteor.subscribe('lessons.all');
        const lessonsCount = LessonsCollection.find().count();

        Meteor.subscribe('beacons.all');
        const beaconsCount = BeaconsCollection.find().count();

        Meteor.subscribe('courses.currentUser');
        const userCoursesCount = CoursesCollection.find().count();
        const userCourses = CoursesCollection.find().fetch();
        const userCourseIds = _.pluck(userCourses, '_id');

        Meteor.subscribe('lessons.forMultipleCourses', userCourseIds);
        const userCoursesLessonsCount = LessonsCollection.find({ courseId: { $in: userCourseIds } }).count();

        Meteor.subscribe('beacons.forMultipleCourses', userCourseIds);
        const userCoursesBeaconsCount = BeaconsCollection.find({ courseId: { $in: userCourseIds } }).count();

        return { usersCount, adminsCount, instructorsCount, studentsCount, coursesCount, lessonsCount, beaconsCount,
            userCoursesCount, userCoursesLessonsCount, userCoursesBeaconsCount };
    });

    useEffect(() => {
        setIsUserAdmin(Roles.userIsInRole(Meteor.userId(), 'admin'));
    }, []);

    return (
        <>
            <EuiPageHeader
                pageTitle="Home"
            />
            <EuiPageContent
                hasBorder={false}
                hasShadow={false}
                paddingSize="none"
                color="plain"
                borderRadius="none"
                grow={true}
            >
                <EuiPageContentBody>
                    { Roles.userIsInRole(Meteor.userId(), 'admin') &&
                        <EuiFlexGroup>
                            <EuiFlexItem>
                                <EuiPanel>
                                    <EuiTitle size="s">
                                        <h4>Users</h4>
                                    </EuiTitle>
                                    <EuiSpacer />
                                    <EuiSplitPanel.Outer hasShadow={false}>
                                        <EuiSplitPanel.Inner color="primary">
                                            <EuiStat
                                                title={usersCount}
                                                description=""
                                                textAlign="center"
                                            />
                                        </EuiSplitPanel.Inner>
                                        <EuiSplitPanel.Inner>
                                            <EuiFlexGroup justifyContent="spaceAround">
                                                <EuiFlexItem grow={false}>
                                                    <EuiButton color="primary" size="s" onClick={() => navigate('/users')}>View Users</EuiButton>
                                                </EuiFlexItem>
                                            </EuiFlexGroup>
                                        </EuiSplitPanel.Inner>
                                    </EuiSplitPanel.Outer>
                                </EuiPanel>
                            </EuiFlexItem>

                            <EuiFlexItem>
                                <EuiPanel>
                                    <EuiTitle size="s">
                                        <h4>Admins</h4>
                                    </EuiTitle>
                                    <EuiSpacer />
                                    <EuiSplitPanel.Outer hasShadow={false}>
                                        <EuiSplitPanel.Inner color="primary">
                                            <EuiStat
                                                title={adminsCount}
                                                description=""
                                                textAlign="center"
                                            />
                                        </EuiSplitPanel.Inner>
                                        <EuiSplitPanel.Inner>
                                            <EuiFlexGroup justifyContent="spaceAround">
                                                <EuiFlexItem grow={false}>
                                                    <EuiButton color="primary" size="s" onClick={() => navigate('/users/admins')}>View Admins</EuiButton>
                                                </EuiFlexItem>
                                            </EuiFlexGroup>
                                        </EuiSplitPanel.Inner>
                                    </EuiSplitPanel.Outer>
                                </EuiPanel>
                            </EuiFlexItem>

                            <EuiFlexItem>
                                <EuiPanel>
                                    <EuiTitle size="s">
                                        <h4>Instructors</h4>
                                    </EuiTitle>
                                    <EuiSpacer />
                                    <EuiSplitPanel.Outer hasShadow={false}>
                                        <EuiSplitPanel.Inner color="primary">
                                            <EuiStat
                                                title={instructorsCount}
                                                description=""
                                                textAlign="center"
                                            />
                                        </EuiSplitPanel.Inner>
                                        <EuiSplitPanel.Inner>
                                            <EuiFlexGroup justifyContent="spaceAround">
                                                <EuiFlexItem grow={false}>
                                                    <EuiButton color="primary" size="s" onClick={() => navigate('/users/instructors')}>View Instructors</EuiButton>
                                                </EuiFlexItem>
                                            </EuiFlexGroup>
                                        </EuiSplitPanel.Inner>
                                    </EuiSplitPanel.Outer>
                                </EuiPanel>
                            </EuiFlexItem>

                            <EuiFlexItem>
                                <EuiPanel>
                                    <EuiTitle size="s">
                                        <h4>Students</h4>
                                    </EuiTitle>
                                    <EuiSpacer />
                                    <EuiSplitPanel.Outer hasShadow={false}>
                                        <EuiSplitPanel.Inner color="primary">
                                            <EuiStat
                                                title={studentsCount}
                                                description=""
                                                textAlign="center"
                                            />
                                        </EuiSplitPanel.Inner>
                                        <EuiSplitPanel.Inner>
                                            <EuiFlexGroup justifyContent="spaceAround">
                                                <EuiFlexItem grow={false}>
                                                    <EuiButton color="primary" size="s" onClick={() => navigate('/users/students')}>View Students</EuiButton>
                                                </EuiFlexItem>
                                            </EuiFlexGroup>
                                        </EuiSplitPanel.Inner>
                                    </EuiSplitPanel.Outer>
                                </EuiPanel>
                            </EuiFlexItem>
                        </EuiFlexGroup>
                    }

                    { Roles.userIsInRole(Meteor.userId(), 'admin') && <EuiSpacer /> }

                    <EuiFlexGroup>
                        <EuiFlexItem>
                            <EuiPanel>
                                <EuiTitle size="s">
                                    <h4>Courses</h4>
                                </EuiTitle>
                                <EuiSpacer />
                                <EuiSplitPanel.Outer hasShadow={false}>
                                    <EuiSplitPanel.Inner color="success">
                                        <EuiStat
                                            title={ isUserAdmin ? coursesCount : userCoursesCount }
                                            description=""
                                            textAlign="center"
                                        />
                                    </EuiSplitPanel.Inner>
                                    <EuiSplitPanel.Inner>
                                        <EuiFlexGroup justifyContent="spaceAround">
                                            <EuiFlexItem grow={false}>
                                                <EuiButton color="success" size="s" onClick={() => navigate('/courses')}>View Courses</EuiButton>
                                            </EuiFlexItem>
                                        </EuiFlexGroup>
                                    </EuiSplitPanel.Inner>
                                </EuiSplitPanel.Outer>
                            </EuiPanel>
                        </EuiFlexItem>

                        <EuiFlexItem>
                            <EuiPanel>
                                <EuiTitle size="s">
                                    <h4>Lessons</h4>
                                </EuiTitle>
                                <EuiSpacer />
                                <EuiSplitPanel.Outer hasShadow={false}>
                                    <EuiSplitPanel.Inner color="accent">
                                        <EuiStat
                                            title={ isUserAdmin ? lessonsCount : userCoursesLessonsCount }
                                            description=""
                                            textAlign="center"
                                        />
                                    </EuiSplitPanel.Inner>
                                    <EuiSplitPanel.Inner>
                                        <EuiFlexGroup justifyContent="spaceAround">
                                            <EuiFlexItem grow={false}>
                                                <EuiButton color="accent" size="s" onClick={() => navigate('/lessons')}>View Lessons</EuiButton>
                                            </EuiFlexItem>
                                        </EuiFlexGroup>
                                    </EuiSplitPanel.Inner>
                                </EuiSplitPanel.Outer>
                            </EuiPanel>
                        </EuiFlexItem>

                        <EuiFlexItem>
                            <EuiPanel>
                                <EuiTitle size="s">
                                    <h4>Beacons</h4>
                                </EuiTitle>
                                <EuiSpacer />
                                <EuiSplitPanel.Outer hasShadow={false}>
                                    <EuiSplitPanel.Inner color="danger">
                                        <EuiStat
                                            title={ isUserAdmin ? beaconsCount : userCoursesBeaconsCount }
                                            description=""
                                            textAlign="center"
                                        />
                                    </EuiSplitPanel.Inner>
                                    <EuiSplitPanel.Inner>
                                        <EuiFlexGroup justifyContent="spaceAround">
                                            <EuiFlexItem grow={false}>
                                                <EuiButton color="danger" size="s" onClick={() => navigate('/beacons')}>View Beacons</EuiButton>
                                            </EuiFlexItem>
                                        </EuiFlexGroup>
                                    </EuiSplitPanel.Inner>
                                </EuiSplitPanel.Outer>
                            </EuiPanel>
                        </EuiFlexItem>
                    </EuiFlexGroup>
                </EuiPageContentBody>
            </EuiPageContent>
        </>
    );
}