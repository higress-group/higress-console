import React from 'react';
// import { Navigate } from 'ice';

export default {
  path: '/mcp',
  children: [
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
