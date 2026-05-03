import { createBrowserRouter, Navigate } from 'react-router-dom';
import AccountLayout from '../layouts/AccountLayout';
import Login from '../pages/Auth/Login';
import WorkItemList from '../pages/WorkItem/WorkItemList';
import AdminWorkItemList from '../pages/Admin/AdminWorkItemList';
import ProtectedRoute from './ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <AccountLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/work-items" replace />,
      },
      {
        element: <ProtectedRoute allowedRoles={['User', 'Admin']} />,
        children: [
          {
            path: 'work-items',
            element: <WorkItemList />,
          },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={['Admin']} />,
        children: [
          {
            path: 'admin/work-items',
            element: <AdminWorkItemList />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
