import React, { lazy } from 'react';
import { Transition } from '@headlessui/react';
import { useReady } from '../State/DataState';

const IndefiniteLoad = lazy(() => import('./IndefiniteLoad'));

function ConnectionWarning() {
  const ready = useReady();
  return (
    <Transition
      show={!ready}
      enter="transition-opacity duration-700"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-700"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="absolute top-0 left-0 z-10 flex h-screen w-screen flex-col items-center overflow-hidden bg-black/25">
        <div className="mt-20 flex w-auto flex-col overflow-hidden rounded-lg text-white shadow-lg">
          <h1 className="bg-warden-700 py-2 px-4 text-2xl">Disconnected</h1>
          <div className="bg-zinc-800 p-4 text-lg">
            <span className="block">Connection to server has been lost.</span>
            <span className="block">Attempting to reconnect...</span>
          </div>
          <IndefiniteLoad />
        </div>
      </div>
    </Transition>
  );
}

export default ConnectionWarning;
