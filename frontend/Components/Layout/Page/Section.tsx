import React from 'react'

function Section ({ title, description, children }: { title?: string, description?: string, children?: React.ReactNode }): JSX.Element {
  return (
    <div className="flex h-full flex-col overflow-auto">
      <div className="mb-4 flex w-full flex-col border-b border-zinc-700 p-4">
        <h2 className="text-2xl font-bold tracking-tight">
          { (title === undefined)
            ? (
                'Default Title'
              )
            : (
                title
              )}
        </h2>
        <span className="text-base tracking-tight text-gray-200">
          { (description === undefined)
            ? (
                'Default description'
              )
            : (
                description
              )}
        </span>
      </div>
      {children}
    </div>
  )
}

export default Section
