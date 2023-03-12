import React, { lazy, memo } from 'react';

const SearchBar = lazy(() => import('./SearchBar'));
const MapConfig = lazy(() => import('./MapConfig'));
const AddToMapMenu = lazy(() => import('./AddToMapMenu'));

const MapControls = memo(() => (
  <>
    <SearchBar />
    <MapConfig />
    <AddToMapMenu />
  </>
));

export default MapControls;
