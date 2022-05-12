import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Login } from '../../../components/index';
import { renderWithRouter } from '../../utils/test-setup';
import { Meteor } from 'meteor/meteor';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate
}));

describe('<Login />', () => {
    it('renders component', () => {
        renderWithRouter(<Login />);
        expect(screen.getByText('Email')).toBeInTheDocument();
        expect(screen.getByText('Password')).toBeInTheDocument();
        expect(screen.getByText('Register Now')).toBeInTheDocument();
    });

    it('test login inputs', async () => {
        const loginMock = jest.spyOn(Meteor, 'loginWithPassword');
        renderWithRouter(<Login />);

        const user = userEvent.setup();
        
        const email = screen.getByLabelText('Email');
        await user.type(email, 'not_exist');
        expect(screen.getByText('Must be a valid email address')).toBeInTheDocument();
        await user.clear(email);

        const password = screen.getByLabelText('Password');
        await user.type(password, 'test');
        expect(screen.getByText('Email is required')).toBeInTheDocument();

        await user.clear(password);
        expect(screen.getByText('Password is required')).toBeInTheDocument();

        await user.type(email, 'not_exist@test.com');
        await user.type(password, 'test');

        const submit = screen.getByRole('button', { name: 'Sign In' });
        await user.click(submit);

        await waitFor(() => { 
            expect(submit).toBeDisabled();
            expect(email).toHaveValue('not_exist@test.com');
            expect(password).toHaveValue('test');
        });

        expect(loginMock).toHaveBeenCalledTimes(1);

        jest.clearAllMocks();
    });

    it('redirect to registration page', async () => {
        renderWithRouter(<Login />);

        const user = userEvent.setup();
        const goRegistration = screen.getByRole('button', { name: 'Register Now' });

        await user.click(goRegistration);

        await waitFor(() => { 
            expect(mockNavigate).toHaveBeenCalledTimes(1);
            expect(mockNavigate).toHaveBeenCalledWith('/register');
        });

        jest.clearAllMocks();
    });
});