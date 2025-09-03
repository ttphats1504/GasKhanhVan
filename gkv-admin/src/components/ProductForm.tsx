import React, {useState, useEffect} from 'react'
import {Form, Input, Button, Modal, Upload, message, Flex, Cascader, Select} from 'antd'
import {RedoOutlined, UploadOutlined} from '@ant-design/icons'
import handleAPI from '../apis/handleAPI'
import {UploadFile} from 'antd/es/upload/interface'
import Product from '../models/Product'
import ReactQuill from 'react-quill'

interface ProductFormProps {
  visible: boolean
  onClose: () => void
  onSuccess: (newProduct: Product) => void
  product?: Product | null
  mode?: 'add' | 'edit' | 'duplicate'
}

const {Option} = Select

const fetchCategoryDatas = async () => {
  try {
    return await handleAPI('/api/categories', 'get')
  } catch (error) {
    console.error('Error fetching Categories:', error)
    return []
  }
}

const fetchBrandDatas = async () => {
  try {
    return await handleAPI('/api/brands', 'get')
  } catch (error) {
    console.error('Error fetching Brands:', error)
    return []
  }
}

const ProductForm: React.FC<ProductFormProps> = ({
  visible,
  onClose,
  onSuccess,
  product,
  mode = 'add',
}) => {
  const [form] = Form.useForm()
  const [file, setFile] = useState<UploadFile | null>(null)
  const [description, setDescription] = useState<string>('')
  const [description2, setDescription2] = useState<string>('')
  const [categories, setCategories] = useState<any[]>([])
  const [brands, setBrands] = useState<any[]>([])

  const isEditing = mode === 'edit'
  const isDuplicating = mode === 'duplicate'

  // find category path
  function findPath(categories: any, id: any) {
    for (const cat of categories) {
      if (cat.id === id) return [cat.id]
      if (cat.children) {
        const path: any = findPath(cat.children, id)
        if (path.length) return [cat.id, ...path]
      }
    }
    return []
  }

  useEffect(() => {
    if (product && (isEditing || isDuplicating)) {
      const path = findPath(categories, product.typeId)
      form.setFieldsValue({
        ...product,
        typeId: path,
        brandId: product.brandId, // 👈 thêm brand
      })

      setDescription(product.description || '')
      setDescription2(product.description2 || '')

      if (isDuplicating) {
        form.setFieldValue('name', `${product.name} (Copy)`)
      }
    } else {
      form.resetFields()
      setDescription('')
      setDescription2('')
    }
  }, [product, mode, categories])

  useEffect(() => {
    const loadData = async () => {
      try {
        const [catRes, brandRes]: any = await Promise.all([fetchCategoryDatas(), fetchBrandDatas()])
        setCategories(catRes)
        setBrands(brandRes.data)
      } catch (err) {
        message.error('Failed to load categories or brands')
      }
    }
    loadData()
  }, [])

  const handleFileChange = ({file}: any) => {
    setFile(file)
  }

  const handleSubmit = async (values: any) => {
    if (!file && !isEditing) {
      message.error('Please upload an image!')
      return
    }

    const typeId = Array.isArray(values.typeId)
      ? values.typeId[values.typeId.length - 1]
      : values.typeId

    const formData = new FormData()
    formData.append('name', values.name)
    formData.append('typeId', typeId.toString())
    formData.append('brandId', values.brandId.toString()) // 👈 thêm brand
    formData.append('price', values.price.toString())
    formData.append('old_price', values.old_price.toString())
    formData.append('stock', values.stock.toString())
    formData.append('description', description)
    formData.append('description2', description2)

    if (file) {
      const fileBlob = file as unknown as Blob
      formData.append('image', fileBlob)
    }

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
        onSuccess(response)
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
      title={isEditing ? 'Edit Product' : isDuplicating ? 'Duplicate Product' : 'Add Product'}
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

        {/* Category */}
        <Form.Item
          label='Category'
          name='typeId'
          rules={[{required: true, message: 'Please select a category!'}]}
        >
          <Cascader
            options={categories}
            placeholder='Select category'
            fieldNames={{label: 'name', value: 'id', children: 'children'}}
            showSearch
          />
        </Form.Item>

        {/* Brand */}
        <Form.Item
          label='Brand'
          name='brandId'
          rules={[{required: true, message: 'Please select a brand!'}]}
        >
          <Select placeholder='Select brand'>
            {brands.map((b: any) => (
              <Option key={b.id} value={b.id}>
                {b.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label='Price' name='price' rules={[{required: true}]}>
          <Input type='number' placeholder='Enter product price' />
        </Form.Item>

        <Form.Item label='Old/ Market Price' name='old_price' rules={[{required: true}]}>
          <Input type='number' placeholder='Enter old price' />
        </Form.Item>

        <Form.Item label='Stock' name='stock' rules={[{required: true}]}>
          <Input type='number' placeholder='Enter stock quantity' />
        </Form.Item>

        <Form.Item label='Upload Image' name='image'>
          <Upload.Dragger
            name='image'
            beforeUpload={(file) => {
              handleFileChange({file})
              return false
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
          <ReactQuill value={description} onChange={setDescription} />
        </Form.Item>

        <Form.Item label='Description' name='description2'>
          <ReactQuill value={description2} onChange={setDescription2} />
        </Form.Item>

        <Form.Item>
          {isEditing ? (
            <Button type='primary' htmlType='submit'>
              Update Product
            </Button>
          ) : isDuplicating ? (
            <Button type='primary' htmlType='submit'>
              Duplicate Product
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
