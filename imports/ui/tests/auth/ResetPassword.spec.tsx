import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ResetPassword } from '../../components/index';
import { createMemoryHistory } from 'history';
import { renderWithRouter } from '../utils/test-setup';

describe('<ResetPassword />', () => {
    beforeEach(() => {
        renderWithRouter(<ResetPassword />);
    });

    it('renders component', () => {
        expect(screen.getByText('Reset Password')).toBeInTheDocument();
        expect(screen.getByText('Password has been reset?')).toBeInTheDocument();
    });

    it('test password reset', async () => {
        const user = userEvent.setup();

        const passwordInput = screen.getByLabelText('Password');
        await user.type(passwordInput, 'test');

        const resetButton = screen.getByRole('button', { name: 'Reset' });
        await user.click(resetButton);

        await waitFor(() => expect(resetButton).toBeDisabled);
    });

    it('redirect user to login page', async () => {
        const history = createMemoryHistory();
        const user = userEvent.setup();

        const homeButton = screen.getByText('Sign In');
        await user.click(homeButton);
        
        expect(history.location.pathname).toEqual('/');
    });
});