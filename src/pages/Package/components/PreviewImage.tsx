import { LeftOutlined, RightOutlined } from '@ant-design/icons'

const PreviewImage = () => {
  return (
    <div className='flex items-start gap-2'>
      <div className='flex flex-col gap-2'>
        <img src='https://picsum.photos/200/300' width={50} height={70} />
        <img src='https://picsum.photos/200/300' width={50} height={70} />
        <img src='https://picsum.photos/200/300' width={50} height={70} />
        <img src='https://picsum.photos/200/300' width={50} height={70} />
        <img src='https://picsum.photos/200/300' width={50} height={70} />
        <img src='https://picsum.photos/200/300' width={50} height={70} />
        <img src='https://picsum.photos/200/300' width={50} height={70} />
      </div>
      <div className='relative'>
        <div className='absolute top-1/2 left-2 w-14 h-14 rounded-full bg-gray-3 flex justify-center items-center cursor-pointer'>
          <LeftOutlined className='text-[#9AA6AC] text-bold' />
        </div>
        <img src='https://picsum.photos/200/300' width={500} height={540} />
        <div className='absolute top-1/2 right-2 w-14 h-14 rounded-full bg-gray-3 flex justify-center items-center cursor-pointer'>
          <RightOutlined className='text-[#9AA6AC] text-bold' />
        </div>
      </div>
    </div>
  )
}

export default PreviewImage
