import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Login } from '../components/index';
import { expect } from 'chai';
import { renderWithRouter } from './setupTests';

describe('<Login />', () => {
    beforeEach(() => {
        renderWithRouter(<Login />);
    });

    it('render <Login /> component', async () => {
        expect(screen.getByText('Email')).to.have.text('Email');
        expect(screen.getByText('Password')).to.have.text('Password');
        expect(screen.getByText('Register Now')).to.have.text('Register Now');
    });

    it('login without valid email', async () => {
        const user = userEvent.setup();
        const emailInput = screen.getByLabelText('Email');
        await user.type(emailInput, 'not_exist');
        expect(screen.getByText('Must be a valid email address'))
            .to.have.text('Must be a valid email address');
    });

    it('login without email', async () => {
        const user = userEvent.setup();
        const passwordInput = screen.getByLabelText('Password');
        await user.type(passwordInput, 'test');
        expect(screen.getByText('Email is required')).to.have.text('Email is required');
    });

    it('login without password', async () => {
        const user = userEvent.setup();
        const emailInput = screen.getByLabelText('Email');
        await user.type(emailInput, 'not_exist@test.com');
        expect(screen.getByText('Password is required')).to.have.text('Password is required');
    });
});