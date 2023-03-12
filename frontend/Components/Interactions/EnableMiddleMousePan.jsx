import { useEffect } from 'react';
import { DragPan } from 'ol/interaction';
import { all, noModifierKeys } from 'ol/events/condition';
import { useOlMap } from '../../State/MapState';

const MiddleMousePan = () => {
  const map = useOlMap();

  useEffect(() => {
    if (!map) return;

    const primaryPrimaryOrMiddle = (mapBrowserEvent) => {
      const pointerEvent = mapBrowserEvent.originalEvent;
      return pointerEvent.isPrimary && (pointerEvent.button === 0 || pointerEvent.button === 1);
    };
    map.getInteractions().forEach((interaction) => {
      if (interaction instanceof DragPan) {
        // eslint-disable-next-line no-underscore-dangle, no-param-reassign
        interaction.condition_ = all(noModifierKeys, primaryPrimaryOrMiddle);
      }
    });
  }, [map]);
};

export default MiddleMousePan;
