export interface Other {
  fullname: string
  address: string
  phone: string
  voucherId: string
  voucherCode?: string
  comboId: string
  description: string
  weddingInformation: WeddingInformation
  orderDetails: OrderDetail[]
}

export interface OrderDetail {
  serviceId: string
  address: string
  startTime: string
  description: string
}

export interface WeddingInformation {
  nameGroom: string
  nameBride: string
  nameBrideFather: string
  nameBrideMother: string
  nameGroomFather: string
  nameGroomMother: string
  weddingDay?: string
  imageUrl?: string
}
