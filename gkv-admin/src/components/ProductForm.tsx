import React, {useState, useEffect} from 'react'
import {Form, Input, Button, Modal, Upload, message, Flex, Select} from 'antd'
import {RedoOutlined, UploadOutlined} from '@ant-design/icons'
import handleAPI from '../apis/handleAPI'
import {UploadFile} from 'antd/es/upload/interface'
import Product from '../models/Product'
import ReactQuill from 'react-quill'

interface ProductFormProps {
  visible: boolean
  onClose: () => void
  onSuccess: (newProduct: Product) => void
  product?: Product | null // If provided, form will be in edit mode
}

const {Option} = Select

const fetchCategoryDatas = async () => {
  const api = '/api/categories'
  try {
    const res = await handleAPI(api, 'get')
    return res
  } catch (error) {
    console.error('Error fetching Categories:', error)
    return []
  }
}

const ProductForm: React.FC<ProductFormProps> = ({visible, onClose, onSuccess, product}) => {
  const [form] = Form.useForm()
  const [file, setFile] = useState<UploadFile | null>(null)
  const [description, setDescription] = useState<string>('')
  const [description2, setDescription2] = useState<string>('')
  const isEditing = !!product
  const [categories, setCategories] = useState([])

  useEffect(() => {
    if (product) {
      form.setFieldsValue(product)
    } else {
      form.resetFields()
    }
  }, [product, form])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res: any = await fetchCategoryDatas()
        setCategories(res)
      } catch (err) {
        message.error('Failed to load categories')
        console.error(err)
      }
    }

    fetchCategories()
  }, [])

  // Handle file change
  const handleFileChange = ({file}: any) => {
    setFile(file)
  }

  // Handle form submission
  const handleSubmit = async (values: Omit<Product, 'id' | 'createdAt'>) => {
    if (!file && !isEditing) {
      message.error('Please upload an image!')
      return
    }

    const formData = new FormData()
    formData.append('name', values.name)
    formData.append('typeId', values.typeId.toString())
    formData.append('price', values.price.toString())
    formData.append('stock', values.stock.toString())
    formData.append('description', values.description)
    formData.append('description2', values.description2)

    // Cast file to Blob safely
    const fileBlob = file as unknown as Blob
    // Append file as Blob
    formData.append('image', fileBlob)

    console.log('📝 FormData before sending:', Object.fromEntries(formData.entries()))

    try {
      const response: any = isEditing
        ? await handleAPI(`/api/products/${product?.id}`, 'put', formData, {
            'Content-Type': 'multipart/form-data',
          })
        : await handleAPI('/api/products', 'post', formData, {
            'Content-Type': 'multipart/form-data',
          })

      if (response) {
        message.success(`Product ${isEditing ? 'updated' : 'added'} successfully!`)
        onSuccess(response) // Update the table
        onClose()
        form.resetFields()
        setFile(null)
      }
    } catch (error) {
      message.error(`Error ${isEditing ? 'updating' : 'adding'} product`)
    }
  }

  return (
    <Modal
      title={isEditing ? 'Edit Product' : 'Add Product'}
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} onFinish={handleSubmit} layout='vertical'>
        <Form.Item
          label='Name'
          name='name'
          rules={[{required: true, message: 'Please enter the product name!'}]}
        >
          <Input placeholder='Enter product name' />
        </Form.Item>
        <Form.Item
          label='Type'
          name='typeId'
          rules={[{required: true, message: 'Please select the product type!'}]}
        >
          <Select placeholder='Select product type'>
            {categories.map((cat: any) => (
              <Option key={cat.id} value={cat.id}>
                {cat.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label='Price ($)'
          name='price'
          rules={[{required: true, message: 'Please enter the product price!'}]}
        >
          <Input type='number' placeholder='Enter product price' />
        </Form.Item>
        <Form.Item
          label='Stock'
          name='stock'
          rules={[{required: true, message: 'Please enter the stock quantity!'}]}
        >
          <Input type='number' placeholder='Enter stock quantity' />
        </Form.Item>
        <Form.Item
          label='Upload Image'
          name='image'
          rules={[{required: true, message: 'Please upload an image!'}]}
        >
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
        </Form.Item>
        <Form.Item label='Promotion' name='description'>
          <ReactQuill
            value={description}
            onChange={setDescription}
            placeholder='Enter product promotion'
          />
        </Form.Item>

        <Form.Item label='Description' name='description2'>
          <ReactQuill
            value={description2}
            onChange={setDescription2}
            placeholder='Enter product description'
          />
        </Form.Item>

        <Form.Item>
          {isEditing ? (
            <Button type='primary' htmlType='submit'>
              Update Product
            </Button>
          ) : (
            <Flex gap={8}>
              <Button type='primary' htmlType='submit'>
                Add Product
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

export default ProductForm
