import React from 'react'
import ConnectionWarning from '../Layout/Information/ConnectionWarning'
import MapTools from './MapTools/MapTools'
import OlMap from './OlMap'
import Attribution from './Attribution'
import MapZoomControls from './MapZoomControls'
import Layers from './Layers/Layers'
import BaseLayer from './Layers/BaseLayer'
import Labels from './Layers/Labels'
import Conquest from './Layers/Conquest'
import Towns from './Layers/Towns'
import Industry from './Layers/Industry'
import Fields from './Layers/Fields'
import Interactions from './Interactions/Interactions'
import DisableContextMenu from './Interactions/DisableContextMenu'
import UpdateURL from './Interactions/UpdateURL'
import EnableMiddleMousePan from './Interactions/EnableMiddleMousePan'

function MapComponent (): JSX.Element {
  return (
    <main className="absolute inset-0 -z-10 h-screen w-screen overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-warden-200 via-warden-100 to-warden-200 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
      <ConnectionWarning />
      <OlMap>
        <Layers>
          <BaseLayer />
          <Labels />
          <Conquest />
          <Towns />
          <Industry />
          <Fields />
        </Layers>
        <Interactions>
          <EnableMiddleMousePan />
          <DisableContextMenu />
          <UpdateURL />
        </Interactions>
      </OlMap>
      <MapZoomControls />
      <Attribution />
      <MapTools />
    </main>
  )
}

export default MapComponent
