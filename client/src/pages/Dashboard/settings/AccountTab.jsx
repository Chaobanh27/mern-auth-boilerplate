import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { toast } from 'react-toastify'
import { selectCurrentUser, updateUserAPI } from '~/redux/user/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import LoadingSpinner from '~/components/LoadingSpinner'
import { singleFileValidator } from '~/utils/validators'

const schema = yup.object({})

const AccountTab = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  })
  const dispatch = useDispatch()
  const user = useSelector(selectCurrentUser)
  if (!user) return <LoadingSpinner/>

  const submitUserInformation = (data) => {
    const { username } = data

    if (username === user?.username) return

    toast.promise(
      dispatch(updateUserAPI({ username })),
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

  const uploadAvatar = (e) => {
    const error = singleFileValidator(e.target?.files[0])
    if (error) {
      toast.error(error)
      return
    }

    let reqData = new FormData()
    reqData.append('avatar', e.target?.files[0])
    // Cách để log được dữ liệu thông qua FormData
    // console.log('reqData: ', reqData)
    // for (const value of reqData.values()) {
    //   console.log('reqData Value: ', value)
    // }

    toast.promise(
      dispatch(updateUserAPI(reqData)),
      {
        pending: 'Updating...',
        success: 'Promise resolved 👌',
        error: 'Promise rejected 🤯'
      }
    )
  }
  return (
    <div className='flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 bg-blue-50/50 dark:bg-gray-900 min-h-screen'>
      <form onSubmit={handleSubmit(submitUserInformation)}>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Chỉnh sửa thông tin cá nhân
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Avatar */}
          <div className="flex flex-col items-center md:items-start">
            <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400">
              <img src={user?.avatar} alt="User Avatar" />
            </div>

            <div className="mt-3 flex items-center gap-2">
              <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 cursor-pointer">
              Change
                <input type="file" className="hidden" onChange={uploadAvatar} />
              </label>

              <button
                type="button"
                className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-sm rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
              >
              Remove
              </button>
            </div>

            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center md:text-left">
            JPG, PNG hoặc GIF. Dung lượng tối đa 2MB.
            </p>
          </div>

          {/* Form fields */}
          <div className="md:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Username
                </label>
                <input
                  defaultValue={user?.username}
                  {
                    ...register('username', { required: 'username is required' })
                  }
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errors.username && <span className='text-red-600'>{errors.username?.message}</span>}

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Email
                </label>
                <input
                  type="email"
                  defaultValue={user?.email}
                  disabled
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                PhoneNumber
                </label>
                <input
                  placeholder="+84 912 345 678"
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Position / Job
                </label>
                <input
                  placeholder="Frontend Developer"
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Bio
              </label>
              <textarea
                rows={4}
                placeholder="Viết vài dòng giới thiệu về bạn..."
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="submit"
                className="inline-flex items-center justify-center px-5 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer"
              >
              Save changes
              </button>

              <button
                type="button"
                className="px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
              Cancel
              </button>

              <div className="ml-auto text-sm text-gray-500 dark:text-gray-400">
              Last updated: <span className="font-medium">2 days ago</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AccountTab