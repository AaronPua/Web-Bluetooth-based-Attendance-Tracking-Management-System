import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UnknownRoute } from '../components/index';
import { expect } from 'chai';
import { createMemoryHistory } from 'history';
import { renderWithRouter } from './setupTests';

describe('<UnknownRoute />', () => {
    beforeEach(() => {
        renderWithRouter(<UnknownRoute />);
    });

    it('render <UnknownRoute /> component', () => {
        expect(screen.getByText('You have arrived at an unknown page.')).to.have.text('You have arrived at an unknown page.');
        expect(screen.getByText('Click the button below to go back to the Home page.'))
            .to.have.text('Click the button below to go back to the Home page.');
    });

    it('redirect user to home page', async () => {
        const history = createMemoryHistory();
        const user = userEvent.setup();

        const homeButton = screen.getAllByRole('button', { name: 'Home' });
        user.click(homeButton[0]);
        expect(history.location.pathname).to.be.equal('/');
    });
});