import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import DashBoardSidebar from '~/components/Dashboard/DashboardSidebar'
import DashBoardNavbar from '~/components/Dashboard/DashboardNavbar'

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(true)
      } else {
        setCollapsed(false)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="flex h-screen">
      <DashBoardSidebar collapsed={collapsed} setCollapsed={setCollapsed}/>

      <div
        className={`flex-1 transition-all duration-300 ${
          collapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        <DashBoardNavbar collapsed={collapsed}/>
        <main className="pt-16 p-6 overflow-y-auto h-screen dark:bg-gray-900">
          <Outlet/>
        </main>
      </div>
    </div>
  )
}
