import React, { useEffect, useState } from 'react';
import moment, { Moment } from 'moment';
import { useNavigate, useParams } from 'react-router';
import { useTracker } from 'meteor/react-meteor-data';
import { LessonsCollection } from '../../../api/lessons/LessonsCollection';
import { createLesson, removeLesson } from '../../../api/lessons/LessonsMethods';
import DataTable, { TableColumn } from 'react-data-table-component';
import { EuiPageHeader, EuiPageContent, EuiPageContentBody, EuiCallOut, EuiForm, EuiFlexGroup, 
    EuiFlexItem, EuiFormRow, EuiFieldText, EuiButton, EuiPanel, EuiDatePicker, EuiTitle, EuiSpacer, EuiConfirmModal } from '@elastic/eui';
import _ from 'underscore';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { CoursesCollection } from '/imports/api/courses/CoursesCollection';
import { Meteor } from 'meteor/meteor';
import { VictoryBar, VictoryChart, VictoryGroup, VictoryLabel, VictoryPie, VictoryLegend } from 'victory';

export const Lessons = () => {

    const { courseId } = useParams();

    const [courseName, setCourseName] = useState('');

    const [showLessonSuccess, setShowLessonSuccess] = useState(false);
    const [showLessonError, setShowLessonError] = useState(false);
    const [lessonError, setLessonError] = useState('');

    const [showRemoveSuccess, setShowRemoveSuccess] = useState(false);
    const [showRemoveError, setShowRemoveError] = useState(false);
    const [removeError, setRemoveError] = useState('');

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [lessonId, setLessonId] = useState('');
    const [lessonName, setLessonName] = useState('');
    const [value, setValue] = useState('');
    const onChange = (e: any) => {
        setValue(e.target.value);
    };

    const { course, isLoadinglessons, lessons, studentAttendance, studentsInCourse }  = useTracker(() => { 
        Meteor.subscribe('courses.specific', courseId);
        const course = CoursesCollection.findOne(courseId);

        const lessonsSub = Meteor.subscribe('lessons.forOneCourse', courseId);
        const isLoadinglessons = !lessonsSub.ready();
        const lessons = LessonsCollection.find(lessonsSub.scopeQuery(), courseId).fetch();

        const studentAttendance = _.chain(lessons).pluck('studentAttendance').flatten(true).value();

        const studentsInCourseHandler = Meteor.subscribe('users.students.inSpecificCourse', courseId);
        const studentsInCourse = Meteor.users.find(studentsInCourseHandler.scopeQuery()).fetch();

        return { course, isLoadinglessons, lessons, studentAttendance, studentsInCourse };
    }, []);

    const totalAttendance = lessons.length * studentsInCourse.length;
    const present = _.first(studentAttendance) != null ? studentAttendance.length : 0;
    const absent = totalAttendance - present;

    const pieChartData = [
        { x: "Absent", y: absent },
        { x: "Present", y: present },
    ];

    const barChartData = _.chain(lessons)
                            .map((lesson) => {
                                const absentNum = studentsInCourse.length - lesson.studentAttendance.length;
                                const absent = absentNum >= 0 ? absentNum: 0;
                                return { name: lesson.name, present: lesson.studentAttendance.length, absent: absent };
                            }).sortBy('name').value();

    let navigate = useNavigate();
    const goToLesson = (lessonId: string) => {
        navigate(`/courses/${courseId}/lessons/${lessonId}`);
    }

    type FormInputs = {
        name: string,
        startTime: Moment,
        endTime: Moment,
        date: Moment
    }

    const createLessonForm = useFormik({
        initialValues: {
            name: '',
            startTime: moment(),
            endTime: moment(),
            date: moment()
        },
        validationSchema: yup.object().shape({
            name: yup.string().required('Lesson Name is required'),
            startTime: yup.date().required('Start Time is required'),
            endTime: yup.date().required('End Time is required'),
            date: yup.date().required('Date is required'),
        }),
        onSubmit: (values) => {
            createNewLesson(courseId, values);
        }
    });

    const createNewLesson = (courseId: string | undefined, values: FormInputs) => {
        createLesson.callPromise({
            courseId: courseId,
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

    useEffect(() => {
        if(course) {
            setCourseName(course.name);
        }
    }, [course]);

    const showRemoveLessonModal = (lessonId: string, lessonName: string) => {
        setIsModalVisible(true);
        setLessonId(lessonId);
        setLessonName(lessonName);
    }

    const removeThisLesson = (lessonId: string) => {
        removeLesson.callPromise({
            lessonId: lessonId
        }).then(() => {
            setShowRemoveSuccess(true);
        }).catch((error: any) => {
            setShowRemoveError(true);
            const reason = error.reason != null ? error.reason : error.message;
            setRemoveError(reason);
        });
    }

    let modal: any;
    if (isModalVisible) {
        modal = (
            <EuiConfirmModal
                title={`Remove ${lessonName}?`}
                onCancel={() => {
                    setIsModalVisible(false);
                    setValue('');
                }}
                onConfirm={() => {
                    removeThisLesson(lessonId);
                    setIsModalVisible(false);
                    setValue('');
                }}
                confirmButtonText="Remove"
                cancelButtonText="Cancel"
                buttonColor="danger"
                confirmButtonDisabled={value.toLowerCase() !== 'remove'}
            >
                <EuiFormRow label="Type the word 'remove' to confirm">
                <EuiFieldText
                    name="remove"
                    value={value}
                    onChange={onChange}
                />
                </EuiFormRow>
            </EuiConfirmModal>
        );
    }

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
            format: row => moment(row.startTime).format('hh:mm a'),
            sortable: true,
        },
        {
            name: 'End Time',
            selector: (row: any) => row.endTime,
            format: row => moment(row.endTime).format('hh:mm a'),
            sortable: true,
        },
        {
            name: 'Date',
            selector: (row: any) => row.date,
            format: row => moment(row.date).format('DD-MM-YYYY'),
            sortable: true,
        },
        {
            name: 'Actions',
            cell: row => (
                <>
                    <EuiButton size="s" color="primary" id={row._id} onClick={() => goToLesson(row._id)} style={{ marginRight: "1em" }}>Edit</EuiButton>
                    <EuiButton size="s" color="text" id={row._id} onClick={() => showRemoveLessonModal(row._id, row.name)}>Remove</EuiButton>
                    { modal }
                </>
            ),
        },
    ];

    return (
        <>
            <EuiPageHeader pageTitle={`${courseName}: Lessons`} />
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
                                <EuiTitle size="s">
                                    <h4>Create Lesson</h4>
                                </EuiTitle>
                                <EuiSpacer />
                                { showLessonError && 
                                    <EuiCallOut title="An error has occured" color="danger" iconType="alert">
                                        <p>{lessonError}</p>
                                    </EuiCallOut> 
                                }
                                { showLessonSuccess && 
                                    <EuiCallOut title="Success!" color="success" iconType="user">
                                        <p>Lesson created sucessfully.</p>
                                    </EuiCallOut> 
                                }
                                <EuiForm component="form" onSubmit={createLessonForm.handleSubmit}>
                                    <EuiFlexGroup>
                                        <EuiFlexItem>
                                            <EuiFormRow label="Name" error={createLessonForm.errors.name} isInvalid={!!createLessonForm.errors.name}>
                                                <EuiFieldText {...createLessonForm.getFieldProps('name')} isInvalid={!!createLessonForm.errors.name}/>
                                            </EuiFormRow>
                                        </EuiFlexItem>

                                        <EuiFlexItem>
                                            <EuiFormRow label="Start Time" error={createLessonForm.errors.startTime} 
                                                isInvalid={!!createLessonForm.errors.startTime}>
                                                <EuiDatePicker
                                                    showTimeSelect
                                                    selected={createLessonForm.values.startTime}
                                                    onChange={(date: Moment) => createLessonForm.setFieldValue('startTime', date)}
                                                    dateFormat="DD-MM-YYYY hh:mm a"
                                                    isInvalid={!!createLessonForm.errors.startTime}
                                                    name="startTime"
                                                />
                                            </EuiFormRow>
                                        </EuiFlexItem>

                                        <EuiFlexItem>
                                            <EuiFormRow label="End Time" error={createLessonForm.errors.endTime} 
                                                isInvalid={!!createLessonForm.errors.endTime}>
                                                <EuiDatePicker
                                                    showTimeSelect
                                                    selected={createLessonForm.values.endTime}
                                                    onChange={(date: Moment) => createLessonForm.setFieldValue('endTime', date)}
                                                    dateFormat="DD-MM-YYYY hh:mm a"
                                                    isInvalid={!!createLessonForm.errors.endTime}
                                                    name="endTime"
                                                />
                                            </EuiFormRow>
                                        </EuiFlexItem>

                                        <EuiFlexItem>
                                            <EuiFormRow label="Date" error={createLessonForm.errors.date} 
                                                isInvalid={!!createLessonForm.errors.date}>
                                                <EuiDatePicker
                                                    dateFormat="DD-MM-YYYY"
                                                    selected={createLessonForm.values.date}
                                                    onChange={(date: Moment) => createLessonForm.setFieldValue('date', date)}
                                                    isInvalid={!!createLessonForm.errors.date}
                                                    name="date"
                                                />
                                             </EuiFormRow>
                                        </EuiFlexItem>

                                         <EuiFlexItem>
                                            <EuiFormRow hasEmptyLabelSpace>
                                                <EuiButton fill color="primary" type="submit">Create</EuiButton>
                                            </EuiFormRow>
                                        </EuiFlexItem>
                                    </EuiFlexGroup>
                                </EuiForm>
                                
                            </EuiPanel>
                        </EuiFlexItem>
                    </EuiFlexGroup>

                    <EuiFlexGroup>
                        <EuiFlexItem>
                            <EuiPanel color="plain">
                                { showRemoveError &&
                                    <EuiCallOut title="Error" color="danger" iconType="alert">
                                        <p>{removeError}</p>
                                    </EuiCallOut>
                                }
                                { showRemoveSuccess &&
                                    <EuiCallOut title="Success!" color="success" iconType="user">
                                        <p>Lesson removed sucessfully.</p>
                                    </EuiCallOut>
                                }
                                <DataTable
                                    title="Current Lessons"
                                    columns={columns}
                                    data={lessons}
                                    progressPending={isLoadinglessons}
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
                                    <h4>Overall Attendance</h4>
                                </EuiTitle>
                                { totalAttendance != 0 &&
                                    <VictoryPie
                                        width={400}
                                        height={200}
                                        colorScale={["orange", "LightSkyBlue"]}
                                        startAngle={90}
                                        endAngle={-90}
                                        data={pieChartData}
                                        labels={({ datum }) => `${datum.x}: ${datum.y}`}
                                        labelComponent={
                                            <VictoryLabel
                                                textAnchor="middle"
                                                verticalAnchor="end"
                                                style={{ fontSize: 12 }}
                                            />
                                        }
                                    />
                                }
                            </EuiPanel>
                        </EuiFlexItem>
                    </EuiFlexGroup>

                    <EuiFlexGroup>
                        <EuiFlexItem>
                            <EuiPanel>
                                <EuiTitle size="s">
                                    <h4>Attendance by Lesson</h4>
                                </EuiTitle>
                                <VictoryChart width={1000} height={350}>
                                    <VictoryLegend x={150} y={0}
                                        orientation="horizontal"
                                        gutter={20}
                                        data={[
                                            { name: "Present", symbol: { fill: "LightSkyBlue" } },
                                            { name: "Absent", symbol: { fill: "Orange" } },
                                        ]}
                                    />
                                    <VictoryGroup offset={45}>
                                        <VictoryBar
                                            data={barChartData}
                                            x="name"
                                            y="present"
                                            style={{ data: { fill: "LightSkyBlue" } }}
                                            labels={({ datum }) => `${datum.present}`}
                                        />
                                        <VictoryBar
                                            data={barChartData}
                                            x="name"
                                            y="absent"
                                            style={{ data: { fill: "Orange" } }}
                                            labels={({ datum }) => `${datum.absent}`}
                                        />
                                    </VictoryGroup>
                                </VictoryChart>
                            </EuiPanel>
                        </EuiFlexItem>
                    </EuiFlexGroup>
                </EuiPageContentBody>
            </EuiPageContent>
        </>
    );
}