export interface CategoryRequest {
  name?: string
  status?: 'inActive' | 'Active'
  page?: number
  'page-size'?: number
  'sort-key'?: 'Id' | 'Name' | 'Description' | 'CreateDate'
  'sort-order'?: 'DESC' | 'ASC'
}

export interface Commission {
  id?: string
  dateOfApply?: Date
  commisionValue?: number
}

export interface ServiceOfCategory {
  id: string
  name: string
  serviceImages: string[]
  categoryId: string
  description: string
  status: string
}

export interface Category {
  id?: string
  name?: string
  imageUrl?: string
  description?: string
  status?: string
  isOrderLimit?: boolean
  commission?: Commission
  services: ServiceOfCategory[]
}

export interface CategoryResponse {
  data?: Category[]
  page?: number
  size?: number
  total?: number
}
