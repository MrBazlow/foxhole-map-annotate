import React from 'react'

import { useLocalData } from '@State/DataState'
import chosenQuote from '@lib/quotes'

function WarStat (): JSX.Element {
  const { init } = useLocalData()

  let shard: string = 'Shard'
  let warNumber: number = 0

  if (init?.shard !== undefined) {
    shard = init.shard
  }

  if (init?.warNumber !== undefined) {
    warNumber = init.warNumber
  }

  return <span title={chosenQuote}>{`${shard}#${warNumber}`}</span>
}

export default WarStat
