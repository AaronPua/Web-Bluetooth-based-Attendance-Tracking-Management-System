import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Account } from '../../../components/index';
import { renderWithRouter } from '../../utils/test-setup';

describe('<Account />', () => {
    beforeEach(() => {
        renderWithRouter(<Account />);
    });

    it('renders component', () => {
        expect(screen.getByText('Account')).toBeInTheDocument();

        expect(screen.getByText('Edit Details')).toBeInTheDocument();
        expect(screen.getByText('Email')).toBeInTheDocument();
        expect(screen.getByText('First Name')).toBeInTheDocument();
        expect(screen.getByText('Last Name')).toBeInTheDocument();
        expect(screen.getByText('Gender')).toBeInTheDocument();

        expect(screen.getByText('Change Password')).toBeInTheDocument();
        expect(screen.getByText('Old Password')).toBeInTheDocument();
        expect(screen.getByText('New Password')).toBeInTheDocument();
    });

    it('edit account details', async () => {
        const user = userEvent.setup();

        const email = screen.getByLabelText('Email');
        await user.clear(email);
        await user.type(email, 'not_exist@test.com');

        const firstName = screen.getByLabelText('First Name');
        await user.clear(firstName);
        await user.type(firstName, 'Test User');

        const lastName = screen.getByLabelText('Last Name');
        await user.clear(lastName);
        await user.type(lastName, 'Fake');

        const update = screen.getByRole('button', { name: 'Update' });
        await user.click(update);

        // can't continue as it relies on data from database
    });

    it('change password', async () => {
        const user = userEvent.setup();

        const oldPassword = screen.getByLabelText('Old Password');
        await user.type(oldPassword, 'test');

        const newPassword = screen.getByLabelText('New Password');
        await user.type(newPassword, 'test1');

        const change = screen.getByRole('button', { name: 'Change' });
        await user.click(change);

        await waitFor(() => { 
            expect(change).toBeDisabled();
            expect(oldPassword).toHaveValue('test');
            expect(newPassword).toHaveValue('test1');
        });
    });
});