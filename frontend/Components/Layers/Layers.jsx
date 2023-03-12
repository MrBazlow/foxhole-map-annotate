import { useEffect } from 'react';
import { useLocalData, useDataActions } from '../../State/DataState';

function Layers({ children }) {
  const { mapStatic } = useLocalData();
  const { fetchStatic } = useDataActions();

  useEffect(() => {
    if (!mapStatic) {
      fetchStatic();
    }
  }, [fetchStatic, mapStatic]);

  return children;
}

export default Layers;
