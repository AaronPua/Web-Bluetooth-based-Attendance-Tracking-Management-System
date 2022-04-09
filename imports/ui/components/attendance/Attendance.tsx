import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useParams } from 'react-router';
import { useTracker } from 'meteor/react-meteor-data';
import { LessonsCollection } from '../../../api/lessons/LessonsCollection';
import DataTable, { TableColumn } from 'react-data-table-component';
import { EuiPageHeader, EuiPageContent, EuiPageContentBody, EuiFlexGroup, EuiFlexItem, EuiPanel } from '@elastic/eui';
import _ from 'underscore';
import { CoursesCollection } from '/imports/api/courses/CoursesCollection';
import { Meteor } from 'meteor/meteor';

export default function Attendance() {

    const { courseId, userId } = useParams();

    const [courseName, setCourseName] = useState('');
    const [studentName, setStudentName] = useState('');

    const { course, isLoadingStudent, student, isLoadingAttended, lessonsAttended, isLoadingMissed, lessonsMissed }  = useTracker(() => { 
        Meteor.subscribe('courses.specific', courseId);
        const course = CoursesCollection.findOne(courseId);

        const studentSubHandler = Meteor.subscribe('users.specific', userId);
        const isLoadingStudent = !studentSubHandler.ready();
        const student = Meteor.users.findOne(userId);

        const attendedLessonsSub = Meteor.subscribe('courses.student.attendedLessons', userId, courseId);
        const isLoadingAttended = !attendedLessonsSub.ready();
        const lessonsAttended = LessonsCollection.find(attendedLessonsSub.scopeQuery(), userId, courseId).fetch();

        const missedLessonsSub = Meteor.subscribe('courses.student.missedLessons', userId, courseId);
        const isLoadingMissed = !missedLessonsSub.ready();
        const lessonsMissed = LessonsCollection.find(missedLessonsSub.scopeQuery(), userId, courseId).fetch();

        return { course, isLoadingStudent, student, isLoadingAttended, lessonsAttended, isLoadingMissed, lessonsMissed };
    }, []);

    useEffect(() => {
        if(course) {
            setCourseName(course.name);
        }
        if(!isLoadingStudent && student) {
            setStudentName(`${student.profile.firstName} ${student.profile.lastName}`)
        }
    }, [course, student]);

    type DataRow = {
        _id: string;
        name: string;
        startTime: Date;
        endTime: Date;
        date: Date;
    }

    const columns: TableColumn<DataRow>[] = [
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Start Time',
            selector: (row: any) => row.startTime,
            format: row => moment(row.startTime).format('HH:mm'),
            sortable: true,
        },
        {
            name: 'End Time',
            selector: (row: any) => row.endTime,
            format: row => moment(row.endTime).format('HH:mm'),
            sortable: true,
        },
        {
            name: 'Date (DD-MM-YYYY)',
            selector: (row: any) => row.date,
            format: row => moment(row.date).format('DD-MM-YYYY'),
            sortable: true,
        },
    ];

    return (
        <>
            <EuiPageHeader pageTitle={`${courseName} attendance: ${studentName}`} />
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
                            <EuiPanel color="plain">
                                <DataTable
                                    title="Attended Lessons"
                                    columns={columns}
                                    data={lessonsAttended}
                                    progressPending={isLoadingAttended}
                                    pagination
                                    striped
                                    responsive
                                    defaultSortFieldId={1}
                                />
                            </EuiPanel>
                        </EuiFlexItem>

                        <EuiFlexItem>
                            <EuiPanel color="plain">
                                <DataTable
                                    title="Missed Lessons"
                                    columns={columns}
                                    data={lessonsMissed}
                                    progressPending={isLoadingMissed}
                                    pagination
                                    striped
                                    responsive
                                    defaultSortFieldId={1}
                                />
                            </EuiPanel>
                        </EuiFlexItem>
                    </EuiFlexGroup>
                </EuiPageContentBody>
            </EuiPageContent>
        </>
    );
}