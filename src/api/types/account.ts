export interface AccountInfo {
  id: string
  code: string
  username: string
  status: string
  roleName: string
  user: User
}

export interface User {
  fullname: string
  dateOfBirth: Date
  phone: string
  address: string
  imageUrl: string
  gender: string
}

export interface UserRegister {
  email?: string
  password?: string
  fullname?: string
  phone?: string
  address?: string
  avatar?: string
  dob?: string
  gender?: string
}
