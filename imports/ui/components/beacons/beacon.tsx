import { EuiForm, EuiFlexGroup, EuiFlexItem, EuiFormRow, EuiFieldText, EuiButton, EuiCallOut, 
    EuiPageContent, EuiPageContentBody, EuiPageHeader, EuiPanel, EuiSpacer, EuiTitle } from '@elastic/eui';
import React, { useEffect, useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { updateBeacon } from '/imports/api/beacons/BeaconsMethods';
import { Meteor } from 'meteor/meteor';
import { BeaconsCollection } from '/imports/api/beacons/BeaconsCollection';

export default function Beacon() {
    const { courseId, beaconId } = useParams();

    const [name, setName] = useState('');
    const [uuidString, setUuidString] = useState('');

    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');

    const updateBeaconForm = useFormik({
        initialValues: {
            name: name,
            uuidString: uuidString
        },
        enableReinitialize: true,
        validationSchema: yup.object().shape({
            name: yup.string().required('Course Name is required'),
            uuidString: yup.string().uuid('Must be a valid uuid').required('Uuid is required')
        }),
        onSubmit: (values) => {
            updateThisBeacon(beaconId, courseId, values.name, values.uuidString);
        }
    });

    const updateThisBeacon = (beaconId: string | undefined, courseId: string | undefined, name: string, uuidString: string) => {
        updateBeacon.callPromise({
            beaconId: beaconId,
            courseId: courseId,
            name: name,
            uuid: uuidString
        }).then(() => {
            setShowSuccess(true);
        }).catch((error: any) => {
            setShowError(true);
            const reason = error.reason != null ? error.reason : error.message;
            setError(reason);
        });
    };

    const { beacon, isLoadingBeacon } = useTracker(() => { 
        const beaconSub = Meteor.subscribe('beacons.specific', beaconId);
        const isLoadingBeacon = !beaconSub.ready();
        const beacon = BeaconsCollection.findOne(beaconId);

        return { beacon, isLoadingBeacon };
    }, []);

    useEffect(() => {
        if(beacon) {
            setName(beacon.name);
            setUuidString(beacon.uuid);
        }
    }, [beacon]);

    return (
        <>
            <EuiPageHeader pageTitle={name} />
            <EuiPageContent
                hasBorder={false}
                hasShadow={false}
                paddingSize="none"
                color="plain"
                borderRadius="none"
                grow={true}
            >
                <EuiPageContentBody>
                    { !isLoadingBeacon &&
                        <EuiPanel>
                            <EuiTitle size="s">
                                <h4>Edit Beacon</h4>
                            </EuiTitle>
                            <EuiSpacer />
                            { showError &&
                                <EuiCallOut title="An error has occured" color="danger">
                                    <p>{error}</p>
                                </EuiCallOut>
                            }
                            { showSuccess &&
                                <EuiCallOut title="Success!" color="success">
                                    <p>Beacon updated sucessfully.</p>
                                </EuiCallOut>
                            }
                            <EuiForm component="form" onSubmit={updateBeaconForm.handleSubmit}>
                                <EuiFlexGroup style={{ maxWidth: 1000 }}>
                                    <EuiFlexItem>
                                        <EuiFormRow label="Name" error={updateBeaconForm.errors.name} isInvalid={!!updateBeaconForm.errors.name}>
                                            <EuiFieldText {...updateBeaconForm.getFieldProps('name')} isInvalid={!!updateBeaconForm.errors.name} />
                                        </EuiFormRow>
                                    </EuiFlexItem>
                                    <EuiFlexItem>
                                        <EuiFormRow label="Uuid" error={updateBeaconForm.errors.uuidString} isInvalid={!!updateBeaconForm.errors.uuidString}>
                                            <EuiFieldText {...updateBeaconForm.getFieldProps('uuidString')} isInvalid={!!updateBeaconForm.errors.uuidString}/>
                                        </EuiFormRow>
                                    </EuiFlexItem>
                                    <EuiFlexItem>
                                        <EuiFormRow hasEmptyLabelSpace>
                                            <EuiButton fill color="primary" type="submit">Update</EuiButton>
                                        </EuiFormRow>
                                    </EuiFlexItem>
                                </EuiFlexGroup>
                            </EuiForm>
                        </EuiPanel>
                    }
                </EuiPageContentBody>
            </EuiPageContent>
        </>
    );
}
