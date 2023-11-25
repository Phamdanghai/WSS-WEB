import { register } from '@/api/account'
import { auth, provider } from '@/config/firebase'
import { useAuth } from '@/context/AuthContext'
import { Button, Checkbox, Form, Input, Modal, Radio, notification } from 'antd'
import axios from 'axios'
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { useCallback, useEffect, useState } from 'react'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { useNavigate } from 'react-router-dom'

interface UserLogin {
  username: string
  password: string
}

const Login = () => {
  const navigate = useNavigate()
  const [showRegister, setShowRegister] = useState(false)
  const [showForgot, setShowForgot] = useState(false)
  const { user, login } = useAuth()
  const [form] = Form.useForm()

  const handleLogin = useCallback(
    (value: UserLogin) => {
      signInWithEmailAndPassword(auth, value.username, value.password)
        .then(async (userCredential) => {
          const user = userCredential.user
          localStorage.setItem('user', JSON.stringify(user))
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          localStorage.setItem('accessToken', (user as any).accessToken)
          await axios.get('https://api.loveweddingservice.shop/api/v1/Auth/userInfo', {
            headers: {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              Authorization: `Bearer ${(user as any).accessToken}`
            }
          })
          // await runAsync()
          login({ username: user.displayName ?? '', avatar: user.photoURL ?? '' })
          navigate('/')
        })
        .catch((e) => {
          notification.error({
            message: e.message
          })
        })
    },
    [login, navigate]
  )

  const googleLogin = useCallback(() => {
    signInWithPopup(auth, provider).then(async (data) => {
      localStorage.setItem('user', JSON.stringify(data.user))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      localStorage.setItem('accessToken', (data.user as any).accessToken)
      await axios.get('https://api.loveweddingservice.shop/api/v1/Auth/userInfo', {
        headers: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          Authorization: `Bearer ${(data.user as any).accessToken}`
        }
      })
      // await runAsync()
      login({ username: data.user.displayName ?? '', avatar: data.user.photoURL ?? '' })
    })
  }, [login])

  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [navigate, user])

  return (
    <>
      <div className='w-full h-screen flex'>
        <div className='relative w-1/2 h-full'>
          <img
            src='/public/images/login-bg.png'
            alt='login background'
            className='absolute top-0 left-0 w-full h-full object-cover'
          />
        </div>
        <div className='w-1/2 h-full flex flex-col items-center justify-center'>
          <div className='flex flex-col items-center '>
            <img src='/public/logo.svg' alt='logo' width={208} height={195} />
            <p className='text-primary font-bold text-5xl'>Blissful Bell</p>
          </div>
          <Form<UserLogin> layout='vertical' className='min-w-[416px]' requiredMark={'optional'} onFinish={handleLogin}>
            <p className='text-4xl text-blue py-10 font-bold'>Đăng Nhập</p>
            <Form.Item
              label={<p className='font-bold text-purple'>Tài khoản</p>}
              name='username'
              rules={[{ required: true, message: 'Tài khoản không được để trống' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={<p className='font-bold text-purple'>Mật khẩu</p>}
              name='password'
              rules={[{ required: true, message: 'Mật khẩu không được để trống' }]}
            >
              <Input.Password />
            </Form.Item>
            <div className='flex justify-between items-center'>
              <Form.Item name='remember' style={{ marginBottom: 0 }}>
                <Checkbox>
                  <p className='text-purple text-base'>Nhớ</p>
                </Checkbox>
              </Form.Item>
              <p className='underline text-purple text-base cursor-pointer' onClick={() => setShowForgot(true)}>
                Quên Mật Khẩu?
              </p>
            </div>
            <div className='flex gap-6 mt-3'>
              <Button type='primary' className='w-full' size='large' htmlType='submit'>
                Đăng nhập
              </Button>
              <Button className='w-full' size='large' htmlType='button' onClick={() => setShowRegister(true)}>
                Tạo Tài Khoản
              </Button>
            </div>
            <button
              className='mt-5 py-3 w-full bg-white border border-black rounded text-base flex justify-center items-center gap-2'
              type='button'
              onClick={googleLogin}
            >
              <img src='/public/Icon-Google.svg' />
              Sign up with Google
            </button>
          </Form>
        </div>
      </div>

      {/* Register Modal */}
      <Modal
        centered
        title={<p className='text-3xl font-medium'>Đăng Kí Tài Khoản</p>}
        open={showRegister}
        footer={false}
        closable={false}
      >
        <Form
          layout='vertical'
          requiredMark={false}
          form={form}
          initialValues={{
            fullName: '',
            email: '',
            phone: '',
            address: '',
            password: '',
            gender: 'Male'
          }}
          onFinish={async (value) => {
            try {
              await register({
                fullname: value.fullName,
                address: value.address,
                gender: value.gender,
                email: value.email,
                password: value.password,
                phone: `+${value.phone}`
              })
              notification.success({
                message: 'Register successfully'
              })
              form.resetFields()
            } catch (e) {
              console.error(e)
            }
          }}
        >
          <Form.Item
            label={<p className='text-sm text-[#666]'>Họ Và Tên</p>}
            name='fullName'
            rules={[{ required: true, message: 'Họ và tên không được để trống' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={<p className='text-sm text-[#666]'>Email</p>}
            name='email'
            rules={[
              { required: true, message: 'Email không được để trống' },
              {
                type: 'email',
                message: 'Email không đúng định dạng'
              }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={<p className='text-sm text-[#666]'>Số điện thoại</p>}
            name='phone'
            rules={[{ required: true, message: 'Số điện thoại không được để trống' }]}
          >
            <PhoneInput country={'us'} inputStyle={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label={<p className='text-sm text-[#666]'>Địa chỉ</p>}
            name='address'
            rules={[{ required: true, message: 'Địa chỉ không được để trống' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={<p className='text-sm text-[#666]'>Mật khẩu</p>}
            name='password'
            rules={[
              { required: true, message: 'Mật khẩu không được để trống' },
              {
                pattern: new RegExp(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
                message: 'Không đúng định dạng'
              }
            ]}
            extra='Sử dụng 8 ký tự trở lên với sự kết hợp của các chữ cái, số và ký hiệu'
          >
            <Input.Password />
          </Form.Item>
          <Form.Item label={<p className='text-sm text-[#666]'>Giới Tính</p>} name='gender'>
            <Radio.Group>
              <Radio value='Male'>Nam</Radio>
              <Radio value='Female'>Nữ</Radio>
              <Radio value='Other'>Khác</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name='accept' valuePropName='checked'>
            <div className='flex gap-2 items-start'>
              <Checkbox id='checkbox' />
              <label className='text-purple text-sm cursor-pointer' htmlFor='checkbox'>
                Bằng cách tạo tài khoản, tôi đồng ý với Điều khoản sử dụng và Chính sách quyền riêng tư của chúng tôi
              </label>
            </div>
          </Form.Item>
          <div className='flex gap-6 items-center'>
            <Form.Item shouldUpdate>
              {() => {
                console.log(form.getFieldValue('accept'))
                return (
                  <Button type='primary' htmlType='submit' disabled={!form.getFieldValue('accept')}>
                    Đăng Kí
                  </Button>
                )
              }}
            </Form.Item>

            <Form.Item>
              <p>
                Bạn đã có tài khoản?{' '}
                <span
                  onClick={() => {
                    setShowRegister(false)
                    form.resetFields()
                  }}
                  className='text-[#666] cursor-pointer'
                >
                  đăng nhập
                </span>
              </p>
            </Form.Item>
          </div>
        </Form>
      </Modal>

      {/* Forgot password */}
      <Modal
        centered
        title={<p className='text-3xl font-medium'>Quên Mật Khẩu</p>}
        open={showForgot}
        footer={false}
        closable={false}
      >
        <Form
          layout='vertical'
          requiredMark={false}
          form={form}
          initialValues={{
            phone: ''
          }}
          onFinish={(value) => {
            console.log(value)
          }}
        >
          <Form.Item
            label={<p className='text-xs text-[#666]'>Vui lòng nhập số điện thoại tài khoản của bạn!</p>}
            name='phone'
            rules={[{ required: true, message: 'Số điện thoại không được để trống' }]}
          >
            <PhoneInput country={'us'} inputStyle={{ width: '100%' }} />
          </Form.Item>
          <Button className='w-full' type='primary' size='large' htmlType='submit'>
            Xác Nhận
          </Button>
          <p className='mt-2'>
            Bạn đã có tài khoản?{' '}
            <span
              onClick={() => {
                setShowForgot(false)
                form.resetFields()
              }}
              className='text-[#666] cursor-pointer'
            >
              đăng nhập
            </span>
          </p>
        </Form>
      </Modal>
    </>
  )
}

export default Login
