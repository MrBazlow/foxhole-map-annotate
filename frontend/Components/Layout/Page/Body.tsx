import React from 'react'

function Body ({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-zinc-800 shadow-md lg:rounded-r-md">
      {children}
    </div>
  )
}

export default Body
