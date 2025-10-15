import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { forgotPasswordAPI } from '~/apis'
import backgroundImage from '~/assets/beautiful-minimalist-landscape.jpg'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email.trim()) return toast.error('pls enter your email')
    toast.promise(
      forgotPasswordAPI({ email }),
      {
        pending: 'sending...',
        success: 'Promise resolved 👌',
        error: 'Promise rejected 🤯'
      }
    ).then(res => {
      if (!res.error) setTimeout(() => setSent(true), 800)
    })
  }

  return (
    <div style={{ backgroundImage: `url(${backgroundImage})` }} className="min-h-screen bg-cover bg-center flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">
          Forgot Password
        </h1>
        <p className="text-gray-500 text-center mb-6 text-sm">
          Enter your email and we’ll send you a link to reset your password.
        </p>

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full cursor-pointer py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Send Reset Link
            </button>

            <div className="text-center text-sm text-gray-600">
              <Link
                to="/login"
                className="text-indigo-600 hover:text-indigo-500"
              >
                Back to Login
              </Link>
            </div>
          </form>
        ) : (
          <div className="text-center">
            <svg
              className="mx-auto mb-4 w-16 h-16 text-green-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <p className="text-gray-700 mb-2 font-semibold">
              Reset link sent!
            </p>
            <p className="text-gray-500 text-sm mb-6">
              Please check your inbox and follow the instructions.
            </p>
            <button
              onClick={() => setSent(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Send again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
