import { useSelector, useDispatch } from 'react-redux'
import { logoutUserAPI, selectCurrentUser } from '~/redux/user/userSlice'
import { Link } from 'react-router-dom'
import { useState } from 'react'

const DashBoardNavbar = ({ collapsed }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const user = useSelector(selectCurrentUser)
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(logoutUserAPI())
  }

  return (
    <>
      <header
        className="fixed top-0 right-0 z-10 h-18 text-gray-800 dark:text-white bg-white dark:bg-gray-900 border-b border-gray-200 flex items-center justify-between px-6 transition-all duration-300"
        style={{ left: collapsed ? '5rem' : '16rem' }} // tương ứng 20px * 4 và 64px * 4
      >
        <h1 className="font-semibold ">Dashboard</h1>
        <div>
          {
            user ? <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center focus:outline-none"
            >
              <img
                src={user.avatar}
                alt="User Avatar"
                className="w-10 h-10 rounded-full border-2 mx-3 border-indigo-500 cursor-pointer"
              />
              <span className=''>{user.username}</span>
            </button>
              : <span>pls login</span>
          }

          {isDropdownOpen && (
            <div className="absolute w-30 right-8 mt-2 bg-white rounded-lg shadow-lg py-2">
              <Link
                to='/'
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                 Home
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                  Logout
              </button>
            </div>
          )}
        </div>
      </header>
    </>

  )
}

export default DashBoardNavbar