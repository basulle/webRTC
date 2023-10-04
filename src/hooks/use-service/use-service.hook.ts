import { interfaces } from 'inversify';
import { useContext, useMemo } from 'react';
import { InversifyContext } from '..';

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint, @typescript-eslint/no-explicit-any
export const useService = <T extends unknown = any>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  service: { type: interfaces.ServiceIdentifier<any> } & (new (...args: any[]) => T),
): T => {
  const container = useContext(InversifyContext);
  const instance = useMemo<T>(() => container.get<T>(service.type), [container, service.type]);
  return instance;
};
