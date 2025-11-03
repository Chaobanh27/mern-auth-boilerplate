import authorizedAxiosInstance from '~/utils/authorizedAxios'
import { API_ROOT } from '~/utils/constants'
import { toast } from 'react-toastify'


export const registerUserAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/register`, data)
  toast.success('Account created successfully! Please check and verify your account before logging in!', { theme: 'colored' })
  return response.data
}

export const fetchUserAPI = async () => {
  const res = await authorizedAxiosInstance.get(`${API_ROOT}/v1/users/:id`)
  const user = res.data
  return user
}

export const fetchAllUsersAPI = async (params) => {
  const res = await authorizedAxiosInstance.get(`${API_ROOT}/v1/users`, { params })
  const users = res.data
  return users
}

export const fetchAllRolesAPI = async () => {
  const res = await authorizedAxiosInstance.get(`${API_ROOT}/v1/users/get-all-roles`)
  const roles = res.data
  return roles
}

export const verifyUserAPI = async (data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/users/verify`, data)
  toast.success('Account verified successfully! Now you can login to enjoy our services! Have a good day!', { theme: 'colored' })
  return response.data
}

export const refreshTokenAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/users/refresh-token`)
  return response.data
}

export const get2FaQrCodeAPI = async () => {
  const res = await authorizedAxiosInstance.get(`${API_ROOT}/v1/users/2fa-qr-code`)
  return res.data
}

export const setup2FaAPI = async (otpToken) => {
  const res = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/setup-2fa`, { otpToken })
  return res.data
}

export const verify2FaAPI = async (otpToken) => {
  const res = await authorizedAxiosInstance.put(`${API_ROOT}/v1/users/verify-2fa`, { otpToken } )
  return res.data
}

export const forgotPasswordAPI = async (data) => {
  const res = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/forgot-password`, data)
  return res.data
}

export const resetPasswordAPI = async (data) => {
  const res = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/reset-password`, data)
  return res.data
}
