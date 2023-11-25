import { api } from '.'

export const getAuth = async () => api.get('/Auth/userInfo')
