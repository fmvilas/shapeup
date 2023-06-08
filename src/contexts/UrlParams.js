'use client';

import { createContext, useContext } from 'react'

export const UrlParamsContext = createContext({})

export function UrlParamsProvider({ children, value = {} }) {
  return <UrlParamsContext.Provider value={value}>{children}</UrlParamsContext.Provider>
}

export function useUrlParams() {
  return useContext(UrlParamsContext)
}