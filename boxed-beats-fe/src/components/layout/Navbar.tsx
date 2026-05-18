import { Link } from '@tanstack/react-router'
import { LayoutDashboard, LogIn, LogOut, User } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { routePaths } from '@/constants/routePaths'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import { AuthModal } from './AuthModal'
import { CartDropdown } from './CartDropdown'

// ── Logo ──────────────────────────────────────────────────────────────────────

function Logo() {
  return (
    <Link
      to={routePaths.home}
      className="group flex select-none items-center gap-0.5 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
    >
      <span className="font-heading text-xl sm:text-2xl font-bold leading-none text-brand-accent-hero/60 transition-colors duration-200 group-hover:text-brand-accent-hero">
        [
      </span>
      <span className="font-heading text-[1rem] sm:text-[1.2rem] font-bold leading-none tracking-[0.05em] text-brand-text px-1 transition-colors duration-200 group-hover:text-white">
        Boxed Beats
      </span>
      <span className="font-heading text-xl sm:text-2xl font-bold leading-none text-brand-accent-hero/60 transition-colors duration-200 group-hover:text-brand-accent-hero">
        ]
      </span>
    </Link>
  )
}

// ── Shared primitives ─────────────────────────────────────────────────────────

function NavSep() {
  return <span className="mx-0.5 h-4 w-px bg-brand-primary/25" aria-hidden />
}

interface NavIconButtonProps {
  label: string
  to?: string
  onClick?: () => void
  children: React.ReactNode
  className?: string
}

function NavIconButton({ label, to, onClick, children, className }: NavIconButtonProps) {
  const cls = cn(
    'inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-md border border-transparent',
    'text-brand-text-muted transition-all duration-150',
    'hover:border-brand-primary/30 hover:bg-brand-primary/10 hover:text-brand-text',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
    className,
  )

  if (to) {
    return (
      <Link to={to} aria-label={label} className={cls}>
        {children}
      </Link>
    )
  }

  return (
    <button onClick={onClick} aria-label={label} className={cls}>
      {children}
    </button>
  )
}

// ── Role-specific action groups ───────────────────────────────────────────────

const motionProps = {
  initial: { opacity: 0, x: 6 },
  animate: { opacity: 1, x: 0 },
  exit:    { opacity: 0, x: 6 },
  transition: { duration: 0.18, ease: 'easeOut' } as const,
}

function GuestActions({ onSignIn }: { onSignIn: () => void }) {
  return (
    <motion.div {...motionProps} className="flex items-center">
      <button
        onClick={onSignIn}
        className={cn(
          'flex items-center gap-2 rounded-md border border-brand-primary/35 px-3 py-1.5',
          'font-sans text-sm text-brand-text-muted transition-all duration-200',
          'hover:border-brand-accent-hero/50 hover:bg-brand-accent-hero/5 hover:text-brand-text',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
        )}
      >
        <LogIn size={14} strokeWidth={2} />
        Sign In
      </button>
    </motion.div>
  )
}

interface ActionsProps {
  email: string
  cartCount: number
  onSignOut: () => void
}

function UserActions({ email, cartCount, onSignOut }: ActionsProps) {
  return (
    <motion.div {...motionProps} className="flex items-center gap-1.5">
      <span className="hidden max-w-[160px] truncate font-mono text-[0.7rem] text-brand-text-muted sm:block">
        {email}
      </span>
      <NavSep />
      <NavIconButton to={routePaths.account} label="Account">
        <User size={16} className="sm:hidden" strokeWidth={1.8} />
        <User size={18} className="hidden sm:block" strokeWidth={1.8} />
      </NavIconButton>
      <NavIconButton label="Sign out" onClick={onSignOut}>
        <LogOut size={16} className="sm:hidden" strokeWidth={1.8} />
        <LogOut size={18} className="hidden sm:block" strokeWidth={1.8} />
      </NavIconButton>
      <NavSep />
      <CartDropdown count={cartCount} />
    </motion.div>
  )
}

function AdminActions({ email, cartCount, onSignOut }: ActionsProps) {
  return (
    <motion.div {...motionProps} className="flex items-center gap-1.5">
      <div className="hidden items-center gap-2 sm:flex">
        <span className="max-w-[130px] truncate font-mono text-[0.7rem] text-brand-text-muted">
          {email}
        </span>
        <span className="rounded border border-brand-accent-hero/30 bg-brand-accent-hero/8 px-1.5 py-[3px] font-mono text-[0.56rem] uppercase tracking-widest text-brand-accent-hero">
          Admin
        </span>
      </div>
      <NavSep />
      <NavIconButton to={routePaths.account} label="Account">
        <User size={16} className="sm:hidden" strokeWidth={1.8} />
        <User size={18} className="hidden sm:block" strokeWidth={1.8} />
      </NavIconButton>
      <NavIconButton to={routePaths.admin} label="Admin dashboard">
        <LayoutDashboard size={16} className="sm:hidden" strokeWidth={1.8} />
        <LayoutDashboard size={18} className="hidden sm:block" strokeWidth={1.8} />
      </NavIconButton>
      <NavIconButton label="Sign out" onClick={onSignOut}>
        <LogOut size={16} className="sm:hidden" strokeWidth={1.8} />
        <LogOut size={18} className="hidden sm:block" strokeWidth={1.8} />
      </NavIconButton>
      <NavSep />
      <CartDropdown count={cartCount} />
    </motion.div>
  )
}

// ── Navbar ────────────────────────────────────────────────────────────────────

export function Navbar() {
  const { role, currentUser, signOut } = useAuthStore()
  const cartCount = useCartStore((s) => s.items.length)
  const [scrolled, setScrolled] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38, ease: 'easeOut' }}
        className={cn(
          'sticky top-0 z-50 transition-[background-color,border-color,box-shadow] duration-300',
          scrolled
            ? 'border-b border-brand-primary/20 bg-background/85 backdrop-blur-lg shadow-[0_4px_24px_-4px_rgba(16,80,103,0.2)]'
            : 'border-b border-transparent bg-transparent',
        )}
      >
        <nav className="mx-auto flex h-16 sm:h-20 max-w-screen-xl items-center justify-between px-4 sm:px-6">
          <Logo />

          <div className="flex items-center">
            <AnimatePresence mode="wait">
              {role === 'guest' && (
                <GuestActions key="guest" onSignIn={() => setAuthOpen(true)} />
              )}
              {role === 'user' && (
                <UserActions
                  key="user"
                  email={currentUser?.email ?? ''}
                  cartCount={cartCount}
                  onSignOut={signOut}
                />
              )}
              {role === 'admin' && (
                <AdminActions
                  key="admin"
                  email={currentUser?.email ?? ''}
                  cartCount={cartCount}
                  onSignOut={signOut}
                />
              )}
            </AnimatePresence>
          </div>
        </nav>
      </motion.header>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  )
}
