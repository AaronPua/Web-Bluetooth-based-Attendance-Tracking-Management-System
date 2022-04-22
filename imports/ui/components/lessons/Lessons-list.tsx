import { EuiButton, EuiFieldText, EuiFlexGroup, EuiFlexItem, EuiPageContent, 
    EuiPageContentBody, EuiPageHeader, EuiPanel, EuiConfirmModal, EuiFormRow, EuiCallOut } from '@elastic/eui';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import moment from 'moment';
import React, { useMemo, useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { useNavigate } from 'react-router';
import _ from 'underscore';
import { CoursesCollection } from '/imports/api/courses/CoursesCollection';
import { LessonsCollection } from '/imports/api/lessons/LessonsCollection';
import { removeLesson } from '/imports/api/lessons/LessonsMethods';

export const LessonsList = () => {

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

    const { isLoading, allLessons, instructorLessons } = useTracker(() => {
        const lessonsSub = Meteor.subscribe('lessons.all.withCourse');
        const isLoading = !lessonsSub.ready()
        const lessons = LessonsCollection.find(lessonsSub.scopeQuery()).fetch();

        const allLessons = _.map(lessons, (lesson) => {
            return { 
                lessonId: lesson._id,
                lessonName: lesson.name,
                lessonStartTime: lesson.startTime,
                lessonEndTime: lesson.endTime,
                lessonDate: lesson.date,
                courseId: lesson.courseId,
                courseName: lesson.course[0].name
            };
        });

        const userCoursesSub = Meteor.subscribe('courses.currentUser');
        const userCourses = CoursesCollection.find(userCoursesSub.scopeQuery()).fetch();
        const userCourseIds = _.pluck(userCourses, '_id');

        const userCoursesLessonsSub = Meteor.subscribe('lessons.forMultipleCourses', userCourseIds);
        const userCoursesLessons = LessonsCollection.find(userCoursesLessonsSub.scopeQuery()).fetch();

        const instructorLessons = _.map(userCoursesLessons, (lesson) => {
            return { 
                lessonId: lesson._id,
                lessonName: lesson.name,
                lessonStartTime: lesson.startTime,
                lessonEndTime: lesson.endTime,
                lessonDate: lesson.date,
                courseId: lesson.courseId,
                courseName: lesson.course[0].name
            };
        });

        console.log(instructorLessons);

        return { isLoading, allLessons, instructorLessons };
    });

    let navigate = useNavigate();

    const goToLesson = (courseId: string | undefined, lessonId: string) => {
        navigate(`/courses/${courseId}/lessons/${lessonId}`);
    }

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
        lessonId: string,
        lessonName: string,
        lessonStartTime: Date,
        lessonEndTime: Date,
        lessonDate: Date,
        courseId: string,
        courseName: string
    }

    const columns: TableColumn<DataRow>[] = [
        {
            name: 'Course',
            selector: row => row.courseName,
            sortable: true,
        },
        {
            name: 'Lesson',
            selector: row => row.lessonName,
            sortable: true,
        },
        {
            name: 'Start Time',
            selector: (row: any) => row.lessonStartTime,
            format: row => moment(row.lessonStartTime).format('hh:mm a'),
            sortable: true,
        },
        {
            name: 'End Time',
            selector: (row: any) => row.lessonEndTime,
            format: row => moment(row.lessonEndTime).format('hh:mm a'),
            sortable: true,
        },
        {
            name: 'Date',
            selector: (row: any) => row.lessonDate,
            format: row => moment(row.lessonDate).format('DD-MM-YYYY'),
            sortable: true,
        },
        {
            name: 'Actions',
            cell: row => (
                <>
                    <EuiButton size="s" color="primary" id={row.lessonId} onClick={() => goToLesson(row.courseId, row.lessonId)} 
                        style={{ marginRight: "1em" }}>Edit</EuiButton>
                    <EuiButton size="s" color="text" id={row.lessonId} onClick={() => showRemoveLessonModal(row.lessonId, row.lessonName)}>Remove</EuiButton>
                    { modal }
                </>
            ),
        },
    ];

    const lessons = Roles.userIsInRole(Meteor.userId(), 'admin') ? allLessons : instructorLessons;

    const [filterText, setFilterText] = useState('');
    const filteredItems = lessons.filter(
        (user) => JSON.stringify(_.omit(user, '_id', 'services', 'courses'))
                    .replace(/("\w+":)/g, '').toLowerCase().indexOf(filterText.toLowerCase()) !== -1
    );

    const subHeaderComponentMemo = useMemo(() => {
		const handleClear = () => {
			if (filterText) {
				setFilterText('');
			}
		};

		return (
            <>
                <EuiFieldText
                    placeholder="Filter"
                    value={filterText}
                    onChange={e => setFilterText(e.target.value)}
                    append={
                        <EuiButton color='text' onClick={() => handleClear()}>
                            X
                        </EuiButton>
                    }
                />
            </>
		);
	}, [filterText]);

    return (
        <>
            <EuiPageHeader pageTitle="All Lessons" />
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
                                    title="Lessons"
                                    columns={columns}
                                    data={filteredItems}
                                    progressPending={isLoading}
                                    pagination
                                    striped
                                    responsive
                                    subHeader
			                        subHeaderComponent={subHeaderComponentMemo}
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