import { DependencyList, useEffect, useState } from 'react';
import { Observable } from 'rxjs';

const useSubscription = <T>(
  dataSource: Observable<T>,
  initialValue: T = null,
  dependencies: DependencyList = [],
): T => {
  const [data, setData] = useState<T>(initialValue);

  useEffect(() => {
    const subscriber = dataSource.subscribe(setData);
    return () => {
      subscriber.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return data;
};

export default useSubscription;
