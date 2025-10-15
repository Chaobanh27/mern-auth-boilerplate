import { pick } from 'lodash'

export const pickUser = (user) => {
  if (!user) return {}
  return pick(user, ['_id', 'email', 'username', 'avatar', 'role', 'isActive', 'require2FA', 'createdAt', 'updatedAt', 'is2FAVerified'])
}