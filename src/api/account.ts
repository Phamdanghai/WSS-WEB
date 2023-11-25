import { apiV3 } from '.'
import { UserRegister } from './types/account'

export const getProfile = async () => apiV3.get('Auth/userInfo')
export const register = async (payload: UserRegister) => apiV3.post('Account/register', payload)
