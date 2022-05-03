import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Header } from '../../layouts/index';
import { renderWithRouter } from '../utils/test-setup';
import { createMemoryHistory } from 'history';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate
}));

describe('<Home />', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderWithRouter(<Header />);
    });

    it('renders component', () => {
        expect(screen.getByText('COMP8047')).toBeInTheDocument();
        expect(screen.getByText('Account')).toBeInTheDocument();
        expect(screen.getByText('Log Out')).toBeInTheDocument();
    });

    it('redirects to accounts page', async () => {
        const user = userEvent.setup();

        const accountButton = screen.getByRole('button', { name: 'Account' });
        await user.click(accountButton);

        await waitFor(() => { 
            expect(mockNavigate).toHaveBeenCalledTimes(1);
            expect(mockNavigate).toHaveBeenCalledWith('/account');
        });
    });

    it('redirects to home page', async () => {
        const user = userEvent.setup();

        const homeButton = screen.getByText('COMP8047');
        await user.click(homeButton);

        await waitFor(() => { 
            expect(mockNavigate).toHaveBeenCalledTimes(1);
            expect(mockNavigate).toHaveBeenCalledWith('/home');
        });
    });

    it('logs the user out', async () => {
        const history = createMemoryHistory();
        const user = userEvent.setup();

        const logoutButton = screen.getByRole('button', { name: 'Log Out' });
        await user.click(logoutButton);

        expect(history.location.pathname).toEqual('/');
    });
});