import React from 'react';
import { AnimatePresence, motion, useDragControls } from 'framer-motion';
import { useToolState, useToolActions } from '../../../State/ToolsState';

function UploadImage() {
  const { isImageActive } = useToolState();
  const { toggleTool } = useToolActions();
  const dragControls = useDragControls();

  return (
    <AnimatePresence>
      {isImageActive && (
        <motion.div
          className="absolute top-16 left-0 z-20 m-2 flex w-full max-w-xs flex-col overflow-y-visible rounded-lg bg-zinc-800 shadow-xl"
          initial={{ x: '-100%', opacity: 0 }}
          animate={{ x: '0%', opacity: 1 }}
          exit={{ x: '-100%', opacity: 0 }}
          drag
          dragMomentum={false}
          dragListener={false}
          dragControls={dragControls}
        >
          <div
            className="flex w-full flex-row items-start justify-between rounded-t-lg border-b border-zinc-700 bg-warden-700 p-4"
            onPointerDown={(event) => dragControls.start(event)}
          >
            <div
              className="flex flex-col"
            >
              <h2 className="select-none text-2xl font-bold tracking-tight">Upload image</h2>
              <span className="select-none text-base tracking-tight">Post images to the map</span>
            </div>
            <button
              type="button"
              onClick={() => toggleTool('image')}
              className="ml-4 justify-center rounded-lg border border-warden-700 p-2 font-bold transition duration-200 hover:scale-105 hover:border-white hover:bg-warden-600 active:scale-95"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex flex-col space-y-2 px-4 py-2">
            <div
              className="flex h-52 w-full select-none flex-col items-center justify-center space-y-2 rounded-lg bg-zinc-900 py-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15" />
              </svg>
              <span>Upload</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default UploadImage;
