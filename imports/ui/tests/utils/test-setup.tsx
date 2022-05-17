// import React, { ReactElement } from 'react';
// import { render } from '@testing-library/react';
// import { Router, MemoryRouter } from 'react-router-dom';
// import { createMemoryHistory } from 'history';

import { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// export const renderWithRouter = (ui: any, {route = '/'} = {}) => {
//   window.history.pushState({}, 'Test page', route);

//   return {
//      user: userEvent.setup(),
//     ...render(ui, { wrapper: BrowserRouter }),
//   }
// }

// export const createRouterWrapper = (history: any): React.ComponentType => ({ children }) => (
//     <Router location={history.location} navigator={history}>{children}</Router>
// );

// export const renderWithRouter = (children: any) => {
//     const history = createMemoryHistory();
//     return render(children, { wrapper: createRouterWrapper(history) });
// }

export const renderWithRouter = (children: ReactElement) => {
    return render(children, { wrapper: MemoryRouter });
}