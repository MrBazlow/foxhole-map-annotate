import React, { lazy, memo } from 'react';

const Title = lazy(() => import('./Title'));
const ScoreCard = lazy(() => import('./ScoreCard'));
const MapControls = lazy(() => import('./MapControls'));
const Notifications = lazy(() => import('./Notifications'));
const NavigationMenu = lazy(() => import('./NavigationMenu'));
const MapZoomControls = lazy(() => import('./MapZoomControls'));

const Header = memo(() => (
  <header>
    <div className="z-20 m-2 flex h-14 flex-row flex-wrap items-center justify-between rounded-md bg-warden-700 bg-clip-padding shadow-md">
      <Title />
      <ScoreCard />
      <div className="flex flex-row items-center">
        <MapControls />
        <Notifications />
        <NavigationMenu />
      </div>
    </div>
    <MapZoomControls />
  </header>
));

export default Header;
