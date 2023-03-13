import React from 'react';
import { useLiveData } from '../State/DataState';

function ScoreCard() {
  const { score } = useLiveData();

  return (
    <div className="absolute inset-x-0 mx-auto hidden h-10 w-fit select-none flex-row text-white xl:flex">
      <div className="flex h-10 flex-row items-center rounded-l-xl bg-zinc-800 pr-4 shadow-inner">
        <img
          className="w-fit pl-3"
          height="38"
          width="40"
          src="/images/colonial.webp"
          alt="Colonial"
          loading="lazy"
        />
        <div className="w-14 pl-3 text-xl font-semibold">
          <span>{`${score.Colonial || 0}/${score.Total || 0}`}</span>
        </div>
      </div>
      <div className="flex h-10 flex-row items-center rounded-r-xl bg-zinc-800 pl-4 shadow-inner">
        <div className="w-14 pr-3 text-xl font-semibold">
          <span>{`${score.Warden || 0}/${score.Total || 0}`}</span>
        </div>
        <img
          className="w-fit pr-3"
          height="38"
          width="40"
          src="/images/warden.webp"
          alt="Warden"
          loading="lazy"
        />
      </div>
    </div>
  );
}

export default ScoreCard;
