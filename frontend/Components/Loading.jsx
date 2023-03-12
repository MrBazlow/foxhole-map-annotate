import React, { memo } from 'react';

const Loading = memo(() => (
  <div className="absolute inset-0 -z-10 flex h-screen w-screen items-center justify-center overflow-hidden">
    <img
      src="/images/favicon.svg"
      className="h-1/3 flex-none animate-clock"
      alt="Logo"
    />
  </div>
));

export default Loading;
