import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ForgotPassword } from '../../../components/index';
import { createMemoryHistory } from 'history';
import { renderWithRouter } from '../../utils/test-setup';

describe('<ResetPassword />', () => {
    beforeEach(() => {
        renderWithRouter(<ForgotPassword />);
    });

    it('renders component', () => {
        expect(screen.getByText('Forgot Password')).toBeInTheDocument();
        expect(screen.getByText('Remembered your password?')).toBeInTheDocument();
    });

    it('test email input', async () => {
        const user = userEvent.setup();

        const emailInput = screen.getByLabelText('Email');
        await user.type(emailInput, 'not_exist@test.com');

        const resendButton = screen.getByRole('button', { name: 'Resend' });
        await user.click(resendButton);

        await waitFor(() => expect(resendButton).toBeDisabled);
    });

    it('redirect user to login page', async () => {
        const history = createMemoryHistory();
        const user = userEvent.setup();

        const homeButton = screen.getByText('Sign In');
        await user.click(homeButton);
        
        expect(history.location.pathname).toEqual('/');
    });
});