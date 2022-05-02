import React from 'react';
import { screen, } from '@testing-library/react';
import { BeaconsList } from '../../components/index';
import { renderWithRouter } from '../utils/test-setup';

describe('<BeaconList />', () => {
    beforeEach(() => {
        renderWithRouter(<BeaconsList />);
    });

    it('renders component', () => {
        expect(screen.getByText('All Beacons')).toBeInTheDocument();
        expect(screen.getByText('There are no records to display')).toBeInTheDocument();
    });
});