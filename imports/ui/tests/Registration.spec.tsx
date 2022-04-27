import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Registration } from '../components/index';
import { expect } from 'chai';
import { createMemoryHistory } from 'history';
import { renderWithRouter } from './setupTests';

describe('<Registration />', () => {
    beforeEach(() => {
        renderWithRouter(<Registration />);
    });

    it('render <Registration /> component', () => {
        expect(screen.getAllByText('Register')[0]).to.have.text('Register');
        expect(screen.getByText('First Name')).to.have.text('First Name');
        expect(screen.getByText('Gender')).to.have.text('Gender');
        expect(screen.getByText('Email')).to.have.text('Email');
        expect(screen.getByText('Password')).to.have.text('Password');
    });

    it('test registration inputs', async () => {
        const user = userEvent.setup();

        const firstName = screen.getByLabelText('First Name');
        const lastName = screen.getByLabelText('Last Name');
        const email = screen.getByLabelText('Email');
        const password = screen.getByLabelText('Password');
        // const registerButton = screen.getByRole('button', { name: 'Register' });

        await user.type(firstName, 'A_Test_User');
        expect(screen.getByText('Email is required')).to.have.text('Email is required');
        expect(screen.getByText('Last Name is required')).to.have.text('Last Name is required');
        expect(screen.getByText('Password is required')).to.have.text('Password is required');

        await user.type(lastName, 'Fake');
        await user.type(email, 'test_user@fake.com');
        await user.type(password, 'test');
        // await user.click(registerButton);
    });

    it('test redirect back to login', async () => {
        expect(screen.getByText('Already have an account?'))
        .to.have.text('Already have an account? Log In To Your Account');

        const history = createMemoryHistory();
        const user = userEvent.setup();

        const backToLogin = screen.getByText('Log In To Your Account');
        await user.click(backToLogin);
        expect(history.location.pathname).to.be.equal('/');
    });
});