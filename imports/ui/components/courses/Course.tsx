import { EuiForm, EuiFlexGroup, EuiFlexItem, EuiFormRow, EuiFieldText, EuiButton, EuiCallOut, 
    EuiFieldNumber, EuiPageContent, EuiPageContentBody, EuiPageHeader, EuiPanel, EuiTitle,
    EuiSpacer, EuiStat, EuiSplitPanel } from '@elastic/eui';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { CoursesCollection } from '../../../api/courses/CoursesCollection';
import { updateCourse } from '../../../api/courses/CoursesMethods';
import { LessonsCollection } from '../../../api/lessons/LessonsCollection';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { BeaconsCollection } from '../../../api/beacons/BeaconsCollection';

export const Course = () => {
    const [courseName, setCourseName] = useState('');
    const [courseCredits, setCourseCredits] = useState(1);

    const [showCourseSuccess, setShowCourseSuccess] = useState(false);
    const [showCourseError, setShowCourseError] = useState(false);
    const [courseError, setCourseError] = useState('');
    
    const { courseId } = useParams();
    let navigate = useNavigate();

    const viewStudents = () => {
        navigate(`/courses/${courseId}/students`);
    }

    const viewInstructors = () => {
        navigate(`/courses/${courseId}/instructors`);
    }

    const viewLessons = () => {
        navigate(`/courses/${courseId}/lessons`);
    }

    const viewBeacons = () => {
        navigate(`/courses/${courseId}/beacons`);
    }

    type FormInputs = {
        name: string,
        credits: number
    }

    const updateCourseForm = useFormik({
        initialValues: {
            name: courseName,
            credits: courseCredits
        },
        enableReinitialize: true,
        validationSchema: yup.object().shape({
            name: yup.string().required('Course Name is required'),
            credits: yup.number().integer('Credits must be an integer').positive('Credits must be a positive number').required('Credits is required'),
        }),
        onSubmit: (values, { setSubmitting }) => {
            updateThisCourse(courseId, values);
            Meteor.setTimeout(() => { setSubmitting(false) }, 500);
        }
    });

    const updateThisCourse = (courseId: string | undefined, values: FormInputs) => {
        updateCourse.callPromise({
            courseId: courseId,
            name: values.name,
            credits: values.credits
        }).then(() => {
            setShowCourseError(false);
            setShowCourseSuccess(true);
        }).catch((error: any) => {
            setShowCourseSuccess(false);
            setShowCourseError(true);
            const reason = error.reason != null ? error.reason : error.message;
            setCourseError(reason);
        });
    };

    const { course, allLessons, studentsInCourse, instructorsInCourse, beaconsInCourse } = useTracker(() => {
        Meteor.subscribe('courses.specific', courseId);
        const course = CoursesCollection.findOne(courseId);

        Meteor.subscribe('lessons.forOneCourse', courseId);
        const allLessons = LessonsCollection.find().fetch();

        Meteor.subscribe('users.students.inSpecificCourse', courseId);
        const studentsInCourse = Meteor.users.find({ "role.role._id": 'student' }).fetch();

        Meteor.subscribe('users.instructors.inSpecificCourse', courseId);
        const instructorsInCourse = Meteor.users.find({ "role.role._id": 'instructor' }).fetch();

        Meteor.subscribe('beacons.forOneCourse', courseId);
        const beaconsInCourse = BeaconsCollection.find().fetch();

        return { course, allLessons, studentsInCourse, instructorsInCourse, beaconsInCourse };
    }, []);

    useEffect(() => {
        if(course) {
            setCourseName(course.name);
            setCourseCredits(course.credits);
        }
    }, [course]);

    return (
        <>
            <EuiPageHeader pageTitle={`${courseName}`}/>
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
                                    <h4>Edit Course</h4>
                                </EuiTitle>
                                <EuiSpacer />
                                { showCourseError && 
                                    <EuiCallOut title="An error has occured" color="danger" iconType="alert">
                                        <p>{courseError}</p>
                                    </EuiCallOut> 
                                }
                                { showCourseSuccess && 
                                    <EuiCallOut title="Success!" color="success" iconType="user">
                                        <p>Course updated sucessfully.</p>
                                    </EuiCallOut> 
                                }
                                <EuiForm component="form" onSubmit={updateCourseForm.handleSubmit}>
                                    <EuiFlexGroup style={{ maxWidth: 1000 }}>
                                        <EuiFlexItem>
                                            <EuiFormRow label="Course Name" error={updateCourseForm.errors.name} isInvalid={!!updateCourseForm.errors.name}>
                                                <EuiFieldText {...updateCourseForm.getFieldProps('name')} isInvalid={!!updateCourseForm.errors.name} />
                                            </EuiFormRow>
                                        </EuiFlexItem>
                                        <EuiFlexItem>
                                            <EuiFormRow label="Credits" error={updateCourseForm.errors.credits} isInvalid={!!updateCourseForm.errors.credits}>
                                                <EuiFieldNumber {...updateCourseForm.getFieldProps('credits')} isInvalid={!!updateCourseForm.errors.credits}/>
                                            </EuiFormRow>
                                        </EuiFlexItem>
                                        <EuiFlexItem grow={false}>
                                            <EuiFormRow hasEmptyLabelSpace>
                                                <EuiButton fill color="primary" type="submit" isLoading={updateCourseForm.isSubmitting}>Update</EuiButton>
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
                            <EuiPanel>
                                <EuiTitle size="s">
                                    <h4>Lessons</h4>
                                </EuiTitle>
                                <EuiSpacer />
                                <EuiSplitPanel.Outer hasShadow={false}>
                                    <EuiSplitPanel.Inner color="primary">
                                        <EuiStat
                                            title={allLessons ? allLessons.length : 0}
                                            description=""
                                            textAlign="center"
                                        />
                                    </EuiSplitPanel.Inner>
                                    <EuiSplitPanel.Inner>
                                        <EuiFlexGroup justifyContent="spaceAround">
                                            <EuiFlexItem grow={false}>
                                                <EuiButton color="primary" size="s" onClick={() => viewLessons()}>View Lessons</EuiButton>    
                                            </EuiFlexItem>
                                        </EuiFlexGroup>
                                    </EuiSplitPanel.Inner>
                                </EuiSplitPanel.Outer>
                            </EuiPanel>
                        </EuiFlexItem>

                        <EuiFlexItem>
                            <EuiPanel>
                                <EuiTitle size="s">
                                    <h4>Students</h4>
                                </EuiTitle>
                                <EuiSpacer />
                                <EuiSplitPanel.Outer hasShadow={false}>
                                    <EuiSplitPanel.Inner color="success">
                                        <EuiStat
                                            title={studentsInCourse ? studentsInCourse.length : 0}
                                            description=""
                                            textAlign="center"
                                        />
                                    </EuiSplitPanel.Inner>
                                    <EuiSplitPanel.Inner>
                                        <EuiFlexGroup justifyContent="spaceAround">
                                            <EuiFlexItem grow={false}>
                                                <EuiButton color="success" size="s" onClick={() => viewStudents()}>View Students</EuiButton>    
                                            </EuiFlexItem>
                                        </EuiFlexGroup>
                                    </EuiSplitPanel.Inner>
                                </EuiSplitPanel.Outer>
                            </EuiPanel>
                        </EuiFlexItem>

                        <EuiFlexItem>
                            <EuiPanel>
                                <EuiTitle size="s">
                                    <h4>Instructors</h4>
                                </EuiTitle>
                                <EuiSpacer />
                                <EuiSplitPanel.Outer hasShadow={false}>
                                    <EuiSplitPanel.Inner color="warning">
                                        <EuiStat
                                            title={instructorsInCourse ? instructorsInCourse.length : 0}
                                            description=""
                                            textAlign="center"
                                        />
                                    </EuiSplitPanel.Inner>
                                    <EuiSplitPanel.Inner>
                                        <EuiFlexGroup justifyContent="spaceAround">
                                            <EuiFlexItem grow={false}>
                                                <EuiButton color="warning" size="s" onClick={() => viewInstructors()}>View Instructors</EuiButton>    
                                            </EuiFlexItem>
                                        </EuiFlexGroup>
                                    </EuiSplitPanel.Inner>
                                </EuiSplitPanel.Outer>
                            </EuiPanel>
                        </EuiFlexItem>

                        <EuiFlexItem>
                            <EuiPanel>
                                <EuiTitle size="s">
                                    <h4>Beacons</h4>
                                </EuiTitle>
                                <EuiSpacer />
                                <EuiSplitPanel.Outer hasShadow={false}>
                                    <EuiSplitPanel.Inner color="accent">
                                        <EuiStat
                                            title={beaconsInCourse ? beaconsInCourse.length : 0}
                                            description=""
                                            textAlign="center"
                                        />
                                    </EuiSplitPanel.Inner>
                                    <EuiSplitPanel.Inner>
                                        <EuiFlexGroup justifyContent="spaceAround">
                                            <EuiFlexItem grow={false}>
                                                <EuiButton color="accent" size="s" onClick={() => viewBeacons()}>View Beacons</EuiButton>    
                                            </EuiFlexItem>
                                        </EuiFlexGroup>
                                    </EuiSplitPanel.Inner>
                                </EuiSplitPanel.Outer>
                            </EuiPanel>
                        </EuiFlexItem>
                        
                    </EuiFlexGroup>

                </EuiPageContentBody>
            </EuiPageContent>
        </>
    );
}