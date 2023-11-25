import { ServiceImages } from './combo'

type ServiceStatus = 'Active' | 'InActive' | 'Deleted' | 'Pending'

export interface ServiceRequest {
  status?: ServiceStatus
  checkDate?: string
  page?: number
  priceFrom?: number
  priceTo?: number
  categoryId?: string
  name?: string
  'page-size'?: number
  'sort-key'?: 'Id' | 'Name' | 'Quantity' | 'CreateDate' | 'Status'
  'sort-order'?: 'DESC' | 'ASC'
}

export interface Service {
  id?: string
  name?: string
  coverUrl?: string
  quantity?: number
  category?: CategoryOfService
  currentPrices?: CurrentPrices
  serviceImages?: ServiceImages[]
  categoryId?: string
  description?: string
  status?: string
  used?: number
  rating?: number
  unit?: string
}

export interface CategoryOfService {
  id?: string
  name?: string
  imageUrl?: string
  description?: string
  status?: string
  isOrderLimit?: boolean
  services?: string[]
}

export interface CurrentPrices {
  id?: string
  price?: number
}

export interface ServiceResponse {
  data: Service[]
  page: number
  size: number
  total: number
}
