import React, { lazy, memo } from 'react';

const WarStat = lazy(() => import('./WarStat'));

const Title = memo(() => (
  <div className="mt-1 flex flex-row items-center pb-1 text-white">
    <a
      href={window.location.pathname === '/' ? '#' : '/'}
      className="group mx-1 flex appearance-none flex-row items-center justify-center rounded-lg px-2 transition duration-300 hover:bg-warden-600 active:scale-95"
    >
      <img
        src="/images/favicon.svg"
        height="40"
        width="40"
        className="flex-none transition duration-300 group-hover:scale-125"
        alt="Logo"
      />
      <div
        className="ml-2 flex-none text-xl font-medium"
        title="Warden Express"
      >
        Warden Express
      </div>
    </a>
    <div
      className="hidden select-none flex-row justify-self-end px-4 text-xl font-normal sm:flex"
    >
      <WarStat />
    </div>
  </div>
));

export default Title;
