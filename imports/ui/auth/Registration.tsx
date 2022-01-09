import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import React, { MouseEvent, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { 
    EuiButton,
    EuiEmptyPrompt,
    EuiFlexGroup,
    EuiFlexItem,
    EuiFieldPassword,
    EuiFieldText,
    EuiForm,
    EuiFormRow,
    EuiSelect,
    EuiSpacer
} from '@elastic/eui';
import { registerUser } from '../../api/AccountsMethods';

export default function Registration() {

    let navigate = useNavigate();

    const genderOptions = [
        { value: 'male', text: 'Male'},
        { value: 'female', text: 'Female'}
    ];
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [gender, setGender] = useState(genderOptions[0].value);

    const createUser = (e: MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        registerUser.callPromise({
            email: email,
            password: password,
            first_name: firstName,
            last_name: lastName,
            gender: gender
        }).then((userId: string) => {  
            Accounts.sendVerificationEmail(userId, email);
            navigate('/verify-email'); 
        }).catch((err: Meteor.Error) => {
            console.log('Details: ' + err.details);
            console.log('Message: ' + err.message);
            console.log('Error Type: ' + err.error);
        });
    }

    return (
        <EuiEmptyPrompt 
            title={<h2>Sign Up</h2>}
            color="plain"
            body={
                <EuiForm component="form">
                    <EuiFlexGroup>
                        <EuiFlexItem>
                            <EuiFormRow label="First Name">
                                <EuiFieldText name="first_name" onChange={(e) => setFirstName(e.target.value)}/>
                            </EuiFormRow>
                        </EuiFlexItem>
                        <EuiFlexItem>
                            <EuiFormRow label="Last Name">
                                <EuiFieldText name="last_name" onChange={(e) => setLastName(e.target.value)}/>
                            </EuiFormRow>
                        </EuiFlexItem>
                    </EuiFlexGroup>

                    <EuiSpacer />

                    <EuiFormRow label="Gender" fullWidth>
                        <EuiSelect fullWidth
                            options={genderOptions}
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                        />
                    </EuiFormRow>

                    <EuiFormRow label="Email" fullWidth>
                        <EuiFieldText fullWidth name="email" onChange={(e) => setEmail(e.target.value)}/>
                    </EuiFormRow>

                    <EuiFormRow label="Password" fullWidth>
                        <EuiFieldPassword fullWidth name="password" type="dual" onChange={(e) => setPassword(e.target.value)}/>
                    </EuiFormRow>
                </EuiForm>
            }
            actions={
                <EuiButton fullWidth fill color="primary" type="submit" onClick={(e: any) => createUser(e)}>Register</EuiButton>
            }
        />
    );
}