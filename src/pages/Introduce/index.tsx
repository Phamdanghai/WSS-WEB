import { HomeOutlined, RightOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

const Introduce = () => {
  const data = [
    {
      icon: '/public/images/wedding-couple 1.png',
      number: '999+',
      label: 'Khách hàng đã phục vụ'
    },
    {
      icon: '/public/images/wedding-couple 2.png',
      number: '20+',
      label: 'Nhân viên tận tâm và nhiệt huyết'
    },
    {
      icon: '/public/images/wedding-couple 3.png',
      number: '10+',
      label: 'Năm kinh nghiệm trong ngành'
    },
    {
      icon: '/public/images/wedding-couple 4.png',
      number: '100%',
      label: 'Khách hàng phản hồi tốt'
    }
  ]
  return (
    <div>
      <img src='/public/images/contact-hero.png' className='w-full' alt='' />
      <div className='container mx-auto mt-10'>
        <div className='flex gap-2 justify-start items-center'>
          <Link to='/'>
            <HomeOutlined className='text-lg text-gray' />
          </Link>
          <RightOutlined className='text-lg text-gray' />
          <p className='text-lg text-primary'>Giới Thiệu</p>
        </div>
        <div className='flex flex-col gap-5 items-center justify-center'>
          <p className='uppercase text-primary text-3xl font-semibold text-center'>
            TRUNG TÂM DỊCH VỤ CƯỚI HỎI TRỌN GÓI BLISSFUL BELL
          </p>
          <p className='uppercase text-[30px] font-semibold text-center mb-32'>
            HẠNH PHÚC CỦA BẠN LÀ HẠNH PHÚC CỦA CHÚNG TÔI !
          </p>
        </div>
        <div className='flex flex-col gap-5 items-center justify-center'>
          <p className='text-[30px] font-light text-center'>
            Chúng tôi là một thương hiệu uy tín – chất lượng. Trên 10 năm kinh nghiệm trong nghề, với đội ngũ nhân viên
            năng động, nhiệt tình, tận tâm, được đào tạo chuyên nghiệp và luôn giữ phương châm{' '}
            <span className='text-primary uppercase'>
              “HẠNH PHÚC CỦA BẠN LÀ HẠNH PHÚC CỦA CHÚNG TÔI” - “PHỤC VỤ HẾT LÒNG NHƯ TRANG TRÍ TIỆC CƯỚI CHO NGƯỜI THÂN
              TRONG GIA ĐÌNH”
            </span>
          </p>
          <p className='text-[30px] font-light text-center'>
            Đây là tâm niệm ngay từ những ngày đầu thành lập và được thể hiện trong từng khâu, từng hoạt động của chúng
            tôi. Kết quả là đã có rất nhiều khách hàng đánh giá dịch vụ bên chúng tôi rất tốt và có nhiều lời giới thiệu
            cho bạn bè, người thân của khách cũ.
          </p>
          <p className='text-[30px] font-light text-center'>
            Hãy trải nghiệm dịch vụ của chúng tôi và tận hưởng niềm vui trọn vẹn trong ngày hạnh phúc !
          </p>
          <p className='text-[30px] font-light text-center mt-24 mb-10'>
            VÌ SAO NÊN LỰA CHỌN DỊCH VỤ CƯỚI HỎI TRỌN GÓI BLISSFUL BELL?
          </p>
          <ul>
            <li className='text-[30px] font-bold mb-2'>Tư vấn tận tình</li>
            <p className='text-[30px] font-light mb-5'>
              Khi nhận được yêu cầu tư vấn của quý khách, Dịch Vụ Cưới Hỏi Trọn Gói BLISSFUL BELL sẽ tùy nhu cầu thực tế
              mà tư vấn các gói dịch vụ phù hợp. Chúng tôi cam kết tư vấn tận tâm, nhiệt tình, chính xác và tiết kiệm
              nhất.
            </p>
            <li className='text-[30px] font-bold mb-2'>Chi phí hợp lý</li>
            <p className='text-[30px] font-light mb-5'>
              Vấn đề chi phí luôn được Dịch Vụ Cưới Hỏi Trọn Gói BLISSFUL BELL cân nhắc tính toán để tiết kiệm nhất cho
              khách hàng. Đặc biệt, đối với các dịch vụ phát sinh thêm trong lúc dàn dựng chúng tôi cũng luôn lấy đúng
              giá, không vì tình huống gấp mà đẩy giá lên cao bất hợp lý.
            </p>
            <li className='text-[30px] font-bold mb-2'>Mẫu mã đẹp, sáng tạo</li>
            <p className='text-[30px] font-light mb-5'>
              Với những yêu cầu ngày một cao từ khách hàng, Dịch Vụ Cưới Hỏi Trọn Gói BLISSFUL BELL luôn tìm tòi sáng
              tạo những gói dịch vụ phù hợp thị hiếu. Chúng tôi liên tục cập nhật mẫu mới với những chất liệu và tông
              màu phong phú đáp ứng nhu cầu đa dạng của khách hàng.
            </p>
            <li className='text-[30px] font-bold mb-2'>Dịch vụ chuyên nghiệp</li>
            <p className='text-[30px] font-light mb-5'>
              Ngay từ khâu lấy yêu cầu đến khảo sát, thiết kế, dàn dựng và xử lý các vấn đề phát sinh, chúng tôi luôn
              thực hiện một cách tỉ mỉ, chuyên nghiệp và linh hoạt để khâu trang trí tiệc cưới hoàn hảo nhất có thể.
            </p>
          </ul>
        </div>
      </div>
      <div className='mt-24 flex justify-around items-center'>
        {data.map((item) => {
          return (
            <div key={item.label} className='flex flex-col justify-center items-center'>
              <img src={item.icon} alt='' />
              <p className='font-bold text-primary text-2xl'>{item.number}</p>
              <p className='text-xl'>{item.label}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Introduce
