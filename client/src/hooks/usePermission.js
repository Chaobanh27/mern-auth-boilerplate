import { rolePermissions } from '~/config/roleConfig'

export const usePermission = (userRole) => {
  const hasPermission = (permission) => {
    const allowedPermission = rolePermissions[userRole] || []
    return allowedPermission.includes(permission)
  }

  return { hasPermission }
}