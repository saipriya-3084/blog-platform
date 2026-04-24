import { getUserWithRole } from '@/utils/supabase/auth'
import { ReactNode } from 'react'

interface RBACGuardProps {
  allowedRoles: Array<'admin' | 'author' | 'viewer'>
  children: ReactNode
  fallback?: ReactNode
}

export default async function RBACGuard({ allowedRoles, children, fallback = null }: RBACGuardProps) {
  const { role } = await getUserWithRole()

  if (!role || !allowedRoles.includes(role as any)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
