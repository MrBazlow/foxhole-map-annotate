import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useToolState, useToolActions } from '../../../State/ToolsState';

function LineEdit() {
  const { isLineEditActive } = useToolState();
  const { toggleTool } = useToolActions();
  return (
    <AnimatePresence>
      {isLineEditActive && (
        <motion.div
          className="absolute top-20 left-2 z-20 h-48 w-48 rounded-lg bg-warden-700"
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -200, opacity: 0 }}
          drag
          dragMomentum={false}
        >
          LineEdit
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default LineEdit;
