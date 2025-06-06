import React from 'react';
// import { Navigate } from 'ice';

export default {
  path: '/mcp',
  children: [
    // {
    //   index: true,
    //   element: <Navigate to="list" replace />,
    // },
    {
      path: 'list',
      element: React.lazy(() => import('./list')),
    },
    {
      path: 'detail/:name',
      element: React.lazy(() => import('./detail')),
    },
  ],
};
