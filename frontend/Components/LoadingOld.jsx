import React, { memo } from 'react';
import { Transition } from '@headlessui/react';
import IndefiniteLoad from './IndefiniteLoad';
import chosenQuote from '../lib/quotes';

const Loading = memo(() => (
  <Transition
    show
    leave="transition-opacity duration-1000"
    leaveFrom="opacity-100"
    leaveTo="opacity-0"
  >
    <div className="absolute inset-0 -z-10 flex h-screen w-screen items-center justify-center overflow-hidden dark:bg-zinc-900">
      <div className="flex w-full max-w-lg flex-col overflow-hidden rounded-lg bg-zinc-800 text-white">
        <h1 className="w-full bg-warden-700 py-2 px-4 text-2xl">Warden Express</h1>
        <span className="overflow-auto p-4 text-lg">{chosenQuote}</span>
        <IndefiniteLoad />
      </div>
    </div>
  </Transition>
));

export default Loading;

// eslint-disable-next-line max-len
// <div className="absolute top-0 left-0 -z-10 flex h-screen w-screen flex-col items-center justify-center overflow-hidden bg-zinc-900">
