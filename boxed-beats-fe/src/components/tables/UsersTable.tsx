import { motion } from "motion/react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import type { User, BeatContract } from "@/types"

interface UsersTableProps {
  users: User[]
  contracts?: BeatContract[]
}

function fmt(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function UsersTable({ users, contracts = [] }: UsersTableProps) {
  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="font-heading text-lg font-bold text-brand-text/35">
          No users yet
        </p>
        <p className="mt-1.5 text-sm text-muted-foreground/45">
          Users will appear here after they sign up.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-primary/14 bg-background/18">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-primary/18 bg-primary/4 hover:bg-primary/4">
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Contracts</TableHead>
            <TableHead className="hidden sm:table-cell text-right">
              Expired
            </TableHead>
            <TableHead className="hidden md:table-cell text-right">
              Last Purchase
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user, idx) => {
            const totalPurchases = user.purchases.length

            const expiredCount = user.purchases.filter((p) => {
              const c = contracts.find((c) => c.id === p.contractId)
              return (
                !!c?.discountExpiresAt &&
                new Date(c.discountExpiresAt) < new Date()
              )
            }).length

            const lastPurchase = user.purchases.length
              ? user.purchases.reduce((latest, p) =>
                  new Date(p.purchasedAt) > new Date(latest.purchasedAt)
                    ? p
                    : latest,
                )
              : null

            return (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: Math.min(idx * 0.04, 0.4),
                  duration: 0.28,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="border-b border-primary/10 transition-colors hover:bg-primary/4"
              >
                <TableCell>
                  <span className="text-sm font-medium text-brand-text">
                    {user.email}
                  </span>
                </TableCell>

                <TableCell>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full border px-2 py-0.5",
                      "text-[0.62rem] font-semibold uppercase tracking-wide",
                      user.role === "admin"
                        ? "border-brand-accent-2/35 bg-brand-accent-2/8 text-brand-accent-2"
                        : "border-brand-accent-3/22 bg-brand-accent-3/5 text-brand-accent-3/75",
                    )}
                  >
                    {user.role}
                  </span>
                </TableCell>

                <TableCell>
                  <span className="font-mono text-xs text-muted-foreground/70">
                    {fmt(user.createdAt)}
                  </span>
                </TableCell>

                <TableCell className="text-right">
                  <span className="font-mono text-sm font-semibold text-brand-text">
                    {totalPurchases}
                  </span>
                </TableCell>

                <TableCell className="hidden text-right sm:table-cell">
                  {expiredCount > 0 ? (
                    <span className="font-mono text-sm text-brand-accent-hero">
                      {expiredCount}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground/35">—</span>
                  )}
                </TableCell>

                <TableCell className="hidden text-right md:table-cell">
                  {lastPurchase ? (
                    <span className="font-mono text-xs text-muted-foreground/65">
                      {fmt(lastPurchase.purchasedAt)}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground/35">—</span>
                  )}
                </TableCell>
              </motion.tr>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

export { UsersTable }
export type { UsersTableProps }
