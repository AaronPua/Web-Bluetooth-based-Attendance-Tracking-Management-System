import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Lesson } from '../../../components/index';
import { renderWithRouter } from '../../utils/test-setup';

describe('<Lesson />', () => {
    beforeEach(() => {
        renderWithRouter(<Lesson />);
    });

    it('renders component', () => {
        expect(screen.getByText('Edit Lesson')).toBeInTheDocument();
        expect(screen.getByText('Lesson Name')).toBeInTheDocument();
        expect(screen.getByText('Start Time')).toBeInTheDocument();
        expect(screen.getByText('End Time')).toBeInTheDocument();
        expect(screen.getByText('Date')).toBeInTheDocument();
        expect(screen.getByText('Present Students')).toBeInTheDocument();
        expect(screen.getByText('Absent Students')).toBeInTheDocument();
    });

    it('edit lesson info', async () => {
        const user = userEvent.setup();

        const lessonName = screen.getByLabelText('Lesson Name');
        await user.clear(lessonName);
        await user.type(lessonName, 'Test Lesson');

        const update = screen.getByRole('button', { name: 'Update' });
        await user.click(update);

        await waitFor(() => { 
            expect(update).toBeDisabled();
            expect(lessonName).toHaveValue('Test Lesson');
        });
    });
});