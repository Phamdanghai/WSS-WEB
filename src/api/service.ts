import { apiV3 } from '.'
import { ServiceRequest } from './types/service'

export const getAllService = async (data: ServiceRequest) =>
  apiV3.get('/Service', {
    params: data
  })

export const getServiceById = async ({ id }: { id: string }) => apiV3.get('/Service/' + id)
