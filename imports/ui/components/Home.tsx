import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { EuiPageHeader, EuiPageContent, EuiPageContentBody, EuiFlexGroup, EuiFlexItem,
    EuiPanel, EuiTitle, EuiSpacer, EuiStat, EuiSplitPanel, EuiButton } from '@elastic/eui';
import { BeaconsCollection } from '/imports/api/beacons/BeaconsCollection';
import { CoursesCollection } from '/imports/api/courses/CoursesCollection';
import { LessonsCollection } from '/imports/api/lessons/LessonsCollection';
import { useNavigate } from 'react-router-dom';

export const Home = () => {

    let navigate = useNavigate();

    const { usersCount, adminsCount, instructorsCount, studentsCount, coursesCount, lessonsCount, beaconsCount } = useTracker(() => {
        const usersSub = Meteor.subscribe('users.all');
        const usersCount = Meteor.users.find(usersSub.scopeQuery()).count();

        const adminsSub = Meteor.subscribe('users.admins');
        const adminsCount = Meteor.users.find(adminsSub.scopeQuery()).count();

        const instructorsSub = Meteor.subscribe('users.instructors');
        const instructorsCount = Meteor.users.find(instructorsSub.scopeQuery()).count();

        const studentsSub = Meteor.subscribe('users.students');
        const studentsCount = Meteor.users.find(studentsSub.scopeQuery()).count();

        const coursesSub = Meteor.subscribe('courses.all');
        const coursesCount = CoursesCollection.find(coursesSub.scopeQuery()).count();

        const lessonsSub = Meteor.subscribe('lessons.all');
        const lessonsCount = LessonsCollection.find(lessonsSub.scopeQuery()).count();

        const beaconsSub = Meteor.subscribe('beacons.all');
        const beaconsCount = BeaconsCollection.find(beaconsSub.scopeQuery()).count();

        return { usersCount, adminsCount, instructorsCount, studentsCount, coursesCount, lessonsCount, beaconsCount };
    });

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

                    <EuiSpacer />

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
                                            title={coursesCount}
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
                                            title={lessonsCount}
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
                                            title={beaconsCount}
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