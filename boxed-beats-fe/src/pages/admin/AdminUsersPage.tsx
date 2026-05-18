import { UsersTable } from "@/components/tables"
import { mockUsers } from "@/mocks"
import { mockContracts } from "@/mocks"

export default function AdminUsersPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-[calc(var(--navbar-height)+2rem)] sm:px-6">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-brand-text">
          Users
        </h1>
        <p className="mt-1 text-sm text-muted-foreground/60">
          All registered accounts and their purchase history.
        </p>
      </div>

      <UsersTable users={mockUsers} contracts={mockContracts} />
    </div>
  )
}
