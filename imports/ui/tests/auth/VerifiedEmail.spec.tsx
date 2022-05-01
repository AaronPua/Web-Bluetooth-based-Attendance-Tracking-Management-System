import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VerifiedEmail } from '../../components/index';
import { createMemoryHistory } from 'history';
import { renderWithRouter } from '../utils/test-setup';

describe('<VerifiedEmail />', () => {

    it('renders component', () => {
        const useEffectMock = jest.spyOn(React, 'useEffect').mockImplementation((f) => f);
        renderWithRouter(<VerifiedEmail />);

        expect(useEffectMock).toHaveBeenCalled();

        expect(screen.getByText('Email Verification')).toBeInTheDocument();
    });

    it('redirect user to login page', async () => {
        const useEffectMock = jest.spyOn(React, 'useEffect').mockImplementation((f) => f);
        renderWithRouter(<VerifiedEmail />);

        expect(useEffectMock).toHaveBeenCalled();

        const history = createMemoryHistory();
        const user = userEvent.setup();

        const homeButton = screen.getByText('Go To Login');
        await user.click(homeButton);
        
        expect(history.location.pathname).toEqual('/');
    });
});