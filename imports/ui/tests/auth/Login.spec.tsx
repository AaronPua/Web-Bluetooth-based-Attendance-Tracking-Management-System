import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Login } from '../../components/index';
import { renderWithRouter } from '../utils/test-setup';
import { Meteor } from 'meteor/meteor';

describe('<Login />', () => {
    it('renders component', () => {
        renderWithRouter(<Login />);
        expect(screen.getByText('Email')).toBeInTheDocument();
        expect(screen.getByText('Password')).toBeInTheDocument();
        expect(screen.getByText('Register Now')).toBeInTheDocument();
    });

    it('login without valid email', async () => {
        renderWithRouter(<Login />);
        const user = userEvent.setup();
        const email = screen.getByLabelText('Email');
        await user.type(email, 'not_exist');
        expect(screen.getByText('Must be a valid email address')).toBeInTheDocument();
    });

    it('login without email', async () => {
        renderWithRouter(<Login />);
        const user = userEvent.setup();
        const password = screen.getByLabelText('Password');
        await user.type(password, 'test');
        expect(screen.getByText('Email is required')).toBeInTheDocument();
    });

    it('login without password', async () => {
        renderWithRouter(<Login />);
        const user = userEvent.setup();
        const email = screen.getByLabelText('Email');
        await user.type(email, 'not_exist@test.com');
        expect(screen.getByText('Password is required')).toBeInTheDocument();
    });

    it('login correctly', async () => {
        const loginMock = jest.spyOn(Meteor, 'loginWithPassword');
        renderWithRouter(<Login />);

        const user = userEvent.setup();
        const email = screen.getByLabelText('Email');
        const password = screen.getByLabelText('Password');
        const submit = screen.getByRole('button', { name: 'Sign In' });

        await user.type(email, 'not_exist@test.com');
        await user.type(password, 'test');
        await user.click(submit);

        await waitFor(() => expect(submit).toBeDisabled);

        expect(loginMock).toHaveBeenCalledTimes(1);
    });
});