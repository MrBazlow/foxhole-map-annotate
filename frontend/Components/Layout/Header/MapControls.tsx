import React from 'react'

import SearchBar from './SearchBar'
import MapConfig from './MapConfig'
import AddToMapMenu from './AddToMapMenu'

function MapControls (): JSX.Element {
  return (
    <>
      <SearchBar />
      <MapConfig />
      <AddToMapMenu />
    </>
  )
}

export default MapControls
