import { PropsWithChildren } from 'react'
import { Footer, Header } from '.'
import Chat from './Chat'

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className='w-full h-screen flex flex-col justify-between relative'>
      <Header />
      <div className='pt-[137px] mb-52'>{children}</div>
      <Footer />
      <Chat />
    </div>
  )
}

export default Layout
