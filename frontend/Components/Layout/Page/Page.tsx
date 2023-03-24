import React from 'react'

function Page ({ children }: { children?: React.ReactNode }): JSX.Element {
  return (
    <div className="my-4 flex h-full flex-row overflow-hidden py-4">
      <div className="flex h-auto w-full flex-row lg:mx-14">
        {children}
      </div>
    </div>
  )
}

export default Page
