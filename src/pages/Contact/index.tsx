import { HomeOutlined, RightOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

const Contact = () => {
  return (
    <div>
      <img src='/public/images/contact-hero.png' className='w-full' alt='' />
      <div className='container mx-auto mt-10'>
        <div className='flex gap-2 justify-start items-center'>
          <Link to='/'>
            <HomeOutlined className='text-lg text-gray' />
          </Link>
          <RightOutlined className='text-lg text-gray' />
          <p className='text-lg text-primary'>Liên hệ</p>
        </div>
        <div className='flex flex-col items-center justify-center gap-5'>
          <p className='uppercase text-primary text-3xl font-semibold text-center'>
            TRUNG TÂM DỊCH VỤ CƯỚI HỎI TRỌN GÓI BLISSFUL BELL
          </p>
          <img src='/public/logo.svg' width={150} height={150} />
          <p className='text-[25px] font-light text-center'>
            Địa chỉ : Số 61/11 Đường Hàng Tre - Long Thạch Mỹ - Thủ Đức
          </p>
          <p className='text-[25px] font-light text-center'>Điện thoại : 0802 342 33 - 0912 412 412 - 09 212 9999</p>
          <p className='text-[25px] uppercase text-primary font-semibold text-center'>
            PHỤC VỤ TẤT CẢ CÁC NHU CẦU VỀ CƯỚI HỎI !
          </p>
          <p className='text-[25px] font-light text-center'>
            Website: www.blissfulbell.com.vn - Email: blissfullbell@gmail.com
          </p>
          <p className='text-[25px] font-light text-center'>
            Cưới hỏi trọn gói Blissful Bell cam kết mang đến những dịch vụ tốt nhất để ngày vui của hai bạn thêm phần
            trọn vẹn !
          </p>

          <iframe
            src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.5206866444223!2d106.81334389999999!3d10.8479454!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752735f4e99c1d%3A0xb1198247bcdd9f59!2zNjEgxJDGsOG7nW5nIEjDoG5nIFRyZSwgTG9uZyBUaOG6oW5oIE3hu7ksIFF14bqtbiA5LCBUaMOgbmggcGjhu5EgSOG7kyBDaMOtIE1pbmg!5e0!3m2!1svi!2s!4v1697641871259!5m2!1svi!2s'
            width='100%'
            height='846'
            style={{
              border: 0,
              marginTop: 50
            }}
            allowFullScreen={true}
            loading='lazy'
            referrerPolicy='no-referrer-when-downgrade'
          ></iframe>
        </div>
      </div>
    </div>
  )
}

export default Contact
