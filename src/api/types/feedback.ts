import { ServiceImages } from './combo'

export type FeedbackType = '1' | '2' | '3' | '4' | '5'
export interface FeedbackResponse {
  data: Feedback[]
  page: number
  size: number
  total: number
}

export interface Feedback {
  id: string
  content: string
  createDate: Date
  rating: number
  service: Service
  user: User
  status: string
}

export interface Service {
  id: string
  code: string
  name: string
  quantity: number
  serviceImages: ServiceImages[]
  categoryId: string
  unit: string
  description: string
  status: string
  used: number
  rating: number
}

export interface User {
  fullname: string
  dateOfBirth: Date
  phone: string
  address: string
  imageUrl: string
  categoryId: string
  gender: string
}
