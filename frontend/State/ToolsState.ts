/*
 *  @module /frontend/State/ToolsState.js
 */

import { create, type StoreApi } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import { produce } from 'immer'

// type ToolGet = StoreApi<ToolState>['getState']
type ToolSet = StoreApi<ToolState>['setState']

interface ToolState {
  data: {
    toolMode: boolean
    darkMode: boolean | null
    active: {
      isRulerActive: boolean
      isImageActive: boolean
      isChatActive: boolean
      isLineEditActive: boolean
      isIconEditActive: boolean
      isArtyCalcActive: boolean
    }
  }
  actions: {
    toggleToolMode: () => void
    toggleTool: (name: string) => void
    setDark: (bool: boolean) => void
  }
}

const toggleToolMode = (set: ToolSet): void => {
  set(produce((state: ToolState) => {
    state.data.toolMode = !state.data.toolMode
    if (!state.data.toolMode) {
      const activeKeys = Object.keys(state.data.active) as Array<keyof typeof state.data.active>
      activeKeys.forEach((tool) => {
        state.data.active[tool] = false
      })
    }
    return state
  }))
}

const toggleTool = (set: ToolSet, name: string): void => {
  const toolKey = `is${name.charAt(0).toUpperCase()}${name.slice(1)}Active`
  set(produce((state: ToolState) => {
    const activeKeys = Object.keys(state.data.active) as Array<keyof typeof state.data.active>
    activeKeys.forEach((tool) => {
      state.data.active[tool] = tool === toolKey ? !state.data.active[tool] : false
    })
    return state
  }))
}

function setDark (set: ToolSet, bool: boolean): void {
  set(produce((state: ToolState) => { state.data.darkMode = bool }))
}

const useToolStore = create<ToolState>()(
  persist(devtools(
    (set, get) => ({
      data: {
        darkMode: null,
        toolMode: false,
        active: {
          isRulerActive: false,
          isImageActive: false,
          isChatActive: false,
          isLineEditActive: false,
          isIconEditActive: false,
          isArtyCalcActive: false
        }
      },
      actions: {
        toggleToolMode: () => { toggleToolMode(set) },
        toggleTool: (name) => { toggleTool(set, name) },
        setDark: (bool) => { setDark(set, bool) }
      }
    })
  ),
  {
    name: 'tools',
    partialize: (state) => ({ tools: state.data })
  })
)

const useToolData = (): ToolState['data'] => useToolStore((state) => state.data)
const useToolState = (): ToolState['data']['active'] => useToolStore((state) => state.data.active)
const useToolActions = (): ToolState['actions'] => useToolStore((state) => state.actions)

export { useToolStore, useToolActions, useToolData, useToolState }
