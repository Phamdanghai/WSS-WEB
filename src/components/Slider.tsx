import { Carousel } from 'antd'

const Slider = ({ className }: { className?: string }) => {
  return (
    <Carousel autoplay className={className}>
      <div>
        <img className='h-[550px] w-full ' src='/public/images/background-slider.png' />
      </div>
      <div>
        <img className='h-[550px] w-full' src='/public/images/background-slider.png' />
      </div>
      <div>
        <img className='h-[550px] w-full' src='/public/images/background-slider.png' />
      </div>
      <div>
        <img className='h-[550px] w-full' src='/public/images/background-slider.png' />
      </div>
    </Carousel>
  )
}

export default Slider
