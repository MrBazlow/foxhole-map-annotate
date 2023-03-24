import React from 'react'
import { useLocation } from 'react-router-dom'

import Title from './Title'
import ScoreCard from './ScoreCard'
import MapControls from './MapControls'
import Notifications from './Notifications'
import NavigationMenu from './NavigationMenu'

function Header (): JSX.Element {
  const location = useLocation()
  return (
  <header>
    <div className="absolute inset-0 z-20 m-2 flex h-14 flex-row flex-wrap items-center justify-between rounded-md bg-warden-700 bg-clip-padding shadow-md">
      <Title />
      <ScoreCard />
      <div className="flex flex-row items-center">
        { location.pathname === '/' &&
          <>
            <MapControls />
            <Notifications />
          </>
        }
        <NavigationMenu />
      </div>
    </div>
  </header>
  )
}

export default Header
