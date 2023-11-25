export interface VoucherResponse {
  id?: string
  name?: string
  discountValueVoucher?: number
  minAmount?: number
  endTime?: Date
  startTime?: Date
  createBy?: CreateBy
}

export interface CreateBy {
  fullname?: string
  dateOfBirth?: Date
  phone?: string
  address?: string
  imageUrl?: string
  gender?: string
}

export interface GetVoucherRequest {
  page?: number
  'page-size'?: number
  'sort-key'?: 'Id' | 'Name' | 'Description' | 'ImageUrl' | 'Code' | 'MinAmount' | 'DiscountValueVoucher'
  'sort-order'?: 'DESC' | 'ASC'
}

export interface VoucherResponse {
  id?: string
  code?: string
  name?: string
  quantity?: number
  category?: Category
  currentPrices?: CurrentPrices
  serviceImages?: ServiceImage[]
  categoryId?: string
  unit?: string
  description?: string
  status?: string
  used?: number
  rating?: number
  reason?: string
  createDate?: Date
  updateDate?: Date
}

export interface Category {
  id?: string
  name?: string
  imageUrl?: string
  description?: string
  status?: string
  isOrderLimit?: boolean
  services?: string[]
}

export interface CurrentPrices {
  dateOfApply?: Date
  price?: number
}

export interface ServiceImage {
  imageUrl?: string
}
