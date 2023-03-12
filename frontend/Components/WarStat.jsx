import React from 'react';

import { useLocalData } from '../State/DataState';
import chosenQuote from '../lib/quotes';

function WarStat() {
  const { init } = useLocalData();

  return (
    <span title={chosenQuote}>{`${init.shard || 'Shard'}#${init.warNumber || 'War'}`}</span>
  );
}

export default WarStat;
