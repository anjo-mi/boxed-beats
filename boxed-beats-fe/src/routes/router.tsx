import {
  createRouter,
  createRootRoute,
  createRoute,
  redirect,
  Outlet,
} from '@tanstack/react-router'
import { lazy, Suspense } from 'react'
import { useAuthStore } from '@/store/authStore'
import { AppShell } from '@/components/layout/AppShell'

// ── Lazy pages ────────────────────────────────────────────────────────────────
const HomePage = lazy(() => import('@/pages/HomePage'))
const AccountPage = lazy(() => import('@/pages/AccountPage'))
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'))
const AdminBeatsPage = lazy(() => import('@/pages/admin/AdminBeatsPage'))
const AdminBeatFormPage = lazy(() => import('@/pages/admin/AdminBeatFormPage'))
const AdminUsersPage = lazy(() => import('@/pages/admin/AdminUsersPage'))
const AdminContractsPage = lazy(() => import('@/pages/admin/AdminContractsPage'))
const AdminContractFormPage = lazy(() => import('@/pages/admin/AdminContractFormPage'))

const PageLoader = () => (
  <div className="flex h-screen items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
  </div>
)

const withSuspense = (Page: React.ComponentType) => (
  <Suspense fallback={<PageLoader />}>
    <Page />
  </Suspense>
)

// ── Root ──────────────────────────────────────────────────────────────────────
const rootRoute = createRootRoute({
  component: () => (
    <AppShell>
      <Outlet />
    </AppShell>
  ),
})

// ── Public ────────────────────────────────────────────────────────────────────
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => withSuspense(HomePage),
})

// ── User-protected (user or admin) ────────────────────────────────────────────
const accountRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/account',
  beforeLoad: () => {
    const role = useAuthStore.getState().role
    if (role === 'guest') throw redirect({ to: '/' })
  },
  component: () => withSuspense(AccountPage),
})

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/checkout',
  beforeLoad: () => {
    const role = useAuthStore.getState().role
    if (role === 'guest') throw redirect({ to: '/' })
  },
  component: () => withSuspense(CheckoutPage),
})

// ── Admin-protected ───────────────────────────────────────────────────────────
const requireAdmin = () => {
  const role = useAuthStore.getState().role
  if (role !== 'admin') throw redirect({ to: '/' })
}

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  beforeLoad: requireAdmin,
  component: () => withSuspense(AdminDashboardPage),
})

const adminBeatsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/beats',
  beforeLoad: requireAdmin,
  component: () => withSuspense(AdminBeatsPage),
})

const adminBeatNewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/beats/new',
  beforeLoad: requireAdmin,
  component: () => withSuspense(AdminBeatFormPage),
})

const adminBeatEditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/beats/$id/edit',
  beforeLoad: requireAdmin,
  component: () => withSuspense(AdminBeatFormPage),
})

const adminUsersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/users',
  beforeLoad: requireAdmin,
  component: () => withSuspense(AdminUsersPage),
})

const adminContractsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/contracts',
  beforeLoad: requireAdmin,
  component: () => withSuspense(AdminContractsPage),
})

const adminContractNewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/contracts/new',
  beforeLoad: requireAdmin,
  component: () => withSuspense(AdminContractFormPage),
})

const adminContractEditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/contracts/$id/edit',
  beforeLoad: requireAdmin,
  component: () => withSuspense(AdminContractFormPage),
})

// ── 404 ──────────────────────────────────────────────────────────────────────
const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '*',
  component: () => withSuspense(NotFoundPage),
})

// ── Router ────────────────────────────────────────────────────────────────────
const routeTree = rootRoute.addChildren([
  homeRoute,
  accountRoute,
  checkoutRoute,
  adminRoute,
  adminBeatsRoute,
  adminBeatNewRoute,
  adminBeatEditRoute,
  adminUsersRoute,
  adminContractsRoute,
  adminContractNewRoute,
  adminContractEditRoute,
  notFoundRoute,
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
