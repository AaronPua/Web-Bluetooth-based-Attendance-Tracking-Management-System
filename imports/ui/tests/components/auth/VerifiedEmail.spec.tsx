import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VerifiedEmail } from '../../../components/index';
import { renderWithRouter } from '../../utils/test-setup';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate
}));

describe('<VerifiedEmail />', () => {

    it('renders component', () => {
        const useEffectMock = jest.spyOn(React, 'useEffect').mockImplementation((f) => f);
        renderWithRouter(<VerifiedEmail />);

        expect(useEffectMock).toHaveBeenCalled();

        expect(screen.getByText('Email Verification')).toBeInTheDocument();
    });

    it('redirect to login page', async () => {
        const useEffectMock = jest.spyOn(React, 'useEffect').mockImplementation((f) => f);
        renderWithRouter(<VerifiedEmail />);

        expect(useEffectMock).toHaveBeenCalled();

        const user = userEvent.setup();

        const homeButton = screen.getByText('Go To Login');
        await user.click(homeButton);

        await waitFor(() => { 
            expect(mockNavigate).toHaveBeenCalledTimes(1);
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });

        jest.clearAllMocks();
    });
});