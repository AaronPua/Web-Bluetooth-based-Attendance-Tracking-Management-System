import React from 'react';
import { screen } from '@testing-library/react';
import { SideNav } from '../../layouts/index';
import { renderWithRouter } from '../utils/test-setup';

describe('<SideNav />', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderWithRouter(<SideNav />);
    });

    it('renders component', () => {
        expect(screen.getByText('Beacons')).toBeInTheDocument();
        expect(screen.getByText('Lessons')).toBeInTheDocument();
        expect(screen.getByText('Courses')).toBeInTheDocument();
    });
});