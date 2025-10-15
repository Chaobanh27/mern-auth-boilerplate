import { useState, useRef, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { setTheme } from '~/redux/theme/themeSlice'
import { Link } from 'react-router-dom'
import { logoutUserAPI, selectCurrentUser } from '~/redux/user/userSlice'

const Navbar = () => {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)

  const dispatch = useDispatch()
  const theme = useSelector(state => state.theme.mode)
  const user = useSelector(selectCurrentUser)

  const handleChange = (e) => {
    if (e.target.value === 'dark') {
      dispatch(setTheme('dark'))
    } else if (e.target.value === 'system') {
      dispatch(setTheme('system'))
    } else {
      dispatch(setTheme('light'))
    }
  }

  const handleLogout = () => {
    dispatch(logoutUserAPI())
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])


  return (
    <>
      <nav className="dark:bg-gray-900 bg-gray-200 shadow-md fixed w-full transition-colors duration-300 top-0 left-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link to='/' className="flex-shrink-0 text-2xl font-bold text-indigo-600">
              MyLogo
            </Link>

            {/* Menu - Desktop */}
            <div className="hidden md:flex space-x-6 items-center h-16 ">
              <Link to='/' className="dark:text-white hover:text-indigo-600 transition">
                        Home
              </Link>
              <Link to='/about-us' className="dark:text-white hover:text-indigo-600 transition">
                        About
              </Link>
              <Link to='/search-detail' className="dark:text-white hover:text-indigo-600 transition">
                        Search
              </Link>
              <Link to='/dashboard' className="dark:text-white hover:text-indigo-600 transition">
                        Dashboard
              </Link>
              <div ref={dropdownRef} className="relative flex" >

                {
                  user ?
                    <>
                      <img
                        onClick={() => setOpen(!open)}

                        src={user.avatar}
                        alt="User Avatar"
                        className="w-10 h-10 rounded-full border-2 border-indigo-500 cursor-pointer"
                      />

                    </>

                    : <button className=" border-indigo-600 border-2 px-3 py-1 cursor-pointer rounded-2xl">
                      <Link to='/login' className="dark:text-white hover:text-indigo-600 transition">
                        Login
                      </Link>
                    </button>
                }
                {/* Avatar + Dropdown */}

                <select
                  aria-label="Theme"
                  value={theme}
                  onChange={handleChange}
                  className=" border-2 border-indigo-600 rounded-2xl px-3 py-1 mx-2 dark:text-white"
                >
                  <option className='text-black' value="light">Light</option>
                  <option className='text-black' value="dark">Dark</option>
                  <option className='text-black' value="system">System</option>
                </select>

                <div className={`absolute right-0 mt-13 w-48 bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-200 origin-top-right
                        ${open ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}
                      `}>
                  <Link
                    to='/home'
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                                Profile
                  </Link>
                  <Link
                    to='/dashboard/setting'
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                                Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                                Logout
                  </button>
                </div>

              </div>

            </div>

            {/* Button Mobile */}
            <div className="md:hidden flex items-center space-x-2">
              {/* Avatar (mobile vẫn có dropdown) */}
              <div className="relative">
                <img
                  onClick={() => setOpen(!open)}
                  src="https://i.pravatar.cc/40"
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full border-2 border-indigo-500"
                />

                {open && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg py-2">
                    <Link
                      href="#"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                                Profile
                    </Link>
                    <Link
                      href="#"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                                Settings
                    </Link>
                    <button
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                                Logout
                    </button>
                  </div>
                )}
              </div>

              {
                !user && <button className=" border-indigo-600 border-2 px-3 py-1 cursor-pointer rounded-2xl text-white">
                    Sign Up
                </button>
              }


              {/* Hamburger Menu */}
              <button
                onClick={() => setOpen(!open)}
                className="text-gray-700 focus:outline-none"
              >
                {open ? <X size={28} /> : <Menu size={28} />}
              </button>

            </div>
          </div>
        </div>

        {/* Menu Mobile */}
        {open && (
          <div className="md:hidden bg-gray-900 shadow-md">
            <div className="px-4 pt-2 pb-4 space-y-2">
              <Link to='/home' className="block  hover:text-indigo-600 transition dark:text-white">
                        Home
              </Link>
              <Link to='/about' className="block  hover:text-indigo-600 transition dark:text-white">
                        About
              </Link>
              <Link to="/search-detail" className="block  hover:text-indigo-600 transition dark:text-white">
                        Search
              </Link>
              <Link to="/dashboard" className="block  hover:text-indigo-600 transition dark:text-white">
                        Dashboard
              </Link>
              <select
                aria-label="Theme"
                value={theme}
                onChange={handleChange}
                className=" border-2 border-indigo-600 rounded-2xl px-3 py-1 mx-2 dark:text-white"
              >
                <option className='text-black' value="light">Light</option>
                <option className='text-black' value="dark">Dark</option>
                <option className='text-black' value="system">System</option>
              </select>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}

export default Navbar