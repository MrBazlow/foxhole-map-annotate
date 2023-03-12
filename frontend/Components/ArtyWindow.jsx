import React from 'react';

function ArtyWindow() {
  return (
    <div className="flex flex-col space-y-2 px-4 py-2">
      <div className="relative flex flex-row items-center justify-start">
        <label htmlFor="artyPieceButton" className="w-1/5">Gun</label>
        <button type="button" className="h-10 w-4/5 rounded-lg border-0 bg-zinc-700 px-3 text-start text-base shadow-inner" />
      </div>
    </div>
  );
}

export default ArtyWindow;
