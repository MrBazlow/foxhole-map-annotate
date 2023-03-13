import React, { Suspense, lazy } from 'react';
import Loading from './Loading';

const ConnectionWarning = lazy(() => import('./ConnectionWarning'));
const OlMap = lazy(() => import('./OlMap'));
const Layers = lazy(() => import('./Layers/Layers'));
const BaseLayer = lazy(() => import('./Layers/BaseLayer'));
const Labels = lazy(() => import('./Layers/Labels'));
const Conquest = lazy(() => import('./Layers/Conquest'));
const Towns = lazy(() => import('./Layers/Towns'));
const Interactions = lazy(() => import('./Interactions/Interactions'));
const DisableContextMenu = lazy(() => import('./Interactions/DisableContextMenu'));
const UpdateURL = lazy(() => import('./Interactions/UpdateURL'));
const EnableMiddleMousePan = lazy(() => import('./Interactions/EnableMiddleMousePan'));

function MapComponent() {
  return (
    <Suspense fallback={<Loading />}>
      <main className="absolute inset-0 -z-10 h-screen w-screen overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-warden-200 via-warden-100 to-warden-200 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
        <ConnectionWarning />
        <OlMap>
          <Layers>
            <BaseLayer />
            <Labels />
            <Conquest />
            <Towns />
          </Layers>
          <Interactions>
            <EnableMiddleMousePan />
            <DisableContextMenu />
            <UpdateURL />
          </Interactions>
        </OlMap>
      </main>
    </Suspense>
  );
}

export default MapComponent;
