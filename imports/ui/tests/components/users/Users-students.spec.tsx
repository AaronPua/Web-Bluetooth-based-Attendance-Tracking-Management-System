import React from 'react';
import { screen } from '@testing-library/react';
import { UsersStudents } from '../../../components/index';
import { renderWithRouter } from '../../utils/test-setup';

describe('<UsersStudents />', () => {
    beforeEach(() => {
        renderWithRouter(<UsersStudents />);
    });

    it('renders component', () => {
        expect(screen.getByText('All Students')).toBeInTheDocument();
        expect(screen.getByText('Students')).toBeInTheDocument();
        expect(screen.getByText('There are no records to display')).toBeInTheDocument();
    });
});