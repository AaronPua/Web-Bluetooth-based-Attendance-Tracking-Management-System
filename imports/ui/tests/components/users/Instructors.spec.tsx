import React from 'react';
import { screen } from '@testing-library/react';
import { Instructors } from '../../../components/index';
import { renderWithRouter } from '../../utils/test-setup';

describe('<Instructors />', () => {
    beforeEach(() => {
        renderWithRouter(<Instructors />);
    });

    it('renders component', () => {
        expect(screen.getByText('Instructors')).toBeInTheDocument();
        expect(screen.getByText('There are no records to display')).toBeInTheDocument();
    });
});