import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Lessons } from '../../../components/index';
import { renderWithRouter } from '../../utils/test-setup';

describe('<Lessons />', () => {
    beforeEach(() => {
        renderWithRouter(<Lessons />);
    });

    it('renders component', () => {
        expect(screen.getByText('Create Lesson')).toBeInTheDocument();
        expect(screen.getByText('Name')).toBeInTheDocument();
        expect(screen.getByText('Start Time')).toBeInTheDocument();
        expect(screen.getByText('End Time')).toBeInTheDocument();
        expect(screen.getByText('Date')).toBeInTheDocument();
        expect(screen.getByText('Current Lessons')).toBeInTheDocument();
        expect(screen.getByText('Overall Attendance')).toBeInTheDocument();
        expect(screen.getByText('Attendance by Lesson')).toBeInTheDocument();
    });

    it('create new lesson', async () => {
        const user = userEvent.setup();

        const lessonName = screen.getByLabelText('Name');
        await user.clear(lessonName);
        await user.type(lessonName, 'Test Lesson');

        const create = screen.getByRole('button', { name: 'Create' });
        await user.click(create);

        await waitFor(() => { 
            expect(create).toBeDisabled();
            expect(lessonName).toHaveValue('Test Lesson');
        });
    });
});