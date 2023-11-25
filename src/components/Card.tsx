import React from 'react'

const Card = ({
  image,
  children,
  className,
  onClick
}: React.PropsWithChildren<{ image: string; className?: string; onClick?: () => void }>) => {
  return (
    <div className={`max-w-[350px] rounded-3xl shadow-md p-5 ${className}`} onClick={onClick}>
      <img src={image} className='w-full h-52 rounded-3xl border border-[#ccc] block border-solid' />
      {children}
    </div>
  )
}

export default Card
