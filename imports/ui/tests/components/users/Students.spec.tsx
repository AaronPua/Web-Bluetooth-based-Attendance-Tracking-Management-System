import React from 'react';
import { screen } from '@testing-library/react';
import { Students } from '../../../components/index';
import { renderWithRouter } from '../../utils/test-setup';

describe('<Students />', () => {
    beforeEach(() => {
        renderWithRouter(<Students />);
    });

    it('renders component', () => {
        expect(screen.getByText('Enrolled Students')).toBeInTheDocument();
        expect(screen.getByText('There are no records to display')).toBeInTheDocument();
    });
});