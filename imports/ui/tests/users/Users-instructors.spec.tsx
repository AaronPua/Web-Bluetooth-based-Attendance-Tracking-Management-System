import React from 'react';
import { screen } from '@testing-library/react';
import { UsersInstructors } from '../../components/index';
import { renderWithRouter } from '../utils/test-setup';

describe('<UsersInstructors />', () => {
    beforeEach(() => {
        renderWithRouter(<UsersInstructors />);
    });

    it('renders component', () => {
        expect(screen.getByText('All Instructors')).toBeInTheDocument();
        expect(screen.getByText('Instructors')).toBeInTheDocument();
        expect(screen.getByText('There are no records to display')).toBeInTheDocument();
    });
});