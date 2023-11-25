import { FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa'
import { IoLocationOutline, IoMailOutline } from 'react-icons/io5'
import { BsTelephone } from 'react-icons/bs'

import './css/footer.css'

const Footer = () => {
  return (
    <footer className='new_footer_area bg_color border-t-2 border-[#E5E5E5]'>
      <div className='flex justify-evenly pt-5'>
        <div className='flex flex-col gap-2 justify-center items-center min-w-[400px]'>
          <img src='/public/logo.svg' alt='logo' width={100} />
          <p className='text-4xl'>Blissful Bell</p>
        </div>
        <div className='flex flex-col w-full gap-5'>
          <p className='text-2xl font-medium'>Theo Dõi Chúng Tôi</p>
          <div className='flex flex-col gap-2 justify-center'>
            <div className='flex gap-2 items-center'>
              <FaFacebookF className='text-primary w-12 h-12 p-3 bg-white shadow-md rounded-lg' />
              <p className='text-gray text-xl'>Facebook</p>
            </div>
            <div className='flex gap-2 items-center'>
              <FaInstagram className='text-primary w-12 h-12 p-3 bg-white shadow-md rounded-lg' />
              <p className='text-gray text-xl'>Instagram</p>
            </div>
            <div className='flex gap-2 items-center'>
              <FaTiktok className='text-primary w-12 h-12 p-3 bg-white shadow-md rounded-lg' />
              <p className='text-gray text-xl'>Tiktok</p>
            </div>
          </div>
        </div>
        <div className='flex flex-col w-full gap-5'>
          <p className='text-2xl font-medium'>Theo Dõi Chúng Tôi</p>
          <div className='flex flex-col gap-5 justify-center'>
            <div className='flex items-center gap-3'>
              <IoLocationOutline className='text-primary w-10 h-10' />
              <p className='text-gray text-xl'>61/11 Đường Hàng Tre, Long Thạch Mỹ, Quận 9</p>
            </div>
            <div className='flex items-center gap-3'>
              <BsTelephone className='text-primary w-8 h-8' />
              <p className='text-gray text-xl'>0857 367 829 - 0983 999 212</p>
            </div>
            <div className='flex items-center gap-3'>
              <IoMailOutline className='text-primary w-10 h-10' />
              <p className='text-gray text-xl'>0857 367 829 - 0983 999 212</p>
            </div>
          </div>
        </div>
      </div>
      <div className='new_footer_top'>
        <div className='footer_bg'>
          <div className='footer_bg_one' />
          <div className='footer_bg_two' />
        </div>
      </div>
      <div className='footer_bottom'>
        <div className='flex items-center justify-around'></div>
      </div>
    </footer>
  )
}

export default Footer
