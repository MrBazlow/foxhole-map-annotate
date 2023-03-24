import React from 'react';
import { AnimatePresence, motion, useDragControls } from 'framer-motion';
import { useToolState, useToolActions } from '../../../State/ToolsState';

function ArtyCalc() {
  const { isArtyCalcActive } = useToolState();
  const { toggleTool } = useToolActions();
  const dragControls = useDragControls();

  return (
    <AnimatePresence>
      {isArtyCalcActive && (
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
              <h2 className="select-none text-2xl font-bold tracking-tight">Artillery Calculator</h2>
              <span className="select-none text-base tracking-tight">Plan and calculate artillery fire</span>
            </div>
            <button
              type="button"
              onClick={() => toggleTool('artyCalc')}
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
            <div className="relative flex flex-row items-center justify-start">
              <div className="w-1/5">Gun</div>
              <button
                type="button"
                className="h-10 w-4/5 rounded-lg border-0 bg-zinc-700 px-3 text-start text-base shadow-inner"
                aria-label="Gun"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ArtyCalc;
