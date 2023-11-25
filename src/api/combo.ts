import { api } from '.'
import { ComboRequest } from './types/combo'

export const getAllCombo = async (data: ComboRequest) =>
  api.get('/Combo', {
    params: data
  })

export const getComboById = async ({ id }: { id: string }) => api.get('/Combo/' + id)
