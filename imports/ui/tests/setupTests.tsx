import React from 'react';
import { render } from '@testing-library/react';
import { Router } from 'react-router-dom';
import chai from 'chai';
chai.use(require('chai-dom'));
import { createMemoryHistory } from 'history';

// export const renderWithRouter = (ui: any, {route = '/'} = {}) => {
//   window.history.pushState({}, 'Test page', route);

//   return {
//      user: userEvent.setup(),
//     ...render(ui, { wrapper: BrowserRouter }),
//   }
// }

export const createRouterWrapper = (history: any): React.ComponentType => ({ children }) => (
    <Router location={history.location} navigator={history}>{children}</Router>
);

export const renderWithRouter = (children: any) => {
    const history = createMemoryHistory();
    return render(children, { wrapper: createRouterWrapper(history) });
}