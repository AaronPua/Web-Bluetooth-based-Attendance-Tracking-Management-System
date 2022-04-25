import React from 'react';
import { render } from '@testing-library/react';

import { Home } from '../components/index';

describe('App', () => {

    it('renders App component', () => {
        render(<Home />);
    });
});