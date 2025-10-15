import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import FloatingButton from '~/components/FloatingButton'
import backgroundImage from '~/assets/beautiful-minimalist-landscape.jpg'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { toast } from 'react-toastify'
import { registerUserAPI } from '~/apis'

const schema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Email is not valid'),
  password: yup
    .string()
    .required('Password is required')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'Password must be at least 8 chars long and include uppercase, lowercase, number, and symbol'),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'confirm password does not match password ')
    .required('Please re-enter password')
})

const RegisterForm = () => {
  const [show, setShow] = useState(false)
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  })

  const onSubmit = (data) => {
    const { email, password } = data
    toast.promise(
      registerUserAPI({ email, password }),
      {
        pending: 'Promise is pending ',
        success: 'Promise resolved 👌',
        error: 'Promise rejected 🤯'
      }
    ). then(user => {
      navigate(`/login?registeredEmail=${user.email}`)
    })
  }

  return (
    <>
      <div style={{ backgroundImage: `url(${backgroundImage})` }} className="min-h-screen bg-cover bg-center bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4 bg-linear-to-r/hsl from-indigo-500 to-teal-400">
        <div className="max-w-md w-full bg-gray-900 dark:bg-gray-200 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-white dark:text-gray-900 mb-6 text-center ">Register</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white dark:text-gray-700 mb-1">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-white dark:text-gray-700"
                placeholder="your@email.com"
                {
                  ...register('email', { required: 'email is required' })
                }
              />
              {errors.email && <span className='text-red-600'>{errors.email?.message}</span>}
            </div>

            <div>
              <label className="block text-sm font-medium text-white dark:text-gray-700 mb-1">
                  Password
              </label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-white dark:text-gray-700 pr-10"
                  placeholder="••••••••"
                  {
                    ...register('password', { required: 'Password is required' })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-indigo-500"
                >
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <span className='text-red-600'>{errors.password?.message}</span>}
            </div>

            <div>
              <label className="block text-sm font-medium text-white dark:text-gray-700 mb-1">Password Confirmation</label>
              <input
                {...register('confirmPassword')}
                type="password"
                className="w-full px-4 py-2 border border-gray-300 text-white dark:text-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="••••••••"
              />
              {errors.confirmPassword && <span className='text-red-600'>{errors.confirmPassword?.message}</span>}

            </div>

            <div className="flex items-center justify-center">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"/>
                <span className="ml-2 text-sm text-white dark:text-gray-600">I accept the terms and privacy policy</span>
              </label>
            </div>

            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors cursor-pointer">
                Register
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-white dark:text-gray-600">
              Have an account already ?
            <Link to='/login' className="text-indigo-600 hover:text-indigo-500 font-medium"> Sign in</Link>
          </div>
        </div>
      </div>
      <FloatingButton/>

    </>
  )
}

export default RegisterForm