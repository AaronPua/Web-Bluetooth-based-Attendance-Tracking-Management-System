import { EuiForm, EuiFlexGroup, EuiFlexItem, EuiFormRow, EuiButton, EuiCallOut, EuiPageContent, 
    EuiPageContentBody, EuiPageHeader, EuiPanel, EuiTitle, EuiSpacer, EuiSuperSelect } from '@elastic/eui';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import React, { useEffect, useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { useParams } from "react-router-dom";
import _ from 'underscore';
import { CoursesCollection } from '../../../api/courses/CoursesCollection';
import { addInstructorToCourse, removeInstructorFromCourse } from '../../../api/courses/CoursesMethods';

export const Instructors = () => {
    const [addInstructorId, setAddInstructorId] = useState('');
    const [removeInstructorId, setRemoveInstructorId] = useState('');
    const [courseName, setCourseName] = useState('');

    const [showAddInstructorSuccess, setShowAddInstructorSuccess] = useState(false);
    const [showAddInstructorError, setShowAddInstructorError] = useState(false);
    const [addInstructorError, setAddInstructorError] = useState('');

    const [showRemoveInstructorSuccess, setShowRemoveInstructorSuccess] = useState(false);
    const [showRemoveInstructorError, setShowRemoveInstructorError] = useState(false);
    const [removeInstructorError, setRemoveInstructorError] = useState('');
    
    const { courseId } = useParams();

    const addInstructorToThisCourse = (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        addInstructorToCourse.callPromise({
            courseId: courseId,
            instructorId: addInstructorId
        }).then(() => {
            setShowAddInstructorSuccess(true);
        }).catch((error: any) => {
            setShowAddInstructorError(true);
            const reason = error.reason != null ? error.reason : error.message;
            setAddInstructorError(reason);
        });
    };

    const removeInstructorFromThisCourse = (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        removeInstructorFromCourse.callPromise({
            courseId: courseId,
            instructorId: removeInstructorId
        }).then(() => {
            setShowRemoveInstructorSuccess(true);
        }).catch((error: any) => {
            setShowRemoveInstructorError(true);
            const reason = error.reason != null ? error.reason : error.message;
            setRemoveInstructorError(reason);
        });
    };

    const { course, isLoadingCourse, addInstructorSelectMap, isLoadingInstructorsInCourse, instructorsInCourse, 
        removeInstructorSelectMap, isLoadingInstructorsNotInCourse, instructorsNotInCourse } = useTracker(() => {
        const courseHandler = Meteor.subscribe('courses.specific', courseId);
        const isLoadingCourse = !courseHandler.ready();
        const course = CoursesCollection.findOne(courseId);

        const instructorsInCourseHandler = Meteor.subscribe('users.instructors.inSpecificCourse', courseId);
        const isLoadingInstructorsInCourse = !instructorsInCourseHandler.ready();
        const instructorsInCourse = Meteor.users.find(instructorsInCourseHandler.scopeQuery()).fetch();

        const instructorsNotInCourseHandler = Meteor.subscribe('users.instructors.notInSpecificCourse', courseId);
        const isLoadingInstructorsNotInCourse = !instructorsNotInCourseHandler.ready();
        const instructorsNotInCourse = Meteor.users.find(instructorsNotInCourseHandler.scopeQuery()).fetch();

        const addInstructorSelectMap = instructorsNotInCourse.map((instructor) => {
            return { value: instructor._id, inputDisplay: `${instructor.profile.firstName} ${instructor.profile.lastName}`, disabled: false }
        });

        const removeInstructorSelectMap = instructorsInCourse.map((instructor) => {
            return { value: instructor._id, inputDisplay: `${instructor.profile.firstName} ${instructor.profile.lastName}`, disabled: false }
        });

        return { course, isLoadingCourse, addInstructorSelectMap, isLoadingInstructorsInCourse, instructorsInCourse,
            removeInstructorSelectMap, isLoadingInstructorsNotInCourse, instructorsNotInCourse };
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
        if(course && !isLoadingCourse) {
            setCourseName(course.name);
        }
        
        if(instructorsNotInCourse && addInstructorSelectMap) {
            if(addInstructorSelectMap.length == 0) {
                addInstructorSelectMap.unshift({ value: "", inputDisplay: 'No more instructors', disabled: true });
            }
            setAddInstructorId(addInstructorSelectMap[0].value);
        }

        if(instructorsInCourse && removeInstructorSelectMap) {
            if(removeInstructorSelectMap.length == 0) {
                removeInstructorSelectMap.unshift({ value: "", inputDisplay: 'No more instructors', disabled: true });
            }
            setRemoveInstructorId(removeInstructorSelectMap[0].value);
        }
    }, [course, instructorsNotInCourse, addInstructorSelectMap, instructorsInCourse, removeInstructorSelectMap]);

    return (
        <>
            <EuiPageHeader pageTitle={`${courseName}: Instructors`}/>
            <EuiPageContent
                hasBorder={false}
                hasShadow={false}
                paddingSize="none"
                color="plain"
                borderRadius="none"
                grow={true}
            >
                <EuiPageContentBody>
                    { Roles.userIsInRole(Meteor.userId(), 'admin') && !isLoadingInstructorsInCourse && !isLoadingInstructorsNotInCourse &&
                        <EuiFlexGroup >
                            <EuiFlexItem>
                                <EuiPanel>
                                    <EuiTitle size="s">
                                        <h4>Add Instructor</h4>
                                    </EuiTitle>
                                    <EuiSpacer />
                                    { showAddInstructorError && 
                                        <EuiCallOut title="An error has occured" color="danger" iconType="alert">
                                            <p>{addInstructorError}</p>
                                        </EuiCallOut> 
                                    }
                                    { showAddInstructorSuccess && 
                                        <EuiCallOut title="Success!" color="success" iconType="user">
                                            <p>Instructor sucessfully added to course.</p>
                                        </EuiCallOut> 
                                    }
                                    <EuiForm component="form">
                                        <EuiFlexGroup style={{ maxWidth: 500 }}>
                                            <EuiFlexItem>
                                                <EuiSuperSelect
                                                    options={addInstructorSelectMap}
                                                    valueOfSelected={addInstructorId}
                                                    onChange={(value) => setAddInstructorId(value)}
                                                />
                                            </EuiFlexItem>

                                            <EuiFlexItem grow={false}>
                                                <EuiFormRow>
                                                    <EuiButton fill color="primary" type="submit" 
                                                        onClick={(e: any) => addInstructorToThisCourse(e)}>Add</EuiButton>
                                                </EuiFormRow>
                                            </EuiFlexItem>
                                        </EuiFlexGroup>
                                    </EuiForm>
                                </EuiPanel>
                            </EuiFlexItem>

                            <EuiFlexItem>
                                <EuiPanel>
                                    <EuiTitle size="s">
                                        <h4>Remove Instructor</h4>
                                    </EuiTitle>
                                    <EuiSpacer />
                                    { showRemoveInstructorError && 
                                        <EuiCallOut title="An error has occured" color="danger" iconType="alert">
                                            <p>{removeInstructorError}</p>
                                        </EuiCallOut> 
                                    }
                                    { showRemoveInstructorSuccess && 
                                        <EuiCallOut title="Success!" color="success" iconType="user">
                                            <p>Instructor sucessfully removed from course.</p>
                                        </EuiCallOut> 
                                    }
                                    <EuiForm component="form">
                                        <EuiFlexGroup style={{ maxWidth: 500 }}>
                                            <EuiFlexItem>
                                                <EuiSuperSelect
                                                    options={removeInstructorSelectMap}
                                                    valueOfSelected={removeInstructorId}
                                                    onChange={(value) => setRemoveInstructorId(value)}
                                                />
                                            </EuiFlexItem>

                                            <EuiFlexItem grow={false}>
                                                <EuiFormRow>
                                                    <EuiButton fill color="primary" type="submit" 
                                                        onClick={(e: any) => removeInstructorFromThisCourse(e)}>Remove</EuiButton>
                                                </EuiFormRow>
                                            </EuiFlexItem>
                                        </EuiFlexGroup>
                                    </EuiForm>
                                </EuiPanel>
                            </EuiFlexItem>
                        </EuiFlexGroup>
                    }

                    { !isLoadingInstructorsInCourse && 
                        <EuiFlexGroup gutterSize="l">
                            <EuiFlexItem>
                                <EuiPanel>
                                    <DataTable
                                        title="Instructors"
                                        columns={studentColumns}
                                        data={instructorsInCourse}
                                        progressPending={isLoadingInstructorsInCourse}
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