import React, {useState, useEffect} from 'react'
import {Table, Button, Popconfirm, message, Input, Card, Row, Col} from 'antd'
import {EditOutlined, DeleteOutlined, PlusOutlined} from '@ant-design/icons'

import handleAPI from '../apis/handleAPI'
import ProductForm from './ProductForm'
import Product from '../models/Product'

const fetchProductDatas = async () => {
  const api = '/api/products'
  try {
    const res = await handleAPI(api, 'get')
    return res
  } catch (error) {
    console.error('Error fetching Products:', error)
    return []
  }
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  // Fetch data from the backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      const res: any = await fetchProductDatas() // Call the function

      if (res && res.length > 0) {
        setProducts(res)
      }

      setLoading(false)
    }

    fetchData() // Call the async function inside useEffect
  }, [])

  // Handle delete action
  const handleDelete = async (id: string) => {
    try {
      await handleAPI(`/api/products/${id}`, 'delete')

      // Update UI by removing deleted item
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id))

      message.success('Product deleted successfully!')
    } catch (error) {
      message.error('Error deleting product')
    }
  }

  const handleAddSuccess = (newProduct: Product) => {
    setProducts((prev) =>
      editingProduct
        ? prev.map((c) => (c.id === newProduct.id ? newProduct : c))
        : [...prev, newProduct]
    )
    setEditingProduct(null)
  }

  // Table columns
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Price ($)',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (image: string) => (
        <img src={image || ''} alt='product' style={{width: '50px', height: '50px'}} />
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => <div dangerouslySetInnerHTML={{__html: text}} />,
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => {
        const formattedDate = new Date(date).toLocaleString('vi-VN', {
          hour12: false, // 24-hour format
        })
        return formattedDate
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: Product) => (
        <span>
          <Button
            type='link'
            icon={<EditOutlined />}
            onClick={() => {
              setEditingProduct(record)
              setModalVisible(true)
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title='Are you sure you want to delete this product?'
            onConfirm={() => handleDelete(record.id)}
            okText='Yes'
            cancelText='No'
          >
            <Button type='link' danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </span>
      ),
    },
  ]

  return (
    <Card
      title='Manage Gas Products'
      extra={
        <Button
          type='primary'
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingProduct(null)
            setModalVisible(true)
          }}
        >
          Add New Product
        </Button>
      }
      style={{margin: '20px'}}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Input.Search
            placeholder='Search products...'
            style={{marginBottom: '20px', width: '300px'}}
          />
        </Col>
        <Col span={24}>
          <Table<Product>
            columns={columns}
            dataSource={products}
            loading={loading}
            rowKey='id'
            pagination={{pageSize: 5}}
          />
        </Col>
      </Row>

      <ProductForm
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false)
          setEditingProduct(null)
        }}
        onSuccess={handleAddSuccess}
        product={editingProduct}
      />
    </Card>
  )
}

export default ProductList
