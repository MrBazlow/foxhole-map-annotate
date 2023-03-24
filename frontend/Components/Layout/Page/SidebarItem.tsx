import React, { useState, useId } from 'react'
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'

function SidebarItem ({ title, icon }: { title?: string, icon?: JSX.Element }): JSX.Element {
  const buttonId = useId()
  const [isActive, setIsActive] = useState<boolean>(false)
  return (
    <button
      type="button"
      role="tab"
      aria-controls="TODO"
      aria-selected={isActive}
      id={buttonId}
      onClick={() => { setIsActive(!isActive) }}
      className="group flex flex-row items-center justify-center px-2 py-4 hover:bg-warden-500 aria-selected:bg-warden-600 sm:py-3 lg:justify-start"
    >
      { (icon === undefined)
        ? (
            <QuestionMarkCircleIcon className="h-6 w-6" />
          )
        : (
            icon
          )}
      <span className="hidden truncate pl-2 lg:inline">
      { (title === undefined)
        ? (
            'Example'
          )
        : (
            title
          )}
      </span>
</button>
  )
}

export default SidebarItem

// title="Example" w-6 h-6
