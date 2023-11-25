export type ComboStatus = 'Active' | 'InActive'

export interface Combo {
  id?: string
  name?: string
  discountValueCombo?: number
  disountPrice?: number
  totalAmount?: number
  description?: string
  status?: string
  comboServices?: ComboService[]
  imageUrl?: string
}

export interface ComboServiceCart {
  data: ComboService
  quantity: number
  total: number
  address?: string
  time: string
  cardId: string
  description?: string
  comboId?: string
}

export interface ComboService {
  id?: string
  name?: string
  quantity?: number
  currentPrices?: CurrentPrices
  serviceImages?: ServiceImages[]
  categoryId?: string
  unit?: string
}

export interface CurrentPrices {
  dateOfApply?: Date
  price?: number
}

export interface ComboResponse {
  data?: Combo[]
  page?: number
  size?: number
  total?: number
}

export interface ServiceImages {
  imageUrl?: string
}

export interface ComboRequest {
  status?: ComboStatus
  name?: string
  page?: number
  priceFrom?: number
  priceTo?: number
  'page-size'?: number
  'sort-key'?: 'Id' | 'Name' | 'CreateDate'
  'sort-order'?: 'DESC' | 'ASC'
}
