import React from 'react';
import { screen } from '@testing-library/react';
import { Attendance } from '../../../components/index';
import { renderWithRouter } from '../../utils/test-setup';

describe('<Attendance />', () => {
    it('renders component', () => {
        renderWithRouter(<Attendance />);
        expect(screen.getByText('Attended Lessons')).toBeInTheDocument();
        expect(screen.getByText('Missed Lessons')).toBeInTheDocument();
    });
});