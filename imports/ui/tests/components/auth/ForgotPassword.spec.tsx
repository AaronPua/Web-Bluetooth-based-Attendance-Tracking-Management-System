import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ForgotPassword } from '../../../components/index';
import { renderWithRouter } from '../../utils/test-setup';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate
}));

describe('<ForgotPassword />', () => {
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

        await waitFor(() => { 
            expect(resendButton).toBeDisabled();
            expect(emailInput).toHaveValue('not_exist@test.com');
        });
    });

    it('redirect to login page', async () => {
        const user = userEvent.setup();

        const homeButton = screen.getByText('Sign In');
        await user.click(homeButton);

        await waitFor(() => { 
            expect(mockNavigate).toHaveBeenCalledTimes(1);
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });

        jest.clearAllMocks();
    });
});