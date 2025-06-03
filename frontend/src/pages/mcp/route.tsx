import React from 'react';
import { Navigate } from 'ice';

export default {
  path: '/mcp',
  children: [
    {
      index: true,
      element: <Navigate to="list" replace />,
    },
    {
      path: 'list',
      element: React.lazy(() => import('./index')),
    },
    {
      path: 'add',
      element: React.lazy(() => import('./edit')),
    },
    {
      path: 'edit/:id',
      element: React.lazy(() => import('./edit')),
    },
    {
      path: 'status',
      element: React.lazy(() => import('./status')),
    },
  ],
};