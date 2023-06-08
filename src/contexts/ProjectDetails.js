'use client';

import { createContext, useContext } from 'react'

export const ProjectDetailsContext = createContext({})

export function ProjectDetailsProvider({ children, value = {} }) {
  return <ProjectDetailsContext.Provider value={value}>{children}</ProjectDetailsContext.Provider>
}

export function useProjectDetails() {
  return useContext(ProjectDetailsContext)
}