import { api } from '.'
import { CategoryRequest } from './types/category'

export const getAllCategory = async (data: CategoryRequest) =>
  api.get('/Category', {
    params: data
  })
