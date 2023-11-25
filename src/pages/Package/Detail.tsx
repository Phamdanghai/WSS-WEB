import { useEffect, useState } from 'react'
import { Avatar, Button, Col, Divider, Progress, Rate, Row, Spin, message, Modal } from 'antd'
import { BsCartPlus } from 'react-icons/bs'
import { Link, useParams } from 'react-router-dom'
import { HomeOutlined, LeftOutlined, RightOutlined, StarFilled } from '@ant-design/icons'
import { Card } from '@/components'
import ReactElasticCarousel, { ReactElasticCarouselProps } from 'react-elastic-carousel'
import { useRequest } from 'ahooks'
import { getComboById } from '@/api/combo'
import { Combo, ComboService, ComboServiceCart } from '@/api/types/combo'
import { formatVND } from '@/utils'
import { Feedback, FeedbackType } from '@/api/types/feedback'
import { useDispatch, useSelector } from 'react-redux'
import { getFeedbackByServiceId } from '@/api/feedback'
import _ from 'lodash'
import dayjs from 'dayjs'
import { Cart } from '@/api/types/cart'
import { addCart, resetComboDetail, setComboServiceDetail } from '@/store/reducers/cart'
import { RootState } from '@/store'
import ModalOrder from './components/Modal'

const DetailPackage = () => {
  const [filter, setFilter] = useState('Tất cả')
  const [showNote, setShowNote] = useState(false)
  const [combo, setCombo] = useState<null | Combo>(null)
  const [feedbackDataArr, setFeedbackDataArr] = useState<null | Feedback[]>(null)
  const [star, setStar] = useState<null | FeedbackType>(null)
  const [totalComment, setTotal] = useState(0)
  const [currentComboService, setCurrentComboService] = useState<ComboService | null>(null)
  const { id } = useParams()
  const dispatch = useDispatch()
  const { combo: comboInCart, comboDetail: comboServiceDetailStore } = useSelector(
    (state: RootState) => state.cartReducer
  )
  const [showDetail, setShowDetail] = useState(false)

  const { runAsync: getComboDetail } = useRequest(getComboById, {
    manual: true,
    onSuccess: (res) => {
      setCombo(res.data)
    },
    onError: (err) => {
      console.log(err)
    }
  })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (!id) return
    getComboDetail({
      id
    })
  }, [getComboDetail, id])

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

  const breakPoints = [
    { width: 1, itemsToShow: 1 },
    { width: 550, itemsToShow: 2, itemsToScroll: 2 },
    { width: 768, itemsToShow: 3 }
  ]
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
        <p className='text-lg text-primary'>{combo?.name}</p>
      </div>
      <Row gutter={250}>
        <Col span={10}>
          <img src={combo?.imageUrl ?? ''} width={500} height={540} className='object-contain bg-slate-200' />
          {/* <PreviewImage /> */}
        </Col>
        <Col span={14}>
          <div className='flex flex-col justify-center gap-10'>
            <p className='text-[#252C32] text-4xl font-bold'>{combo?.name}</p>
            <div className='flex gap-2 items-center'>
              <Rate value={5} disabled /> <span className='text-sm'>(5) Người đã sử dụng</span>
            </div>
            <p className='text-4xl font-bold'>{formatVND(combo?.disountPrice ?? 0)}</p>
            <div>{combo?.description}</div>
            <Divider />
            <div>
              <Button type='primary' ghost className='w-[500px] mt-5' size='large'>
                <div
                  className='flex justify-center items-center gap-2'
                  onClick={() => {
                    setShowDetail(true)
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

      {/* DANH SÁCH DỊCH VỤ */}
      <div className='mt-20'>
        <p className='text-4xl capitalize text-center font-medium'>Danh sách dịch vụ</p>
        {combo?.comboServices?.map((item) => {
          return (
            <div className='flex justify-between items-center my-8' key={item.id}>
              <div className='w-1/4'>
                <img src={item.serviceImages?.[0]?.imageUrl} width={155} height={103} />
              </div>
              <p className='text-[#2F2F2F] text-2xl font-light capitalize w-1/4'>{item.name}</p>
              <p className='text-[#2F2F2F] text-2xl font-light capitalize w-1/4 text-center'>X{item.quantity}</p>
              <p className='text-[#2F2F2F] text-2xl font-light capitalize w-1/4 text-end'>
                {formatVND(Number(item.currentPrices.price))}
              </p>
            </div>
          )
        })}
      </div>

      {/* ĐÁNH GIÁ NHẬN XÉT */}
      <div
        className='rounded-3xl py-5 px-24 mt-20'
        style={{
          border: '1px solid #AEAEAE'
        }}
      >
        <Spin spinning={feedbackLoading}>
          <p className='text-2xl font-semibold mb-10'>Đánh giá & nhận xét</p>
          <Row gutter={20}>
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
      <Modal open={showDetail} closeIcon={false} width={1229} footer={false}>
        <p className='text-center text-4xl py-5'>Chi Tiết Gói Dịch Vụ</p>
        <table className='w-full'>
          <tbody>
            {combo?.comboServices?.map((item) => {
              const index = comboServiceDetailStore.findIndex((combo) => combo.data.id === item.id)
              let detailInfo = null
              if (index !== -1) {
                detailInfo = comboServiceDetailStore[index]
              }
              return (
                <tr key={item.id}>
                  <td>
                    <img
                      src={item.serviceImages?.[0]?.imageUrl}
                      alt=''
                      width={155}
                      height={103}
                      className='rounded-lg'
                    />
                  </td>
                  <td>
                    <p>{item.name}</p>
                    {/* <p>
                      {item?.currentPrices?.dateOfApply
                        ? dayjs(item?.currentPrices?.dateOfApply).format('DD/MM/YYYY')
                        : ''}
                    </p> */}
                    {detailInfo && (
                      <p className='mt-1'>
                        <p>Ngày đặt: {detailInfo?.time}</p>
                        <p>Địa chỉ: {detailInfo?.address}</p>
                        <p>Ghi chú: {detailInfo?.description}</p>
                      </p>
                    )}
                  </td>
                  <td>
                    <p>{formatVND(item.currentPrices?.price ?? 0)}</p>
                  </td>
                  <td>
                    {/* <Button
                      type='primary'
                      size='large'
                      onClick={() => {
                        navigate('/service/' + item.id)
                      }}
                    >
                      Chi Tiết
                    </Button> */}
                    <Button
                      className='ml-2'
                      type='primary'
                      size='large'
                      onClick={() => {
                        setShowNote(true)
                        setCurrentComboService(item)
                      }}
                    >
                      Nhập thông tin
                    </Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <div className='text-center mt-10'>
          {/* <Button
            className='mr-2'
            type='primary'
            size='large'
            onClick={() => {
              if (combo) {
                message.warning('Bạn chỉ được đặt 1 gói combo!')
                return
              }
              setShowNote(true)
            }}
          >
            Thêm giỏ hàng
          </Button> */}
          <Button
            type='primary'
            ghost
            size='large'
            className='mr-2'
            onClick={() => {
              console.log('first')
              if (comboInCart && combo?.id !== comboInCart.id) {
                message.warning('Bạn chỉ được đặt 1 gói combo!')
                return
              }

              if (combo.comboServices.length !== comboServiceDetailStore.length) {
                message.error(`Vui lòng điền đầy đủ thông tin ${combo.comboServices.length} dịch vụ`)
                return
              }
              const res = {
                product: { ...combo },
                quantity: 1,
                address: '',
                description: '',
                cardId: combo?.id + '0'.toString() + new Date().getMilliseconds(),
                time: dayjs().format('YYYY/MM/DD HH:mm:ss'),
                total: (combo?.disountPrice ?? 0) * 1
              } as Cart
              if (!comboInCart) {
                dispatch(addCart([res]))
                message.success('Thêm giỏ hàng thành công')
              } else {
                message.success('Thêm giỏ hàng thành công')
              }

              setShowDetail(false)
            }}
          >
            Thêm giỏ hàng
          </Button>
          <Button
            type='primary'
            ghost
            size='large'
            onClick={() => {
              if (!combo) {
                dispatch(resetComboDetail())
              }
              setShowDetail(false)
            }}
          >
            Đóng
          </Button>
        </div>
        <ModalOrder
          showNote={showNote}
          setShowNote={setShowNote}
          onFinish={(data) => {
            console.log('first', currentComboService)
            console.log('comboServiceDetailStore', comboServiceDetailStore)

            if (comboInCart && combo?.id !== comboInCart.id) {
              message.warning('Bạn chỉ được đặt 1 gói combo!')
              return
            }

            const index = comboServiceDetailStore.findIndex((item) => item.data.id === currentComboService.id)
            if (index === -1) {
              const date = dayjs(data[0].from).format('YYYY/MM/DD')
              const time = dayjs(data[0].to).format('HH:mm:ss')
              const dataCombo = {
                data: currentComboService,
                cardId: currentComboService?.id + '0'.toString() + new Date().getMilliseconds(),
                quantity: 1,
                time: date + ' ' + time,
                total: (currentComboService?.currentPrices?.price ?? 0) * 1,
                address: data[0]?.address,
                description: data[0]?.note,
                comboId: combo?.id
              } as ComboServiceCart
              const cloneCombo = [...comboServiceDetailStore]
              cloneCombo.push(dataCombo)
              dispatch(setComboServiceDetail(cloneCombo))
            } else {
              const date = dayjs(data[0].from).format('YYYY/MM/DD')
              const time = dayjs(data[0].to).format('HH:mm:ss.SSS')
              const dataCombo = {
                data: currentComboService,
                cardId: currentComboService?.id + '0'.toString() + new Date().getMilliseconds(),
                quantity: 1,
                time: date + ' ' + time,
                total: (currentComboService?.currentPrices?.price ?? 0) * 1,
                address: data[0]?.address,
                description: data[0]?.note,
                comboId: combo?.id
              } as ComboServiceCart
              const cloneCombo = [...comboServiceDetailStore]
              cloneCombo.splice(index, 1, dataCombo)
              dispatch(setComboServiceDetail(cloneCombo))
            }
          }}
        />
      </Modal>
    </div>
  )
}

export default DetailPackage
