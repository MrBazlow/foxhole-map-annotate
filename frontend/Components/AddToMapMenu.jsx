import React from 'react';
import { Menu } from '@headlessui/react';

function AddToMapMenu() {
  return (
    <Menu as="div" className="relative">
      <Menu.Button
        role="switch"
        className="group mx-2 cursor-pointer rounded-lg p-2 transition duration-200 hover:bg-warden-600 focus:outline-none focus:ring-2 focus:ring-warden-500 active:scale-95 aria-pressed:bg-warden-600"
      >
        <div className="relative flex h-6 w-6 flex-col justify-center transition duration-200 group-hover:scale-125">
          <div className="absolute h-[3px] w-6 origin-center rotate-90 scale-75 rounded-full bg-white transition duration-200 ease-in-out group-aria-pressed:rotate-0" />
          <div className="absolute h-[3px] w-6 origin-center scale-75 rounded-full bg-white transition duration-200 ease-in-out" />
        </div>
      </Menu.Button>
      <Menu.Items className="absolute right-0 mt-4 w-fit origin-top-right">
        <Menu.Item as="div">Ruler</Menu.Item>
        <Menu.Item as="div">Edit Tool</Menu.Item>
        <Menu.Item as="div">Artillery Calculator</Menu.Item>
        <Menu.Item as="div">Flags</Menu.Item>
      </Menu.Items>
    </Menu>
  );
}

export default AddToMapMenu;
