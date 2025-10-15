/* eslint-disable no-unused-vars */
import { Navigate, Outlet } from 'react-router-dom'
import { usePermission } from '~/hooks/usePermission'
import { roles } from '~/config/rbacConfig'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'

const RbacRoute = ({ requiredPermission, redirectTo = '/access-denied', children }) => {

  const user = useSelector(selectCurrentUser)
  const userRole = user?.role || roles.USER

  const { hasPermission } = usePermission(userRole)

  if (!hasPermission(requiredPermission)) {
    return <Navigate to={redirectTo} replace={true} />
  }

  return <Outlet/>
}

export default RbacRoute