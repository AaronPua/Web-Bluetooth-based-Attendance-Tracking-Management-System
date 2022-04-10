import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useParams } from 'react-router';
import { useTracker } from 'meteor/react-meteor-data';
import { LessonsCollection } from '../../../api/lessons/LessonsCollection';
import DataTable, { TableColumn } from 'react-data-table-component';
import { EuiPageHeader, EuiPageContent, EuiPageContentBody, EuiFlexGroup, EuiFlexItem, EuiPanel, EuiButton, EuiCallOut } from '@elastic/eui';
import _ from 'underscore';
import { CoursesCollection } from '/imports/api/courses/CoursesCollection';
import { Meteor } from 'meteor/meteor';
import { updateAttendance } from '/imports/api/lessons/LessonsMethods';

export default function Attendance() {

    const { courseId, userId } = useParams();

    const [courseName, setCourseName] = useState('');
    const [studentName, setStudentName] = useState('');

    const [showAddAttendanceSuccess, setShowAddAttendanceSuccess] = useState(false);
    const [showAddAttendanceError, setShowAddAttendanceError] = useState(false);
    const [addAttendanceError, setAddAttendanceError] = useState('');

    const [showRemoveAttendanceSuccess, setShowRemoveAttendanceSuccess] = useState(false);
    const [showRemoveAttendanceError, setShowRemoveAttendanceError] = useState(false);
    const [removeAttendanceError, setRemoveAttendanceError] = useState('');

    const { course, isLoadingStudent, student, isLoadingAttended, lessonsAttended, isLoadingMissed, lessonsMissed }  = useTracker(() => { 
        Meteor.subscribe('courses.specific', courseId);
        const course = CoursesCollection.findOne(courseId);

        const studentSubHandler = Meteor.subscribe('users.specific', userId);
        const isLoadingStudent = !studentSubHandler.ready();
        const student = Meteor.users.findOne(userId);

        const lessonsSub = Meteor.subscribe('lessons.forOneCourse', courseId);
        const lessons = LessonsCollection.find(lessonsSub.scopeQuery(), courseId).fetch();

        const lessonIds = _.pluck(lessons, '_id');
        const lessonsAttendedIds = _.chain(lessons)
                                    .filter((lesson) => {
                                        return _.findWhere(_.get(lesson, 'studentAttendance'), { _id: userId });
                                    }).pluck('_id').value();
        const lessonsMissedIds = _.difference(lessonIds, lessonsAttendedIds);          

        const attendedLessonsSub = Meteor.subscribe('courses.student.attendedLessons', userId, courseId);
        const isLoadingAttended = !attendedLessonsSub.ready();
        const lessonsAttended = LessonsCollection.find({ _id: { $in: lessonsAttendedIds } }).fetch()

        const missedLessonsSub = Meteor.subscribe('courses.student.missedLessons', userId, courseId);
        const isLoadingMissed = !missedLessonsSub.ready();
        const lessonsMissed = LessonsCollection.find({ _id: { $in: lessonsMissedIds } }).fetch();

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

    const updateStudentAttendance = (e: { preventDefault: () => void; }, lessonId: string | undefined, studentId: string | undefined, action: string) => {
        e.preventDefault();

        updateAttendance.callPromise({
            lessonId: lessonId,
            studentId: studentId,
            action: action
        }).then(() => {
            action === 'add' ? setShowAddAttendanceSuccess(true) : setShowRemoveAttendanceSuccess(true);
        }).catch((error: any) => {
            action === 'add' ? setShowAddAttendanceError(false) : setShowRemoveAttendanceError(false);
            const reason = error.reason != null ? error.reason : error.message;
            action === 'add' ? setAddAttendanceError(reason) : setRemoveAttendanceError(reason);
        });
    };

    type DataRow = {
        _id: string;
        name: string;
        startTime: Date;
        endTime: Date;
        date: Date;
    }

    const attendedColumns: TableColumn<DataRow>[] = [
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
        {
            name: 'Attendance',
            cell: row => <EuiButton size="s" color="text" id={row._id} 
                    onClick={(e: any) => updateStudentAttendance(e, row._id, userId, 'remove') }>Mark Absent</EuiButton>,
        },
    ];

    const missedColumns: TableColumn<DataRow>[] = [
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
        {
            name: 'Attendance',
            cell: row => <EuiButton size="s" color="primary" id={row._id} 
                    onClick={(e: any) => updateStudentAttendance(e, row._id, userId, 'add') }>Mark Present</EuiButton>,
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
                                { showRemoveAttendanceError && 
                                    <EuiCallOut title="An error has occured" color="danger">
                                        <p>{removeAttendanceError}</p>
                                    </EuiCallOut> 
                                }
                                { showRemoveAttendanceSuccess && 
                                    <EuiCallOut title="Success!" color="success">
                                        <p>Student attendance sucessfully marked as absent.</p>
                                    </EuiCallOut> 
                                }
                                <DataTable
                                    title="Attended Lessons"
                                    columns={attendedColumns}
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
                                { showAddAttendanceError && 
                                    <EuiCallOut title="An error has occured" color="danger">
                                        <p>{addAttendanceError}</p>
                                    </EuiCallOut> 
                                }
                                { showAddAttendanceSuccess && 
                                    <EuiCallOut title="Success!" color="success">
                                        <p>Student attendance sucessfully marked as present.</p>
                                    </EuiCallOut> 
                                }
                                <DataTable
                                    title="Missed Lessons"
                                    columns={missedColumns}
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