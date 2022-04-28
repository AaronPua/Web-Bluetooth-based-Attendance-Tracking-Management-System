import React from 'react';
import { render } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
import { UnknownRoute } from '../components/index';
// import { expect } from 'chai';
// import { renderWithRouter } from './setupTests';

describe('<Login />', () => {
    beforeEach(() => {
        // renderWithRouter(<UnknownRoute />);
        // render(<UnknownRoute />);
    });

    it('render <Login /> component', () => {

        render(<UnknownRoute />);
    });
});