import React from 'react'
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'

function Heading ({ title, Icon }: { title?: string, Icon?: React.ElementType }): JSX.Element {
  return (
    <div
      className="pt-24"
    >
      <div className="mx-auto flex flex-row items-center px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="rounded-md bg-warden-700 p-2 shadow-md">
          { (Icon === undefined)
            ? (
                <QuestionMarkCircleIcon className="h-6 w-6 sm:h-8 sm:w-8" />
              )
            : (
                <Icon className="h-6 w-6 sm:h-8 sm:w-8" />
              )}
        </div>
        <h2
          className="pl-2 text-xl font-bold tracking-tight dark:text-white sm:text-3xl"
        >
          { (title === undefined)
            ? (
                'Blank Page'
              )
            : (
                title
              )}
        </h2>
      </div>
    </div>
  )
}

export default Heading
