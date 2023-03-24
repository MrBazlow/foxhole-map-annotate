import './style.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { LazyMotion, domAnimation } from 'framer-motion'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import ErrorPage from '@Routes/ErrorPage'
import Root from '@Routes/Root'
import MapComponent from '@Components/olMap/MapComponent'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <MapComponent />
      },
      {
        path: 'admin',
        children: [
          {
            path: 'eventlog',
            async lazy () {
              const EventLog = (await import('@Routes/EventLog')).default
              return { Component: EventLog }
            }
          },
          {
            path: 'config',
            async lazy () {
              const Admin = (await import('@Routes/Admin')).default
              return { Component: Admin }
            }
          }
        ]
      }
    ]
  }
])

const rootElement = document.querySelector('#react-root')

if (rootElement !== null) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <LazyMotion features={domAnimation}>
        <RouterProvider router={router} />
      </LazyMotion>
    </React.StrictMode>
  )
}
