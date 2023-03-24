import React from 'react'

import MapToolBar from './MapToolBar'
import Ruler from './Ruler'
import UploadImage from './UploadImage'
import Chat from './Chat'
import LineEdit from './LineEdit'
import IconEdit from './IconEdit'
import ArtyCalc from './ArtyCalc'

function MapTools (): JSX.Element {
  return (
    <>
      <MapToolBar />
      <Ruler />
      <UploadImage />
      <Chat />
      <LineEdit />
      <IconEdit />
      <ArtyCalc />
    </>
  )
}

export default MapTools
