import { Home, Users, Settings, ChevronRight, ChevronLeft } from 'lucide-react'
import { usePermission } from '~/hooks/usePermission'
import { permissions } from '~/config/roleConfig'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'

const DashBoardSidebar = ({ collapsed, setCollapsed }) => {

  const user = useSelector(selectCurrentUser)
  const { hasPermission } = usePermission(user?.role.name)


  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-gray-900 text-white transition-all duration-300 
          ${collapsed ? 'w-20' : 'w-64'}`}
    >
      <div className="flex items-center justify-between p-4 h-18 border-b border-gray-700">
        <span
          className={`font-semibold text-lg transition-opacity duration-200 ${
            collapsed ? 'opacity-0 w-0' : 'opacity-100'
          }`}
        >
          {!collapsed && user.role?.name}
        </span>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded hover:bg-gray-700 cursor-pointer"
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft/>}
        </button>
      </div>

      {/* //dùng navlink để dùng cho menu điều hướng, khi muốn biết tab nào đang active để highlights */}

      <NavLink end={true} to='/dashboard' className={({ isActive }) => `dark:text-white flex items-center gap-3 py-3.5 px-3  cursor-pointer ${collapsed && 'justify-center'} ${isActive && 'bg-indigo-800/40 dark:bg-white/10 dark:border-white'}`}>
        <Home />
        {!collapsed && <span>Dashboard</span>}
      </NavLink>


      {
        hasPermission(permissions.USER_READ) && <NavLink to='/dashboard/list-users' className={({ isActive }) => `dark:text-white flex items-center gap-3 py-3.5 px-3  cursor-pointer ${collapsed && 'justify-center'} ${isActive && 'bg-indigo-800/40  dark:bg-white/10 dark:border-white'}`}>
          <Users />
          {!collapsed && <span>Users</span>}
        </NavLink>
      }


      <NavLink to='/dashboard/setting' className={({ isActive }) => `dark:text-white flex absolute bottom-0 w-full items-center gap-3 py-3.5 px-3  cursor-pointer ${collapsed && 'justify-center'} ${isActive && 'bg-indigo-800/40 dark:bg-white/10 dark:border-white'}`}>
        <Settings />
        {!collapsed && <span>Settings</span>}
      </NavLink>

    </aside>

  )
}

export default DashBoardSidebar

