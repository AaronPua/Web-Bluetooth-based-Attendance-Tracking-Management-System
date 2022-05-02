import React from 'react';
import { screen } from '@testing-library/react';
import { LessonsList } from '../../components/index';
import { renderWithRouter } from '../utils/test-setup';

describe('<LessonsList />', () => {
    beforeEach(() => {
        renderWithRouter(<LessonsList />);
    });

    it('renders component', () => {
        expect(screen.getByText('All Lessons')).toBeInTheDocument();
        expect(screen.getByText('Lessons')).toBeInTheDocument();
        expect(screen.getByText('There are no records to display')).toBeInTheDocument();
    });
});