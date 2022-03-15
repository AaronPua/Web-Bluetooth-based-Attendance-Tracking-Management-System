import { Meteor } from 'meteor/meteor';
import React, { useEffect, useState } from 'react';
import moment, { Moment } from 'moment';
import { useParams } from 'react-router';
import { useTracker } from 'meteor/react-meteor-data';
import { LessonsCollection } from '../api/lessons/LessonsCollection';
import { updateLesson } from '../api/lessons/LessonsMethods';
import DataTable, { TableColumn } from 'react-data-table-component';
import { EuiPageHeader, EuiPageContent, EuiPageContentBody, EuiCallOut, EuiForm, EuiFlexGroup, EuiFlexItem, EuiFormRow, EuiFieldText, EuiButton, EuiPanel, EuiDatePicker, EuiTitle, EuiText } from '@elastic/eui';

export default function Lesson() {

    const { courseId, lessonId } = useParams();

    const [lessonName, setLessonName] = useState('');
    const [lessonStartTime, setLessonStartTime] = useState(moment());
    const [lessonEndTime, setLessonEndTime] = useState(moment());
    const [lessonDate, setLessonDate] = useState(moment());

    const [showLessonSuccess, setShowLessonSuccess] = useState(false);
    const [showLessonError, setShowLessonError] = useState(false);
    const [lessonError, setLessonError] = useState('');

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

    const { lesson, isLoadingLesson, students, isLoadingStudents } = useTracker(() => {
        const lessonHandler = Meteor.subscribe('lessons.specific', lessonId);
        const isLoadingLesson = !lessonHandler.ready();
        const lesson = LessonsCollection.findOne(lessonId);

        const studentsHandler = Meteor.subscribe('users.students');
        const isLoadingStudents = !studentsHandler.ready();
        const students = Meteor.users.find().fetch();

        return { lesson, isLoadingLesson, students, isLoadingStudents };
    }, []);

    const columns: TableColumn<Meteor.User>[] = [
        {
            name: 'First Name',
            selector: row => row.profile.firstName,
            sortable: true,
        },
        {
            name: 'Last Name',
            selector: row => row.profile.lastName,
            sortable: true,
        }
    ];

    useEffect(() => {
        if(lesson) {
            setLessonName(lesson.name);
            setLessonStartTime(moment(lesson.startTime));
            setLessonEndTime(moment(lesson.endTime));
            setLessonDate(moment(lesson.date));
        }
    }, [lesson]);

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
                                    <h3>Students</h3>
                                </EuiTitle>
                                <DataTable
                                    columns={columns}
                                    data={students}
                                    progressPending={isLoadingStudents}
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