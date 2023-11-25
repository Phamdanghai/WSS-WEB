import { removeLocalStorage } from '@/utils'
import { message } from 'antd'
import axios, { AxiosError } from 'axios'

export const api = axios.create({
  baseURL: 'https://api.loveweddingservice.shop/api/v1',
  timeout: 60000,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
  }
})

export const apiV3 = axios.create({
  baseURL: 'https://api.loveweddingservice.shop/api/v3',
  timeout: 60000,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
  }
})

apiV3.interceptors.request.use(
  async (config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`
    return config
  },
  (error: AxiosError) => Promise.reject(error)
)

apiV3.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      removeLocalStorage('accessToken')
      removeLocalStorage('user')
      message.warning('Login session timeout!')
      setTimeout(() => {
        window.location.href = '/login'
      }, 1500)
    }
    return Promise.reject(error)
  }
)

api.interceptors.request.use(
  // async (config) => {
  //   const data = getLocalStorage('token')

  //   if (data?.accessToken) {
  //     if (checkTokenExpired(data?.accessToken)) {
  //       removeLocalStorage('token')
  //       message.warning('Login session has expired, Please login again!')
  //       setTimeout(() => {
  //         window.location.href = '/login'
  //       }, 1500)
  //       // try {
  //       //   const res = await refreshToken({
  //       //     refreshToken: data?.refreshToken
  //       //   })
  //       //   config.headers.Authorization = `Bearer ${res.data.accessToken}`
  //       //   setLocalStorage('token', res.data as never)
  //       // } catch (err) {
  //       //   removeLocalStorage('token')
  //       //   message.warning('Login session has expired, Please login again!')
  //       //   setTimeout(() => {
  //       //     window.location.href = '/login'
  //       //   }, 1500)
  //       //   throw new Error('Unable to refresh access token.')
  //       // }
  //     } else {
  //       config.headers.Authorization = `Bearer ${data?.accessToken}`
  //     }
  //   }
  //   return config
  // },
  async (config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`
    return config
  },
  (error: AxiosError) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      removeLocalStorage('accessToken')
      removeLocalStorage('user')
      message.warning('Login session timeout!')
      setTimeout(() => {
        window.location.href = '/login'
      }, 1500)
    }
    return Promise.reject(error)
  }
)
