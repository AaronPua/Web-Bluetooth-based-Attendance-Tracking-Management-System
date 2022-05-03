import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UnknownRoute } from '../../../components/index';
import { createMemoryHistory } from 'history';
import { renderWithRouter } from '../../utils/test-setup';

describe('<UnknownRoute />', () => {
    beforeEach(() => {
        renderWithRouter(<UnknownRoute />);
    });

    it('renders component', () => {
        expect(screen.getByText('You have arrived at an unknown page.')).toBeInTheDocument();
        expect(screen.getByText('Click the button below to go back to the Home page.')).toBeInTheDocument();
    });

    it('redirect user to home page', async () => {
        const history = createMemoryHistory();
        const user = userEvent.setup();

        const homeButton = screen.getAllByRole('button', { name: 'Home' });
        await user.click(homeButton[0]);
        expect(history.location.pathname).toEqual('/');
    });
});