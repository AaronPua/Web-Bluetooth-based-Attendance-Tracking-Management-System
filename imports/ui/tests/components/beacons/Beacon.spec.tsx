import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Beacon } from '../../../components/index';
import { renderWithRouter } from '../../utils/test-setup';

describe('<Beacon />', () => {
    beforeEach(() => {
        renderWithRouter(<Beacon />);
    });

    it('renders component', () => {
        expect(screen.getByText('Edit Beacon')).toBeInTheDocument();
        expect(screen.getByText('Update')).toBeInTheDocument();
    });

    it('updates beacon info', async () => {
        const user = userEvent.setup();

        const beaconName = screen.getByLabelText('Name');
        await user.clear(beaconName);
        await user.type(beaconName, 'Test Beacon');

        const beaconUuid = screen.getByLabelText('Uuid');
        await user.clear(beaconUuid);
        await user.type(beaconUuid, 'caf2c03e-2d86-4468-82ae-baa63c2d5980');

        const update = screen.getByRole('button', { name: 'Update' });
        await user.click(update);

        await waitFor(() => { 
            expect(update).toBeDisabled();
            expect(beaconName).toHaveValue('Test Beacon');
            expect(beaconUuid).toHaveValue('caf2c03e-2d86-4468-82ae-baa63c2d5980');
        });
    });
});