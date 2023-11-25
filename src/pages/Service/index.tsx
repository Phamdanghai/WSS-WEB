import { getAllCategory } from '@/api/category'
import { getAllService } from '@/api/service'
import { Cart } from '@/api/types/cart'
import { CategoryResponse } from '@/api/types/category'
import { Service, ServiceResponse } from '@/api/types/service'
import { Card } from '@/components'
import { addCart } from '@/store/reducers/cart'
import { formatVND } from '@/utils'
import { SearchOutlined } from '@ant-design/icons'
import { useDebounceFn, useRequest } from 'ahooks'
import { Button, Col, Radio, Rate, Row, Slider, Spin, message } from 'antd'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { BsCartPlus } from 'react-icons/bs'
import { NumericFormat } from 'react-number-format'
import { useDispatch } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Modal from './components/Modal'

const Service = () => {
  const [categoriesData, setCategoriesData] = useState<CategoryResponse | null>(null)
  const [serviceData, setServiceData] = useState<ServiceResponse | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [inputLeftValue, setInputLeftValue] = useState(0)
  const [inputRightValue, setInputRightValue] = useState(30000000)
  const [partnetId, setPartnetId] = useState('')
  const [name, setName] = useState('')
  const [showNote, setShowNote] = useState(false)
  const [searchParams] = useSearchParams()
  const page = searchParams.get('page')
  const category = searchParams.get('category')
  const [value, setValue] = useState(category)
  const navigate = useNavigate()

  const dispatch = useDispatch()
  const [service, setService] = useState<Service | null>(null)

  console.log('category', category)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    setCurrentPage(Number(page ?? 1))
  }, [page])

  const { run: onChangeName } = useDebounceFn(
    (e) => {
      setName(e.target.value)
    },
    {
      wait: 500
    }
  )

  const { runAsync: onFetchAllCategory, loading: CategoriesLoading } = useRequest(getAllCategory, {
    manual: true,
    onSuccess: (res) => {
      if (res?.data) {
        setCategoriesData(res.data)
      }
    },
    onError: (err) => {
      console.log(err)
    }
  })

  const { runAsync: onGetAllService, loading: serviceLoading } = useRequest(getAllService, {
    manual: true,
    onSuccess: (res) => {
      setServiceData(res?.data)
    },
    onError: (err) => {
      console.log(err)
    }
  })

  useEffect(() => {
    onGetAllService({
      'page-size': currentPage * 6,
      status: 'Active',
      priceFrom: inputLeftValue,
      priceTo: inputRightValue,
      name,
      categoryId: partnetId
    })
  }, [onGetAllService, currentPage, inputLeftValue, inputRightValue, name, partnetId])

  useEffect(() => {
    if (!category) return
    setPartnetId(category)
  }, [category])

  useEffect(() => {
    onFetchAllCategory({})
  }, [])

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
              <div className='mt-2 border border-black py-2'>
                <Spin spinning={CategoriesLoading}>
                  <p className='text-2xl font-medium'>Loại dịch vụ</p>
                  {/* <Checkbox.Group
                    options={categoriesData?.data?.map(({ id, name, services }) => ({
                      label: (
                        <div key={id} className='flex justify-between items-center w-full'>
                          <p className='text-base font-semibold'>{name}</p>
                          <p className='text-base font-semibold'>{services.length}</p>
                        </div>
                      ),
                      value: id ?? ''
                    }))}
                    
                  /> */}
                  {/* <Checkbox.Group className='w-full mt-5' onChange={(checkedValues) => setValue(checkedValues)}>
                    <Space direction='vertical' size={10} className='w-full'>
                      {categoriesData?.data?.map(({ id, name, services }) => (
                        <div key={id} className='flex justify-between items-center w-full'>
                          <Checkbox value={id} key={id} className='w-full'>
                            <p className='text-base font-semibold'>{name}</p>
                          </Checkbox>
                          <p className='text-base font-semibold'>{services.length}</p>
                        </div>
                      ))}
                    </Space>
                  </Checkbox.Group> */}
                  <Radio.Group className='w-full mt-4' onChange={(e) => setValue(e.target.value)} value={value}>
                    <div className='flex flex-col justify-center gap-4'>
                      {categoriesData?.data?.map(({ id, name, services }) => {
                        return (
                          <div key={id} className='flex justify-between items-center w-full'>
                            <Radio value={id} onChange={(e) => setPartnetId(e.target.value)}>
                              <p className='text-base font-semibold'>{name}</p>
                            </Radio>
                            <p className='text-base font-semibold'>{services.length}</p>
                          </div>
                        )
                      })}
                    </div>
                  </Radio.Group>
                  <Button
                    className='mt-5'
                    onClick={() => {
                      setPartnetId(undefined)
                      setValue('')
                      navigate('/service')
                    }}
                  >
                    Bỏ lọc loại dịch vụ
                  </Button>
                </Spin>
              </div>
            </div>
          </Col>
          <Col span={16}>
            <Spin spinning={serviceLoading} className='w-full'>
              <Row gutter={[20, 20]}>
                {serviceData?.data?.length ? (
                  serviceData?.data?.map((item) => {
                    return (
                      <Col span={8} key={item.id}>
                        <Card
                          image={item?.serviceImages?.[0]?.imageUrl ?? ''}
                          onClick={() => navigate('/service/' + item.id)}
                          className='min-h-[560px]'
                        >
                          <div className='flex flex-col gap-3 mt-4 h-[300px] justify-between'>
                            <div>
                              <div className='flex justify-center items-center text-sm gap-2 text-gray'>
                                <Rate defaultValue={item?.rating ?? 0} disabled />
                                <p className='font-medium'>{item?.used ?? 0}</p>
                                <p>Người đã sử dụng</p>
                              </div>
                              <p className='text-center font-bold text-3xl'>
                                {' '}
                                {(item?.name ?? []).length > 20
                                  ? (item?.name ?? '').substring(0, 15) + '...'
                                  : item.name}
                              </p>
                              <p className='text-center text-3xl text-primary'>
                                {formatVND(item.currentPrices?.price ?? 0)}
                              </p>
                              <p className='text-md px-3 text-center break-words'>{item.description}</p>
                            </div>
                            <div className='flex justify-around items-center mt-4'>
                              <Button
                                type='primary'
                                ghost
                                size='large'
                                onClick={(e) => {
                                  e.stopPropagation()
                                }}
                              >
                                <div
                                  className='flex justify-center items-center gap-2'
                                  onClick={() => {
                                    setService(item)
                                    setShowNote(true)
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
            </Spin>
            {6 * currentPage < (serviceData?.total ?? 1) && (
              <div className='text-center mt-10'>
                <button
                  className='bg-white shadow-lg rounded-3xl text-lg font-medium p-3 border-none cursor-pointer'
                  onClick={() => {
                    navigate('/service?page=' + (currentPage + 1))
                  }}
                >
                  Xem thêm
                </button>
              </div>
            )}
          </Col>
        </Row>
      </div>
      <Modal
        showNote={showNote}
        setShowNote={setShowNote}
        onFinish={(data) => {
          if (!service) return
          const newData = data.map((item, index) => {
            const date = dayjs(item.from).format('YYYY/MM/DD')
            const time = dayjs(item.to).format('HH:mm:ss.SSS')
            return {
              product: { ...service },
              quantity: 1,
              address: item.address ?? '',
              description: item.note ?? '',
              cardId: service?.id + index.toString() + new Date().getMilliseconds(),
              time: date + ' ' + time,
              total: (service?.currentPrices?.price ?? 0) * 1
            } as Cart
          })
          dispatch(addCart(newData))
          message.success('Thêm giỏ hàng thành công')
        }}
      />
    </>
  )
}

export default Service
