import { Eye, EyeOff, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'

interface AuthModalProps {
  open: boolean
  onClose: () => void
}

type Mode = 'signin' | 'signup'

const DEMO_ACCOUNTS = [
  { label: 'Artist', email: 'artist@example.com' },
  { label: 'Admin',  email: 'admin@boxedbeats.com' },
] as const

export function AuthModal({ open, onClose }: AuthModalProps) {
  const { signIn } = useAuthStore()

  const [mode, setMode]                     = useState<Mode>('signin')
  const [email, setEmail]                   = useState('')
  const [password, setPassword]             = useState('')
  const [confirmPw, setConfirmPw]           = useState('')
  const [showPw, setShowPw]                 = useState(false)
  const [error, setError]                   = useState('')
  const [signupNotice, setSignupNotice]     = useState(false)

  const emailRef = useRef<HTMLInputElement>(null)

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Escape to close
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  // Focus email on open
  useEffect(() => {
    if (open) setTimeout(() => emailRef.current?.focus(), 80)
  }, [open])

  const reset = () => {
    setEmail('')
    setPassword('')
    setConfirmPw('')
    setError('')
    setShowPw(false)
    setSignupNotice(false)
  }

  const handleClose = () => { reset(); onClose() }

  const switchMode = (next: Mode) => { reset(); setMode(next) }

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const ok = signIn(email.trim().toLowerCase())
    if (ok) handleClose()
    else setError('No account found for that email address.')
  }

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password !== confirmPw) { setError('Passwords do not match.'); return }
    setSignupNotice(true)
  }

  const handleDemoLogin = (demoEmail: string) => { signIn(demoEmail); handleClose() }

  const inputCls = (hasError = false) =>
    cn(
      'w-full rounded-lg border bg-background/40 px-3 py-2.5 font-mono text-sm text-brand-text',
      'placeholder:text-brand-text-muted/30 outline-none transition-all duration-150',
      'focus:ring-2 focus:ring-brand-accent-3/15 focus:border-brand-accent-3/50',
      hasError ? 'border-destructive/50' : 'border-brand-primary/30',
    )

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={handleClose}
            className="fixed inset-0 z-[60] bg-black/65 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{    opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.24, ease: [0.34, 1.1, 0.64, 1] }}
            className="pointer-events-none fixed inset-0 z-[61] flex items-center justify-center p-4"
          >
            <div
              className="pointer-events-auto relative w-full max-w-sm overflow-hidden rounded-2xl border border-brand-primary/25 bg-card shadow-[0_24px_64px_rgba(0,0,0,0.55)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Accent gradient bar */}
              <div className="h-[2px] w-full bg-gradient-to-r from-brand-primary via-brand-accent-hero to-brand-accent-2" />

              <div className="p-6">
                {/* Header */}
                <div className="mb-5 flex items-start justify-between">
                  <div>
                    <h2 className="font-heading text-xl font-bold text-brand-text">
                      {mode === 'signin' ? 'Welcome back' : 'Create account'}
                    </h2>
                    <p className="mt-0.5 font-sans text-xs text-brand-text-muted">
                      {mode === 'signin'
                        ? 'Sign in to license and download beats.'
                        : 'Join to license and download beats.'}
                    </p>
                  </div>

                  <button
                    onClick={handleClose}
                    aria-label="Close"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-transparent text-brand-text-muted transition-all hover:border-brand-primary/30 hover:text-brand-text"
                  >
                    <X size={15} strokeWidth={2} />
                  </button>
                </div>

                {/* Sign-in form */}
                {mode === 'signin' && (
                  <form onSubmit={handleSignIn} className="space-y-3">
                    <input
                      ref={emailRef}
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError('') }}
                      required
                      className={inputCls(!!error)}
                    />

                    <div className="relative">
                      <input
                        type={showPw ? 'text' : 'password'}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={cn(inputCls(), 'pr-10')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-muted/45 transition-colors hover:text-brand-text-muted"
                      >
                        {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>

                    {error && (
                      <p className="font-sans text-xs text-destructive">{error}</p>
                    )}

                    <button
                      type="submit"
                      className={cn(
                        'w-full rounded-lg bg-brand-primary px-4 py-2.5',
                        'font-heading text-sm font-bold text-brand-text',
                        'transition-all duration-200 hover:bg-brand-primary/80',
                        'hover:shadow-[0_0_20px_rgba(16,80,103,0.4)]',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
                      )}
                    >
                      Sign In
                    </button>
                  </form>
                )}

                {/* Sign-up form */}
                {mode === 'signup' && (
                  <form onSubmit={handleSignUp} className="space-y-3">
                    <input
                      ref={emailRef}
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError('') }}
                      required
                      className={inputCls()}
                    />

                    <div className="relative">
                      <input
                        type={showPw ? 'text' : 'password'}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={cn(inputCls(), 'pr-10')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-muted/45 transition-colors hover:text-brand-text-muted"
                      >
                        {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>

                    <input
                      type="password"
                      placeholder="Confirm password"
                      value={confirmPw}
                      onChange={(e) => { setConfirmPw(e.target.value); setError('') }}
                      required
                      className={inputCls(!!error)}
                    />

                    {error && (
                      <p className="font-sans text-xs text-destructive">{error}</p>
                    )}

                    {signupNotice && (
                      <p className="rounded-lg border border-brand-accent-3/20 bg-brand-accent-3/5 px-3 py-2 font-sans text-xs leading-relaxed text-brand-accent-3">
                        Sign-up is unavailable in demo mode — use the quick logins below to explore the app.
                      </p>
                    )}

                    <button
                      type="submit"
                      className={cn(
                        'w-full rounded-lg bg-brand-primary px-4 py-2.5',
                        'font-heading text-sm font-bold text-brand-text',
                        'transition-all duration-200 hover:bg-brand-primary/80',
                        'hover:shadow-[0_0_20px_rgba(16,80,103,0.4)]',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
                      )}
                    >
                      Create Account
                    </button>
                  </form>
                )}

                {/* Mode toggle */}
                <p className="mt-4 text-center font-sans text-xs text-brand-text-muted">
                  {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
                  <button
                    onClick={() => switchMode(mode === 'signin' ? 'signup' : 'signin')}
                    className="text-brand-accent-3 transition-colors hover:underline"
                  >
                    {mode === 'signin' ? 'Sign up' : 'Sign in'}
                  </button>
                </p>

                {/* Demo quick logins */}
                <div className="mt-4 border-t border-brand-primary/15 pt-4">
                  <p className="mb-2.5 text-center font-mono text-[0.56rem] uppercase tracking-widest text-brand-text-muted/35">
                    Demo — Quick Login
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {DEMO_ACCOUNTS.map(({ label, email: demoEmail }) => (
                      <button
                        key={demoEmail}
                        onClick={() => handleDemoLogin(demoEmail)}
                        className={cn(
                          'rounded-lg border border-brand-primary/20 px-3 py-2',
                          'font-mono text-[0.65rem] text-brand-text-muted transition-all',
                          'hover:border-brand-accent-3/30 hover:bg-brand-accent-3/5 hover:text-brand-accent-3',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
