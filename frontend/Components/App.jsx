import React, { lazy } from 'react';

const Header = lazy(() => import('./Header'));
const MapComponent = lazy(() => import('./MapComponent'));

function App() {
  return (
    <>
      <Header />
      <MapComponent />
    </>
  );
}

export default App;
