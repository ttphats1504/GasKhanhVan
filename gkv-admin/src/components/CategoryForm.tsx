import React, {useState, useEffect} from 'react'
import {Form, Input, Button, Modal, Upload, message, Flex} from 'antd'
import {RedoOutlined, UploadOutlined} from '@ant-design/icons'
import handleAPI from '../apis/handleAPI'
import {UploadFile} from 'antd/es/upload/interface'
import Category from '../models/Category'

interface CategoryFormProps {
  visible: boolean
  onClose: () => void
  onSuccess: (newCategory: Category) => void
  category?: Category | null // If provided, form will be in edit mode
}

const CategoryForm: React.FC<CategoryFormProps> = ({visible, onClose, onSuccess, category}) => {
  const [form] = Form.useForm()
  const [file, setFile] = useState<UploadFile | null>(null)
  const isEditing = !!category

  useEffect(() => {
    if (category) {
      form.setFieldsValue(category)
    } else {
      form.resetFields()
    }
  }, [category, form])

  // Handle file change
  // const handleFileChange = ({file}: any) => {
  //   setFile(file)
  // }

  // Handle form submission
  const handleSubmit = async (values: Omit<Category, 'id'>) => {
    // if (!file && !isEditing) {
    //   message.error('Please upload an image!')
    //   return
    // }

    const formData = new FormData()
    formData.append('name', values.name)
    formData.append('slug', values.slug)
    // Cast file to Blob safely
    const fileBlob = file as unknown as Blob
    // Append file as Blob
    formData.append('image', fileBlob)

    console.log('📝 FormData before sending:', Object.fromEntries(formData.entries()))

    try {
      const response: any = isEditing
        ? await handleAPI(`/api/categories/${category?.id}`, 'put', formData, {
            'Content-Type': 'multipart/form-data',
          })
        : await handleAPI('/api/categories', 'post', formData, {
            'Content-Type': 'multipart/form-data',
          })

      if (response) {
        message.success(`Cylinder ${isEditing ? 'updated' : 'added'} successfully!`)
        onSuccess(response) // Update the table
        onClose()
        form.resetFields()
        setFile(null)
      }
    } catch (error) {
      message.error(`Error ${isEditing ? 'updating' : 'adding'} cylinder`)
    }
  }

  return (
    <Modal
      title={isEditing ? 'Edit Category' : 'Add Category'}
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} onFinish={handleSubmit} layout='vertical'>
        <Form.Item
          label='Name'
          name='name'
          rules={[{required: true, message: 'Please enter the category name!'}]}
        >
          <Input placeholder='Enter category name' />
        </Form.Item>
        <Form.Item
          label='Slug'
          name='slug'
          rules={[{required: true, message: 'Please enter the slug!'}]}
        >
          <Input placeholder='Enter slug' />
        </Form.Item>
        {/* <Form.Item label='Upload Image' name='image'>
          <Upload.Dragger
            name='image'
            beforeUpload={(file) => {
              handleFileChange({file})
              return false // Prevent automatic upload
            }}
            maxCount={1}
            onRemove={() => setFile(null)}
          >
            <p className='ant-upload-drag-icon'>
              <UploadOutlined />
            </p>
            <p>Click or drag file to upload</p>
          </Upload.Dragger>
        </Form.Item> */}
        <Form.Item>
          {isEditing ? (
            <Button type='primary' htmlType='submit'>
              Update Category
            </Button>
          ) : (
            <Flex gap={8}>
              <Button type='primary' htmlType='submit'>
                Add Category
              </Button>
              <Button type='dashed' icon={<RedoOutlined />} onClick={() => form.resetFields()}>
                Clear
              </Button>
            </Flex>
          )}
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CategoryForm
