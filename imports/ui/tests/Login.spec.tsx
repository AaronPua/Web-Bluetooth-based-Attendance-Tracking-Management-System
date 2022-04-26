import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import { Login } from '../components/index';
var chai = require('chai');
chai.use(require('chai-dom'));
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { registerUser } from '/imports/api/users/UsersMethods';

describe('<Login />', () => {

    before(() => {
        resetDatabase();
        if(Meteor.roles.find().count() === 0) {
            Roles.createRole('admin');
            Roles.createRole('instructor');
            Roles.createRole('student');
        }
    });

    beforeEach(() => {
        render(<Router><Login /></Router>);
    });

    it('success - render <Login /> component', async () => {
        expect(screen.getByText('Email')).to.have.text('Email');
        expect(screen.getByText('Password')).to.have.text('Password');
        expect(screen).to.have.text('Don\'t have an account yet?');
    });

    it('fail - login without valid email', async () => {
        const emailInput = screen.getByLabelText('Email');
        await userEvent.type(emailInput, 'not_exist');
        expect(screen.getByText('Must be a valid email address')).to.be.visible;
    });

    it('fail - login without email', async () => {
        const passwordInput = screen.getByLabelText('Password');
        await userEvent.type(passwordInput, 'test');
        expect(screen.getByText('Email is required')).to.be.visible;
    });

    it('fail - login without password', async () => {
        const emailInput = screen.getByLabelText('Email');
        await userEvent.type(emailInput, 'not_exist@test.com');
        expect(screen.getByText('Password is required')).to.be.visible;
    });

    it('success - login with correct email password', async () => {
        registerUser.callPromise({
            email: 'test_user@fake.com',
            password: 'test',
            firstName: 'Test User',
            lastName: 'Fake',
            gender: 'male' 
        });

        const emailInput = screen.getByLabelText('Email', { selector: 'input' });
        await userEvent.type(emailInput, 'test_user@fake.com');
        expect(screen.getByText('Password is required')).not.to.be.visible;

        // const passwordInput = screen.getByLabelText('Password', { selector: 'input' });
        // await userEvent.type(passwordInput, 'test');
        // expect(screen.getByText('Email is required')).to.not.be.visible;

        // resetDatabase();
    });

    after(() => {
        resetDatabase();
    });
});