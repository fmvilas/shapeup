'use client';

import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { signOut } from 'next-auth/react'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function UserMenu({ user }) {
  if (!user) {
    return (
      <a
        href="/"
        className="text-pink-600 bg-pink-600/10 ring-pink-600/30 rounded-full flex-none py-1 px-2 text-xs font-medium ring-1 ring-inset"
      >
        Sign In
      </a>
    )
  }

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-full px-3 py-2">
          <img
            className="inline-block h-8 w-8 rounded-full"
            src={user.image}
            alt={`Avatar of ${user.name} (@${user.username})`}
          />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 divide-y divide-gray-100 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <div className="block px-4 py-2 text-sm font-semibold text-gray-700">{user.name} (@{user.username})</div>
          </div>
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <a
                  href="/projects"
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm'
                  )}
                >
                  Projects
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  type="submit"
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block w-full px-4 py-2 text-left text-sm'
                  )}
                  onClick={(e) => {
                    e.preventDefault()
                    signOut({ callbackUrl: '/' })
                  }}
                >
                  Sign out
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
