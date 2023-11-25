import { useAuth } from '@/context/AuthContext'
import { ShoppingCartOutlined } from '@ant-design/icons'
import { Avatar, Badge, Button, Dropdown, MenuProps, Space } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { Logo } from '.'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'

const Header = () => {
  const { logout, user } = useAuth()
  const cart = useSelector((state: RootState) => state.cartReducer.cart)
  const navigate = useNavigate()
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: <Link to='account-info'>Tài khoản của tôi</Link>
    },
    {
      key: '2',
      label: <Link to='order-history'>Lịch Sử Đơn Hàng</Link>
    },
    {
      key: '3',
      label: (
        <div
          onClick={() => {
            logout()
          }}
        >
          Đăng Xuất
        </div>
      )
    }
  ]

  return (
    <header className='py-5 fixed w-full bg-white z-40'>
      <nav className='flex justify-evenly items-center'>
        <Link to='/' className='font-medium text-lg'>
          Trang Chủ
        </Link>
        <Link to='/introduce' className='font-medium text-lg'>
          Giới Thiệu
        </Link>
        <Link to='/service' className='font-medium text-lg'>
          Dịch Vụ
        </Link>
        <Logo />
        <Link to='/package' className='font-medium text-lg'>
          Gói Dịch Vụ
        </Link>
        <Link to='/contact' className='font-medium text-lg'>
          Liên Hệ
        </Link>
        <div className='flex gap-20 items-center'>
          <Link to='/cart'>
            <Badge count={cart.length}>
              <ShoppingCartOutlined className='text-lg' />
            </Badge>
          </Link>
          {user ? (
            <Dropdown menu={{ items }} placement='topRight' arrow={{ pointAtCenter: true }}>
              <Space size={5} direction='vertical' align='center'>
                <Avatar src={user.avatar} />
                <p>{user.username}</p>
              </Space>
            </Dropdown>
          ) : (
            <Button type='primary' onClick={() => navigate('/login')}>
              Đăng nhập
            </Button>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Header
