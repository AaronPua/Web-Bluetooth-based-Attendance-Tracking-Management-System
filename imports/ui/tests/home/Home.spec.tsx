import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Home } from '../../components/index';
import { renderWithRouter } from '../utils/test-setup';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate
}));

describe('<Home />', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        renderWithRouter(<Home />);
    });

    it('renders component', () => {
        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Courses')).toBeInTheDocument();
        expect(screen.getByText('Lessons')).toBeInTheDocument();
        expect(screen.getByText('Beacons')).toBeInTheDocument();
    });

    it('redirects to view courses page', async () => {
        const user = userEvent.setup();

        const viewCourses = screen.getByRole('button', { name: 'View Courses' });
        await user.click(viewCourses);

        await waitFor(() => { 
            expect(mockNavigate).toHaveBeenCalledTimes(1);
            expect(mockNavigate).toHaveBeenCalledWith('/courses');
        });
    });

    it('redirects to view lessons page', async () => {
        const user = userEvent.setup();

        const viewLessons = screen.getByRole('button', { name: 'View Lessons' });
        await user.click(viewLessons);

        await waitFor(() => { 
            expect(mockNavigate).toHaveBeenCalledTimes(1);
            expect(mockNavigate).toHaveBeenCalledWith('/lessons');
        });
    });

    it('redirects to view beacons page', async () => {
        const user = userEvent.setup();

        const viewBeacons = screen.getByRole('button', { name: 'View Beacons' });
        await user.click(viewBeacons);

        await waitFor(() => { 
            expect(mockNavigate).toHaveBeenCalledTimes(1);
            expect(mockNavigate).toHaveBeenCalledWith('/beacons');
        });
    });
});