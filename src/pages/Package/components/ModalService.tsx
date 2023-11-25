import { Cart } from '@/api/types/cart'
import { OrderDetail } from '@/api/types/order'
import { MinusCircleOutlined } from '@ant-design/icons'
import { Modal as AntModal, Button, DatePicker, Form, Input, TimePicker } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import dayjs, { Dayjs } from 'dayjs'
import { useEffect } from 'react'

export interface ModalFormData {
  from: Dayjs
  to: Dayjs
  address?: string
  note?: string
  orderDetail?: OrderDetail
}

const Modal = ({
  showNote,
  setShowNote,
  onFinish: onFinishModal,
  cart
}: {
  showNote: boolean
  setShowNote: (value: boolean) => void
  onFinish?: (data: ModalFormData[]) => void
  cart?: Cart
}) => {
  const [form] = Form.useForm()

  useEffect(() => {
    if (!cart) return

    form.setFieldValue('order', [
      {
        note: cart.description,
        address: cart.address,
        from: dayjs(cart.time),
        time: dayjs(cart.time)
      }
    ])
  }, [cart, form])

  const onFinish = (data: { order: ModalFormData[] }) => {
    setShowNote(false)
    onFinishModal?.(data.order)
    form.resetFields()
  }

  return (
    <AntModal
      open={showNote}
      closeIcon={true}
      footer={false}
      onCancel={() => {
        form.resetFields()
        setShowNote(false)
      }}
    >
      <div className='py-5'>
        <Form
          layout='vertical'
          onFinish={onFinish}
          initialValues={{
            order: [{}]
          }}
          form={form}
        >
          <Form.List name='order'>
            {(fields, { remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key}>
                    {fields.length > 1 && (
                      <div className='text-right'>
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      </div>
                    )}
                    <div className='flex items-end gap-20'>
                      <Form.Item
                        {...restField}
                        name={[name, 'from']}
                        label='Từ'
                        rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                      >
                        <DatePicker />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'time']}
                        rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                      >
                        <TimePicker format='HH:mm' />
                      </Form.Item>
                    </div>
                    <Form.Item
                      {...restField}
                      name={[name, 'address']}
                      label='Địa chỉ'
                      rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, 'note']} label='Ghi chú'>
                      <TextArea style={{ resize: 'none' }} />
                    </Form.Item>
                  </div>
                ))}
              </>
            )}
          </Form.List>

          <div className='text-center'>
            <Button type='primary' size='large' htmlType='submit'>
              Xác nhận
            </Button>
          </div>
        </Form>
      </div>
    </AntModal>
  )
}

export default Modal
