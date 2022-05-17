import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UnknownRoute } from '../../../components/index';
import { renderWithRouter } from '../../utils/test-setup';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate
}));

describe('<UnknownRoute />', () => {
    beforeEach(() => {
        renderWithRouter(<UnknownRoute />);
    });

    it('renders component', () => {
        expect(screen.getByText('You have arrived at an unknown page.')).toBeInTheDocument();
        expect(screen.getByText('Click the button below to go back to the Home page.')).toBeInTheDocument();
    });

    it('redirect to login page', async () => {
        const user = userEvent.setup();

        const homeButton = screen.getAllByRole('button', { name: 'Home' });
        await user.click(homeButton[0]);

        await waitFor(() => { 
            expect(mockNavigate).toHaveBeenCalledTimes(1);
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });

        jest.clearAllMocks();
    });
});