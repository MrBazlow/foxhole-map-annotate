import React from 'react'
import { useToolData, useToolActions } from '@State/ToolsState'

function AddToMapMenu (): JSX.Element {
  const { toolMode } = useToolData()
  const { toggleToolMode } = useToolActions()
  return (
    <div>
      <button
        role="switch"
        aria-checked={toolMode}
        onClick={() => { toggleToolMode() }}
        type="button"
        className="group mx-2 hidden cursor-pointer rounded-lg p-2 transition duration-200 hover:bg-warden-600 focus:outline-none focus:ring-2 focus:ring-warden-500 active:scale-95 aria-checked:bg-warden-600 sm:inline"
      >
        <div className="relative flex h-6 w-6 flex-col justify-center transition duration-200 group-hover:scale-125">
          <div className="absolute h-[3px] w-6 origin-center rotate-90 scale-75 rounded-full bg-white transition duration-200 ease-in-out group-aria-checked:rotate-0" />
          <div className="absolute h-[3px] w-6 origin-center scale-75 rounded-full bg-white transition duration-200 ease-in-out" />
        </div>
      </button>
    </div>
  )
}

export default AddToMapMenu
