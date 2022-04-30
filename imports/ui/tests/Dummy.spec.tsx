// import React from 'react';
// import { render } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
// import { UnknownRoute } from '../components/index';
// import { expect } from 'chai';
// import { renderWithRouter } from './setupTests';
import React from 'react';
import { render, screen  } from '@testing-library/react';
import { UnknownRoute } from '../components/index';
import { renderWithRouter } from './utils/test-setup';

it("Dummy unit test", () => {
    const actual = 1 + 1;
    expect(actual).toBe(2);
});

it("Dummy unit test 2", () => {
    const actual = 4 + 1 + 2 - 7;
    expect(actual).toBe(0);
});

it("Dummy unit test 3", () => {
    render(<button>Click Me</button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
});

it("Dummy unit test 4", () => {
    renderWithRouter(<UnknownRoute />);
});