import { apiV3 } from '.'
import { Other } from './types/order'

export const oderWedding = async (data: Other) => apiV3.post('/Order', data)
export const getAllOrders = async () =>
  apiV3.get('/Order', {
    params: {
      'sort-key': 'CreateDate',
      'sort-order': 'DESC'
    }
  })
export const getOrderById = async (id: string) => apiV3.get(`/Order/${id}`)
export const payment = async (orderReferenceId: string, orderType: 'Payment' | 'Deposit') =>
  apiV3.get('/VnPay', {
    params: {
      orderReferenceId,
      orderType
    }
  })
