import { oderWedding } from '@/api/order'
import { Cart, convertComboServiceToOrderDetail, isCombo } from '@/api/types/cart'
import { WeddingInformation } from '@/api/types/order'
import { VoucherResponse } from '@/api/types/voucher'
import { getVouchers } from '@/api/voucher'
import { useAuth } from '@/context/AuthContext'
import { RootState } from '@/store'
import {
  addReviewCart,
  applyCurrentCart,
  resetCart,
  saveCart,
  setApplyVoucher,
  setComboServiceDetail,
  setVoucherDetail
} from '@/store/reducers/cart'
import { formatVND, getLocalStorage } from '@/utils'
import { CloseCircleOutlined, HomeOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { Button, Col, DatePicker, Empty, Form, Input, InputRef, Modal, Radio, Row, Space, Spin, message } from 'antd'
import { RangePickerProps } from 'antd/es/date-picker'
import axios from 'axios'
import dayjs from 'dayjs'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import ModalCombo from './Package/components/Modal'
import ModalService from './Package/components/ModalService'
import { ComboServiceCart } from '@/api/types/combo'

interface ShowDetailCart {
  active: boolean
}

const disabledDate: RangePickerProps['disabledDate'] = (current) => {
  // Can not select days before today and today
  return current && current < dayjs().endOf('day')
}

const Cart = () => {
  const [show, setShow] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [openVoucher, setOpenVoucher] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()
  const { cartPreview, total, cart, combo, services, voucher, applyVoucher, totalAfterDiscount, comboDetail } =
    useSelector((state: RootState) => state.cartReducer)
  const [expandCart, setExpandCart] = useState<ShowDetailCart[]>([])
  const dispatch = useDispatch()
  const [form] = Form.useForm()
  const ref = useRef<InputRef>(null)
  const [showNote, setShowNote] = useState(false)
  const [showNoteService, setShowNoteService] = useState(false)
  const [comboServiceCart, setComboServiceCart] = useState<ComboServiceCart | null>(null)
  const [cartDetail, setCartDetail] = useState<Cart | null>(null)

  // const userData: User | undefined = getLocalStorage('user')

  useEffect(() => {
    dispatch(addReviewCart(cart))
    dispatch(setVoucherDetail(null))
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const newData: ShowDetailCart[] = cartPreview.map(() => {
      return {
        active: false
      }
    })
    setExpandCart(newData)
  }, [cartPreview])

  const { data: vouchersData = [] } = useRequest(
    async () => {
      try {
        const res = await getVouchers({})
        if (res.data?.data) {
          return res.data?.data as VoucherResponse[]
        }
      } catch (error) {
        console.error(error)
      }
    },
    {
      manual: !getLocalStorage('accessToken')
    }
  )

  const handleChangeQuantity = (id: string, value: number) => {
    if (!cartPreview) return
    const updatedCart = cartPreview.map((item) => {
      if (item.cardId === id) {
        // Create a new object for this item with the updated quantity
        return { ...item, quantity: item.quantity + value < 1 ? 1 : item.quantity + value }
      }
      return item // Keep other items unchanged
    })
    dispatch(addReviewCart(updatedCart))
  }

  const handleDelete = (id: string) => {
    if (!cartPreview) return
    const updatedCart = cartPreview.filter((item) => item.cardId !== id)
    dispatch(addReviewCart(updatedCart))
  }

  const { runAsync: onOderWedding, loading: oderLoading } = useRequest(oderWedding, {
    manual: true,
    onSuccess: (res) => {
      if (res.data) {
        // message.success('Đặt hàng thành công')
        dispatch(resetCart())
        form.resetFields()
        setShowConfirm(true)
      }
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        message.error({
          content: err.response?.data.message ?? 'Something went wrong'
        })
      }
    }
  })

  const onFinish = async (values: WeddingInformation) => {
    const listService = [...services]
    let comboServices = []
    if (comboDetail.length) {
      comboServices = convertComboServiceToOrderDetail(comboDetail)
    }
    setShow(false)
    setShowConfirm(false)
    await onOderWedding({
      address: '',
      comboId: combo?.id ?? '',
      description: '',
      fullname: user?.username ?? '',
      orderDetails: listService.concat(comboServices),
      phone: '',
      voucherId: voucher?.id ?? '',
      voucherCode: voucher?.code ?? '',
      weddingInformation: {
        ...values,
        imageUrl: ''
      }
    })
  }

  return (
    <Spin spinning={oderLoading}>
      <img src='/public/images/contact-hero.png' className='w-full' alt='' />
      <div className='container mx-auto mt-10'>
        <div className='flex gap-2 justify-start items-center'>
          <Link to='/'>
            <HomeOutlined className='text-lg text-gray' />
          </Link>
          <RightOutlined className='text-lg text-gray' />
          <p className='text-lg text-primary'>Giỏ Hàng</p>
        </div>
        <p className='text-3xl font-medium text-center'>Giỏ Hàng</p>
        <div className='mt-5'>
          <Row
            className='px-5'
            style={{
              borderBottom: '1px solid #7D7D7D',
              paddingBottom: '25px'
            }}
          >
            <Col span={8}>SẢN PHẨM</Col>
            <Col span={4}>
              <p className='text-center'>ĐỊA CHỈ</p>
            </Col>
            <Col span={4}>
              <p className='text-center'>SỐ LƯỢNG</p>
            </Col>
            <Col span={4}>
              <p className='text-left'>NGÀY/GIỜ</p>
            </Col>
            <Col span={4}>TỔNG</Col>
          </Row>

          {cartPreview.map((item, index) => {
            if (isCombo(item.product)) {
              const combo = item.product
              return (
                <div
                  key={item.product.id}
                  style={{
                    borderBottom: '1px solid #7D7D7D'
                  }}
                >
                  <Row className='px-5'>
                    <Col span={8}>
                      <div className='flex gap-5 items-center py-5'>
                        <img src={combo.imageUrl} width={155} height={103} />
                        <div>
                          <p className='text-2xl font-light text-gray'>{combo.name}</p>
                          <p className='text-md font-light text-gray'>{formatVND(combo?.disountPrice ?? 0)}</p>
                        </div>
                      </div>
                    </Col>
                    <Col span={4}></Col>
                    <Col span={4}>
                      <div className='text-center flex justify-center gap-5 items-center h-full'>
                        {/* <LeftOutlined
                          className='cursor-pointer'
                          onClick={() => handleChangeQuantity(item.cardId ?? '', -1)}
                        /> */}
                        <p>1</p>
                        {/* <RightOutlined
                          className='cursor-pointer'
                          onClick={() => handleChangeQuantity(item.cardId ?? '', 1)}
                        /> */}
                      </div>
                    </Col>
                    <Col span={4}></Col>
                    <Col span={4}>
                      <div className='flex items-center justify-between  h-full'>
                        <p className='text-start text-primary'>
                          {formatVND(combo.disountPrice ?? 0)}{' '}
                          <span className='line-through text-gray ml-2'>{formatVND(combo.totalAmount ?? 0)}</span>
                        </p>
                        <CloseCircleOutlined
                          className='text-3xl text-gray cursor-pointer'
                          onClick={() => handleDelete(item.cardId)}
                        />
                      </div>
                    </Col>
                  </Row>
                  {expandCart?.[index]?.active && (
                    <div className='mx-10'>
                      {comboDetail?.map((detail) => {
                        return (
                          <div
                            key={detail.cardId}
                            className='flex justify-around items-center py-4 w-[100%] max-w-[1080px] m-auto'
                            style={{ borderBottom: '1px solid #7D7D7D' }}
                          >
                            <div className='flex gap-2 items-center w-1/3'>
                              <img src={detail.data.serviceImages?.[0]?.imageUrl} width={155} height={103} />
                              <div>
                                <p>{detail.data.name}</p>
                                <p>x{detail.quantity}</p>
                              </div>
                            </div>
                            <p className='text-center text-gray w-1/3'>{detail.address}</p>
                            <p className='text-center text-gray w-1/3'>{detail.time}</p>
                            <p>
                              <Button
                                onClick={() => {
                                  setComboServiceCart(detail)
                                  setShowNote(true)
                                }}
                                type='primary'
                              >
                                Sửa
                              </Button>
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  )}
                  {expandCart?.[index]?.active ? (
                    <p
                      className='text-center text-gray py-5 cursor-pointer'
                      onClick={() =>
                        setExpandCart((state) => {
                          const cloneState = [...state]
                          cloneState[index] = {
                            active: false
                          }
                          return cloneState
                        })
                      }
                    >
                      Thu gọn
                    </p>
                  ) : (
                    <p
                      className='text-center text-gray py-5 cursor-pointer'
                      onClick={() =>
                        setExpandCart((state) => {
                          const cloneState = [...state]
                          cloneState[index] = {
                            active: true
                          }
                          return cloneState
                        })
                      }
                    >
                      Mở rộng
                    </p>
                  )}
                </div>
              )
            }

            const service = item.product
            return (
              <Row
                key={item.product.id}
                className='px-5'
                style={{
                  borderBottom: '1px solid #7D7D7D'
                }}
              >
                <Col span={8}>
                  <div className='flex gap-5 items-center py-5'>
                    <img src={service.serviceImages?.[0]?.imageUrl ?? ''} width={155} height={103} />
                    <div>
                      <p className='text-2xl font-light text-gray'>{service.name}</p>
                      <p className='text-md font-light text-gray'>{formatVND(service?.currentPrices?.price ?? 0)}</p>
                    </div>
                  </div>
                </Col>
                <Col span={4}>
                  <div className='flex items-center h-full justify-center'>
                    <p className='text-center text-gray'>{item.address}</p>
                  </div>
                </Col>
                <Col span={4}>
                  <div className='text-center flex justify-center gap-5 items-center h-full'>
                    <LeftOutlined
                      className='cursor-pointer'
                      onClick={() => handleChangeQuantity(item.cardId ?? '', -1)}
                    />
                    <p>{item.quantity}</p>
                    <RightOutlined
                      className='cursor-pointer'
                      onClick={() => handleChangeQuantity(item.cardId ?? '', 1)}
                    />
                  </div>
                </Col>
                <Col span={4}>
                  <div className='flex items-center  h-full'>
                    <p className='text-start text-gray'>{item.time}</p>
                  </div>
                </Col>
                <Col span={4}>
                  <div className='flex items-center justify-between  h-full'>
                    <p className='text-start text-gray'>{formatVND(item.total ?? 0)}</p>
                    <p>
                      <Button
                        onClick={() => {
                          const index = cart.findIndex((i) => i.cardId === item.cardId)
                          if (index !== -1) {
                            setCartDetail(cart[index])
                            setShowNoteService(true)
                          }
                        }}
                        type='primary'
                      >
                        Sửa
                      </Button>
                    </p>
                    <CloseCircleOutlined
                      className='text-3xl text-gray cursor-pointer'
                      onClick={() => handleDelete(item.cardId)}
                    />
                  </div>
                </Col>
              </Row>
            )
          })}
        </div>
        <Row className='mt-10'>
          <Col span={16}>
            <Button
              type='primary'
              className='uppercase mr-4'
              size='large'
              onClick={() => {
                dispatch(saveCart())
                message.success('Cập nhật giỏ hàng thành công')
              }}
            >
              Cập nhật giỏ hàng
            </Button>
            <Button type='primary' ghost className='uppercase' size='large' onClick={() => navigate('/service')}>
              tiếp tục mua
            </Button>
            <div className='flex gap-2 flex-col justify-center mt-5'>
              <p className='text-2xl'>Mã Voucher</p>
              <p className='text-xl'>Nhập mã phiếu giảm giá của bạn nếu bạn có.</p>
              <div className='flex justify-start items-center gap-4'>
                <Input
                  className='w-96'
                  ref={ref}
                  readOnly
                  value={voucher?.code}
                  onFocus={() => {
                    setOpenVoucher(true)
                    ref.current?.blur()
                  }}
                />
                <Button className='uppercase' type='primary' onClick={() => dispatch(setApplyVoucher())}>
                  Áp dụng
                </Button>
                <Button
                  className='uppercase'
                  onClick={() => {
                    dispatch(setVoucherDetail(null))
                  }}
                >
                  Bỏ voucher
                </Button>
              </div>
            </div>
          </Col>
          <Col span={8}>
            <p className='text-2xl'>Tổng giỏ hàng</p>
            <div className='flex justify-between items-center py-5' style={{ borderBottom: '1px solid #E5E5E5' }}>
              <p>Tổng tiền hàng</p>
              <p className='font-bold'>{formatVND(total)}</p>
            </div>
            <div className='flex justify-between items-center py-5' style={{ borderBottom: '1px solid #E5E5E5' }}>
              <p>Voucher giảm giá</p>
              <p className='font-bold'>{applyVoucher ? formatVND(voucher?.discountValueVoucher ?? 0) : 0}</p>
            </div>
            <div className='flex justify-between items-center py-5'>
              <p>Tổng Thanh Toán:</p>
              <p className='font-bold'>
                {applyVoucher
                  ? totalAfterDiscount !== 0
                    ? totalAfterDiscount > 0
                      ? formatVND(totalAfterDiscount)
                      : 0
                    : formatVND(total)
                  : formatVND(total)}
              </p>
            </div>
            <Button
              type='primary'
              className='w-full uppercase'
              size='large'
              onClick={() => {
                if (user) setShow(true)
                else navigate('/login')
              }}
              disabled={!cart.length}
            >
              đặt hàng
            </Button>
          </Col>
        </Row>
        <Modal
          open={show}
          closeIcon={true}
          footer={false}
          onCancel={() => {
            setShow(false)
            form.resetFields()
          }}
        >
          <p className='text-xl font-medium'>Thông Tin Đám Cưới</p>
          <Form layout='vertical' form={form} onFinish={onFinish}>
            <Row gutter={[20, 20]}>
              <div className='mb-0 w-full px-2 mt-3'>
                <Form.Item
                  label='Ngày cưới'
                  name='weddingDay'
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập ngày'
                    }
                  ]}
                  className='mb-0 w-full'
                >
                  <DatePicker
                    format='DD/MM/YYYY HH:mm:ss'
                    disabledDate={disabledDate}
                    showTime={{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }}
                    style={{
                      width: '100%'
                    }}
                    placeholder='Nhập ngày cưới'
                  />
                </Form.Item>
              </div>
              <Col span={12}>
                <Form.Item
                  label='Tên chú rể:'
                  name='nameGroom'
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập tên chú rể'
                    }
                  ]}
                >
                  <Input placeholder='nhập tên ..' />
                </Form.Item>
                <Form.Item
                  label='Tên Bố Chú Rể :'
                  name='nameGroomFather'
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập tên bố chú rể'
                    }
                  ]}
                >
                  <Input placeholder='nhập tên ..' />
                </Form.Item>
                <Form.Item
                  label='Tên Bố Cô Dâu :'
                  name='nameBrideFather'
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập tên bố cô dâu'
                    }
                  ]}
                >
                  <Input placeholder='nhập tên ..' />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label='Tên Cô Dâu :'
                  name='nameBride'
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập tên cô dâu'
                    }
                  ]}
                >
                  <Input placeholder='nhập tên ..' />
                </Form.Item>
                <Form.Item
                  label='Tên Mẹ Chú Rể :'
                  name='nameGroomMother'
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập mẹ chú rể'
                    }
                  ]}
                >
                  <Input placeholder='nhập tên ..' />
                </Form.Item>
                <Form.Item
                  label='Tên Mẹ Cô Dâu :'
                  name='nameBrideMother'
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập tên mẹ cô dâu'
                    }
                  ]}
                >
                  <Input placeholder='nhập tên ..' />
                </Form.Item>
              </Col>
            </Row>
            <div className='text-center'>
              <Button
                type='primary'
                htmlType='submit'
                size='large'
                // onClick={() => {
                //   setShow(false)
                //   setShowConfirm(true)
                // }}
              >
                Xác Nhận
              </Button>
            </div>
          </Form>
        </Modal>
        <Modal open={showConfirm} closeIcon={true} footer={false} centered>
          <p className='text-center text-2xl mb-10'>Đơn hàng đang chờ xác nhận!</p>
          <div className='text-center'>
            <Button
              type='primary'
              size='large'
              onClick={() => {
                setShowConfirm(false)
                navigate('/')
              }}
            >
              Đóng
            </Button>
          </div>
        </Modal>
      </div>
      <Modal
        open={openVoucher}
        centered
        onOk={() => {
          setOpenVoucher(false)
        }}
        okText='Áp dụng'
        cancelText='Hủy'
        onCancel={() => setOpenVoucher(false)}
      >
        {vouchersData.length < 1 ? (
          <Empty />
        ) : (
          <Radio.Group value={voucher?.id}>
            <Space size={20} direction='vertical'>
              {vouchersData?.map((item) => {
                return (
                  <Radio
                    id={item.id}
                    onChange={() => dispatch(setVoucherDetail(item))}
                    value={item.id}
                    key={item.id}
                    disabled={item.minAmount > total}
                  >
                    <p style={{ fontWeight: 600, fontSize: 20 }}>{item.name}</p>
                    <p>Thanh toán ít nhất {formatVND(item.minAmount)}</p>
                  </Radio>
                )
              })}
            </Space>
          </Radio.Group>
        )}
      </Modal>

      <ModalCombo
        showNote={showNote}
        setShowNote={(value) => {
          setComboServiceCart(null)
          setShowNote(value)
        }}
        onFinish={(data: unknown) => {
          const index = comboDetail.findIndex((item) => item.data.id === comboServiceCart.data.id)
          if (index !== -1) {
            const date = dayjs(data[0].from).format('YYYY/MM/DD')
            const time = dayjs(data[0].time).format('HH:mm:ss.SSS')
            const dataCombo = {
              data: comboServiceCart.data,
              cardId: comboServiceCart.cardId,
              quantity: 1,
              time: date + ' ' + time,
              total: comboServiceCart.total,
              address: data[0]?.address,
              description: data[0]?.note,
              comboId: combo?.id
            } as ComboServiceCart
            const cloneCombo = [...comboDetail]
            cloneCombo.splice(index, 1, dataCombo)
            dispatch(setComboServiceDetail(cloneCombo))
            message.success('Cập nhật thành công')
          }
        }}
        comboServiceCart={comboServiceCart}
      />

      <ModalService
        showNote={showNoteService}
        setShowNote={(value) => {
          // setComboServiceCart(null)
          setShowNoteService(value)
          setCartDetail(null)
        }}
        onFinish={(data: unknown) => {
          const index = cart.findIndex((i) => i.cardId === cartDetail.cardId)
          if (index !== -1) {
            const date = dayjs(data[0].from).format('YYYY/MM/DD')
            const time = dayjs(data[0].time).format('HH:mm:ss.SSS')

            const newCart: Cart = {
              ...cart[index],
              address: data[0].address,
              description: data[0].note,
              time: date + ' ' + time
            }

            const cloneCart = [...cart]
            cloneCart.splice(index, 1, newCart)

            dispatch(applyCurrentCart(cloneCart))
            message.success('Cập nhật thành công')
          }
        }}
        cart={cartDetail}
      />
    </Spin>
  )
}

export default Cart
