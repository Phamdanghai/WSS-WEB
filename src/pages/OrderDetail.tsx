import { createFeedback } from '@/api/feedback'
import { getOrderById } from '@/api/order'
import { OrderDetailStatus, OrderStatus, PaymentStatus } from '@/constants/order'
import { formatVND } from '@/utils'
import { HomeOutlined, RightOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { Button, Col, Divider, Flex, Modal, Rate, Row, Spin, Steps } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import dayjs from 'dayjs'
import { useCallback, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

const OrderDetail = () => {
  const [expand, setExpand] = useState(false)
  const [show, setShow] = useState(false)
  const [showService, setShowService] = useState(false)
  const [loading, setLoading] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [service, setService] = useState<any>()
  const [rate, setRate] = useState(0)
  const [feedback, setFeedback] = useState('')
  const navigate = useNavigate()
  const { id = '' } = useParams()
  const { data } = useRequest(
    async () => {
      const response = await getOrderById(id)
      return response.data
    },
    {
      onBefore() {
        setLoading(true)
      },
      onFinally() {
        setLoading(false)
      },
      onError(e) {
        console.error(e)
      }
    }
  )

  const onFeedback = useCallback(async (data: { content: string; rating: number; orderDetailId: string }) => {
    try {
      await createFeedback(data)
    } catch (e) {
      console.error(e)
    }
  }, [])

  const renderStatusProcess = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 1
      case 'CONFIRM':
        return 2
      case 'DOING':
        return 3
      case 'DONE':
        return 4
      default:
        return 0
    }
  }

  return (
    <Spin spinning={loading}>
      <img src='/public/images/checkout-bg.png' className='w-full' alt='' />
      <div className='container mx-auto mt-10'>
        <div className='flex gap-2 justify-start items-center'>
          <Link to='/'>
            <HomeOutlined className='text-lg text-gray' />
          </Link>
          <RightOutlined className='text-lg text-gray' />
          <Link to='/order-history'>
            <p className='text-lg text-gray'>Lịch Sử Đơn Hàng</p>
          </Link>
          <RightOutlined className='text-lg text-gray' />
          <p className='text-lg text-primary'>Thông Tin Đơn Hàng</p>
        </div>
        <p className='text-center text-3xl mb-10'>Thông tin đơn hàng</p>
        <Steps
          progressDot
          current={renderStatusProcess(data?.statusOrder)}
          items={[
            {
              title: <img src='/public/hourglass.svg' />,
              description: <p className='text-xl text-black'>Chờ Xác Nhận</p>
            },
            {
              title: <img src='/public/check.svg' />,
              description: <p className='text-xl text-black'>Xác nhận</p>
            },
            {
              title: <img src='/public/list.svg' />,
              description: <p className='text-xl text-black'>Đang Thực Hiện</p>
            },
            {
              title: <img src='/public/handshake.svg' />,
              description: <p className='text-xl text-black'>Hoàn Thành</p>
            }
          ]}
        />
        <Row gutter={20}>
          <Col span={12}>
            <p className='text-3xl my-10'>Mã Đơn Hàng : {data?.code}</p>
          </Col>
          <Col span={12}>
            <p className='text-3xl my-10'>Trạng Thái Thanh Toán : {PaymentStatus[data?.statusPayment]}</p>
          </Col>
        </Row>
        <Row gutter={50}>
          <Col
            span={12}
            style={{
              borderRight: '1px solid #E5E5E5'
            }}
          >
            <Flex justify='center' gap='large' vertical>
              <p className='text-2xl font-semibold'>Thông tin khách hàng</p>
              <div>
                <p className='text-xl text-[#989898]'>Tên: {data?.customer?.fullname}</p>
                <p className='text-xl text-[#989898]'>SĐT: {data?.customer?.phone ?? '-'}</p>
                <p className='text-xl text-[#989898]'>Địa chỉ: {data?.customer?.address ?? '-'}</p>
              </div>
            </Flex>
          </Col>
          <Col span={12}>
            <Flex justify='center' gap='large' vertical>
              <p className='text-2xl font-semibold'>Thông tin đám cưới</p>
              <Flex gap='150px' align='center'>
                <div>
                  <p className='text-xl text-[#989898]'>Chú rể: {data?.weddingInformation?.nameGroom}</p>
                  <p className='text-xl text-[#989898]'>Bố chú rể: {data?.weddingInformation?.nameGroomFather}</p>
                  <p className='text-xl text-[#989898]'>Bố cô dâu: {data?.weddingInformation?.nameBrideFather}</p>
                </div>
                <div>
                  <p className='text-xl text-[#989898]'>Cô dâu: {data?.weddingInformation?.nameBride}</p>
                  <p className='text-xl text-[#989898]'>Mẹ chú rể: {data?.weddingInformation?.nameGroomMother}</p>
                  <p className='text-xl text-[#989898]'>Mẹ cô dâu: {data?.weddingInformation?.nameBrideMother}</p>
                </div>
              </Flex>
            </Flex>
          </Col>
        </Row>
        <Divider />
        {data?.orderDetails?.map((order) => (
          <Row
            className='px-5'
            style={{
              borderBottom: '1px solid #7D7D7D'
            }}
            key={order?.id}
          >
            <Col span={8}>
              <div className='flex gap-5 items-center py-5'>
                <img src={order?.service?.coverUrl} width={155} height={103} />
                <div>
                  <p className='text-2xl font-light text-gray'>{order?.service?.name}</p>
                  <p className='text-md font-light text-gray'>x{order?.service?.quantity}</p>
                </div>
              </div>
            </Col>
            <Col span={5}>
              <div className='flex items-center h-full'>
                <p className='text-center text-gray'>{order?.address}</p>
              </div>
            </Col>
            <Col span={5}>
              <div className='flex items-center justify-center h-full'>
                <p className='text-center text-gray'>{dayjs(order?.startTime).format('YYYY-MM-DD HH:mm')}</p>
              </div>
            </Col>
            <Col span={5}>
              <div className='flex items-center justify-between  h-full'>
                <p className='text-start text-gray'>{order?.price} Vnđ</p>
                <Flex vertical align='center' justify='center' gap='middle'>
                  <p className='text-primary text-sm'>{OrderStatus[order?.status]}</p>
                  {order?.status === 'ACTIVE' && (
                    <Button
                      type='primary'
                      size='large'
                      onClick={() => {
                        setService({
                          image: order?.coverUrl,
                          name: order?.name,
                          quantity: order?.service?.quantity,
                          startTime: order?.startTime
                        })
                        setShow(true)
                      }}
                    >
                      Đánh Giá
                    </Button>
                  )}
                </Flex>
              </div>
            </Col>
          </Row>
        ))}
        {/* <Row
          className='px-5'
          style={{
            borderBottom: '1px solid #7D7D7D'
          }}
        >
          <Col span={8}>
            <div className='flex gap-5 items-center py-5'>
              <img src='https://picsum.photos/id/237/536/354' width={155} height={103} />
              <div>
                <p className='text-2xl font-light text-gray'>Bentley Flying</p>
                <p className='text-md font-light text-gray'>x1</p>
              </div>
            </div>
          </Col>
          <Col span={5}>
            <div className='flex items-center h-full'>
              <p className='text-center text-gray'>61/11 đương hàng tre, long thạch mỹ , quận 9</p>
            </div>
          </Col>
          <Col span={5}>
            <div className='flex items-center justify-center h-full'>
              <p className='text-center text-gray'>13/ 10 / 2023</p>
              <p className='text-center text-gray'>23 : 23</p>
            </div>
          </Col>
          <Col span={5}>
            <div className='flex items-center justify-between  h-full'>
              <p className='text-start text-gray'>2.000.000 Vnđ</p>
              <Flex vertical align='center' justify='center' gap='middle'>
                <p className='text-primary text-sm'>Hoàn thành</p>
                <Button type='primary' size='large' onClick={() => setShowService(true)}>
                  Đánh Giá
                </Button>
              </Flex>
            </div>
          </Col>
        </Row> */}
        {data?.combo && (
          <div
            style={{
              borderBottom: '1px solid #7D7D7D'
            }}
          >
            <Row className='px-5'>
              <Col span={8}>
                <div className='flex gap-5 items-center py-5'>
                  <img src={data?.combo?.imageUrl} width={155} height={103} />
                  <div>
                    <p className='text-2xl font-light text-gray'>{data?.combo?.name}</p>
                    <p className='text-md font-light text-gray'>{formatVND(data?.combo?.totalAmount)}</p>
                  </div>
                </div>
              </Col>
              <Col span={5}></Col>
              <Col span={5}></Col>
              <Col span={5}>
                <div className='flex items-center justify-between  h-full'>
                  <p className='text-start text-primary'>
                    {formatVND(data?.combo?.totalAmount)}{' '}
                    <span className='line-through text-gray'>{formatVND(data?.combo?.disountPrice)}</span>
                  </p>
                  <Flex vertical align='center' justify='center' gap='middle'>
                    <p className='text-primary text-sm'>{OrderDetailStatus[data?.comboOrderStatus]}</p>
                    {data?.comboOrderStatus === 'DONE' && (
                      <Button type='primary' size='large' onClick={() => setShowService(true)}>
                        Đánh Giá
                      </Button>
                    )}
                  </Flex>
                </div>
              </Col>
            </Row>
            {expand && (
              <div className='mx-10'>
                {data?.comboOrderDetails.map((service) => (
                  <div
                    className='flex justify-around items-center py-4'
                    style={{ borderBottom: '1px solid #7D7D7D' }}
                    key={service?.id}
                  >
                    <div className='flex gap-2 items-center'>
                      <img src={service?.service?.coverUrl} width={155} height={103} />
                      <div>
                        <p>{service?.service?.name}</p>
                        <p>x1</p>
                      </div>
                    </div>
                    <p className='text-center text-gray'>{service?.address}</p>
                    <p className='text-center text-gray'>{dayjs(service?.startTime).format('YYYY-MM-DD HH:mm')}</p>
                    <p className='text-center text-primary'>{OrderDetailStatus[service?.status]}</p>
                  </div>
                ))}
              </div>
            )}
            {expand ? (
              <p className='text-center text-gray py-5 cursor-pointer' onClick={() => setExpand(false)}>
                Thu gọn
              </p>
            ) : (
              <p className='text-center text-gray py-5 cursor-pointer' onClick={() => setExpand(true)}>
                Mở rộng
              </p>
            )}
          </div>
        )}

        <Flex vertical gap='large' className='mb-12 mx-96 mt-32'>
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
        <Flex justify='space-between' className='mx-96'>
          <p className='text-xl'>Đặt Cọc 30%:</p>
          <p className='font-bold text-xl'>{formatVND(Number(data?.totalAmountRequest ?? 0))}</p>
        </Flex>
        <Flex justify='space-between' className='mx-96 mt-8'>
          <p className='text-xl'>Sô tiền còn nợ:</p>
          <p className='font-bold text-xl'>{formatVND(Number(data?.totalAmount - data?.totalAmountRequest) || 0)}</p>
        </Flex>
        {data?.statusPayment && (
          <div className='text-center mt-10'>
            <Button
              type='primary'
              className='w-96'
              size='large'
              onClick={() => navigate(`/checkout/${id}`)}
              disabled={data?.statusOrder !== 'CONFIRM' && data?.statusOrder !== 'DONE'}
            >
              Thanh Toán
            </Button>
          </div>
        )}
        <Modal closeIcon={false} footer={false} open={showService} width={750}>
          <p className='text-center text-2xl mb-10  '>Đánh giá dịch vụ</p>
          <Flex vertical gap={20}>
            {data?.comboOrderDetails?.map((service) => (
              <Flex align='center' justify='space-around' key={service?.id}>
                <img src={service?.service?.coverUrl} alt='' className='w-[155px] h-[103px] rounded-md' />
                <div>
                  <p>{service?.service?.name}</p>
                  <p>x1</p>
                </div>
                <p>{formatVND(service?.price)}</p>
                <Button
                  type='primary'
                  size='large'
                  onClick={() => {
                    setShow(true)
                    setService({
                      image: service?.service?.coverUrl,
                      name: service?.service?.name,
                      startTime: service?.startTime
                    })
                  }}
                >
                  Đánh Giá
                </Button>
              </Flex>
            ))}
            {/* <Flex align='center' justify='space-around'>
              <img src='https://picsum.photos/id/237/536/354' alt='' className='w-[155px] h-[103px] rounded-md' />
              <div>
                <p>Bentley Flying</p>
                <p>x1</p>
              </div>
              <p>2.000.000 Vnđ</p>
              <Button type='primary' size='large'>
                Đánh Giá
              </Button>
            </Flex>
            <Flex align='center' justify='space-around'>
              <img src='https://picsum.photos/id/237/536/354' alt='' className='w-[155px] h-[103px] rounded-md' />
              <div>
                <p>Bentley Flying</p>
                <p>x1</p>
              </div>
              <p>2.000.000 Vnđ</p>
              <Button type='primary' size='large' onClick={() => setShow(true)}>
                Đánh Giá
              </Button>
            </Flex> */}
          </Flex>
          <div className='text-center mt-10'>
            <Button ghost type='primary' size='large' onClick={() => setShowService(false)}>
              Đóng
            </Button>
          </div>
        </Modal>

        <Modal closeIcon={false} footer={false} open={show} width={800} className='z-[99]'>
          <p className='text-4xl font-medium mb-10'>Đánh Giá Dịch Vụ</p>
          <Flex align='center' gap='100px'>
            <Flex gap='middle' align='center'>
              <img src={service?.coverUrl} className='w-[116px] h-[71px]' />
              <div>
                <p className='text-xl'>{service?.name}</p>
                <p className='text-xl'>x{service?.quantity ?? 1}</p>
              </div>
            </Flex>
            <div>
              <p className='text-center text-xl'>{dayjs(service?.startTime).format('YYYY-MM-DD')}</p>
              <p className='text-center text-xl'>{dayjs(service?.startTime).format('HH:mm')}</p>
            </div>
          </Flex>
          <Flex align='center' className='my-10'>
            <p className='text-lg mr-7'>Chất lượng dịch vụ</p>
            <Flex gap='large'>
              <Rate defaultValue={rate} onChange={(value) => setRate(value)} />
              {/* <p className='text-[#FFAD33]'>Tuyệt vời</p> */}
            </Flex>
          </Flex>
          <TextArea
            placeholder='bình luận....'
            rows={5}
            onChange={(e) => setFeedback(e.target.value)}
            value={feedback}
          />
          <Flex justify='flex-end' gap='50px' align='center' className='mt-10'>
            <div className='cursor-pointer' onClick={() => setShow(false)}>
              Trở lại
            </div>
            <Button
              type='primary'
              size='large'
              onClick={async () => {
                await onFeedback({
                  content: feedback,
                  rating: rate,
                  orderDetailId: id
                })
                setShow(false)
              }}
            >
              Hoàn thành
            </Button>
          </Flex>
        </Modal>
      </div>
    </Spin>
  )
}

export default OrderDetail
