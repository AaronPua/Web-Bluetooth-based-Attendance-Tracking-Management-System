import { EuiButton, EuiFieldText, EuiFlexGroup, EuiFlexItem, EuiPageContent, 
    EuiPageContentBody, EuiPageHeader, EuiPanel, EuiConfirmModal, EuiFormRow, EuiCallOut } from '@elastic/eui';
import { Meteor } from 'meteor/meteor';
import { useSubscribe, useFind } from 'meteor/react-meteor-data';
import moment from 'moment';
import React, { useMemo, useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { useNavigate } from 'react-router';
import _ from 'underscore';
import { removeUser } from '/imports/api/users/UsersMethods';

export const Users = () => {

    const [showRemoveSuccess, setShowRemoveSuccess] = useState(false);
    const [showRemoveError, setShowRemoveError] = useState(false);
    const [removeError, setRemoveError] = useState('');

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [userId, setUserId] = useState('');
    const [userName, setUserName] = useState('');
    const [value, setValue] = useState('');
    const onChange = (e: any) => {
        setValue(e.target.value);
    };

    const isLoading = useSubscribe('users.all');
    const allUsers = useFind(() => Meteor.users.find());

    let navigate = useNavigate();

    const goToUser = (userId: string) => {
        navigate(`/users/${userId}`);
    }

    const showRemoveUserModal = (userId: string, firstName: string, lastName: string) => {
        setIsModalVisible(true);
        setUserId(userId);
        setUserName(`${firstName} ${lastName}`);
    }

    const removeThisUser = (userId: string) => {
        removeUser.callPromise({
            userId: userId
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
                title={`Remove ${userName}?`}
                onCancel={() => {
                    setIsModalVisible(false);
                    setValue('');
                }}
                onConfirm={() => {
                    removeThisUser(userId);
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
        },
        {
            name: 'Email',
            selector: row => row.emails[0].address,
            sortable: true,
        },
        {
            name: 'Gender',
            selector: row => row.profile.gender,
            sortable: true,
        },
        {
            name: 'Registered Date',
            selector: (row: any) => row.createdAt,
            format: row => moment(row.createdAt).format('YYYY-MM-DD'),
            sortable: true,
        },
        {
            name: 'Actions',
            cell: row => (
                <>
                    <EuiButton size="s" color="primary" id={row._id} onClick={() => goToUser(row._id)} style={{ marginRight: "1em" }}>Edit</EuiButton>
                    { Roles.userIsInRole(Meteor.userId(), 'admin') &&
                        <EuiButton size="s" color="text" id={row._id} 
                            onClick={() => showRemoveUserModal(row._id, row.profile.firstName, row.profile.lastName) }>Remove</EuiButton>
                    }
                        { modal }
                </>
            
            ),
        },
    ];

    const [filterText, setFilterText] = useState('');
    const filteredItems = allUsers.filter(
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
            <EuiPageHeader pageTitle="All Users" />
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
                                        <p>User removed sucessfully.</p>
                                    </EuiCallOut>
                                }
                                <DataTable
                                    title="Users"
                                    columns={columns}
                                    data={filteredItems}
                                    progressPending={isLoading()}
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