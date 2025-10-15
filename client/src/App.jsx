import { useSelector, useDispatch } from 'react-redux'
import { updateSystemTheme } from '~/redux/theme/themeSlice'
import { useEffect } from 'react'
import Home from '~/pages/PublicLayout/Home'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import Auth from '~/pages/Auth/Auth'
import PublicLayout from '~/pages/PublicLayout/PublicLayout'
import DashboardLayout from '~/pages/Dashboard/DashboardLayout'
import Dashboard from '~/pages/Dashboard/Dashboard'
import ListUsers from '~/pages/Dashboard/List/ListUser'
import Settings from '~/pages/Dashboard/settings/Settings'
import AccountTab from '~/pages/Dashboard/settings/AccountTab'
import SecurityTab from '~/pages/Dashboard/settings/SecurityTab'
import NotFoundPage from '~/pages/404/NotFoundPage'
import AccountVerification from '~/pages/Auth/AccountVerification'
import { selectCurrentUser } from '~/redux/user/userSlice'
import ForgotPassword from '~/pages/Auth/ForgotPassword'
import ResetPassword from '~/pages/Auth/ResetPassword'

const ProtectedRoute = ({ user }) => {
  if (!user) return <Navigate to='/login' replace={true} />
  return <Outlet />
}

const App = () => {
  const { mode, system } = useSelector(state => state.theme)
  const currentUser = useSelector(selectCurrentUser)
  const dispatch = useDispatch()

  useEffect(() => {
    //lắng nghe thay đổi của system theme
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => dispatch(updateSystemTheme())
    media.addEventListener('change', handler)

    return () => media.removeEventListener('change', handler)
  }, [dispatch])

  const appliedTheme = mode === 'system' ? system : mode

  useEffect(() => {
    document.documentElement.classList.toggle('dark', appliedTheme === 'dark')
  }, [appliedTheme])


  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path='/' element={<PublicLayout />}>
          <Route index element={<Home />} />
        </Route>

        <Route path='/login' element={<Auth/>} />
        <Route path='/register' element={<Auth/>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path='/account/verification' element={<AccountVerification/>} />


        {/* Dashboard routes */}
        <Route element={<ProtectedRoute user={currentUser} />}>
          <Route path='/dashboard' element={<DashboardLayout />}>
            <Route index element={<Dashboard/>} />
            <Route path='list-users' element={<ListUsers/>}/>
            <Route path='setting' element={<Settings/>}>
              <Route index element={<AccountTab/>}/>
              <Route path='security-tab' element={<SecurityTab/>}/>
            </Route>
          </Route>
        </Route>


        <Route path='*' element={<NotFoundPage/>} />

      </Routes>

    </>
  )
}

export default App
