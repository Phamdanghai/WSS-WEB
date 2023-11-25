import { Button, Form, Input, Modal } from 'antd'

const ChangePassword = (props: { open: boolean; onClose: () => void }) => {
  const { open, onClose } = props
  const [form] = Form.useForm()

  return (
    <Modal
      centered
      title={<p className='text-3xl font-medium'>Đăng Kí Tài Khoản</p>}
      open={open}
      footer={false}
      closable={false}
    >
      <Form
        layout='vertical'
        requiredMark={false}
        form={form}
        initialValues={{
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        }}
        onFinish={(value) => {
          console.log(value)
        }}
      >
        <Form.Item
          label={<p className='text-sm text-[#666]'>Mật khẩu cũ</p>}
          name='oldPassword'
          rules={[{ required: true, message: 'Mật khẩu cũ không được để trống' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label={<p className='text-sm text-[#666]'>Mật khẩu mới</p>}
          name='newPassword'
          rules={[{ required: true, message: 'Mật khẩu mới không được để trống' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label={<p className='text-sm text-[#666]'>Xác nhận mật khẩu mới</p>}
          name='confirmPassword'
          dependencies={['newPassword']}
          rules={[
            { required: true, message: 'Xác nhận mật khẩu mới không được để trống' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('Mật khẩu mới không trùng khớp'))
              }
            })
          ]}
        >
          <Input.Password />
        </Form.Item>
        <div className='flex gap-6 items-center justify-center mt-14'>
          <Button type='primary' htmlType='submit'>
            Cập Nhật
          </Button>
          <Button type='primary' ghost onClick={() => onClose()}>
            Đóng
          </Button>
        </div>
      </Form>
    </Modal>
  )
}

export default ChangePassword
