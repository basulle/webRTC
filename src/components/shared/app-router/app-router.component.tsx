import { AppRoutes } from '@constants/routes.constants';
import { Main } from '@pages/main';
import { MeetingRoom } from '@pages/meeting-room';
import { FC } from 'react';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

function ErrorBoundary() {
  return <div>Something went wrong (Custom error boundary)</div>;
}

const router = createBrowserRouter([
  {
    path: AppRoutes.Main,
    element: <Main />,
    ErrorBoundary: ErrorBoundary,
  },
  {
    path: AppRoutes.Room,
    element: <MeetingRoom />,
  },
]);

const AppRouter: FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
