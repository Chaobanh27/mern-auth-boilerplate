import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import Require2FA from '~/components/Require2FA'
import Setup2FA from '~/components/Setup2FA'
import { selectCurrentUser, updateUserAPI } from '~/redux/user/userSlice'
import { yupResolver } from '@hookform/resolvers/yup'
import LoadingSpinner from '~/components/LoadingSpinner'
import * as yup from 'yup'
import { toast } from 'react-toastify'

const schema = yup.object({
  newPassword: yup
    .string()
    .required('Password is required')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'Password must be at least 8 chars long and include uppercase, lowercase, number, and symbol'),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'confirm password does not match password ')
    .required('Please re-enter password')
})

const SecurityTab = () => {
  const [openSetup2FA, setOpenSetup2FA] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  })
  const dispatch = useDispatch()
  const user = useSelector(selectCurrentUser)
  if (!user) return <LoadingSpinner/>

  const submitUserInformation = (data) => {
    const { currentPassword, newPassword, confirmPassword } = data

    if (confirmPassword != newPassword ) {
      toast.error('confirm password does not match password')
      return
    }

    toast.promise(
      dispatch(updateUserAPI({ currentPassword, newPassword })),
      {
        pending: 'Promise is pending ',
        success: 'Promise resolved 👌',
        error: 'Promise rejected 🤯'
      }
    ). then(res => {
      if (!res.error) {
        toast.success('User updated successfully!')
      }
    })
  }


  return (
    <div className='flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 bg-blue-50/50 dark:bg-gray-900 min-h-screen'>

      <Setup2FA
        isOpen={openSetup2FA}
        toggleOpen={setOpenSetup2FA}
      />
      {user.require2FA && !user.is2FAVerified && <Require2FA user={user} />}


      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
        Cài đặt bảo mật
      </h2>

      {/* Đổi mật khẩu */}
      <div className="mb-10">
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-3">
          Đổi mật khẩu
        </h3>
        <form className="space-y-4" onSubmit={handleSubmit(submitUserInformation)}>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
              Mật khẩu hiện tại
            </label>
            <input
              {
                ...register('currentPassword', { required: 'username is required' })
              }
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
              Mật khẩu mới
            </label>
            <input
              {
                ...register('newPassword', { required: 'username is required' })
              }
              type="password"
              placeholder="Nhập mật khẩu mới"
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.newPassword && <span className='text-red-600'>{errors.newPasword?.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
              Xác nhận mật khẩu mới
            </label>
            <input
              {...register('confirmPassword')}
              type="password"
              placeholder="Nhập lại mật khẩu mới"
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.confirmPassword && <span className='text-red-600'>{errors.confirmPassword?.message}</span>}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="px-5 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Cập nhật mật khẩu
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>

      {/* Thiết lập 2FA */}
      <div>
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-3">
          Xác thực hai yếu tố (2FA)
        </h3>
        <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          {
            user.is2FAVerified ?
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-100">
              Đã Bật 2FA
                </p>
              </div> :
              <>
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-100">
              Bật 2FA
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
              Thêm lớp bảo mật bằng cách yêu cầu mã OTP khi đăng nhập.
                  </p>
                </div>
                <button
                  onClick={() => setOpenSetup2FA(true)}
                  type="button"
                  className="cursor-pointer px-4 py-2 text-sm rounded-md bg-green-600 text-white hover:bg-green-700"
                >
            Enable
                </button>
              </>
          }

        </div>

      </div>
    </div>
  )
}

export default SecurityTab