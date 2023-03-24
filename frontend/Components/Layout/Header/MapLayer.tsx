import React, { useState, useId } from 'react'
import type { Layer } from 'ol/layer'

function MapLayer ({ layer }: { layer: Layer }): JSX.Element {
  const inputId = useId()
  const [toggle, setToggle] = useState(layer.getVisible())

  function onChange (): void {
    layer.setVisible(!toggle)
    setToggle(!toggle)
  }

  return (
    <div
      className="group flex flex-row p-2"
    >
      <input
        id={inputId}
        type="checkbox"
        checked={toggle}
        onChange={() => { onChange() }}
        className=""
      />
      <label
        htmlFor={inputId}
        className="w-max pl-2"
      >
        {layer.get('title')}
      </label>
    </div>
  )
}

export default MapLayer
