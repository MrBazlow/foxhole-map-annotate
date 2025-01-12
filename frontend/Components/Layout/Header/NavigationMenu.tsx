import React from 'react'
import { Disclosure, Popover } from '@headlessui/react'
import { Link } from 'react-router-dom'

function NavigationMenu (): JSX.Element {
  return (
    <Popover className="relative">
      <Popover.Button
        aria-label="Navigation Menu"
        className="group mx-2 flex items-center overflow-hidden rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-warden-500 active:scale-95"
      >
        <img
          width="40"
          height="40"
          className="select-none rounded-lg transition duration-200 group-hover:scale-110 group-hover:brightness-125 group-active:scale-110"
          src="/images/placeholder_profile.webp"
          alt="Profile"
        />
      </Popover.Button>
      <Popover.Panel className="absolute right-0 z-20 mt-4 w-fit origin-top-right divide-y divide-zinc-500 overflow-hidden rounded-lg bg-zinc-800 shadow-lg">
        <div className="px-4 py-3">
          <span
            id="discord-username"
            data-user-id="1234567895"
            className="block truncate pb-1 text-lg font-medium"
          >
            develop
          </span>
          <span className="block select-none text-xs">Admin</span>
        </div>
        <div>
          <AdminDisclosure />
          <ModeratorDisclosure />
          <button
            type="button"
            className="group flex items-center justify-start bg-transparent py-1 pl-2 pr-8 text-lg font-light transition duration-200 hover:bg-warden-600"
          >
            <div className="flex origin-left flex-row items-center transition duration-200 group-active:scale-95">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5"
                />
              </svg>
              <span className="pl-2">Language</span>
            </div>
          </button>
          <button
            type="button"
            className="group flex items-center justify-start bg-transparent py-1 pl-2 pr-8 text-lg font-light transition duration-200 hover:bg-warden-600"
          >
            <div className="flex origin-left flex-row items-center transition duration-200 group-active:scale-95">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                />
              </svg>
              <span className="pl-2">Help</span>
            </div>
          </button>
        </div>
        <div>
          <a
            href="/logout"
            className="group flex items-center justify-start bg-transparent py-1 pl-2 pr-8 text-lg font-light transition duration-200 hover:bg-warden-600"
          >
            <div className="flex origin-left flex-row items-center transition duration-200 group-active:scale-95">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                />
              </svg>
              <span className="pl-2">Logout</span>
            </div>
          </a>
        </div>
      </Popover.Panel>
    </Popover>
  )
}

function AdminDisclosure (): JSX.Element {
  return (
    <Disclosure>
      <div className="flex w-full flex-col justify-start bg-transparent text-lg font-light">
        <Disclosure.Button className="group py-1 pl-2 pr-8 transition duration-200 hover:bg-warden-600">
          <div className="flex origin-left flex-row items-center transition duration-200 group-active:scale-95">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="white"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="pl-2 text-white">Admin</span>
          </div>
        </Disclosure.Button>
      </div>
      <Disclosure.Panel as="div" className="flex flex-col">
        <Link
          to="/admin/config"
          className="flex flex-row items-center justify-start py-1 pl-4 transition duration-200 hover:bg-warden-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"
            />
          </svg>
          <span className="pl-2">Dashboard</span>
        </Link>
      </Disclosure.Panel>
    </Disclosure>
  )
}

function ModeratorDisclosure (): JSX.Element {
  return (
    <Disclosure>
      <div className="flex w-full flex-col justify-start bg-transparent text-lg font-light">
        <Disclosure.Button className="group py-1 pl-2 pr-8 transition duration-200 hover:bg-warden-600">
          <div className="flex origin-left flex-row items-center transition duration-200 group-active:scale-95">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="white"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 11-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 016.336-4.486l-3.276 3.276a3.004 3.004 0 002.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.867 19.125h.008v.008h-.008v-.008z"
              />
            </svg>
            <span className="pl-2 text-white">Moderation</span>
          </div>
        </Disclosure.Button>
        <Disclosure.Panel as="div" className="flex flex-col">
          <button
            type="button"
            className="flex flex-row items-center justify-start py-1 pl-4 transition duration-200 hover:bg-warden-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5"
              />
            </svg>
            <span className="pl-2">Flagged</span>
          </button>
          <Link
            to="/admin/eventlog"
            className="flex flex-row items-center justify-start py-1 pl-4 transition duration-200 hover:bg-warden-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 16 16"
              className="h-6 w-6"
            >
              <path d="M3.5 2a.5.5 0 0 0-.5.5v12a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-12a.5.5 0 0 0-.5-.5H12a.5.5 0 0 1 0-1h.5A1.5 1.5 0 0 1 14 2.5v12a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5v-12A1.5 1.5 0 0 1 3.5 1H4a.5.5 0 0 1 0 1h-.5Z" />
              <path d="M10 .5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5.5.5 0 0 1-.5.5.5.5 0 0 0-.5.5V2a.5.5 0 0 0 .5.5h5A.5.5 0 0 0 11 2v-.5a.5.5 0 0 0-.5-.5.5.5 0 0 1-.5-.5Z" />
            </svg>
            <span className="pl-2">Event Log</span>
          </Link>
        </Disclosure.Panel>
      </div>
    </Disclosure>
  )
}

export default NavigationMenu
