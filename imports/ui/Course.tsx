import { EuiForm, EuiFlexGroup, EuiFlexItem, EuiFormRow, EuiFieldText, EuiButton, EuiCallOut, 
    EuiFieldNumber, EuiPageContent, EuiPageContentBody, EuiPageHeader, EuiPanel, EuiTitle, EuiDatePicker, EuiSpacer, EuiSelect, EuiSuperSelect } from '@elastic/eui';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import moment, { Moment } from 'moment';
import React, { useEffect, useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { useNavigate, useParams } from "react-router-dom";
import { CoursesCollection } from '../api/courses/CoursesCollection';
import { updateCourse, addStudentToCourse } from '../api/courses/CoursesMethods';
import { LessonsCollection } from '../api/lessons/LessonsCollection';
import { createLesson } from '../api/lessons/LessonsMethods';

export default function Course() {
    const [courseName, setCourseName] = useState('');
    const [courseCredits, setCourseCredits] = useState(1);

    const [lessonName, setLessonName] = useState('');
    const [lessonStartTime, setLessonStartTime] = useState(moment());
    const [lessonEndTime, setLessonEndTime] = useState(moment());
    const [lessonDate, setLessonDate] = useState(moment());

    const [studentId, setStudentId] = useState('');

    const [showCourseSuccess, setShowCourseSuccess] = useState(false);
    const [showCourseError, setShowCourseError] = useState(false);

    const [showLessonSuccess, setShowLessonSuccess] = useState(false);
    const [showLessonError, setShowLessonError] = useState(false);

    const [showAddStudentSuccess, setShowAddStudentSuccess] = useState(false);
    const [showAddStudentError, setShowAddStudentError] = useState(false);

    const [courseError, setCourseError] = useState('');
    const [lessonError, setLessonError] = useState('');
    const [addStudentError, setAddStudentError] = useState('');
    
    const { courseId } = useParams();

    const updateThisCourse = (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        updateCourse.callPromise({
            courseId: courseId,
            name: courseName,
            credits: courseCredits
        }).then(() => {
            setShowCourseSuccess(true);
        }).catch((error: any) => {
            setShowCourseError(true);
            const reason = error.reason != null ? error.reason : error.message;
            setCourseError(reason);
            console.log('Message: ' + error.message);
            console.log('Error Type: ' + error.error);
            console.log('Reason: ' + error.reason);
        });
    };

    const addStudentToThisCourse = (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        addStudentToCourse.callPromise({
            courseId: courseId,
            studentId: studentId
        }).then(() => {
            setShowAddStudentSuccess(true);
        }).catch((error: any) => {
            setShowAddStudentError(true);
            const reason = error.reason != null ? error.reason : error.message;
            setAddStudentError(reason);
            console.log('Message: ' + error.message);
            console.log('Error Type: ' + error.error);
            console.log('Reason: ' + error.reason);
        });
    };

    const createNewLesson = (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        createLesson.callPromise({
            courseId: courseId,
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

    let navigate = useNavigate();

    const goToLesson = (lessonId: string) => {
        navigate(`/courses/${courseId}/lesson/${lessonId}`);
    }

    const { course, isLoadingCourse, allLessons, isLoadingLessons, 
        studentSelectMap, isLoadingStudentsInCourse, studentsInCourse, 
        isLoadingStudentsNotInCourse, studentsNotInCourse } = useTracker(() => {
        const courseHandler = Meteor.subscribe('courses.specific', courseId);
        const isLoadingCourse = !courseHandler.ready();
        const course = CoursesCollection.findOne(courseId);

        const lessonHandler = Meteor.subscribe('lessons.forOneCourse', courseId);
        const isLoadingLessons = !lessonHandler.ready();
        const allLessons = LessonsCollection.find().fetch();

        const studentsInCourseHandler = Meteor.subscribe('users.students.inSpecificCourse', courseId);
        const isLoadingStudentsInCourse = !studentsInCourseHandler.ready();
        const studentsInCourse = Meteor.users.find(studentsInCourseHandler.scopeQuery()).fetch();

        const studentsNotInCourseHandler = Meteor.subscribe('users.students.notInSpecificCourse', courseId);
        const isLoadingStudentsNotInCourse = !studentsNotInCourseHandler.ready();
        const studentsNotInCourse = Meteor.users.find(studentsNotInCourseHandler.scopeQuery()).fetch();

        const studentSelectMap = studentsNotInCourse.map((student) => {
            return { value: student._id, inputDisplay: `${student.profile.firstName} ${student.profile.lastName}`, disabled: false }
        });

        return { course, isLoadingCourse, allLessons, isLoadingLessons, 
            studentSelectMap, isLoadingStudentsInCourse, studentsInCourse,
            isLoadingStudentsNotInCourse, studentsNotInCourse };
    }, []);

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
            selector: row => row.startTime,
            format: row => moment(row.startTime).format('HH:mm'),
            sortable: true,
        },
        {
            name: 'End Time',
            selector: row => row.endTime,
            format: row => moment(row.endTime).format('HH:mm'),
            sortable: true,
        },
        {
            name: 'Date (DD-MM-YYYY)',
            selector: row => row.date,
            format: row => moment(row.date).format('DD-MM-YYYY'),
            sortable: true,
        },
        {
            name: 'Actions',
            cell: row => <EuiButton size="s" color="primary" id={row._id} onClick={() => goToLesson(row._id)}>Edit</EuiButton>,
        },
    ];

    const studentColumns: TableColumn<Meteor.User>[] = [
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
        if(course) {
            setCourseName(course.name);
            setCourseCredits(course.credits);
        }
        const timer = setTimeout(() => {
            if(studentsNotInCourse && studentSelectMap) {
                if(studentSelectMap.length == 0) {
                    studentSelectMap.unshift({ value: "", inputDisplay: 'No more students', disabled: true });
                }
                setStudentId(studentSelectMap[0].value);
            }
        }, 2000);

        return () => clearTimeout(timer);
        
    }, [course, studentsNotInCourse, studentSelectMap]);

    return (
        <>
            <EuiPageHeader pageTitle="Edit Course"/>
            <EuiPageContent
                hasBorder={false}
                hasShadow={false}
                paddingSize="none"
                color="plain"
                borderRadius="none"
                grow={true}
            >
                <EuiPageContentBody>
                    { !isLoadingCourse && !isLoadingStudentsNotInCourse &&
                        <EuiFlexGroup >
                            <EuiFlexItem>
                                <EuiPanel>
                                    { showCourseError && 
                                        <EuiCallOut title="An error has occured" color="danger">
                                            <p>{courseError}</p>
                                        </EuiCallOut> 
                                    }
                                    { showCourseSuccess && 
                                        <EuiCallOut title="Success!" color="success">
                                            <p>Course edited sucessfully.</p>
                                        </EuiCallOut> 
                                    }
                                    <EuiForm component="form">
                                        <EuiFlexItem>
                                            <EuiFormRow label="Course Name">
                                                <EuiFieldText value={courseName} onChange={(e) => setCourseName(e.target.value)}/>
                                            </EuiFormRow>
                                        </EuiFlexItem>
                                        <EuiSpacer />
                                        <EuiFlexItem>
                                            <EuiFormRow label="Credits">
                                                <EuiFieldNumber value={courseCredits} onChange={(e) => setCourseCredits(e.target.valueAsNumber)}/>
                                            </EuiFormRow>
                                        </EuiFlexItem>
                                        <EuiFlexItem grow={false}>
                                            <EuiFormRow hasEmptyLabelSpace>
                                                <EuiButton fill color="primary" type="submit" onClick={(e: any) => updateThisCourse(e)}>Update Course</EuiButton>
                                            </EuiFormRow>
                                        </EuiFlexItem>
                                    </EuiForm>
                                </EuiPanel>
                            </EuiFlexItem>

                            <EuiFlexItem>
                                <EuiPanel>
                                    { showAddStudentError && 
                                        <EuiCallOut title="An error has occured" color="danger">
                                            <p>{addStudentError}</p>
                                        </EuiCallOut> 
                                    }
                                    { showAddStudentSuccess && 
                                        <EuiCallOut title="Success!" color="success">
                                            <p>Student sucessfully added to course.</p>
                                        </EuiCallOut> 
                                    }
                                    <EuiForm component="form">
                                        <EuiFlexItem>
                                            <EuiSuperSelect
                                                options={studentSelectMap}
                                                valueOfSelected={studentId}
                                                onChange={(value) => setStudentId(value)}
                                            />
                                        </EuiFlexItem>
                                        <EuiFlexItem grow={false}>
                                            <EuiFormRow hasEmptyLabelSpace>
                                                <EuiButton fill color="primary" type="submit" onClick={(e: any) => addStudentToThisCourse(e)}>Add Student</EuiButton>
                                            </EuiFormRow>
                                        </EuiFlexItem>
                                    </EuiForm>
                                </EuiPanel>
                            </EuiFlexItem>

                            <EuiFlexItem>
                                <EuiPanel>
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
                                                <EuiButton fill color="primary" type="submit" onClick={(e: any) => createNewLesson(e)}>Create Lesson</EuiButton>
                                            </EuiFormRow>
                                        </EuiFlexItem>
                                    </EuiForm>
                                </EuiPanel>
                            </EuiFlexItem>
                        </EuiFlexGroup>
                    }
                    { !isLoadingLessons && 
                        <EuiFlexGroup gutterSize="l">
                            <EuiFlexItem>
                                <EuiPanel>
                                    <EuiTitle>
                                        <h2>Students</h2>
                                    </EuiTitle>
                                    <DataTable
                                        columns={studentColumns}
                                        data={studentsInCourse}
                                        progressPending={isLoadingStudentsInCourse}
                                        pagination
                                        striped
                                        responsive
                                        defaultSortFieldId={1}
                                    />
                                </EuiPanel>
                            </EuiFlexItem>
                            <EuiFlexItem>
                                <EuiPanel>
                                    <EuiTitle>
                                        <h2>Lessons</h2>
                                    </EuiTitle>
                                    <DataTable
                                        columns={columns}
                                        data={allLessons}
                                        progressPending={isLoadingLessons}
                                        pagination
                                        striped
                                        responsive
                                        defaultSortFieldId={1}
                                    />
                                </EuiPanel>
                            </EuiFlexItem>
                        </EuiFlexGroup>
                    }
                </EuiPageContentBody>
            </EuiPageContent>
        </>
    );
}