import { Link } from '@tanstack/react-router'
import { ShoppingCart, LayoutDashboard, User, LogIn } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import { routePaths } from '@/constants/routePaths'

export function Navbar() {
  const { role, currentUser, signOut } = useAuthStore()
  const cartCount = useCartStore((s) => s.items.length)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 sm:px-6">
        <Link to={routePaths.home} className="font-display text-lg font-bold text-brand-text">
          Boxed Beats
        </Link>

        <div className="flex items-center gap-3">
          {role === 'guest' && (
            <button className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-brand-text-muted hover:text-brand-text">
              <LogIn size={16} />
              Sign in
            </button>
          )}

          {role !== 'guest' && (
            <>
              <span className="text-sm text-brand-text-muted">{currentUser?.email}</span>

              <Link
                to={routePaths.account}
                className="rounded-lg p-2 text-brand-text-muted hover:text-brand-text"
              >
                <User size={18} />
              </Link>

              {role === 'admin' && (
                <Link
                  to={routePaths.admin}
                  className="rounded-lg p-2 text-brand-text-muted hover:text-brand-text"
                >
                  <LayoutDashboard size={18} />
                </Link>
              )}

              <button
                onClick={signOut}
                className="text-sm text-brand-text-muted hover:text-brand-text"
              >
                Sign out
              </button>
            </>
          )}

          <Link
            to={routePaths.checkout}
            className="relative rounded-lg p-2 text-brand-text-muted hover:text-brand-text"
          >
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  )
}
