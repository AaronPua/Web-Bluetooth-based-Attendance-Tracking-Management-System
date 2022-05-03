import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Beacons } from '../../../components/index';
import { renderWithRouter } from '../../utils/test-setup';

describe('<Beacons />', () => {
    beforeEach(() => {
        renderWithRouter(<Beacons />);
    });

    it('renders component', () => {
        expect(screen.getByText('Create Beacon')).toBeInTheDocument();
        expect(screen.getByText('Beacons')).toBeInTheDocument();
    });

    it('create new beacon', async () => {
        const user = userEvent.setup();

        const beaconName = screen.getByLabelText('Name');
        await user.type(beaconName, 'test beacon');

        const beaconUuid = screen.getByLabelText('Uuid');
        await user.type(beaconUuid, 'caf2c03e-2d86-4468-82ae-baa63c2d5980');
        expect(screen.getByText('Must be a valid uuid')).toBeInTheDocument();

        await user.clear(beaconUuid);
        await user.type(beaconUuid, 'caf2c03e-2d86-4468-82ae-baa63c2d5980');

        const create = screen.getByRole('button', { name: 'Create' });
        await user.click(create);

        await waitFor(() => expect(create).toBeDisabled);
    });
});