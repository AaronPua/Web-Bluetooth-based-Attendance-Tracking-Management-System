import { EuiForm, EuiFlexGroup, EuiFlexItem, EuiFormRow, EuiButton, EuiCallOut, EuiPageContent, 
    EuiPageContentBody, EuiPageHeader, EuiPanel, EuiTitle, EuiSpacer, EuiSuperSelect } from '@elastic/eui';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import React, { useEffect, useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { useParams } from "react-router-dom";
import _ from 'underscore';
import { CoursesCollection } from '../../../api/courses/CoursesCollection';
import { addStudentToCourse, removeStudentFromCourse } from '../../../api/courses/CoursesMethods';

export default function Students() {
    const [addStudentId, setAddStudentId] = useState('');
    const [removeStudentId, setRemoveStudentId] = useState('');
    const [courseName, setCourseName] = useState('');

    const [showAddStudentSuccess, setShowAddStudentSuccess] = useState(false);
    const [showAddStudentError, setShowAddStudentError] = useState(false);
    const [addStudentError, setAddStudentError] = useState('');

    const [showRemoveStudentSuccess, setShowRemoveStudentSuccess] = useState(false);
    const [showRemoveStudentError, setShowRemoveStudentError] = useState(false);
    const [removeStudentError, setRemoveStudentError] = useState('');
    
    const { courseId } = useParams();

    const addStudentToThisCourse = (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        addStudentToCourse.callPromise({
            courseId: courseId,
            studentId: addStudentId
        }).then(() => {
            setShowAddStudentSuccess(true);
        }).catch((error: any) => {
            setShowAddStudentError(true);
            const reason = error.reason != null ? error.reason : error.message;
            setAddStudentError(reason);
        });
    };

    const removeStudentFromThisCourse = (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        removeStudentFromCourse.callPromise({
            courseId: courseId,
            studentId: removeStudentId
        }).then(() => {
            setShowRemoveStudentSuccess(true);
        }).catch((error: any) => {
            setShowRemoveStudentError(true);
            const reason = error.reason != null ? error.reason : error.message;
            setRemoveStudentError(reason);
        });
    };

    const { course, isLoadingCourse, addStudentSelectMap, isLoadingStudentsInCourse, studentsInCourse, 
        removeStudentSelectMap, isLoadingStudentsNotInCourse, studentsNotInCourse } = useTracker(() => {
        const courseHandler = Meteor.subscribe('courses.specific', courseId);
        const isLoadingCourse = !courseHandler.ready();
        const course = CoursesCollection.findOne(courseId);

        const studentsInCourseHandler = Meteor.subscribe('users.students.inSpecificCourse', courseId);
        const isLoadingStudentsInCourse = !studentsInCourseHandler.ready();
        const studentsInCourse = Meteor.users.find(studentsInCourseHandler.scopeQuery()).fetch();

        const studentsNotInCourseHandler = Meteor.subscribe('users.students.notInSpecificCourse', courseId);
        const isLoadingStudentsNotInCourse = !studentsNotInCourseHandler.ready();
        const studentsNotInCourse = Meteor.users.find(studentsNotInCourseHandler.scopeQuery()).fetch();

        const addStudentSelectMap = studentsNotInCourse.map((student) => {
            return { value: student._id, inputDisplay: `${student.profile.firstName} ${student.profile.lastName}`, disabled: false }
        });

        const removeStudentSelectMap = studentsInCourse.map((student) => {
            return { value: student._id, inputDisplay: `${student.profile.firstName} ${student.profile.lastName}`, disabled: false }
        });

        return { course, isLoadingCourse, addStudentSelectMap, isLoadingStudentsInCourse, studentsInCourse,
            removeStudentSelectMap, isLoadingStudentsNotInCourse, studentsNotInCourse };
    }, []);

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
        }
        
        if(studentsNotInCourse && addStudentSelectMap) {
            if(addStudentSelectMap.length == 0) {
                addStudentSelectMap.unshift({ value: "", inputDisplay: 'No more students', disabled: true });
            }
            setAddStudentId(addStudentSelectMap[0].value);
        }

        if(studentsInCourse && removeStudentSelectMap) {
            if(removeStudentSelectMap.length == 0) {
                removeStudentSelectMap.unshift({ value: "", inputDisplay: 'No more students', disabled: true });
            }
            setRemoveStudentId(removeStudentSelectMap[0].value);
        }
    }, [course, studentsNotInCourse, addStudentSelectMap, studentsInCourse, removeStudentSelectMap]);

    return (
        <>
            <EuiPageHeader pageTitle={`${courseName}: Students`}/>
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
                                    <EuiTitle size="s">
                                        <h4>Add Student</h4>
                                    </EuiTitle>
                                    <EuiSpacer />
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
                                        <EuiFlexGroup style={{ maxWidth: 500 }}>
                                            <EuiFlexItem>
                                                <EuiSuperSelect
                                                    options={addStudentSelectMap}
                                                    valueOfSelected={addStudentId}
                                                    onChange={(value) => setAddStudentId(value)}
                                                />
                                            </EuiFlexItem>

                                            <EuiFlexItem grow={false}>
                                                <EuiFormRow>
                                                    <EuiButton fill color="primary" type="submit" 
                                                        onClick={(e: any) => addStudentToThisCourse(e)}>Add</EuiButton>
                                                </EuiFormRow>
                                            </EuiFlexItem>
                                        </EuiFlexGroup>
                                    </EuiForm>
                                </EuiPanel>
                            </EuiFlexItem>

                            <EuiFlexItem>
                                <EuiPanel>
                                    <EuiTitle size="s">
                                        <h4>Remove Student</h4>
                                    </EuiTitle>
                                    <EuiSpacer />
                                    { showRemoveStudentError && 
                                        <EuiCallOut title="An error has occured" color="danger">
                                            <p>{removeStudentError}</p>
                                        </EuiCallOut> 
                                    }
                                    { showRemoveStudentSuccess && 
                                        <EuiCallOut title="Success!" color="success">
                                            <p>Student sucessfully removed from course.</p>
                                        </EuiCallOut> 
                                    }
                                    <EuiForm component="form">
                                        <EuiFlexGroup style={{ maxWidth: 500 }}>
                                            <EuiFlexItem>
                                                <EuiSuperSelect
                                                    options={removeStudentSelectMap}
                                                    valueOfSelected={removeStudentId}
                                                    onChange={(value) => setRemoveStudentId(value)}
                                                />
                                            </EuiFlexItem>

                                            <EuiFlexItem grow={false}>
                                                <EuiFormRow>
                                                    <EuiButton fill color="primary" type="submit" 
                                                        onClick={(e: any) => removeStudentFromThisCourse(e)}>Remove</EuiButton>
                                                </EuiFormRow>
                                            </EuiFlexItem>
                                        </EuiFlexGroup>
                                    </EuiForm>
                                </EuiPanel>
                            </EuiFlexItem>
                        </EuiFlexGroup>
                    }
                    <EuiSpacer />
                    { !isLoadingStudentsInCourse && 
                        <EuiFlexGroup gutterSize="l">
                            <EuiFlexItem>
                                <EuiPanel>
                                    <DataTable
                                        title="Enrolled Students"
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
                        </EuiFlexGroup>
                    }
                </EuiPageContentBody>
            </EuiPageContent>
        </>
    );
}