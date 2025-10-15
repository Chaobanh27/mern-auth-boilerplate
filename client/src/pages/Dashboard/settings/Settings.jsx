import { Shield, UserPen } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'

const Settings = () => {
  return (
    <>
      <div className='flex flex-row min-w-full pt-6 bg-white dark:bg-gray-900 border-b-2 rounded-2xl border-indigo-800 '>
        <NavLink end={true} to='/dashboard/setting' className={({ isActive }) => ` dark:text-white flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer ${isActive && 'bg-indigo-800/10 border-b-4 border-indigo-600 dark:bg-white/10 dark:border-white'}`}>
          <UserPen />
          <p className='hidden md:inline-block'>Account</p>
        </NavLink>

        <NavLink to='/dashboard/setting/security-tab' className={({ isActive }) => ` dark:text-white flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer ${isActive && 'bg-indigo-800/10 border-b-4 border-indigo-600 dark:bg-white/10 dark:border-white'}`}>
          <Shield />
          <p className='hidden md:inline-block'>Security</p>
        </NavLink>

      </div>
      <Outlet/>
    </>
  )
}

export default Settings