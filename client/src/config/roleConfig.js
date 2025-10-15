//Định nghĩa Role của users trong hệ thống
export const roles = {
  USER: 'user',
  MODERATOR: 'moderator',
  ADMIN: 'admin'
}
//Định nghĩa các quyền - Permission trong hệ thống
export const permissions = {
  USER_SELF_READ: 'user_self_read',
  USER_SELF_UPDATE: 'user_self_update',
  USER_READ: 'user_read',
  USER_CREATE: 'user_create',
  USER_UPDATE: 'user_update',
  USER_DELETE: 'user_delete',
  ROLE_CREATE: 'role_create',
  ROLE_READ: 'role_read',
  ROLE_UPDATE: 'role_update',
  ROLE_DELETE: 'role_delete'
}
// Kết hợp Roles và Permission để xác định quyền hạn của user
export const rolePermissions = {
  [roles.USER]: [
    permissions.USER_SELF_READ,
    permissions.USER_SELF_UPDATE
  ],
  [roles.MODERATOR]: [
    permissions.USER_SELF_READ,
    permissions.USER_SELF_UPDATE,
    permissions.USER_READ,
    permissions.USER_UPDATE
  ],
  [roles.ADMIN]: Object.values(permissions)
}