import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { routePaths } from '@/constants/routePaths'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center gap-4"
      >
        <p
          className="font-heading text-[8rem] font-bold leading-none tabular-nums"
          style={{
            color: 'transparent',
            WebkitTextStroke: '1px rgba(199,119,139,0.4)',
            textShadow: '0 0 80px rgba(199,119,139,0.15)',
          }}
        >
          404
        </p>
        <h1 className="font-heading text-2xl font-bold text-brand-text">
          Page not found
        </h1>
        <p className="max-w-xs text-sm text-muted-foreground/55">
          The page you're looking for doesn't exist or was moved.
        </p>
        <Link
          to={routePaths.home}
          className="mt-2 inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
        >
          Back to Beats
        </Link>
      </motion.div>
    </div>
  )
}
