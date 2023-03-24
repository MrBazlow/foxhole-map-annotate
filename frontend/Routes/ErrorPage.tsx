import React from 'react'
import { isRouteErrorResponse, useRouteError, Link } from 'react-router-dom'

function ErrorPage (): JSX.Element {
  const error = useRouteError()

  let bodyText: string = 'Strange, doesn\'t seem to be anything here...'

  if (isRouteErrorResponse(error)) {
    bodyText = error.statusText
  } else if (error instanceof Error) {
    bodyText = error.message
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <div className="flex h-auto w-auto max-w-xl -translate-y-full flex-col overflow-hidden rounded-xl bg-white text-black shadow-lg">
        <div className="bg-warden-700 p-4">
          <Link
            to="/"
            className="group flex flex-row items-center rounded-lg p-2 px-4 transition hover:bg-warden-600 active:scale-95"
          >
            <img
              src="/images/favicon.svg"
              height="64"
              width="64"
              className="transition duration-300 group-hover:scale-105"
              alt="Website Logo"
            />
            <span className="origin-left pl-2 text-3xl text-white transition duration-300 group-hover:scale-105">Warden Express</span>
          </Link>
        </div>
        <h1 className="p-2 text-2xl font-medium">
          An error occurred.
        </h1>
        <p className="px-4 pb-4 font-normal">
          <code>{bodyText}</code>
        </p>
      </div>
    </div>
  )
}

export default ErrorPage
