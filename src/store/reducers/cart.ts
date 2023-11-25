import { Cart, getAllServiceInCard, getComboInCard, getTotalCart } from '@/api/types/cart'
import { Combo, ComboServiceCart } from '@/api/types/combo'
import { OrderDetail } from '@/api/types/order'
import { VoucherResponse } from '@/api/types/voucher'
import { getLocalStorage, removeLocalStorage, setLocalStorage } from '@/utils'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface CardState {
  cart: Cart[]
  cartPreview: Cart[]
  total: number
  totalAfterDiscount: number
  combo?: Combo | null
  services: OrderDetail[]
  voucher?: VoucherResponse | null
  applyVoucher: boolean
  comboDetail: ComboServiceCart[]
}

const initialState = {
  cart: getLocalStorage('cart') ?? [],
  cartPreview: getLocalStorage('cart') ?? [],
  total: getTotalCart(getLocalStorage('cart')),
  combo: getComboInCard(getLocalStorage('cart')),
  services: getAllServiceInCard(getLocalStorage('cart')),
  voucher: null,
  totalAfterDiscount: 0,
  applyVoucher: false,
  comboDetail: getLocalStorage('comboDetail') ?? []
} as CardState

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addCart(state, action: PayloadAction<Cart[]>) {
      const newCart = [...state.cart, ...action.payload]
      state.cart = newCart
      state.cartPreview = newCart
      state.total = getTotalCart(newCart)
      state.combo = getComboInCard(newCart)
      state.services = getAllServiceInCard(newCart)
      setLocalStorage('cart', newCart)
    },
    applyCurrentCart(state, action: PayloadAction<Cart[]>) {
      const newCart = action.payload
      state.cart = newCart
      state.cartPreview = newCart
      state.total = getTotalCart(newCart)
      state.combo = getComboInCard(newCart)
      state.services = getAllServiceInCard(newCart)
      setLocalStorage('cart', newCart)
    },
    addReviewCart(state, action: PayloadAction<Cart[]>) {
      state.cartPreview = action.payload
      state.total = getTotalCart(action.payload)
    },
    saveCart(state) {
      state.cart = [...state.cartPreview]
      setLocalStorage('cart', [...state.cartPreview])
      state.total = getTotalCart([...state.cartPreview])
      state.combo = getComboInCard([...state.cartPreview])
      state.services = getAllServiceInCard([...state.cartPreview])
      state.voucher = null
      state.totalAfterDiscount = 0
      if (!state.combo) {
        state.comboDetail = []
        removeLocalStorage('comboDetail')
      }
    },
    setVoucherDetail(state, action: PayloadAction<VoucherResponse | null>) {
      state.applyVoucher = false
      state.voucher = action.payload
    },
    setApplyVoucher(state) {
      state.applyVoucher = true
      if (!state.voucher) {
        state.totalAfterDiscount = 0
      } else {
        state.totalAfterDiscount = state.total - (state.voucher.discountValueVoucher ?? 0)
      }
      if (!getComboInCard([...state.cartPreview])) {
        state.comboDetail = []
        removeLocalStorage('comboDetail')
      }
    },
    setComboServiceDetail(state, action: PayloadAction<ComboServiceCart[]>) {
      state.comboDetail = action.payload
      setLocalStorage('comboDetail', action.payload)
    },
    resetCart(state) {
      state.cart = []
      state.cartPreview = []
      state.cartPreview = []
      state.combo = null
      state.comboDetail = []
      state.services = []
      state.total = 0
      removeLocalStorage('comboDetail')
      removeLocalStorage('cart')
    },
    resetComboDetail(state) {
      state.comboDetail = []
      removeLocalStorage('comboDetail')
    }
  }
})

export const {
  addCart,
  addReviewCart,
  saveCart,
  setComboServiceDetail,
  resetCart,
  setVoucherDetail,
  setApplyVoucher,
  resetComboDetail,
  applyCurrentCart
} = cartSlice.actions
export default cartSlice.reducer
