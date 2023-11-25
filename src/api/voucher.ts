import { api } from '.'
import { GetVoucherRequest } from './types/voucher'

export const getVouchers = async (data: GetVoucherRequest) =>
  api.get('/Voucher', {
    params: data
  })
