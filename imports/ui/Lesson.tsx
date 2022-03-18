import { Meteor } from 'meteor/meteor';
import React, { useEffect, useState } from 'react';
import moment, { Moment } from 'moment';
import { useParams } from 'react-router';
import { useTracker } from 'meteor/react-meteor-data';
import { LessonsCollection } from '../api/lessons/LessonsCollection';
import { updateLesson, updateAttendance } from '../api/lessons/LessonsMethods';
import DataTable, { TableColumn } from 'react-data-table-component';
import { EuiPageHeader, EuiPageContent, EuiPageContentBody, EuiCallOut, EuiForm, EuiFlexGroup, EuiFlexItem, EuiFormRow, EuiFieldText, EuiButton, EuiPanel, EuiDatePicker, EuiTitle } from '@elastic/eui';
import _ from 'underscore';

export default function Lesson() {

    const { courseId, lessonId } = useParams();

    const [lessonName, setLessonName] = useState('');
    const [lessonStartTime, setLessonStartTime] = useState(moment());
    const [lessonEndTime, setLessonEndTime] = useState(moment());
    const [lessonDate, setLessonDate] = useState(moment());

    const [showLessonSuccess, setShowLessonSuccess] = useState(false);
    const [showLessonError, setShowLessonError] = useState(false);
    const [lessonError, setLessonError] = useState('');

    const [showAddAttendanceSuccess, setShowAddAttendanceSuccess] = useState(false);
    const [showAddAttendanceError, setShowAddAttendanceError] = useState(false);
    const [addAttendanceError, setAddAttendanceError] = useState('');

    const [showRemoveAttendanceSuccess, setShowRemoveAttendanceSuccess] = useState(false);
    const [showRemoveAttendanceError, setShowRemoveAttendanceError] = useState(false);
    const [removeAttendanceError, setRemoveAttendanceError] = useState('');

    const updateThisLesson = (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        updateLesson.callPromise({
            lessonId: lessonId,
            name: lessonName,
            startTime: lessonStartTime.toDate(),
            endTime: lessonEndTime.toDate(),
            date: lessonDate.toDate(),
        }).then(() => {
            setShowLessonSuccess(true);
        }).catch((error: any) => {
            setShowLessonError(true);
            const reason = error.reason != null ? error.reason : error.message;
            setLessonError(reason);
            console.log('Message: ' + error.message);
            console.log('Error Type: ' + error.error);
            console.log('Reason: ' + error.reason);
        });
    };

    const updateStudentAttendance = (e: { preventDefault: () => void; }, lessonId: string | undefined, studentId: string, action: string) => {
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
            console.log('Message: ' + error.message);
            console.log('Error Type: ' + error.error);
            console.log('Reason: ' + error.reason);
        });
    };

    const { lesson,  isLoadingLesson, presentStudents, isLoadingPresentStudents, absentStudents, isLoadingAbsentStudents } = useTracker(() => {
        const lessonSub = Meteor.subscribe('lessons.specific', lessonId);
        const isLoadingLesson = !lessonSub.ready();
        const lesson = LessonsCollection.findOne(lessonId);

        const presentStudentsSub = Meteor.subscribe('lesson.attendance.present', courseId, lessonId);
        const isLoadingPresentStudents = !presentStudentsSub.ready();

        const absentStudentsSub = Meteor.subscribe('lesson.attendance.absent', courseId, lessonId);
        const isLoadingAbsentStudents = !absentStudentsSub.ready();

        const courseStudentsSub = Meteor.subscribe('users.students.inSpecificCourse', courseId);
        const courseStudents = Meteor.users.find(courseStudentsSub.scopeQuery()).fetch();
        const courseStudentIds = _.pluck(courseStudents, '_id');

        const attendedIds = _.pluck(_.get(lesson, 'studentAttendance'), '_id');
        const absentIds = _.difference(courseStudentIds, attendedIds);

        const presentStudents = Meteor.users.find({ _id: { $in: attendedIds }, "courses._id": { $eq: courseId } }).fetch();
        const absentStudents = Meteor.users.find({ _id: { $in: absentIds }, "courses._id": { $eq: courseId } }).fetch();

        return { lesson, isLoadingLesson, presentStudents, isLoadingPresentStudents, absentStudents, isLoadingAbsentStudents };
    }, []);

    const presentStudentColumns: TableColumn<Meteor.User>[] = [
        {
            name: 'First Name',
            selector: row => row.profile.firstName,
            sortable: true,
        },
        {
            name: 'Last Name',
            selector: row => row.profile.lastName,
            sortable: true,
        },
        {
            name: 'Attendance',
            cell: row => <EuiButton size="s" color="text" id={row._id} 
                    onClick={(e: any) => updateStudentAttendance(e, lessonId, row._id, 'remove') }>Mark Absent</EuiButton>,
        },
    ];

    const absentStudentColumns: TableColumn<Meteor.User>[] = [
        {
            name: 'First Name',
            selector: row => row.profile.firstName,
            sortable: true,
        },
        {
            name: 'Last Name',
            selector: row => row.profile.lastName,
            sortable: true,
        },
        {
            name: 'Attendance',
            cell: row => <EuiButton size="s" color="primary" id={row._id} 
                    onClick={(e: any) => updateStudentAttendance(e, lessonId, row._id, 'add') }>Mark Present</EuiButton>,
        },
    ];

    useEffect(() => {
        if(lesson) {
            setLessonName(lesson.name);
            setLessonStartTime(moment(lesson.startTime));
            setLessonEndTime(moment(lesson.endTime));
            setLessonDate(moment(lesson.date));
        }
    }, [lesson, presentStudents, absentStudents]);

    return (
        <>
            <EuiPageHeader pageTitle="Edit Lesson" />
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
                                { showLessonError && 
                                    <EuiCallOut title="An error has occured" color="danger">
                                        <p>{lessonError}</p>
                                    </EuiCallOut> 
                                }
                                { showLessonSuccess && 
                                    <EuiCallOut title="Success!" color="success">
                                        <p>Lesson updated sucessfully.</p>
                                    </EuiCallOut> 
                                }
                                { !isLoadingLesson &&
                                    <EuiForm component="form">
                                        <EuiFlexGroup>
                                            <EuiFlexItem>
                                                <EuiFormRow label="Lesson Name">
                                                    <EuiFieldText name="lessonName" value={lessonName} onChange={(e) => setLessonName(e.target.value)}/>
                                                </EuiFormRow>
                                            </EuiFlexItem>
                                            <EuiFlexItem>
                                                <EuiFormRow label="Start Time">
                                                    <EuiDatePicker
                                                        showTimeSelect
                                                        showTimeSelectOnly
                                                        showIcon={false}
                                                        selected={lessonStartTime}
                                                        onChange={(date: Moment) => setLessonStartTime(date)}
                                                        dateFormat="HH:mm"
                                                        timeFormat="HH:mm"
                                                    />
                                                </EuiFormRow>
                                            </EuiFlexItem>
                                        </EuiFlexGroup>
                                        
                                        <EuiFlexGroup>
                                            <EuiFlexItem>
                                                <EuiFormRow label="Date (DD-MM-YYYY)">
                                                    <EuiDatePicker
                                                        showIcon={false}
                                                        selected={lessonDate}
                                                        onChange={(date: Moment) => setLessonDate(date)}
                                                        dateFormat="DD-MM-YYYY"
                                                    />
                                                </EuiFormRow>
                                            </EuiFlexItem>
                                            <EuiFlexItem>
                                                <EuiFormRow label="End Time">
                                                    <EuiDatePicker
                                                        showTimeSelect
                                                        showTimeSelectOnly
                                                        showIcon={false}
                                                        selected={lessonEndTime}
                                                        onChange={(date: Moment) => setLessonEndTime(date)}
                                                        dateFormat="HH:mm"
                                                        timeFormat="HH:mm"
                                                    />
                                                </EuiFormRow>
                                            </EuiFlexItem>
                                        </EuiFlexGroup>
                                        
                                        <EuiFlexItem grow={false}>
                                            <EuiFormRow hasEmptyLabelSpace>
                                                <EuiButton fill color="primary" type="submit" onClick={(e: any) => updateThisLesson(e)}>Update Lesson</EuiButton>
                                            </EuiFormRow>
                                        </EuiFlexItem>
                                    </EuiForm>
                                }
                            </EuiPanel>
                        </EuiFlexItem>
                    </EuiFlexGroup>

                    <EuiFlexGroup>
                        <EuiFlexItem>
                            <EuiPanel>
                                <EuiTitle size="s">
                                    <h3>Present Students</h3>
                                </EuiTitle>
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
                                    columns={presentStudentColumns}
                                    data={presentStudents}
                                    progressPending={isLoadingPresentStudents}
                                    pagination
                                    striped
                                    responsive
                                    defaultSortFieldId={1}
                                />
                            </EuiPanel>
                        </EuiFlexItem>
                        <EuiFlexItem>
                            <EuiPanel>
                                <EuiTitle size="s">
                                    <h3>Absent Students</h3>
                                </EuiTitle>
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
                                    columns={absentStudentColumns}
                                    data={absentStudents}
                                    progressPending={isLoadingAbsentStudents}
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