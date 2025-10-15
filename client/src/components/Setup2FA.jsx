import { useEffect, useState } from 'react'
import { X, ShieldCheck } from 'lucide-react'
import { get2FaQrCodeAPI, setup2FaAPI } from '~/apis/index'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { updateUserSuccess } from '~/redux/user/userSlice'

const Setup2FA = ({ isOpen, toggleOpen }) => {
  const [otpToken, setConfirmOtpToken] = useState('')
  const [error, setError] = useState(null)
  const [qrCodeImageUrl, setQrCodeImageUrl] = useState(null)
  const dispatch = useDispatch()

  useEffect(() => {
    if (isOpen) {
      get2FaQrCodeAPI()
        .then(res => {
          setQrCodeImageUrl(res.qrcode)
        })
    }
  }, [isOpen])


  const handleCloseModal = () => {
    toggleOpen(false)
  }

  const handleConfirmSetup2FA = () => {
    if (!otpToken) {
      const errMsg = 'Please enter your otp token.'
      setError(errMsg)
      toast.error(errMsg)
      return
    }
    setup2FaAPI(otpToken)
      .then(updatedUser => {
        dispatch(updateUserSuccess(updatedUser))
        toast.success('2FA setup successfully')
        setError(null)
      })
  }

  return (
    <div className={`fixed inset-0 z-50 items-start justify-center overflow-auto bg-black/50 p-4 ${isOpen ? 'flex' : 'hidden'}` }>
      <div className="relative mx-auto mt-24 w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 shadow-2xl p-8 md:p-10">
        {/* Nút đóng */}
        <button
          aria-label="Close"
          onClick={handleCloseModal}
          className="absolute right-3 top-3 rounded-full p-2 text-gray-500 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Tiêu đề */}
        <div className="mb-3 flex items-center justify-center gap-2">
          <ShieldCheck className="h-6 w-6 text-green-600" />
          <h3 className="text-center text-lg font-semibold text-green-600">
            Setup 2FA (Two-Factor Authentication)
          </h3>
        </div>

        {/* Nội dung */}
        <div className="flex flex-col items-center gap-4 px-2">
          <div className="flex w-full items-center justify-center">
            {!qrCodeImageUrl ? (
              <div className="text-sm text-gray-500">Loading...</div>
            ) : (
              <img
                src={qrCodeImageUrl}
                alt="QR Code"
                style={{ width: '100%', maxWidth: 250, objectFit: 'contain' }}
                className="rounded-md border p-2 bg-white dark:bg-slate-800"
              />
            )}
          </div>

          <p className="mx-auto max-w-prose text-center text-sm text-gray-600 dark:text-gray-300">
            Quét mã QR trên ứng dụng <strong>Google Authenticator</strong> hoặc{' '}
            <strong>Authy</strong> của bạn.
            <br />
            Sau đó nhập mã gồm 6 chữ số và click vào <strong>Confirm</strong> để
            xác nhận.
          </p>

          {/* Input + Button */}
          <div className="flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <input
              autoFocus
              autoComplete="off"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Enter your 6-digit code"
              value={otpToken}
              onChange={(e) =>
                setConfirmOtpToken(e.target.value.replace(/[^0-9]/g, ''))
              }
              className={`min-w-[280px] rounded-md border px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-slate-800 dark:text-white ${
                error ? 'border-red-400' : 'border-gray-200'
              }`}
            />

            <button
              type="button"
              onClick={handleConfirmSetup2FA}
              className="min-w-[120px] rounded-md bg-indigo-600 px-5 py-3 text-sm font-medium text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              Confirm
            </button>
          </div>

          {error && <div className="text-sm text-red-500">{error}</div>}

        </div>
      </div>
    </div>
  )
}

export default Setup2FA