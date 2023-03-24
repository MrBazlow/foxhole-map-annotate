import React from 'react'
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'

function BodyBackgroundIcon ({ Icon }: { Icon?: React.ElementType }): JSX.Element {
  return (
    <div className="absolute inset-y-0 right-0 z-auto max-h-full translate-x-3/4 select-none md:translate-x-2/3 lg:translate-x-1/2">
      {(Icon === undefined)
        ? (
          <QuestionMarkCircleIcon className="h-full stroke-zinc-900 opacity-50" />
          )
        : (
          <Icon className="h-full stroke-zinc-900 opacity-50" />
          )}
    </div>
  )
}

export default BodyBackgroundIcon
