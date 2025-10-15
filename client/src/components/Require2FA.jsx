import { useState } from 'react'
import { ShieldCheck } from 'lucide-react'
import { verify2FaAPI } from '~/apis'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { updateUserSuccess } from '~/redux/user/userSlice'

export default function Require2FA() {
  const [otpToken, setConfirmOtpToken] = useState('')
  const [error, setError] = useState(null)
  const dispatch = useDispatch()


  const handleRequire2FA = () => {
    if (!otpToken) {
      const errMsg = 'Please enter your code.'
      setError(errMsg)
      toast.error(errMsg)
      return
    }
    verify2FaAPI(otpToken)
      .then(updatedUser => {
        dispatch(updateUserSuccess(updatedUser))
        toast.success('2FA Verified Successfully')
        setError(null)
      })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-slate-900">
      <div className="relative flex h-screen w-screen flex-col items-center justify-start p-6">
        {/* Header */}
        <div className="mb-6 mt-6 flex items-center justify-center gap-2">
          <ShieldCheck className="h-6 w-6 text-green-600" />
          <h3 className="text-lg font-bold text-green-600">
            Require 2FA (Two-Factor Authentication)
          </h3>
        </div>

        {/* Content */}
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="max-w-md text-sm text-gray-700 dark:text-gray-300">
            Nhập mã gồm 6 chữ số từ ứng dụng bảo mật của bạn và click vào{' '}
            <strong>Confirm</strong> để xác nhận.
          </p>

          {/* Input + Button */}
          <div className="flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <input
              autoFocus
              autoComplete="off"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Enter your 6-digit code..."
              value={otpToken}
              onChange={(e) => setConfirmOtpToken(e.target.value.replace(/[^0-9]/g, ''))}
              className={`min-w-[280px] rounded-md border px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-slate-800 dark:text-white ${
                error ? 'border-red-400' : 'border-gray-200'
              }`}
            />

            <button
              type="button"
              onClick={handleRequire2FA}
              className="min-w-[120px] rounded-md bg-indigo-600 px-5 py-3 text-sm font-medium text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              Confirm
            </button>
          </div>

          {error && <div className="text-sm text-red-500">{error}</div>}

          {/* Credit link */}
          <div className="mt-2 text-center">
            <a
              className="text-sm font-semibold text-slate-500 hover:text-amber-400"
              href="https://youtube.com/@trungquandev"
              target="_blank"
              rel="noreferrer"
            >
              TrungQuanDev - Một Lập Trình Viên
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
