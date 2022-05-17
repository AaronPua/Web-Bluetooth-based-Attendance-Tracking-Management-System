import React from 'react';
import { screen } from '@testing-library/react';
import { Courses } from '../../../components/index';
import { renderWithRouter } from '../../utils/test-setup';

describe('<Courses />', () => {
    beforeEach(() => {
        renderWithRouter(<Courses />);
    });

    it('renders component', () => {
        expect(screen.getAllByText('Courses')[0]).toBeInTheDocument();
        expect(screen.getByText('There are no records to display')).toBeInTheDocument();
    });
});