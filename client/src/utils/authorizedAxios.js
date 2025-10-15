import axios from 'axios'
import { toast } from 'react-toastify'
import { refreshTokenAPI } from '~/apis'
import { logoutUserAPI } from '~/redux/user/userSlice'

let axiosReduxStore
export const injectStore = mainStore => {
  axiosReduxStore = mainStore
}

let authorizedAxiosInstance = axios.create()
let refreshTokenPromise = null

authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10
authorizedAxiosInstance.defaults.withCredentials = true

authorizedAxiosInstance.interceptors.request.use( config => {
  return config
}, error => {
  return Promise.reject(error)
})


authorizedAxiosInstance.interceptors.response.use( response => {
  return response
}, error => {

  if ( error.response?.status === 401) {
    logoutUserAPI().then(() => {
      location.href = '/login'
    })
  }

  const originalRequest = error.config
  if (error.response?.status === 410 && !originalRequest._retry) {
    originalRequest._retry = true

    if (!refreshTokenPromise) {
      refreshTokenPromise = refreshTokenAPI()
        .then(() => {
          //lấy accessToken mới từ BE nếu dùng local storage
        })
        .catch(_error => {
          logoutUserAPI().then(() => {
            location.href = '/login'
          })

          return Promise.reject(_error)
        })
        .finally(() => {
          refreshTokenPromise = null
        })
      return refreshTokenPromise.then(() => {
        return authorizedAxiosInstance(originalRequest)
      })
    }


  }

  if (error.response?.status !== 410) {
    toast.error(error.response?.data?.message || error?.message)
  }
  return Promise.reject(error)
})

export default authorizedAxiosInstance