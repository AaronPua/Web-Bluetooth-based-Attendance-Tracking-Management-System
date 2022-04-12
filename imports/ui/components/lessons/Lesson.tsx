import { Meteor } from 'meteor/meteor';
import React, { useEffect, useState } from 'react';
import moment, { Moment } from 'moment';
import { useParams } from 'react-router';
import { useTracker } from 'meteor/react-meteor-data';
import { LessonsCollection } from '../../../api/lessons/LessonsCollection';
import { updateLesson, updateAttendance } from '../../../api/lessons/LessonsMethods';
import DataTable, { TableColumn } from 'react-data-table-component';
import { EuiPageHeader, EuiPageContent, EuiPageContentBody, EuiCallOut, EuiForm, EuiFlexGroup, 
    EuiFlexItem, EuiFormRow, EuiFieldText, EuiButton, EuiPanel, EuiDatePicker, EuiTitle, EuiSpacer } from '@elastic/eui';
import _ from 'underscore';
import { useFormik } from 'formik';
import * as yup from 'yup';

export const Lesson = () => {

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

    useEffect(() => {
        if(lesson) {
            setLessonName(lesson.name);
            setLessonStartTime(moment(lesson.startTime));
            setLessonEndTime(moment(lesson.endTime));
            setLessonDate(moment(lesson.date));
        }
    }, [lesson, presentStudents, absentStudents]);

    type FormInputs = {
        name: string,
        startTime: Moment,
        endTime: Moment,
        date: Moment
    }

    const updateLessonForm = useFormik({
        initialValues: {
            name: lessonName,
            startTime: lessonStartTime,
            endTime: lessonEndTime,
            date: lessonDate
        },
        enableReinitialize: true,
        validationSchema: yup.object().shape({
            name: yup.string().required('Lesson Name is required'),
            startTime: yup.date().required('Start Time is required'),
            endTime: yup.date().required('End Time is required'),
            date: yup.date().required('Date is required'),
        }),
        onSubmit: (values) => {
            updateThisLesson(lessonId, values);
        }
    });

    const updateThisLesson = (lessonId: string | undefined, values: FormInputs) => {
        updateLesson.callPromise({
            lessonId: lessonId,
            name: values.name,
            startTime: values.startTime.toDate(),
            endTime: values.endTime.toDate(),
            date: values.date.toDate(),
        }).then(() => {
            setShowLessonSuccess(true);
        }).catch((error: any) => {
            setShowLessonError(true);
            const reason = error.reason != null ? error.reason : error.message;
            setLessonError(reason);
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
        });
    };

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

    return (
        <>
            <EuiPageHeader pageTitle={lessonName} />
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
                                    <h4>Edit Lesson</h4>
                                </EuiTitle>
                                <EuiSpacer />
                                { showLessonError && 
                                    <EuiCallOut title="An error has occured" color="danger" iconType="alert">
                                        <p>{lessonError}</p>
                                    </EuiCallOut> 
                                }
                                { showLessonSuccess && 
                                    <EuiCallOut title="Success!" color="success" iconType="user">
                                        <p>Lesson updated sucessfully.</p>
                                    </EuiCallOut> 
                                }
                                { !isLoadingLesson &&
                                    <EuiForm component="form" onSubmit={updateLessonForm.handleSubmit}>
                                        <EuiFlexGroup>
                                            <EuiFlexItem>
                                                <EuiFormRow label="Lesson Name" error={updateLessonForm.errors.name} isInvalid={!!updateLessonForm.errors.name}>
                                                    <EuiFieldText {...updateLessonForm.getFieldProps('name')} isInvalid={!!updateLessonForm.errors.name}/>
                                                </EuiFormRow>
                                            </EuiFlexItem>

                                            <EuiFlexItem>
                                                <EuiFormRow label="Start Time" error={updateLessonForm.errors.startTime} 
                                                    isInvalid={!!updateLessonForm.errors.startTime}>
                                                    <EuiDatePicker
                                                        showTimeSelect
                                                        showTimeSelectOnly
                                                        showIcon={false}
                                                        selected={updateLessonForm.values.startTime}
                                                        onChange={(date: Moment) => updateLessonForm.setFieldValue('startTime', date)}
                                                        dateFormat="HH:mm"
                                                        timeFormat="HH:mm"
                                                        isInvalid={!!updateLessonForm.errors.startTime}
                                                    />
                                                </EuiFormRow>
                                            </EuiFlexItem>

                                            <EuiFlexItem>
                                                <EuiFormRow label="End Time" error={updateLessonForm.errors.endTime} 
                                                    isInvalid={!!updateLessonForm.errors.endTime}>
                                                    <EuiDatePicker
                                                        showTimeSelect
                                                        showTimeSelectOnly
                                                        showIcon={false}
                                                        selected={updateLessonForm.values.endTime}
                                                        onChange={(date: Moment) => updateLessonForm.setFieldValue('endTime', date)}
                                                        dateFormat="HH:mm"
                                                        timeFormat="HH:mm"
                                                        isInvalid={!!updateLessonForm.errors.endTime}
                                                    />
                                                </EuiFormRow>
                                            </EuiFlexItem>

                                            <EuiFlexItem>
                                                <EuiFormRow label="Date (DD-MM-YYYY)" error={updateLessonForm.errors.date} 
                                                    isInvalid={!!updateLessonForm.errors.date}>
                                                    <EuiDatePicker
                                                        showIcon={false}
                                                        dateFormat="DD-MM-YYYY"
                                                        selected={updateLessonForm.values.date}
                                                        onChange={(date: Moment) => updateLessonForm.setFieldValue('date', date)}
                                                        isInvalid={!!updateLessonForm.errors.date}
                                                    />
                                                </EuiFormRow>
                                            </EuiFlexItem>

                                            <EuiFlexItem>
                                                <EuiFormRow hasEmptyLabelSpace>
                                                    <EuiButton fill color="primary" type="submit">Update</EuiButton>
                                                </EuiFormRow>
                                            </EuiFlexItem>
                                        </EuiFlexGroup>
                                    </EuiForm>
                                }
                            </EuiPanel>
                        </EuiFlexItem>
                    </EuiFlexGroup>

                    <EuiFlexGroup>
                        <EuiFlexItem>
                            <EuiPanel>
                                { showRemoveAttendanceError && 
                                    <EuiCallOut title="An error has occured" color="danger" iconType="alert">
                                        <p>{removeAttendanceError}</p>
                                    </EuiCallOut> 
                                }
                                { showRemoveAttendanceSuccess && 
                                    <EuiCallOut title="Success!" color="success" iconType="user">
                                        <p>Student attendance sucessfully marked as absent.</p>
                                    </EuiCallOut> 
                                }
                                <DataTable
                                    title="Present Students"
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
                                { showAddAttendanceError && 
                                    <EuiCallOut title="An error has occured" color="danger" iconType="alert">
                                        <p>{addAttendanceError}</p>
                                    </EuiCallOut> 
                                }
                                { showAddAttendanceSuccess && 
                                    <EuiCallOut title="Success!" color="success" iconType="user">
                                        <p>Student attendance sucessfully marked as present.</p>
                                    </EuiCallOut> 
                                }
                                <DataTable
                                    title="Absent Students"
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