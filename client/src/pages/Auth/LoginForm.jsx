import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import FloatingButton from '~/components/FloatingButton'
import backgroundImage from '~/assets/beautiful-minimalist-landscape.jpg'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { loginUserAPI } from '~/redux/user/userSlice'


const schema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Email is not valid'),
  password: yup
    .string()
    .required('Password is required'),
  rememberMe: yup.boolean()
})

const LoginForm = () => {
  const [show, setShow] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  let [searchParams] = useSearchParams()
  const registeredEmail = searchParams.get('registeredEmail')
  const verifiedEmail = searchParams.get('verifiedEmail')
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  })

  const onSubmit = (data) => {
    const { email, password, rememberMe } = data

    localStorage.setItem('rememberMe', rememberMe ? 'true' : 'false')

    toast.promise(
      dispatch(loginUserAPI({ email, password, rememberMe })),
      {
        pending: 'Logging in...',
        success: 'Promise resolved 👌',
        error: 'Promise rejected 🤯'
      }
    ).then(res => {
      if (!res.error) navigate('/')
    })
  }

  return (
    <>
      <div style={{ backgroundImage: `url(${backgroundImage})` }} className={'min-h-screen bg-cover bg-center bg-gray-100 dark:bg-gray-900 flex flex-col gap-4 items-center justify-center p-4 bg-linear-to-r/hsl from-indigo-500 to-teal-400'}>

        {
          verifiedEmail && <div className="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md " role="alert">
            <div className="flex">
              <div className="py-1"><svg className="fill-current h-6 w-6 text-teal-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
              <div>
                <p >Your email <span className="font-bold">{verifiedEmail}</span>  has been verified</p>
              </div>
            </div>
          </div>
        }

        {
          registeredEmail && <div className="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md " role="alert">
            <div className="flex">
              <div className="py-1"><svg className="fill-current h-6 w-6 text-teal-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
              <div>
                <p>An email has been sent to <span className='font-bold'>{registeredEmail}</span> </p>
                Please check and verify your account before logging in!
              </div>
            </div>
          </div>
        }


        <div className="max-w-md w-full bg-gray-900 dark:bg-gray-200 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-white dark:text-gray-900 mb-6 text-center ">Sign In</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white dark:text-gray-700 mb-1">Email</label>
              <input
                {...register('email', { required: 'email is required' })}
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-white dark:text-gray-700"
                placeholder="your@email.com"
              />
              {errors.email && <span className='text-red-600'>{errors.email?.message}</span>}
            </div>

            <div>
              <label className="block text-sm font-medium text-white dark:text-gray-700 mb-1">
                  Password
              </label>
              <div className="relative">
                <input
                  {
                    ...register('password', { required: 'Password is required' })
                  }
                  type={show ? 'text' : 'password'}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-white dark:text-gray-700 pr-10"
                  placeholder="••••••••"
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

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input defaultChecked {...register('rememberMe')} type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"/>
                <span className="ml-2 text-sm text-white dark:text-gray-600">Remember me</span>
              </label>
              <Link to='/forgot-password' className="text-sm text-indigo-600 hover:text-indigo-500">Forgot password?</Link>
            </div>

            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors cursor-pointer">
                Sign In
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-white dark:text-gray-600">
              Don&apos;t have an account?
            <Link to='/register' className="text-indigo-600 hover:text-indigo-500 font-medium"> Sign up</Link>
          </div>
        </div>
      </div>
      <FloatingButton/>
    </>

  )
}

export default LoginForm