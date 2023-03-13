import { useEffect } from 'react';
import { useLiveData, useDataActions } from '../../State/DataState';

function Layers({ children }) {
  const { mapStatic } = useLiveData();
  const { readStatic } = useDataActions();

  useEffect(() => {
    if (!mapStatic) {
      readStatic();
    }
  }, [readStatic, mapStatic]);

  return children;
}

export default Layers;
