import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Course } from '../../components/index';
import { renderWithRouter } from '../utils/test-setup';

describe('<Course />', () => {
    beforeEach(() => {
        renderWithRouter(<Course />);
    });

    it('renders component', () => {
        expect(screen.getByText('Edit Course')).toBeInTheDocument();
        expect(screen.getByText('Update')).toBeInTheDocument();
        expect(screen.getByText('View Lessons')).toBeInTheDocument();
        expect(screen.getByText('View Students')).toBeInTheDocument();
        expect(screen.getByText('View Beacons')).toBeInTheDocument();
    });

    it('edit course info', async () => {
        const user = userEvent.setup();

        const courseName = screen.getByLabelText('Course Name');
        await user.clear(courseName);
        await user.type(courseName, 'Test Course');

        const courseCredits = screen.getByLabelText('Credits');
        await user.clear(courseCredits);
        await user.type(courseCredits, '2');

        const update = screen.getByRole('button', { name: 'Update' });
        await user.click(update);

        await waitFor(() => expect(update).toBeDisabled);
    });
});