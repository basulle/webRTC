import 'reflect-metadata';
import App from './app';
import { createRoot } from 'react-dom/client';
import { InversifyContainerProvider } from './hooks';
import { inversifyAppContainer } from './inversify.config';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <InversifyContainerProvider container={inversifyAppContainer}>
    <App />
  </InversifyContainerProvider>,
);
