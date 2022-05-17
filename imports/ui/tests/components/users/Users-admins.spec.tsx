import React from 'react';
import { screen } from '@testing-library/react';
import { UsersAdmins } from '../../../components/index';
import { renderWithRouter } from '../../utils/test-setup';

describe('<UsersAdmins />', () => {
    beforeEach(() => {
        renderWithRouter(<UsersAdmins />);
    });

    it('renders component', () => {
        expect(screen.getByText('All Admins')).toBeInTheDocument();
        expect(screen.getByText('Admins')).toBeInTheDocument();
        expect(screen.getByText('There are no records to display')).toBeInTheDocument();
    });
});