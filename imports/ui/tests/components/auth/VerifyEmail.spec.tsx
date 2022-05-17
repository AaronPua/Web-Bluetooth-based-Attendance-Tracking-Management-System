import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VerifyEmail } from '../../../components/index';
import { renderWithRouter } from '../../utils/test-setup';

describe('<VerifyEmail />', () => {
    beforeEach(() => {
        renderWithRouter(<VerifyEmail />);
    });

    it('renders component', () => {
        expect(screen.getByText('Verify Your Email')).toBeInTheDocument();
        expect(screen.getByText('Did not receive the verification email?')).toBeInTheDocument();
    });

    it('test email input', async () => {
        const user = userEvent.setup();

        const showInput = screen.getByRole('button', { name: 'Click Here.' });
        await user.click(showInput);

        const emailInput = screen.getByLabelText('Email');
        await user.type(emailInput, 'not_exist@test.com');

        const resendButton = screen.getByRole('button', { name: 'Resend' });
        await user.click(resendButton);

        await waitFor(() => { 
            expect(resendButton).toBeDisabled();
            expect(emailInput).toHaveValue('not_exist@test.com');
        });
    });
});