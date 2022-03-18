import { EuiButton, EuiFieldText, EuiFlexGroup, EuiFlexItem, EuiPageContent, EuiPageContentBody, EuiPageHeader, EuiPanel } from '@elastic/eui';
import { useSubscribe, useFind } from 'meteor/react-meteor-data';
import moment from 'moment';
import React, { useMemo, useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import _ from 'underscore';

export default function Users() {

    const isLoading = useSubscribe('users.all');
    const allUsers = useFind(() => Meteor.users.find());

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
            selector: row => row.createdAt,
            format: row => moment(row.createdAt).format('YYYY-MM-DD'),
            sortable: true,
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
                                <DataTable
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