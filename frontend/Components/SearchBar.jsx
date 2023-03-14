import React, { useState, useEffect, useCallback } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import { getCenter } from 'ol/extent';
import { useOlMap } from '../State/MapState';

function SearchBar() {
  const buttonId = React.useId();
  const inputId = React.useId();
  const [query, setQuery] = useState('');
  const [toggle, setToggle] = useState(false);
  const [locations, setLocations] = useState([]);

  const olMap = useOlMap();

  const collectLocations = useCallback((currentMap) => {
    const places = [];
    try {
      currentMap
        .getAllLayers()
        .filter((layer) => layer.get('canSearch'))
        .forEach((layer) => layer.getSource().forEachFeature((feature) => {
          const coordinates = feature.getGeometry().constructor.name === 'Point' ? feature.getGeometry().flatCoordinates : getCenter(feature.getGeometry().getExtent());
          places.push({
            id: crypto.randomUUID(), name: feature.get('notes'), type: feature.get('type'), location: coordinates,
          });
        }));
    } catch (error) {
      return null;
    }
    return places;
  }, []);

  useEffect(() => {
    if (!toggle || !olMap) return;
    setLocations(collectLocations(olMap));
  }, [toggle, olMap, collectLocations]);

  const moveMap = useCallback((event) => {
    if (!event) return;
    setToggle(false);
    olMap.getView().animate({
      center: event.location,
      resolution: event.type === 'Region' ? 1.75 : 0.75,
      duration: 2000,
    });
  }, [olMap]);

  const toggleMode = () => {
    setToggle(!toggle);
    document.getElementById(toggle ? buttonId : inputId).focus();
  };

  const filteredList = query === '' ? [] : locations.filter((entry) => entry.name
    .toLowerCase()
    .replace(/\s+/g, '')
    .includes(query
      .toLowerCase()
      .replace(/\s+/g, ''))).slice(0, 9);

  return (
    <div role="search" className="relative hidden flex-row-reverse md:flex">
      <button
        type="button"
        id={buttonId}
        role="switch"
        onClick={toggleMode}
        className="group peer mr-2 hidden rounded-lg p-2 text-lg font-light text-white transition duration-200 hover:bg-warden-600 focus:outline-none focus:ring-2 focus:ring-warden-500 active:scale-95 aria-checked:rounded-l-none aria-checked:bg-warden-600 md:flex"
        aria-label="Toggle Search"
        aria-checked={toggle}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="h-6 w-6 transition duration-200 group-hover:scale-125 group-aria-checked:rotate-90"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </button>
      <Combobox value="" onChange={(event) => moveMap(event)}>
        <Combobox.Input
          type="combobox"
          tabIndex={toggle ? '0' : '-1'}
          id={inputId}
          className="relative block w-auto origin-right scale-x-0 rounded-l-lg rounded-r-none border-0 bg-zinc-800 py-2 pl-2 text-sm text-white ring-0 transition placeholder:text-gray-400 focus:border-0 focus:ring-0 peer-aria-checked:scale-x-100"
          displayValue={(location) => location.name}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search Input"
        />
        <Transition
          as={React.Fragment}
          enter="transition ease-out duration-100"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => document.getElementById(buttonId).focus()}
        >
          <Combobox.Options className="absolute right-0 top-14 mr-12 h-auto w-40 origin-top-left divide-y divide-zinc-500 overflow-hidden rounded-lg bg-zinc-800 shadow-lg">
            {filteredList.length === 0 && query.length > 3 ? (
              <div className="relative cursor-default select-none p-2 text-base font-light text-white">Nothing here...</div>
            ) : (
              filteredList.map((location) => (
                <Combobox.Option
                  key={location.id}
                  value={location}
                  className={({ active }) => `relative cursor-default select-none p-2 px-4 w-full text-base text-center font-light text-white hover:bg-warden-600 ${active && 'bg-warden-700'}`}
                >
                  <span className="block truncate font-normal">
                    {location.name}
                  </span>
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </Combobox>
    </div>
  );
}

export default SearchBar;
