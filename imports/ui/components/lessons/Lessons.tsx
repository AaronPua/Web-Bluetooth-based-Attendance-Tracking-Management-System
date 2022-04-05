import React, { useState } from 'react';
import moment, { Moment } from 'moment';
import { useNavigate, useParams } from 'react-router';
import { useFind, useSubscribe } from 'meteor/react-meteor-data';
import { LessonsCollection } from '../../../api/lessons/LessonsCollection';
import { createLesson } from '../../../api/lessons/LessonsMethods';
import DataTable, { TableColumn } from 'react-data-table-component';
import { EuiPageHeader, EuiPageContent, EuiPageContentBody, EuiCallOut, EuiForm, EuiFlexGroup, 
    EuiFlexItem, EuiFormRow, EuiFieldText, EuiButton, EuiPanel, EuiDatePicker, EuiTitle, EuiSpacer } from '@elastic/eui';
import _ from 'underscore';
import { useFormik } from 'formik';
import * as yup from 'yup';

export default function Lessons() {

    const { courseId, lessonId } = useParams();

    const [showLessonSuccess, setShowLessonSuccess] = useState(false);
    const [showLessonError, setShowLessonError] = useState(false);
    const [lessonError, setLessonError] = useState('');

    const isLoading = useSubscribe('lessons.all');
    const allLessons = useFind(() => LessonsCollection.find());

    let navigate = useNavigate();
    const goToLesson = (lessonId: string) => {
        navigate(`/courses/${courseId}/lessons/${lessonId}`);
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
            createNewLesson(courseId, values.name, values.startTime, values.endTime, values.date);
        }
    });

    const createNewLesson = (courseId: string | undefined, name: string, startTime: Moment, endTime: Moment, date: Moment) => {
        createLesson.callPromise({
            courseId: courseId,
            name: name,
            startTime: startTime.toDate(),
            endTime: endTime.toDate(),
            date: date.toDate(),
        }).then(() => {
            setShowLessonSuccess(true);
        }).catch((error: any) => {
            setShowLessonError(true);
            const reason = error.reason != null ? error.reason : error.message;
            setLessonError(reason);
        });
    };

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
        {
            name: 'Actions',
            cell: row => <EuiButton size="s" color="primary" id={row._id} onClick={() => goToLesson(row._id)}>Edit</EuiButton>,
        },
    ];

    return (
        <>
            <EuiPageHeader pageTitle="Lessons" />
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
                                { showLessonError && 
                                    <EuiCallOut title="An error has occured" color="danger">
                                        <p>{lessonError}</p>
                                    </EuiCallOut> 
                                }
                                { showLessonSuccess && 
                                    <EuiCallOut title="Success!" color="success">
                                        <p>Lesson created sucessfully.</p>
                                    </EuiCallOut> 
                                }
                                <EuiForm component="form" onSubmit={createLessonForm.handleSubmit}>
                                    <EuiFlexGroup>
                                        <EuiFlexItem>
                                            <EuiFormRow label="Lesson Name" error={createLessonForm.errors.name} isInvalid={!!createLessonForm.errors.name}>
                                                <EuiFieldText {...createLessonForm.getFieldProps('name')} isInvalid={!!createLessonForm.errors.name}/>
                                            </EuiFormRow>
                                        </EuiFlexItem>

                                        <EuiFlexItem>
                                            <EuiFormRow label="Start Time" error={createLessonForm.errors.startTime} 
                                                isInvalid={!!createLessonForm.errors.startTime}>
                                                <EuiDatePicker
                                                    showTimeSelect
                                                    showTimeSelectOnly
                                                    showIcon={false}
                                                    selected={createLessonForm.values.startTime}
                                                    onChange={(date: Moment) => createLessonForm.setFieldValue('startTime', date)}
                                                    dateFormat="HH:mm"
                                                    timeFormat="HH:mm"
                                                    isInvalid={!!createLessonForm.errors.startTime}
                                                />
                                            </EuiFormRow>
                                        </EuiFlexItem>

                                        <EuiFlexItem>
                                            <EuiFormRow label="End Time" error={createLessonForm.errors.endTime} 
                                                isInvalid={!!createLessonForm.errors.endTime}>
                                                <EuiDatePicker
                                                    showTimeSelect
                                                    showTimeSelectOnly
                                                    showIcon={false}
                                                    selected={createLessonForm.values.startTime}
                                                    onChange={(date: Moment) => createLessonForm.setFieldValue('endTime', date)}
                                                    dateFormat="HH:mm"
                                                    timeFormat="HH:mm"
                                                    isInvalid={!!createLessonForm.errors.endTime}
                                                />
                                            </EuiFormRow>
                                        </EuiFlexItem>

                                        <EuiFlexItem>
                                            <EuiFormRow label="Date (DD-MM-YYYY)" error={createLessonForm.errors.date} 
                                                isInvalid={!!createLessonForm.errors.date}>
                                                <EuiDatePicker
                                                    showIcon={false}
                                                    dateFormat="DD-MM-YYYY"
                                                    selected={createLessonForm.values.startTime}
                                                    onChange={(date: Moment) => createLessonForm.setFieldValue('date', date)}
                                                    isInvalid={!!createLessonForm.errors.date}
                                                />
                                             </EuiFormRow>
                                        </EuiFlexItem>

                                         <EuiFlexItem>
                                            <EuiFormRow hasEmptyLabelSpace>
                                                <EuiButton fill color="primary" type="submit">Create Lesson</EuiButton>
                                            </EuiFormRow>
                                        </EuiFlexItem>
                                    </EuiFlexGroup>
                                </EuiForm>
                                
                            </EuiPanel>
                        </EuiFlexItem>
                    </EuiFlexGroup>

                    <EuiSpacer />

                    <EuiFlexGroup>
                        <EuiFlexItem>
                                <EuiPanel color="plain">
                                    {/* <EuiTitle>
                                        <h2>Lessons</h2>
                                    </EuiTitle> */}
                                    <DataTable
                                        title="Current Lessons"
                                        columns={columns}
                                        data={allLessons}
                                        progressPending={isLoading()}
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