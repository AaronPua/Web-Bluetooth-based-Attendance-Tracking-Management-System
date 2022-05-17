import React from 'react';
import { screen } from '@testing-library/react';
import { Users } from '../../../components/index';
import { renderWithRouter } from '../../utils/test-setup';

describe('<Users />', () => {
    beforeEach(() => {
        renderWithRouter(<Users />);
    });

    it('renders component', () => {
        expect(screen.getByText('All Users')).toBeInTheDocument();
        expect(screen.getByText('Users')).toBeInTheDocument();
        expect(screen.getByText('There are no records to display')).toBeInTheDocument();
    });
});