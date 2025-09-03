// components/admin/BrandForm.tsx
import React, {useEffect, useState} from 'react'
import {Modal, Form, Input, Button, Upload, message} from 'antd'
import {UploadOutlined} from '@ant-design/icons'
import {UploadFile} from 'antd/es/upload/interface'
import handleAPI from '../apis/handleAPI'
import Brand from '../models/Brand'

interface Props {
  visible: boolean
  onClose: () => void
  onSaved: () => void
  brand?: Brand | null
}

const BrandForm: React.FC<Props> = ({visible, onClose, onSaved, brand}) => {
  const [form] = Form.useForm()
  const [file, setFile] = useState<UploadFile | null>(null)
  const isEdit = !!brand

  useEffect(() => {
    if (brand) {
      form.setFieldsValue({name: brand.name, order: brand.order})
    } else {
      form.resetFields()
      setFile(null)
    }
  }, [brand, visible])

  const beforeUpload = (file: File) => {
    setFile(file as unknown as UploadFile)
    return false // prevent auto upload
  }

  const handleFinish = async (values: any) => {
    try {
      const formData = new FormData()
      formData.append('name', values.name)
      formData.append('order', String(values.order ?? 0))
      if (file) formData.append('image', file as unknown as Blob)

      if (isEdit) {
        await handleAPI(`/api/brands/${brand!.id}`, 'put', formData, {
          'Content-Type': 'multipart/form-data',
        })
        message.success('Brand updated')
      } else {
        await handleAPI('/api/brands', 'post', formData, {
          'Content-Type': 'multipart/form-data',
        })
        message.success('Brand created')
      }
      onSaved()
      onClose()
    } catch (err) {
      message.error('Save failed')
      console.error(err)
    }
  }

  return (
    <Modal
      title={isEdit ? 'Edit Brand' : 'Add Brand'}
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} layout='vertical' onFinish={handleFinish} initialValues={{order: 0}}>
        <Form.Item name='name' label='Name' rules={[{required: true}]}>
          <Input />
        </Form.Item>

        <Form.Item name='order' label='Order'>
          <Input type='number' />
        </Form.Item>

        <Form.Item label='Image'>
          <Upload
            beforeUpload={beforeUpload}
            // showUploadList={!!file ? [{uid: '-1', name: file.name}] : false}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Choose image</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type='primary' htmlType='submit'>
            {isEdit ? 'Update' : 'Create'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default BrandForm
