import { getAllCategory } from '@/api/category'
import { getAllCombo } from '@/api/combo'
import { getAllService } from '@/api/service'
import { CategoryResponse } from '@/api/types/category'
import { ComboResponse } from '@/api/types/combo'
import { ServiceResponse } from '@/api/types/service'
import { Slider as AntSlider, Card } from '@/components'
import { formatVND } from '@/utils'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { Button, Col, Rate, Row, Spin } from 'antd'
import { useEffect, useState } from 'react'
import Carousel, { ReactElasticCarouselProps } from 'react-elastic-carousel'
import { BsCartPlus } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const [categoriesData, setCategoriesData] = useState<CategoryResponse | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const navigate = useNavigate()

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
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const { data: serviceData, loading: serviceLoading } = useRequest(async () => {
    try {
      const res = await getAllService({
        status: 'Active',
        page: 0,
        'page-size': 20
      })

      if (res?.data) {
        return res.data as ServiceResponse
      }

      return null
    } catch (error) {
      console.log(error)
    }
  })

  const { data: comboData, loading: comboLoading } = useRequest(async () => {
    try {
      const res = await getAllCombo({
        status: 'Active',
        page: 0,
        'page-size': 20
      })

      if (res?.data) {
        return res.data as ComboResponse
      }

      return null
    } catch (error) {
      console.log(error)
    }
  })

  useEffect(() => {
    onFetchAllCategory({
      page: 0,
      'page-size': 6 * currentPage
    })
  }, [currentPage, onFetchAllCategory])

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

  return (
    <>
      {/* Carousel */}
      <div className='relative px-5 mb-24'>
        <AntSlider />
        <div className='bg-gray-2 rounded-md px-2 py-1 absolute bottom-14 left-1/4 w-[912px]'>
          <input
            type='text'
            className='border-none outline-none text-lg bg-transparent w-[790px]'
            placeholder='Tìm kiếm...'
          />
          <Button type='primary' size='large'>
            Tìm kiếm
          </Button>
        </div>
      </div>

      {/* introduce */}
      <div className='flex justify-evenly items-start gap-2'>
        <img src='/public/images/section2.png' width={600} />
        <div className='max-w-[600px]'>
          <p className='text-4xl font-bold text-[#181E4B] my-10'>
            Blissful Bell luôn làm việc linh hoạt cho sự kiện của bạn
          </p>
          <div className='flex flex-col gap-5 text-lg'>
            <p className='text-base'>
              Tại Blissful Bell bạn có thể chọn dịch vụ cưới hỏi trọn gói hoặc gói dịch vụ theo yêu cầu riêng cho từng
              hạng mục cụ thể, vui lòng liên hệ Blissful Bell để được tư vấn và nhận bảng giá dịch vụ cưới hỏi theo yêu
              cầu.
            </p>
            <p className='text-base'>
              Chính sách bảng giá dịch vụ cưới hỏi của chúng tôi dựa trên 4 tiêu chí dành cho tất cả các sản phẩm dịch
              vụ cưới hỏi và luôn mang đến sự hoàn hảo và sự an tâm cho ngày trọng đại của bạn.
            </p>
            <ul className='ml-5 list-disc text-base'>
              <li>Phục vụ đúng sản phẩm dịch vụ cưới hỏi được công bố</li>
              <li>Cùng một dịch vụ nhưng đảm bảo giá phải cạnh tranh cao</li>
              <li>Luôn làm việc linh hoạt cho từng hạng mục dịch vụ cụ thể</li>
              <li>Chúng tôi luôn đồng hành hỗ trợ bạn xuyên suốt sự kiện 24/7</li>
            </ul>
          </div>
        </div>
      </div>

      {/* category */}
      <Spin spinning={CategoriesLoading}>
        <div className='mt-24'>
          <p className='text-lg text-primary font-semibold text-center uppercase'>Thể loại</p>
          <p className='text-4xl text-[#181E4B] text-center'>Chúng tôi cung cấp các loại dịch vụ tốt nhất</p>
          <Row gutter={[0, 20]} className='px-96 py-10'>
            {categoriesData?.data?.map(({ id, imageUrl, name }) => {
              return (
                <Col
                  span={8}
                  key={id}
                  className='flex justify-center'
                  onClick={() => navigate('/service?category=' + id)}
                >
                  <Card image={imageUrl ?? ''} className='w-full'>
                    <p className='text-center font-medium text-lg'>{name}</p>
                  </Card>
                </Col>
              )
            })}
          </Row>
          {6 * currentPage < (categoriesData?.total ?? 1) && (
            <div className='text-center'>
              <button
                className='bg-white shadow-lg rounded-3xl text-lg font-medium p-3 border-none cursor-pointer'
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Xem thêm
              </button>
            </div>
          )}
        </div>
      </Spin>

      {/* hero */}
      <div className='mt-24'>
        <img src='/public/images/sepratir.png' className='w-full' />
      </div>

      {/* popular service */}
      <div className='w-[1240px] mx-auto mt-24'>
        <Spin spinning={serviceLoading}>
          <p className='text-lg text-primary font-semibold text-center uppercase'>Xu Hướng</p>
          <p className='text-4xl text-[#181E4B] text-center mb-5'>Dịch Vụ Phổ Biến</p>
          <Carousel {...propsCarousel}>
            {serviceData?.data?.map((item) => {
              return (
                <div key={item.id} className='my-2' onClick={() => navigate('/service/' + item.id)}>
                  <Card className='h-[573px]' image={item.serviceImages?.[0]?.imageUrl ?? ''}>
                    <div className='flex flex-col gap-3 mt-4 h-[300px] justify-between'>
                      <div>
                        <div className='flex justify-center items-center text-sm gap-2 text-gray'>
                          <Rate defaultValue={item?.rating ?? 0} disabled />
                          <p className='font-medium'>{item?.used ?? 0}</p>
                          <p>Người đã sử dụng</p>
                        </div>
                        <p className='text-center font-bold text-3xl'>{item.name}</p>
                        <p className='text-center text-3xl text-primary'>{formatVND(item.currentPrices?.price ?? 0)}</p>
                        <p className='text-md px-3 text-center break-words'>{item.description}</p>
                      </div>
                      <div className='flex justify-around items-center mt-4'>
                        <Button type='primary' ghost size='large'>
                          <div className='flex justify-center items-center gap-2'>
                            <BsCartPlus />
                            Thêm vào giỏ hàng
                          </div>
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              )
            })}
          </Carousel>
        </Spin>
      </div>
      <div className='mt-24'>
        <img src='/public/images/sepratir.png' className='w-full' />
      </div>
      <div className='w-[1240px] mx-auto mt-24'>
        <p className='text-4xl text-[#181E4B] text-center mb-5'>Gói Dịch Vụ</p>
        <Spin spinning={comboLoading}>
          <Carousel {...propsCarousel}>
            {comboData?.data.map((item) => {
              return (
                <div key={item.id} className='my-2' onClick={() => navigate('/package/' + item.id)}>
                  <Card className='h-[573px]' image={item.imageUrl ?? ''}>
                    <div className='flex flex-col gap-3 mt-4 h-[300px] justify-between'>
                      <div>
                        <div className='flex justify-center items-center text-sm gap-2 text-gray'>
                          <Rate defaultValue={5} disabled />
                          <p className='font-medium'>(35)</p>
                          <p>Người đã sử dụng</p>
                        </div>
                        <p className='text-center font-bold text-3xl'>{item.name}</p>
                        <p className='text-center text-3xl text-primary'>2.000.000 vnd</p>
                        <p className='text-md px-3 text-center'>{item.description}</p>
                      </div>
                      <div className='flex justify-around items-center mt-4'>
                        <Button type='primary' ghost size='large'>
                          <div className='flex justify-center items-center gap-2'>
                            <BsCartPlus />
                            Thêm vào giỏ hàng
                          </div>
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              )
            })}
          </Carousel>
        </Spin>
      </div>
    </>
  )
}

export default Home
