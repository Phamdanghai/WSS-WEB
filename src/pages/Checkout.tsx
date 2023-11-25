import { getOrderById, payment } from '@/api/order'
import { formatVND } from '@/utils'
import { HomeOutlined, RightOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { Button, Col, DatePicker, Divider, Flex, Form, Input, Row, Spin, notification } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import dayjs from 'dayjs'
import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

const Checkout = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [form] = Form.useForm()
  const [expand, setExpand] = useState(false)
  const [loading, setLoading] = useState(false)

  const { data } = useRequest(
    async () => {
      const res = await getOrderById(id)
      return res.data
    },
    {
      onSuccess(data) {
        if (data?.statusOrder !== 'DONE' && data?.statusOrder !== 'CONFIRM') {
          navigate(`/order-history/${id}`)
        }
      },
      onError(e) {
        console.error(e)
        navigate('/')
        notification.error({
          message: e.message
        })
      },
      onBefore() {
        setLoading(true)
      },
      onFinally() {
        setLoading(false)
      }
    }
  )

  const onPayment = useCallback(async () => {
    try {
      const orderType = data?.statusOrder === 'CONFIRM' ? 'Deposit' : 'Payment'
      const res = await payment(id, orderType)
      location.replace(res.data?.linkPay)
    } catch (e) {
      console.error(e)
    }
  }, [data?.statusOrder, id])

  const onFinish = useCallback(async () => {
    try {
      await onPayment()
    } catch (error) {
      console.error(error)
    }
  }, [onPayment])

  useEffect(() => {
    form.setFields([
      {
        name: 'name',
        value: data?.customer?.fullname
      },
      {
        name: 'phone',
        value: data?.customer?.phone
      },
      {
        name: 'address',
        value: data?.customer?.address
      },
      {
        name: 'email',
        value: data?.customer?.email
      },
      {
        name: 'note',
        value: data?.description
      },
      {
        name: 'nameBride',
        value: data?.weddingInformation?.nameBride
      },
      {
        name: 'nameBrideFather',
        value: data?.weddingInformation?.nameBrideFather
      },
      {
        name: 'nameBrideMother',
        value: data?.weddingInformation?.nameBrideMother
      },
      {
        name: 'nameGroom',
        value: data?.weddingInformation?.nameGroom
      },
      {
        name: 'nameGroomFather',
        value: data?.weddingInformation?.nameGroom
      },
      {
        name: 'nameGroomMother',
        value: data?.weddingInformation?.nameGroom
      },
      {
        name: 'weddingDay',
        value: dayjs(data?.weddingInformation?.weddingDay)
      }
    ])
  }, [
    data?.customer?.address,
    data?.customer?.email,
    data?.customer?.fullname,
    data?.customer?.phone,
    data?.description,
    data?.weddingInformation?.nameBride,
    data?.weddingInformation?.nameBrideFather,
    data?.weddingInformation?.nameBrideMother,
    data?.weddingInformation?.nameGroom,
    data?.weddingInformation?.weddingDay,
    form
  ])

  return (
    <Spin spinning={loading}>
      <img src='/public/images/checkout-bg.png' className='w-full' alt='' />
      <div className='container mx-auto mt-10'>
        <div className='flex gap-2 justify-start items-center'>
          <Link to='/'>
            <HomeOutlined className='text-lg text-gray' />
          </Link>
          {/* <RightOutlined className='text-lg text-gray' /> */}
          {/* <Link to='/'>
            <p className='text-lg text-gray'>Giỏ Hàng</p>
          </Link> */}
          <RightOutlined className='text-lg text-gray' />
          <p className='text-lg text-primary'>Thanh toán</p>
        </div>

        <p className='text-center capitalize text-3xl font-medium mb-10'>Thanh toán</p>

        <Row gutter={100}>
          <Col span={8}>
            <Form layout='vertical' requiredMark={false} form={form} onFinish={onFinish}>
              <p className='capitalize text-3xl mb-5'>Thông Tin Khách Hàng</p>
              <div className='flex justify-between items-center'>
                <Form.Item label='Tên*:' name='name' rules={[{ required: true, message: 'Tên bắt buộc nhập' }]}>
                  <Input placeholder='Trần Văn A' />
                </Form.Item>
                <Form.Item
                  label='Số điện thoại*:'
                  name='phone'
                  rules={[{ required: true, message: 'Số điện thoại bắt buộc nhập' }]}
                >
                  <Input placeholder='0851231287' />
                </Form.Item>
              </div>
              <Form.Item
                label='Địa Chỉ*:'
                name='address'
                rules={[{ required: true, message: 'Địa Chỉ bắt buộc nhập' }]}
              >
                <Input placeholder='61/11 đường hàng tre , long thạch mỹ , quận 9 , thành phố thử đức' />
              </Form.Item>
              <Form.Item label='Email:' name='email'>
                <Input placeholder='nhập Email ...' />
              </Form.Item>
              <Form.Item label='Ghi Chú:' name='note'>
                <TextArea
                  style={{
                    resize: 'none'
                  }}
                  rows={5}
                  placeholder='nhập...'
                />
              </Form.Item>
              <p className='capitalize text-3xl mb-5'>Thông Tin Đám Cưới</p>
              <Form.Item
                label='Ngày cưới'
                name='weddingDay'
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập ngày'
                  }
                ]}
                className='w-full'
              >
                <DatePicker
                  format='DD/MM/YYYY HH:mm:ss'
                  disabledDate={(current) => {
                    return current && current < dayjs().endOf('day')
                  }}
                  showTime={{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }}
                  style={{
                    width: '100%'
                  }}
                  placeholder='Nhập ngày cưới'
                />
              </Form.Item>
              <Row gutter={[20, 20]}>
                <Col span={12}>
                  <Form.Item
                    label='Tên Chú Rể:'
                    name='nameGroom'
                    rules={[{ required: true, message: 'Tên bắt buộc nhập' }]}
                  >
                    <Input placeholder='Nhập tên...' />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label='Tên Cô Dâu:'
                    name='nameBride'
                    rules={[{ required: true, message: 'Tên bắt buộc nhập' }]}
                  >
                    <Input placeholder='Nhập tên...' />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label='Tên Bố Chú Rể:'
                    name='nameGroomFather'
                    rules={[{ required: true, message: 'Tên bắt buộc nhập' }]}
                  >
                    <Input placeholder='Nhập tên...' />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label='Tên Mẹ Chú Rể:'
                    name='nameGroomMother'
                    rules={[{ required: true, message: 'Tên bắt buộc nhập' }]}
                  >
                    <Input placeholder='Nhập tên...' />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label='Tên Bố Cô Dâu:'
                    name='nameBrideFather'
                    rules={[{ required: true, message: 'Tên bắt buộc nhập' }]}
                  >
                    <Input placeholder='Nhập tên...' />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label='Tên Mẹ Cô Dâu:'
                    name='nameBrideMother'
                    rules={[{ required: true, message: 'Tên bắt buộc nhập' }]}
                  >
                    <Input placeholder='Nhập tên...' />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Col>
          <Col span={16} className='pl-10'>
            <p className='capitalize text-3xl mb-10'>Tóm Tắt Đơn Hàng</p>
            <Flex gap='middle' vertical>
              {data?.orderDetails?.map((order) => {
                return (
                  <Row gutter={20} key={order?.id}>
                    <Col span={12} className='flex gap-5 items-center'>
                      <img src={order?.service?.coverUrl} className='w-[133px] h-[95px] rounded-lg' alt='' />
                      <p className='text-2xl'>{order?.service?.name}</p>
                    </Col>
                    <Col span={4} className='flex flex-col justify-center'>
                      <p className='text-center text-2xl'>{dayjs(order?.startTime).format('YYYY-MM-DD')}</p>
                      <p className='text-center text-2xl'>{dayjs(order?.startTime).format('HH:mm')}</p>
                    </Col>
                    <Col span={2} className='flex flex-col justify-center'>
                      <p className='text-2xl text-center'>x1</p>
                    </Col>
                    <Col span={6} className='flex flex-col justify-center'>
                      <p className='text-2xl text-center'>{formatVND(order?.price ?? 0)}</p>
                    </Col>
                  </Row>
                )
              })}
              {data?.combo && (
                <>
                  <Row gutter={20}>
                    <Col span={12} className='flex gap-5 items-center'>
                      <img src={data?.combo?.imageUrl} className='w-[133px] h-[95px] rounded-lg' alt='' />
                      <p className='text-2xl'>{data?.combo?.name}</p>
                    </Col>
                    <Col span={4} className='flex flex-col justify-center'></Col>
                    <Col span={2} className='flex flex-col justify-center'>
                      <p className='text-2xl text-center'>x1</p>
                    </Col>
                    <Col span={6} className='flex flex-col justify-center'>
                      <p className='text-2xl text-center'>{formatVND(data?.combo?.totalAmount)}</p>
                    </Col>
                  </Row>
                  {expand &&
                    data?.comboOrderDetails.map((combo) => (
                      <div className='px-10 py-5' key={combo?.id}>
                        <Row gutter={20}>
                          <Col span={10} className='flex gap-5 items-center'>
                            <img
                              src={combo?.service?.coverUrl}
                              className='w-[133px] h-[95px] rounded-lg'
                              alt=''
                              width={133}
                            />
                            <p className='text-2xl'>{combo?.service?.name}</p>
                          </Col>
                          <Col span={8} className='flex flex-col justify-center'>
                            <p className='text-center text-2xl'>{dayjs(combo?.startTime).format('YYYY-MM-DD')}</p>
                            <p className='text-center text-2xl'>{dayjs(combo?.startTime).format('HH:mm')}</p>
                          </Col>
                          <Col span={6} className='flex flex-col justify-center'>
                            <p className='text-2xl text-center'>x1</p>
                          </Col>
                        </Row>
                      </div>
                    ))}
                  <p
                    className='text-center text-gray cursor-pointer'
                    onClick={() => {
                      setExpand(!expand)
                    }}
                  >
                    {expand ? 'Thu gọn' : 'Mở rộng'}
                  </p>
                </>
              )}
            </Flex>
            <Divider />
            <Flex vertical gap='large' className='mb-12'>
              <Flex justify='space-between' className='py-5' style={{ borderBottom: '1px solid #E5E5E5' }}>
                <p className='text-xl'>Tổng tiền hàng:</p>
                <p className='font-bold text-xl'>{formatVND(Number(data?.totalAmount ?? 0))}</p>
              </Flex>
              <Flex justify='space-between' className='pb-5' style={{ borderBottom: '1px solid #E5E5E5' }}>
                <p className='text-xl'>Voucher giảm giá:</p>
                <p className='font-bold text-xl'>{formatVND(Number(data?.voucher?.discountValueVoucher ?? 0))}</p>
              </Flex>
              <Flex justify='space-between'>
                <p className='text-xl'>Tổng Thanh Toán:</p>
                <p className='font-bold text-xl'>
                  {formatVND(
                    Number(data?.totalAmount) - Number(data?.voucher?.discountValueVoucher ?? 0) > 0
                      ? Number(data?.totalAmount) - Number(data?.voucher?.discountValueVoucher ?? 0)
                      : 0
                  )}
                </p>
              </Flex>
            </Flex>
            <Flex justify='space-between'>
              <p className='text-xl'>Đặt Cọc 30%:</p>
              <p className='font-bold text-xl'>{formatVND(Number(data?.totalAmountRequest))}</p>
            </Flex>
            {/* <p className='text-3xl font-medium my-8'>Phương Thức Thanh Toán</p>
            <div className='flex items-center mb-5'>
              <input id='vn-pay' type='radio' name='payment' className='w-4 h-4 accent-primary' />
              <label htmlFor='vn-pay' className='ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
                <Flex gap='small' align='center'>
                  <img src='/public/images/vn-pay.png' />
                  <p className='text-lg text-gray'>VN Pay </p>
                </Flex>
              </label>
            </div> */}
            <div className='text-center mt-10'>
              <Button
                type='primary'
                className='w-96'
                size='large'
                onClick={() => {
                  form.submit()
                  // navigate('/order-history/')
                }}
              >
                Thanh Toán
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    </Spin>
  )
}

export default Checkout
