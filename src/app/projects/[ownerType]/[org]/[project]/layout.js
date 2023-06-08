import { UrlParamsProvider } from '@/contexts/UrlParams'

export default function ProjectLayout({ params, children }) {
  return (
    <UrlParamsProvider value={params}>
      {children}
    </UrlParamsProvider>
  )
}