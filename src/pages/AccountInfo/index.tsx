import { CameraOutlined, HomeOutlined, RightOutlined } from '@ant-design/icons'
import { Avatar, Button, Col, DatePicker, Form, Input, Row, Select } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ChangePassword from './ChangePassword'
import { useRequest } from 'ahooks'
import { getProfile } from '@/api/account'
import { AccountInfo } from '@/api/types/account'

const AccountInfo = () => {
  const [openChangePassword, setOpenChangePassword] = useState(false)
  const [form] = Form.useForm()

  const { data: dataProfile } = useRequest(async () => {
    try {
      const res = await getProfile()
      if (res?.data) {
        return res.data as AccountInfo
      }
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  })

  useEffect(() => {
    if (!dataProfile) return
    form.setFieldsValue({
      fullName: dataProfile?.user.fullname,
      phone: dataProfile?.user.phone,
      confirmPassword: '',
      gender: dataProfile.user.gender,
      email: dataProfile?.username,
      dateOfBirth: dayjs(dataProfile?.user?.dateOfBirth),
      address: dataProfile?.user?.address
    })
  }, [dataProfile, form])

  return (
    <div className='container mx-auto'>
      <div className='flex gap-2 justify-start items-center'>
        <Link to='/'>
          <HomeOutlined className='text-lg text-gray' />
        </Link>
        <RightOutlined className='text-lg text-gray' />
        <p className='text-lg text-primary'>Tài Khoản Của Tôi</p>
      </div>
      <p className='text-center text-3xl font-medium'>Thông tin cá nhân</p>
      <Form
        layout='vertical'
        requiredMark={false}
        onFinish={(value) => console.log(value)}
        form={form}
        initialValues={{
          fullName: dataProfile?.user.fullname,
          phone: dataProfile?.user.phone,
          confirmPassword: '',
          gender: 'male',
          email: dataProfile?.username,
          dateOfBirth: dayjs('2000-01-01'),
          address: 'FPT University'
        }}
      >
        <div className='rounded-[40px] shadow-md px-[159px] py-24'>
          <Row gutter={150}>
            <Col span={16}>
              <Row gutter={[20, 20]}>
                <Col span={12}>
                  <Form.Item
                    label='Tên *'
                    name='fullName'
                    rules={[{ required: true, message: 'Tên không được bỏ trống' }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item label='Số điện thoại' name='phone'>
                    <Input />
                  </Form.Item>
                  <Form.Item label='Giới tính' name='gender'>
                    <Select>
                      <Select.Option value='Male'>Nam</Select.Option>
                      <Select.Option value='Female'>Nữ</Select.Option>
                      <Select.Option value='Other'>Khác</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label='Email *'
                    name='email'
                    rules={[{ required: true, message: 'Email không được bỏ trống' }]}
                  >
                    <Input disabled />
                  </Form.Item>
                  <Form.Item label='Ngày Sinh' name='dateOfBirth'>
                    <DatePicker className='w-full' />
                  </Form.Item>
                  <Form.Item label='Địa chỉ' name='address'>
                    <TextArea rows={4} style={{ resize: 'none' }} />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col span={8}>
              <div className='w-[350px] h-[350px] relative'>
                <Avatar src={dataProfile?.user?.imageUrl} className='w-full h-full rounded-full' />
                {/* <img src='https://picsum.photos/id/237/200/300' alt='' className='w-full h-full rounded-full' /> */}
                <input type='file' id='file' name='avatar' style={{ display: 'none' }} />
                <label htmlFor='file'>
                  <div className='absolute bottom-0 right-10 h-16 w-16 rounded-full bg-primary flex justify-center items-center cursor-pointer'>
                    <CameraOutlined className='text-4xl text-white' />
                  </div>
                </label>
              </div>
            </Col>
          </Row>
          <div className='flex justify-evenly items-center mt-14'>
            <Button type='primary' ghost size='large' onClick={() => setOpenChangePassword(true)}>
              Đổi Mật Khẩu
            </Button>
            <Button type='primary' size='large' htmlType='submit'>
              Cập Nhật
            </Button>
          </div>
        </div>
      </Form>
      <ChangePassword open={openChangePassword} onClose={() => setOpenChangePassword(false)} />
    </div>
  )
}

export default AccountInfo
