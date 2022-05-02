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
import { Roles } from 'meteor/alanning:roles';

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
            setShowAddInstructorError(false);
            setShowAddInstructorSuccess(true);
        }).catch((error: any) => {
            setShowAddInstructorSuccess(false);
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
            setShowRemoveInstructorError(false);
            setShowRemoveInstructorSuccess(true);
        }).catch((error: any) => {
            setShowRemoveInstructorSuccess(false);
            setShowRemoveInstructorError(true);
            const reason = error.reason != null ? error.reason : error.message;
            setRemoveInstructorError(reason);
        });
    };

    const { course, addInstructorSelectMap, instructorsInCourse, removeInstructorSelectMap, instructorsNotInCourse } = useTracker(() => {
        Meteor.subscribe('courses.specific', courseId);
        const course = CoursesCollection.findOne(courseId);

        Meteor.subscribe('users.instructors.inSpecificCourse', courseId);
        const instructorsInCourse = Meteor.users.find({ "courses._id": { $eq: courseId }, "role.role._id": 'instructor' }).fetch();

        Meteor.subscribe('users.instructors.notInSpecificCourse', courseId);
        const instructorsNotInCourse = Meteor.users.find({ "courses._id": { $ne: courseId }, "role.role._id": 'instructor' }).fetch();

        let addInstructorSelectMap: { value: string; inputDisplay: string; disabled: boolean; }[] = [];
        if(instructorsNotInCourse) {
            addInstructorSelectMap = instructorsNotInCourse.map((instructor) => {
                return { value: instructor._id, inputDisplay: `${instructor.profile.firstName} ${instructor.profile.lastName}`, disabled: false }
            });
        }
        
        let removeInstructorSelectMap: { value: string; inputDisplay: string; disabled: boolean; }[] = [];
        if(instructorsNotInCourse) {
            removeInstructorSelectMap = instructorsInCourse.map((instructor) => {
                return { value: instructor._id, inputDisplay: `${instructor.profile.firstName} ${instructor.profile.lastName}`, disabled: false }
            });
        }

        return { course, addInstructorSelectMap, instructorsInCourse, removeInstructorSelectMap, instructorsNotInCourse };
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
                    { Roles.userIsInRole(Meteor.userId(), 'admin') &&
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

                    <EuiFlexGroup gutterSize="l">
                        <EuiFlexItem>
                            <EuiPanel>
                                <DataTable
                                    title="Instructors"
                                    columns={studentColumns}
                                    data={instructorsInCourse}
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