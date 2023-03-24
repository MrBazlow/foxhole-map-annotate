import React from 'react'
import SidebarItem from './SidebarItem'

function Sidebar ({ children }: { children?: React.ReactNode }): JSX.Element {
  return (
    <aside className="basis-1/12 border-r border-zinc-700 bg-zinc-800 py-6 shadow-md lg:rounded-l-md">
      <nav className="flex flex-col text-lg font-normal tracking-tight">
        {children}
      </nav>
    </aside>
  )
}

export default Sidebar
