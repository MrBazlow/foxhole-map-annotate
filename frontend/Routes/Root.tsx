import React from 'react'
import { useToolActions, useToolData } from '@State/ToolsState'
import { Outlet } from 'react-router-dom'

import Header from '@Components/Layout/Header/Header'

function Root (): JSX.Element {
  const { setDark } = useToolActions()
  const { darkMode } = useToolData()
  const isSystemDarkMode = window.matchMedia('(prefers-color-scheme:dark)').matches

  if (darkMode === null) {
    setDark(isSystemDarkMode)
  }

  if (!isSystemDarkMode && document.documentElement.classList.contains('dark')) {
    document.documentElement.classList.remove('dark')
  }

  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}

export default Root
