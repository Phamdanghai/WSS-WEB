import { useEffect, useState } from 'react'
import { Avatar, Button, Col, Divider, Input, Progress, Rate, Row, Spin, message } from 'antd'
import PreviewImage from './components/PreviewImage'
import { BsCartPlus } from 'react-icons/bs'
import { Link, useParams } from 'react-router-dom'
import { HomeOutlined, LeftOutlined, RightOutlined, StarFilled } from '@ant-design/icons'
import { Card } from '@/components'
import ReactElasticCarousel, { ReactElasticCarouselProps } from 'react-elastic-carousel'
import Modal from './components/Modal'
import { useRequest } from 'ahooks'
import { getServiceById } from '@/api/service'
import { Service } from '@/api/types/service'
import { formatVND } from '@/utils'
import { getFeedbackByServiceId } from '@/api/feedback'
import { Feedback, FeedbackType } from '@/api/types/feedback'
import dayjs from 'dayjs'
import { Cart } from '@/api/types/cart'
import { useDispatch } from 'react-redux'
import { addCart } from '@/store/reducers/cart'
import _ from 'lodash'

const DetailService = () => {
  const [quantity, setQuantity] = useState(1)
  const [service, setService] = useState<null | Service>(null)
  const [filter, setFilter] = useState('Tất cả')
  const [showNote, setShowNote] = useState(false)
  const breakPoints = [
    { width: 1, itemsToShow: 1 },
    { width: 550, itemsToShow: 2, itemsToScroll: 2 },
    { width: 768, itemsToShow: 3 }
  ]
  const [feedbackDataArr, setFeedbackDataArr] = useState<null | Feedback[]>(null)
  const [star, setStar] = useState<null | FeedbackType>(null)
  const [totalComment, setTotal] = useState(0)
  const { id } = useParams()
  const dispatch = useDispatch()
  const { runAsync: onGetServiceById } = useRequest(getServiceById, {
    manual: true,
    onSuccess: (res) => {
      setService(res.data)
    },
    onError: (err) => {
      console.log(err)
    }
  })
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const { data: feedbackData, loading: feedbackLoading } = useRequest(async () => {
    try {
      const res = await getFeedbackByServiceId({
        id: id ?? ''
      })
      if (res.data) {
        return res.data as Record<FeedbackType, Feedback[]>
      }
    } catch (error) {
      console.log(error)
    }
  })

  const getAverageTotal = () => {
    let count = 0
    let total = 0
    if (feedbackData?.[1]?.length && feedbackData?.[1]?.length > 0) {
      count = count + feedbackData[1].length
      total += feedbackData?.[1].length
    }
    if (feedbackData?.[2]?.length && feedbackData?.[2]?.length > 0) {
      count = count + feedbackData[2].length
      total += feedbackData?.[2].length * 2
    }
    if (feedbackData?.[3]?.length && feedbackData?.[3]?.length > 0) {
      count = count + feedbackData[3].length
      total += feedbackData?.[3].length * 3
    }
    if (feedbackData?.[4]?.length && feedbackData?.[4]?.length > 0) {
      count = count + feedbackData[4].length
      total += feedbackData?.[4].length * 4
    }
    if (feedbackData?.[5]?.length && feedbackData?.[5]?.length > 0) {
      count = count + feedbackData[5].length
      total += feedbackData?.[5].length * 5
    }
    if (total === 0) return 0
    return (total / count).toFixed(1)
  }

  useEffect(() => {
    if (!feedbackData) return
    const feedbackArray =
      _.flatMap(feedbackData, (elements, key) => elements.map((element) => ({ key, ...element }))) ?? []
    setTotal(feedbackArray.length)
  }, [feedbackData])

  useEffect(() => {
    if (!feedbackData) return
    if (!star) {
      const feedbackArray =
        _.flatMap(feedbackData, (elements, key) => elements.map((element) => ({ key, ...element }))) ?? []
      setFeedbackDataArr(feedbackArray)
    } else {
      setFeedbackDataArr(feedbackData[star])
    }
  }, [feedbackData, star])

  useEffect(() => {
    if (!id) return
    onGetServiceById({
      id
    })
  }, [id, onGetServiceById])

  const propsCarousel: ReactElasticCarouselProps = {
    breakPoints,
    pagination: false,
    isRTL: false,
    renderArrow(props) {
      return (
        <button className='bg-transparent border-none' disabled={props.isEdge} onClick={props.onClick}>
          {props.type === 'NEXT' ? <RightOutlined className='text-4xl' /> : <LeftOutlined className='text-4xl' />}
        </button>
      )
    }
  }
  const rates = [
    { label: 'Tất cả', comments: feedbackDataArr?.length ?? 0, value: null },
    {
      label: '5 Sao',
      comments: feedbackData?.['5']?.length ?? 0,
      value: 5
    },
    {
      label: '4 Sao',
      comments: feedbackData?.['4']?.length ?? 0,
      value: 4
    },
    {
      label: '3 Sao',
      comments: feedbackData?.['3']?.length ?? 0,
      value: 3
    },
    {
      label: '2 Sao',
      comments: feedbackData?.['2']?.length ?? 0,
      value: 2
    },
    {
      label: '1 Sao',
      comments: feedbackData?.['1']?.length ?? 0,
      value: 1
    }
  ]
  return (
    <div className='container mx-auto'>
      <div className='flex gap-2 justify-start items-center mb-10'>
        <Link to='/'>
          <HomeOutlined className='text-lg text-gray' />
        </Link>
        <RightOutlined className='text-lg text-gray' />
        <Link to='/service'>
          <p className='text-lg text-gray'>Dịch Vụ</p>
        </Link>
        <RightOutlined className='text-lg text-gray' />
        <p className='text-lg text-primary'>{service?.name}</p>
      </div>
      <Row gutter={20}>
        <Col span={10}>
          <PreviewImage serviceImages={service?.serviceImages} />
        </Col>
        <Col span={14}>
          <div className='flex flex-col justify-center gap-10'>
            <p className='text-[#252C32] text-4xl font-bold'>{service?.name}</p>
            <div className='flex gap-2 items-center'>
              <Rate value={service?.rating ?? 0} disabled />{' '}
              <span className='text-sm'>({service?.used ?? 0}) Người đã sử dụng</span>
            </div>
            <p className='text-4xl font-bold'>{formatVND(service?.currentPrices?.price ?? 0)}</p>
            <div>{service?.description}</div>
            <Divider />
            <div>
              <div className='flex items-center gap-5'>
                <p className='text-[#989898] text-base'>Số Lượng:</p>
                <Input
                  addonBefore={
                    <div
                      className='cursor-pointer'
                      onClick={() =>
                        setQuantity((oldValue) => {
                          if (oldValue === 1) return 1
                          return oldValue - 1
                        })
                      }
                    >
                      -
                    </div>
                  }
                  addonAfter={
                    <div className='cursor-pointer' onClick={() => setQuantity((oldValue) => oldValue + 1)}>
                      +
                    </div>
                  }
                  className='w-[150px]'
                  value={quantity}
                  min={0}
                  onChange={(e) => {
                    if (!isNaN(Number(e.target.value))) setQuantity(Number(e.target.value))
                  }}
                />
              </div>
              <Button type='primary' ghost className='w-[500px] mt-5' size='large'>
                <div
                  className='flex justify-center items-center gap-2'
                  onClick={() => {
                    setShowNote(true)
                  }}
                >
                  <BsCartPlus />
                  Thêm vào giỏ hàng
                </div>
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* ĐÁNH GIÁ NHẬN XÉT */}
      <div
        className='rounded-3xl py-5 px-24 mt-20'
        style={{
          border: '1px solid #AEAEAE'
        }}
      >
        <Spin spinning={feedbackLoading}>
          <p className='text-2xl font-semibold mb-10'>Đánh giá & nhận xét</p>
          <Row gutter={250}>
            <Col span={8} className='flex flex-col items-center gap-2'>
              <p className='text-4xl font-bold'>{getAverageTotal()}/5</p>
              <Rate value={Math.floor(Number(getAverageTotal() ?? 5))} disabled />
            </Col>
            <Col span={16}>
              <div className='flex items-center gap-3'>
                <p className='text-2xl'>
                  5 <StarFilled className='text-yellow-400' />
                </p>
                <Progress
                  percent={((feedbackData?.['5']?.length ?? 0) / totalComment) * 100}
                  size='default'
                  showInfo={false}
                  strokeColor='#DF6951'
                  className='w-[523px]'
                />
                <p className='text-xl text-[#989898]'>{feedbackData?.['5']?.length ?? 0} đánh giá</p>
              </div>
              <div className='flex items-center gap-3'>
                <p className='text-2xl'>
                  4 <StarFilled className='text-yellow-400' />
                </p>
                <Progress
                  percent={((feedbackData?.['4']?.length ?? 0) / totalComment) * 100}
                  size='default'
                  showInfo={false}
                  strokeColor='#DF6951'
                  className='w-[523px]'
                />
                <p className='text-xl text-[#989898]'>{feedbackData?.['4']?.length ?? 0} đánh giá</p>
              </div>
              <div className='flex items-center gap-3'>
                <p className='text-2xl'>
                  3 <StarFilled className='text-yellow-400' />
                </p>
                <Progress
                  percent={((feedbackData?.['3']?.length ?? 0) / totalComment) * 100}
                  size='default'
                  showInfo={false}
                  strokeColor='#DF6951'
                  className='w-[523px]'
                />
                <p className='text-xl text-[#989898]'>{feedbackData?.['3']?.length ?? 0} đánh giá</p>
              </div>
              <div className='flex items-center gap-3'>
                <p className='text-2xl'>
                  2 <StarFilled className='text-yellow-400' />
                </p>
                <Progress
                  percent={((feedbackData?.['2']?.length ?? 0) / totalComment) * 100}
                  size='default'
                  showInfo={false}
                  strokeColor='#DF6951'
                  className='w-[523px]'
                />
                <p className='text-xl text-[#989898]'>{feedbackData?.['2']?.length ?? 0} đánh giá</p>
              </div>
              <div className='flex items-center gap-3'>
                <p className='text-2xl'>
                  1 <StarFilled className='text-yellow-400' />
                </p>
                <Progress
                  percent={((feedbackData?.['1']?.length ?? 0) / totalComment) * 100}
                  size='default'
                  showInfo={false}
                  strokeColor='#DF6951'
                  className='w-[523px]'
                />
                <p className='text-xl text-[#989898]'>{feedbackData?.['1']?.length ?? 0} đánh giá</p>
              </div>
            </Col>
          </Row>
          <div className='flex justify-around items-center mt-20'>
            {rates.map((rate) => {
              return (
                <div
                  className={`p-3 cursor-pointer ${filter === rate.label ? 'text-primary' : ''}`}
                  style={{
                    border: `1px solid ${filter === rate.label ? '#DF6951' : '#DADADA'}`
                  }}
                  key={rate.label}
                  onClick={() => {
                    const value = rate.value ? (rate.value as unknown as FeedbackType) : null
                    setFilter(rate.label)
                    setStar(value)
                  }}
                >
                  {rate.label} {rate.label !== 'Tất cả' && `(${rate.comments})`}
                </div>
              )
            })}
          </div>

          {/* COMMENT */}
          {feedbackDataArr?.map((item) => {
            return (
              <div className='flex gap-2 mt-10 mb-5' key={item.id}>
                <Avatar shape='circle' />
                <div>
                  <p className='text-lg font-medium'>{item.user.fullname}</p>
                  <div className='flex gap-1'>
                    <Rate defaultValue={item?.rating ?? 0} disabled />
                  </div>
                  <p className='font-light text-xs my-2'>
                    {dayjs(item.createDate).format('DD/MM/YYYY HH:ss:mm')} | {item.service.name}
                    (48-54kg)
                  </p>
                  <p>{item.content}</p>
                </div>
              </div>
            )
          })}
          {/* <div className='text-center mt-10'>
            <button className='bg-white shadow-lg rounded-3xl text-lg font-medium p-3 border-none'>Xem thêm</button>
          </div> */}
        </Spin>
      </div>

      {/* DỊCH VỤ LIÊN QUAN */}
      <div className='px-10'>
        <p className='capitalize text-3xl font-bold text-purple text-center mt-20 mb-5'>Dịch Vụ Liên Quan</p>
        <ReactElasticCarousel {...propsCarousel}>
          {Array(5)
            .fill(5)
            .map((_, index) => (
              <div key={index} className='my-2'>
                <Card image='https://picsum.photos/536/354'>
                  <div className='flex flex-col gap-3 mt-4'>
                    <div className='flex justify-center items-center text-sm gap-2 text-gray'>
                      <Rate defaultValue={5} disabled />
                      <p className='font-medium'>(35)</p>
                      <p>Người đã sử dụng</p>
                    </div>
                    <p className='text-center font-bold text-2xl'>Bentley Flying</p>
                    <p className='text-center text-2xl text-primary'>2.000.000 vnd</p>
                    <div className='flex justify-around items-center mt-4'>
                      <Button
                        type='primary'
                        size='large'
                        onClick={(e) => {
                          e.stopPropagation()
                        }}
                        className='w-full'
                      >
                        <div className='flex justify-center items-center gap-2'>
                          <BsCartPlus />
                          Thêm vào giỏ hàng
                        </div>
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
        </ReactElasticCarousel>
      </div>
      <Modal
        showNote={showNote}
        setShowNote={setShowNote}
        onFinish={(data) => {
          const newData = data.map((item, index) => {
            const date = dayjs(item.from).format('YYYY/MM/DD')
            const time = dayjs(item.to).format('HH:mm:ss')
            return {
              product: { ...service },
              quantity,
              address: item.address ?? '',
              description: item.note ?? '',
              cardId: service?.id + index.toString() + new Date().getMilliseconds(),
              time: date + ' ' + time,
              total: (service?.currentPrices?.price ?? 0) * quantity
            } as Cart
          })
          dispatch(addCart(newData))
          message.success('Thêm giỏ hàng thành công')
        }}
      />
    </div>
  )
}

export default DetailService
