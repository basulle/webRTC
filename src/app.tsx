import { AppRouter } from '@components/shared/app-router';
import { ErrorBoundary } from '@components/shared/error-boundary';
import { useService } from '@hooks/use-service/use-service.hook';
import { CallsService } from '@services/calls/calls.service';
import { useEffect } from 'react';
import { FC } from 'react';

import './index.css';

const App: FC = () => {
  const { login } = useService(CallsService);

  useEffect(() => {
    login().subscribe();
  }, [login]);

  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <AppRouter />
    </ErrorBoundary>
  );
};

export default App;
