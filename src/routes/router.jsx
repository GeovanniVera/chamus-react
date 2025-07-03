import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Home from '../components/Home';
import Login from '../modules/auth/components/Login';
import AuthLayout from '../layouts/AuthLayout';
import Layout from '../layouts/Layout';
import MuseumList from '../modules/museums/components/MuseumList';
import MuseumForm from '../modules/museums/components/MuseumForm';
import MuseumDetail from '../modules/museums/components/MuseumDetail';
import RoomDetail from '../modules/rooms/components/RoomDetail';
import RoomForm from '../modules/rooms/components/RoomForm';
import DiscountForm from '../modules/discounts/components/DiscountForm';
import CategoryManager from '../modules/categories/components/CategoryManager';
import MuseumEditForm from '../modules/museums/components/MuseumEdit';
import RoomEditForm from '../modules/rooms/components/RoomEditForm';
import DiscountEditForm from '../modules/discounts/components/DiscountEditForm';
import UserManager from '../modules/users/components/UserManager';
import ProtectedRoute from '../components/ProtectedRoute';
import PublicRoute from '../components/PublicRoute';
import NotFound from '../components/NotFound';

const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <Layout />,
        children: [
          {
            index: true,
            element: <Home />
          },
          {
            path: '/museums',
            element: <MuseumList />
          },
          {
            path: '/museums/:id',
            element: <MuseumDetail />
          },
          {
            path: '/museums/new',
            element: <MuseumForm />
          },
          {
            path: '/museums/edit/:id',
            element: <MuseumEditForm />
          },
          {
            path: '/discounts/new/:museumId',
            element: <DiscountForm />
          },
          {
            path: '/museums/:museumId/discounts/:discountId/edit',
            element: <DiscountEditForm />
          },
          {
            path: '/rooms/new/:museumId',
            element: <RoomForm />
          },
          {
            path: '/museums/:museumId/rooms/:roomId/edit',
            element: <RoomEditForm />
          },
          {
            path: '/rooms/:id',
            element: <RoomDetail />
          },
          {
            path: '/categories',
            element: <CategoryManager />
          },
          {
            path: '/users',
            element: <UserManager />
          },
          {
            path: '/posts',
            element: <MuseumList />
          }
        ]
      }
    ]
  },
  {
    element: <PublicRoute />,
    children: [
      {
        path: '/auth',
        element: <AuthLayout />,
        children: [
          {
            index: true,
            element: <Login />
          },
          {
            path: 'login',
            element: <Login />
          }
        ]
      }
    ]
  },
  {
    path: '*',
    element: <NotFound />
  }
]);

export default router;