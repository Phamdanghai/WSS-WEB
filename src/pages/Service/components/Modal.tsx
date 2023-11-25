import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { Modal as AntModal, Button, DatePicker, Form, Input, TimePicker } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { Dayjs } from 'dayjs'

export interface ModalFormData {
  from: Dayjs
  to: Dayjs
  address?: string
  note?: string
}

const Modal = ({
  showNote,
  setShowNote,
  onFinish: onFinishModal
}: {
  showNote: boolean
  setShowNote: (value: boolean) => void
  onFinish?: (data: ModalFormData[]) => void
}) => {
  const [form] = Form.useForm()

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
            {(fields, { add, remove }) => (
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
                        rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
                        label='Từ'
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
                      rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                      label='Địa chỉ'
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, 'note']} label='Ghi chú'>
                      <TextArea style={{ resize: 'none' }} />
                    </Form.Item>
                  </div>
                ))}
                <Form.Item>
                  <Button type='dashed' onClick={() => add()} icon={<PlusOutlined />}>
                    Thêm
                  </Button>
                </Form.Item>
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
