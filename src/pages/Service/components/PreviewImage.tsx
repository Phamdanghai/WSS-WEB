import { ServiceImages } from '@/api/types/combo'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { useState } from 'react'
export interface PreviewImageProps {
  serviceImages?: ServiceImages[]
}

const PreviewImage = ({ serviceImages }: PreviewImageProps) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const onNextClick = () => {
    if (!serviceImages?.length) return
    const newActiveIndex = activeIndex + 1 > serviceImages.length - 1 ? 0 : activeIndex + 1
    setActiveIndex(newActiveIndex)
  }
  const onPrevClick = () => {
    if (!serviceImages?.length) return
    const newActiveIndex = activeIndex - 1 < 0 ? serviceImages.length - 1 : activeIndex - 1
    setActiveIndex(newActiveIndex)
  }

  return (
    <div className='flex items-start gap-2'>
      <div className='flex flex-col gap-2'>
        {serviceImages?.length ? (
          serviceImages?.map((item, index) => {
            return (
              <div
                key={item.imageUrl}
                className={`border border-solid ${activeIndex === index ? 'border-red-200' : 'border-none'}`}
                onClick={() => setActiveIndex(index)}
              >
                <img
                  src={item.imageUrl}
                  width={50}
                  height={70}
                  className='object-contain border bg-slate-300 cursor-pointer'
                />
              </div>
            )
          })
        ) : (
          <img src='' width={50} height={70} className='object-contain border bg-slate-300 cursor-pointer' />
        )}
      </div>
      <div className='relative'>
        {serviceImages?.length && serviceImages?.length > 1 ? (
          <div
            className='absolute top-1/2 left-2 w-14 h-14 rounded-full bg-gray-3 flex justify-center items-center cursor-pointer'
            onClick={onPrevClick}
          >
            <LeftOutlined className='text-[#9AA6AC] text-bold' />
          </div>
        ) : (
          ''
        )}
        <img
          src={serviceImages?.[activeIndex]?.imageUrl ?? ''}
          width={500}
          height={540}
          className='object-contain bg-slate-400'
        />
        {serviceImages?.length && serviceImages?.length > 1 ? (
          <div
            className='absolute top-1/2 right-2 w-14 h-14 rounded-full bg-gray-3 flex justify-center items-center cursor-pointer'
            onClick={onNextClick}
          >
            <RightOutlined className='text-[#9AA6AC] text-bold' />
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  )
}

export default PreviewImage
