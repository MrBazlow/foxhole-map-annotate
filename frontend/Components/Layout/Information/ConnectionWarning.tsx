import React from 'react'
import { useReady } from '@State/DataState'
import IndefiniteLoad from './IndefiniteLoad'

function ConnectionWarning (): JSX.Element {
  const isReady = useReady()
  return (
    <div className={`absolute top-0 left-0 z-10 ${isReady ? 'hidden' : 'flex'} h-screen w-screen flex-col items-center overflow-hidden bg-black/25`}>
      <div className="mt-20 flex w-auto flex-col overflow-hidden rounded-lg text-white shadow-lg">
        <h1 className="bg-warden-700 py-2 px-4 text-2xl">Disconnected</h1>
        <div className="bg-zinc-800 p-4 text-lg">
          <span className="block">Connection to server has been lost.</span>
          <span className="block">Attempting to reconnect...</span>
        </div>
        <IndefiniteLoad />
      </div>
    </div>
  )
}

export default ConnectionWarning
