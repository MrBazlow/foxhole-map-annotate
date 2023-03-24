import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useToolData, useToolState, useToolActions } from '../../../State/ToolsState';

function MapToolBar() {
  const { toolMode } = useToolData();
  const { toggleTool } = useToolActions();
  const {
    isRulerActive,
    isImageActive,
    isChatActive,
    isLineEditActive,
    isIconEditActive,
    isArtyCalcActive,
  } = useToolState();

  return (
    <AnimatePresence>
      {toolMode && (
        <motion.div
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 200, opacity: 0 }}
          drag
          dragMomentum={false}
          className="fixed inset-y-1/3 right-2 z-50 h-fit w-fit -translate-y-1/2 shadow-lg"
        >
          <div
            className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-t-lg bg-warden-700 p-1 py-2"
          >
            <div
              id="toolHandle"
              className="flex h-10 w-10 cursor-grab flex-col items-center justify-center space-y-1 rounded-lg transition-all duration-150 hover:scale-105 hover:bg-warden-600 active:cursor-grabbing active:bg-warden-900"
            >
              <div className="h-[2px] w-8 scale-75 bg-white" />
              <div className="h-[2px] w-8 scale-75 bg-white" />
              <div className="h-[2px] w-8 scale-75 bg-white" />
              <div className="h-[2px] w-8 scale-75 bg-white" />
            </div>
          </div>
          <div
            className="flex w-14 flex-col items-center justify-center space-y-1 rounded-b-lg bg-zinc-800 p-2"
          >
            <button
              role="switch"
              type="button"
              onClick={() => toggleTool('ruler')}
              className="flex h-10 w-10 items-center justify-center rounded-lg p-1 transition-all hover:scale-105 hover:bg-zinc-600 active:bg-zinc-900 aria-checked:bg-zinc-900"
              aria-label="Ruler"
              aria-checked={isRulerActive}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M17 3l4 4l-14 14l-4 -4z" />
                <path d="M16 7l-1.5 -1.5" />
                <path d="M13 10l-1.5 -1.5" />
                <path d="M10 13l-1.5 -1.5" />
                <path d="M7 16l-1.5 -1.5" />
              </svg>
            </button>
            <button
              role="switch"
              type="button"
              onClick={() => toggleTool('image')}
              className="flex h-10 w-10 items-center justify-center rounded-lg p-1 transition-all hover:scale-105 hover:bg-zinc-600 active:bg-zinc-900 aria-checked:bg-zinc-900"
              aria-label="Post an image"
              aria-checked={isImageActive}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </button>
            <button
              role="switch"
              type="button"
              onClick={() => toggleTool('chat')}
              className="flex h-10 w-10 items-center justify-center rounded-lg p-1 transition-all hover:scale-105 hover:bg-zinc-600 active:bg-zinc-900 aria-checked:bg-zinc-900"
              aria-label="Start a conversation"
              aria-checked={isChatActive}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
            </button>
            <button
              role="switch"
              type="button"
              onClick={() => toggleTool('lineEdit')}
              className="flex h-10 w-10 items-center justify-center rounded-lg p-1 transition-all hover:scale-105 hover:bg-zinc-600 active:bg-zinc-900 aria-checked:bg-zinc-900"
              aria-label="Draw lines"
              aria-checked={isLineEditActive}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
              </svg>
            </button>
            <button
              role="switch"
              type="button"
              onClick={() => toggleTool('iconEdit')}
              className="flex h-10 w-10 items-center justify-center rounded-lg p-1 transition-all hover:scale-105 hover:bg-zinc-600 active:bg-zinc-900 aria-checked:bg-zinc-900"
              aria-label="Place icons"
              aria-checked={isIconEditActive}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" strokeLinejoin="miter" className="h-6 w-6">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M6.5 6.5m-3.5 0a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0 -7 0" />
                <path d="M2.5 21h8l-4 -7z" />
                <path d="M14 3l7 7" />
                <path d="M14 10l7 -7" />
                <path d="M14 14h7v7h-7z" />
              </svg>
            </button>
            <button
              role="switch"
              type="button"
              onClick={() => toggleTool('artyCalc')}
              className="flex h-10 w-10 items-center justify-center rounded-lg p-1 transition-all hover:scale-105 hover:bg-zinc-600 active:bg-zinc-900 aria-checked:bg-zinc-900"
              aria-label="Artillery Calculator"
              aria-checked={isArtyCalcActive}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-6 w-6" viewBox="0 0 16 16">
                <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default MapToolBar;
