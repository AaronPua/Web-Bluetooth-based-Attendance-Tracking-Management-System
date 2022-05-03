import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Registration } from '../../../components/index';
import { createMemoryHistory } from 'history';
import { renderWithRouter } from '../../utils/test-setup';

describe('<Registration />', () => {
    beforeEach(() => {
        renderWithRouter(<Registration />);
    });

    it('renders component', () => {
        expect(screen.getAllByText('Register')[0]).toBeInTheDocument();
        expect(screen.getByText('First Name')).toBeInTheDocument();
        expect(screen.getByText('Gender')).toBeInTheDocument();
        expect(screen.getByText('Email')).toBeInTheDocument();
        expect(screen.getByText('Password')).toBeInTheDocument();
    });

    it('test registration inputs', async () => {
        const user = userEvent.setup();

        const firstName = screen.getByLabelText('First Name');
        await user.type(firstName, 'A_Test_User');
        expect(screen.getByText('Email is required')).toBeInTheDocument();
        expect(screen.getByText('Last Name is required')).toBeInTheDocument();
        expect(screen.getByText('Password is required')).toBeInTheDocument();

        const lastName = screen.getByLabelText('Last Name');
        await user.type(lastName, 'Fake');

        const email = screen.getByLabelText('Email');
        await user.type(email, 'test_user@fake.com');

        const password = screen.getByLabelText('Password');
        await user.type(password, 'test');

        const registerButton = screen.getByRole('button', { name: 'Register' });
        await user.click(registerButton);

        await waitFor(() => { expect(registerButton).toBeDisabled });
    });

    it('test redirect back to login', async () => {
        const history = createMemoryHistory();
        const user = userEvent.setup();

        const backToLogin = screen.getByText('Log In To Your Account');
        await user.click(backToLogin);

        expect(history.location.pathname).toEqual('/');
    });
});