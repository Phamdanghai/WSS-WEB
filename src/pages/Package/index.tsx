import { SearchOutlined } from '@ant-design/icons'
import { Button, Col, Modal, Rate, Row, Slider, message } from 'antd'
import { Card } from '@/components'
import { useEffect, useState } from 'react'
import { BsCartPlus } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'
import { useDebounceFn, useRequest } from 'ahooks'
import { getAllCombo } from '@/api/combo'
import { Combo, ComboResponse, ComboService, ComboServiceCart } from '@/api/types/combo'
import { formatVND } from '@/utils'
import { NumericFormat } from 'react-number-format'
import dayjs from 'dayjs'
import { Cart } from '@/api/types/cart'
import ModalOrder from './components/Modal'
import { addCart, resetComboDetail, setComboServiceDetail } from '@/store/reducers/cart'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'

const Package = () => {
  const [comboData, setComboData] = useState<ComboResponse | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [currentComboService, setCurrentComboService] = useState<ComboService | null>(null)
  const [inputLeftValue, setInputLeftValue] = useState(0)
  const [inputRightValue, setInputRightValue] = useState(30000000)
  const [showDetail, setShowDetail] = useState(false)
  const [showNote, setShowNote] = useState(false)
  const [name, setName] = useState('')
  const navigate = useNavigate()
  const [comboDetail, setComboDetail] = useState<Combo | null>(null)
  const dispatch = useDispatch()
  const { combo, comboDetail: comboServiceDetailStore } = useSelector((state: RootState) => {
    return state.cartReducer
  })

  const { runAsync: onGetAllCombo } = useRequest(getAllCombo, {
    manual: true,
    onSuccess: (res) => {
      setComboData(res?.data)
    },
    onError: (err) => {
      console.log(err)
    }
  })
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const { run: onChangeName } = useDebounceFn(
    (e) => {
      setName(e.target.value)
    },
    {
      wait: 500
    }
  )

  useEffect(() => {
    onGetAllCombo({
      'page-size': currentPage * 6,
      status: 'Active',
      priceFrom: inputLeftValue,
      priceTo: inputRightValue,
      name
    })
  }, [onGetAllCombo, currentPage, inputLeftValue, inputRightValue, name])

  return (
    <>
      <img src='/public/images/service-hero.png' className='w-full h-[430px]' />
      <div className='mx-16'>
        <Row gutter={20} className='mt-44'>
          <Col span={8}>
            <div className='max-w-[328px]'>
              <div className='shadow-md flex gap-2 items-center p-3'>
                <input
                  type='text'
                  placeholder='Tìm kiếm'
                  className='border-none outline-none w-full text-base placeholder:italic'
                  onChange={onChangeName}
                />
                <SearchOutlined className='text-lg text-primary' />
              </div>
              <p className='text-xl font-medium capitalize my-4'>Bộ lọc</p>
              <p className='text-xl font-medium capitalize my-4'>Giá</p>
              <div className='flex justify-between items-center gap-4'>
                <NumericFormat
                  prefix='đ '
                  className='w-full border border-gray-2 h-7 rounded-md px-3'
                  min={0}
                  max={30000000}
                  style={{ margin: '0 16px' }}
                  thousandSeparator='.'
                  decimalSeparator=','
                  defaultValue={0}
                  fixedDecimalScale={true}
                  value={inputLeftValue}
                  onChange={(e) => {
                    const newValue = e.target.value.replace(/\./g, '')
                    setInputLeftValue(Number(newValue ?? 0))
                  }}
                />
                -
                <NumericFormat
                  prefix='đ '
                  className='w-full border border-gray-2 h-7 rounded-md px-3'
                  min={0}
                  max={30000000}
                  style={{ margin: '0 16px' }}
                  thousandSeparator='.'
                  decimalSeparator=','
                  defaultValue={30000000}
                  fixedDecimalScale={true}
                  value={inputRightValue}
                  onChange={(e) => {
                    const newValue = e.target.value.replace(/\./g, '')
                    setInputLeftValue(Number(newValue ?? 0))
                  }}
                />
              </div>
              <Slider
                tooltip={{
                  open: false
                }}
                range
                onChange={(value) => {
                  setInputLeftValue((value[0] * 30000000) / 100)
                  setInputRightValue((value[1] * 30000000) / 100)
                }}
                value={[Math.floor((inputLeftValue * 100) / 30000000), Math.floor((inputRightValue * 100) / 30000000)]}
              />
            </div>
          </Col>
          <Col span={16}>
            <Row gutter={[20, 20]}>
              {comboData?.data?.length ? (
                comboData?.data?.map((item: Combo) => {
                  return (
                    <Col span={8} key={item.id}>
                      <Card
                        image={item.imageUrl ?? ''}
                        onClick={() => navigate(`/package/${item.id}`)}
                        className='min-h-[540px]'
                      >
                        <div className='flex flex-col gap-3 mt-4 h-[300px] justify-between'>
                          <div>
                            <div className='flex justify-center items-center text-sm gap-2 text-gray'>
                              <Rate defaultValue={5} disabled />
                              <p className='font-medium'>(35)</p>
                              <p>Người đã sử dụng</p>
                            </div>
                            <p className='text-center font-bold text-3xl'>
                              {(item?.name ?? '').length > 20
                                ? (item?.name ?? '').substring(0, 20) + '...'
                                : item?.name}
                            </p>
                            <p className='text-center text-2xl text-primary flex justify-center items-end gap-2'>
                              {formatVND(item?.disountPrice ?? 0)}
                              <span className='line-through text-gray text-lg'>
                                {formatVND(item?.totalAmount ?? 0)}
                              </span>
                            </p>
                            <p className='text-md px-3 text-center'>{item.description}</p>
                          </div>
                          <div className='flex justify-around items-center mt-4'>
                            <Button
                              type='primary'
                              ghost
                              size='large'
                              onClick={(e) => {
                                e.stopPropagation()
                                setShowDetail(true)
                              }}
                            >
                              <div
                                className='flex justify-center items-center gap-2'
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setShowDetail(true)
                                  setComboDetail(item)
                                }}
                              >
                                <BsCartPlus />
                                Thêm vào giỏ hàng
                              </div>
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </Col>
                  )
                })
              ) : (
                <div className='text-lg'>Không tìm thấy kết quả phù hợp</div>
              )}
            </Row>
            {6 * currentPage < (comboData?.total ?? 1) && (
              <div className='text-center mt-10'>
                <button
                  className='bg-white shadow-lg rounded-3xl text-lg font-medium p-3 border-none cursor-pointer'
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Xem thêm
                </button>
              </div>
            )}
          </Col>
        </Row>
      </div>
      <Modal open={showDetail} closeIcon={false} width={1229} footer={false}>
        <p className='text-center text-4xl py-5'>Chi Tiết Gói Dịch Vụ</p>
        <table className='w-full'>
          <tbody>
            {comboDetail?.comboServices?.map((item) => {
              const index = comboServiceDetailStore.findIndex((combo) => combo.data.id === item.id)
              let detailInfo = null
              if (index !== -1) {
                detailInfo = comboServiceDetailStore[index]
              }
              return (
                <tr key={item.id} className=''>
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
              if (combo && comboDetail?.id !== combo.id) {
                message.warning('Bạn chỉ được đặt 1 gói combo!')
                return
              }

              if (comboDetail.comboServices.length !== comboServiceDetailStore.length) {
                message.error(`Vui lòng điền đầy đủ thông tin ${comboDetail.comboServices.length} dịch vụ`)
                return
              }
              const res = {
                product: { ...comboDetail },
                quantity: 1,
                address: '',
                description: '',
                cardId: comboDetail?.id + '0'.toString() + new Date().getMilliseconds(),
                time: dayjs().format('YYYY/MM/DD HH:mm:ss'),
                total: (comboDetail?.disountPrice ?? 0) * 1
              } as Cart
              if (!combo) {
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

            if (combo && comboDetail?.id !== combo.id) {
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
    </>
  )
}

export default Package
