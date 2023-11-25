import { getAllOrders } from '@/api/order'
import { OrderStatus, PaymentStatus } from '@/constants/order'
import { formatVND } from '@/utils'
import { HomeOutlined, RightOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { Col, Row, Spin } from 'antd'
import dayjs from 'dayjs'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const OrderHistory = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { data } = useRequest(
    async () => {
      const response = await getAllOrders()
      return response.data.data
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
  return (
    <>
      <img src='/public/images/checkout-bg.png' className='w-full' alt='' />
      <div className='container mx-auto mt-10'>
        <div className='flex gap-2 justify-start items-center'>
          <Link to='/'>
            <HomeOutlined className='text-lg text-gray' />
          </Link>
          <RightOutlined className='text-lg text-gray' />
          <p className='text-lg text-primary'>Lịch Sử Đơn Hàng</p>
        </div>
        <p className='text-center text-3xl mb-10'>Lịch Sử Đơn Hàng</p>
        <Row
          className='pb-5'
          style={{
            borderBottom: '1px solid #E5E5E5'
          }}
        >
          <Col span={4}>
            <p className='text-3xl'>Mã Đơn Hàng</p>
          </Col>
          <Col span={4}>
            <p className='text-3xl'>Ngày Đặt</p>
          </Col>
          <Col span={4}>
            <p className='text-3xl'>Tổng Tiền</p>
          </Col>
          <Col span={4}>
            <p className='text-3xl'>Trạng Thái</p>
          </Col>
          <Col span={4}>
            <p className='text-3xl'>Trạng Thái Thanh Toán</p>
          </Col>
        </Row>
        <Spin spinning={loading}>
          {(data ?? []).map((item) => (
            <Row
              className='p-5 my-5 cursor-pointer'
              style={{
                background: '#E5E5E5'
              }}
              onClick={() => navigate(`/order-history/${item?.id}`)}
              key={item.id}
            >
              <Col span={4}>
                <p className='text-xl'>{item?.code}</p>
              </Col>
              <Col span={4}>
                <p className='text-xl'>{dayjs(item?.createDate).format('YYYY-MM-DD')}</p>
              </Col>
              <Col span={4}>
                <p className='text-xl'>{formatVND(item?.totalAmount)}</p>
              </Col>
              <Col span={5}>
                <p className='text-xl text-primary'>{OrderStatus[item?.statusOrder]}</p>
              </Col>
              <Col span={5}>
                <p className='text-xl text-primary'>{PaymentStatus[item?.statusPayment]}</p>
              </Col>
              <Col span={2} className='text-right'>
                <RightOutlined className='text-gray' />
              </Col>
            </Row>
          ))}
        </Spin>
      </div>
    </>
  )
}

export default OrderHistory
