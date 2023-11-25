import dayjs from 'dayjs'
import { Combo, ComboService, ComboServiceCart } from './combo'
import { OrderDetail } from './order'
import { Service } from './service'

export interface Cart {
  product: Service | Combo
  quantity: number
  total: number
  address?: string
  time: string
  cardId: string
  description?: string
}

// Type guard function to check if the product is a Service
export function isService(product: Service | Combo): product is Service {
  return (product as Service).serviceImages !== undefined // Replace with an actual property check
}

// Type guard function to check if the product is a Combo
export function isCombo(product: Service | Combo): product is Combo {
  return (product as Combo).comboServices?.length !== 0 // Replace with an actual property check
}

export const convertComboServiceToOrderDetail = (data: ComboServiceCart[]): OrderDetail[] => {
  return data.map((item) => {
    return {
      address: item.address,
      description: item.description,
      serviceId: item.data.id,
      startTime: item.time
    }
  })
}

export const getTotalCart = (data: Cart[] | undefined) => {
  if (!data) return 0
  let total = 0
  for (const element of data) {
    const item = element
    if (isCombo(item.product)) {
      total += (item?.product?.disountPrice ?? 0) * item.quantity
    } else {
      total += (item?.product.currentPrices?.price ?? 0) * item.quantity
    }
  }
  return total
}

export const getComboInCard = (data: Cart[] | undefined) => {
  if (!data) return null
  for (const element of data) {
    const item = element
    if (isCombo(item.product)) {
      return item.product
    }
  }
  return null
}

export const getAllServiceInCard = (data: Cart[] | undefined) => {
  if (!data) return []
  const services: Cart[] = []
  for (const element of data) {
    const item = element
    if (!isCombo(item.product)) {
      services.push(item)
    }
  }
  const orderDetails = services.map((item) => {
    return {
      address: item.address ?? '',
      description: item.description ?? '',
      startTime: item.time ?? '',
      serviceId: item.product.id ?? ''
    } as OrderDetail
  })
  return orderDetails
}

export const convertComboServiceCarts = (comboService: ComboService[]): ComboServiceCart[] => {
  return comboService.map((item, index) => {
    return {
      description: '',
      total: Number(item.quantity) * 1,
      cardId: item?.id + index.toString() + new Date().getMilliseconds(),
      quantity: 1,
      time: dayjs().format('DD/MM/YYYY HH:mm:ss'),
      address: '',
      data: item
    }
  })
}
