import { interfaces } from 'inversify';
import { createContext, FC } from 'react';

const InversifyContext = createContext<interfaces.Container>(null);

const InversifyContainerProvider: FC<{ container: interfaces.Container; children?: React.ReactNode }> = ({
  container,
  children,
}) => <InversifyContext.Provider value={container}>{children}</InversifyContext.Provider>;

export { InversifyContainerProvider, InversifyContext };
