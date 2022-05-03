import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { User } from '../../../components/index';
import { renderWithRouter } from '../../utils/test-setup';

describe('<User />', () => {
    beforeEach(() => {
        renderWithRouter(<User />);
    });

    it('renders component', () => {
        expect(screen.getByText('Edit User')).toBeInTheDocument();
        expect(screen.getByText('Email')).toBeInTheDocument();
        expect(screen.getByText('First Name')).toBeInTheDocument();
        expect(screen.getByText('Last Name')).toBeInTheDocument();
        expect(screen.getByText('Gender')).toBeInTheDocument();
        expect(screen.getByText('Roles')).toBeInTheDocument();

        expect(screen.getByText('Courses')).toBeInTheDocument();
        expect(screen.getByText('There are no records to display')).toBeInTheDocument();
    });

    it('edit user account details', async () => {
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

        expect(screen.getByText('Must have at least 1 role')).toBeInTheDocument;
        // Can't continue as this relies on data from database
    });
});