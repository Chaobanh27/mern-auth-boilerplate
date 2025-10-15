import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import backgroundImage from '~/assets/beautiful-minimalist-landscape.jpg'
import { resetPasswordAPI } from '~/apis'
import { toast } from 'react-toastify'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('confirm password does not match password')
      return
    }

    toast.promise(
      resetPasswordAPI({
        token,
        newPassword: formData.newPassword
      }),
      {
        pending: 'sending...',
        success: 'Promise resolved 👌',
        error: 'Promise rejected 🤯'
      }
    ).then(res => {
      if (!res.error) {
        setTimeout(() => navigate('/login'), 800)
      }
    })


  }

  return (
    <div style={{ backgroundImage: `url(${backgroundImage})` }} className="min-h-screen flex items-center justify-center bg-cover bg-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-800">
          Reset Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password Confirmation
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="••••••••"
              required
            />
          </div>


          <button
            type="submit"
            // disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-50"
          >
            {/* {loading ? 'loading...' : 'Reset Password'} */}
            Reset Password
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Back to{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  )
}
