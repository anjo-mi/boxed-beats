import { Link } from '@tanstack/react-router'
import { routePaths } from '@/constants/routePaths'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center">
      <h1 className="text-7xl font-bold text-brand-primary">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-brand-text">Page not found</h2>
      <p className="mt-2 text-brand-text-muted">The page you are looking for does not exist.</p>
      <Link
        to={routePaths.home}
        className="mt-6 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
      >
        Back to Beats
      </Link>
    </div>
  )
}
