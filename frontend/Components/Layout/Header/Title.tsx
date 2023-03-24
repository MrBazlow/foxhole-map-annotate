import React from 'react'
import { Link } from 'react-router-dom'
import WarStat from '@Components/Layout/Header/WarStat'

function Title (): JSX.Element {
  return (
    <div className="mt-1 flex flex-row items-center pb-1 text-white">
      <Link
        to='/'
        aria-label="Homepage"
        className="group mx-1 flex appearance-none flex-row items-center justify-center rounded-lg px-2 transition duration-300 hover:bg-warden-600 focus:outline-none focus:ring-2 focus:ring-warden-500 active:scale-95"
      >
        <img src="/images/favicon.svg" height="40" width="40" className="flex-none transition duration-300 group-hover:scale-125" alt="Website Logo" />
        <h1 className="ml-2 flex-none text-xl font-medium">Warden Express</h1>
      </Link>
      <div className="hidden select-none flex-row justify-self-end px-4 text-xl font-normal sm:flex">
        <WarStat />
      </div>
    </div>
  )
}

export default Title
