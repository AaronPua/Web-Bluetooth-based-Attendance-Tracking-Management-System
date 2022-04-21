import { EuiButton, EuiFieldText, EuiFlexGroup, EuiFlexItem, EuiPageContent, 
    EuiPageContentBody, EuiPageHeader, EuiPanel, EuiConfirmModal, EuiFormRow, EuiCallOut } from '@elastic/eui';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import React, { useMemo, useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { useNavigate } from 'react-router';
import _ from 'underscore';
import { BeaconsCollection } from '/imports/api/beacons/BeaconsCollection';
import { removeBeacon } from '/imports/api/beacons/BeaconsMethods';

export const BeaconsList = () => {

    const [showRemoveSuccess, setShowRemoveSuccess] = useState(false);
    const [showRemoveError, setShowRemoveError] = useState(false);
    const [removeError, setRemoveError] = useState('');

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [beaconId, setBeaconId] = useState('');
    const [beaconName, setBeaconName] = useState('');
    const [value, setValue] = useState('');
    const onChange = (e: any) => {
        setValue(e.target.value);
    };

    const { isLoading, allBeacons } = useTracker(() => {
        const beaconsSub = Meteor.subscribe('beacons.all.withCourse');
        const isLoading = !beaconsSub.ready()
        const beacons = BeaconsCollection.find(beaconsSub.scopeQuery()).fetch();

        const allBeacons = _.map(beacons, (beacon) => {
            return { beaconId: beacon._id, beaconName: beacon.name, courseId: beacon.course[0]._id , courseName: beacon.course[0].name };
        });

        return { isLoading, allBeacons }
    });

    let navigate = useNavigate();

    const goToBeacon = (courseId: string | undefined, beaconId: string) => {
        navigate(`/courses/${courseId}/beacons/${beaconId}`);
    }

    const showRemoveBeaconModal = (beaconId: string, beaconName: string) => {
        setIsModalVisible(true);
        setBeaconId(beaconId);
        setBeaconName(beaconName);
    }

    const removeThisBeacon = (beaconId: string) => {
        removeBeacon.callPromise({
            beaconId: beaconId
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
                title={`Remove ${beaconName}?`}
                onCancel={() => {
                    setIsModalVisible(false);
                    setValue('');
                }}
                onConfirm={() => {
                    removeThisBeacon(beaconId);
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
        beaconId: string;
        courseId: string;
        courseName: string;
        beaconName: string;
    }

    const columns: TableColumn<DataRow>[] = [
        {
            name: 'Course',
            selector: row => row.courseName,
            sortable: true,
        },
        {
            name: 'Beacon',
            selector: row => row.beaconName,
            sortable: true,
        },
        {
            name: 'Actions',
            cell: row => (
                <>
                    <EuiButton size="s" color="primary" id={row.beaconId} onClick={() => goToBeacon(row.courseId, row.beaconId)} 
                        style={{ marginRight: "1em" }}>Edit</EuiButton>
                    <EuiButton size="s" color="text" id={row.beaconId} onClick={() => showRemoveBeaconModal(row.beaconId, row.beaconName)}>Remove</EuiButton>
                    { modal }
                </>
            ),
        },
    ];

    const [filterText, setFilterText] = useState('');
    const filteredItems = allBeacons.filter(
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
            <EuiPageHeader pageTitle="All Beacons" />
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
                                        <p>Beacon removed sucessfully.</p>
                                    </EuiCallOut>
                                }
                                <DataTable
                                    title="Beacons"
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