import React, {useState, useEffect} from 'react'
import {Table, Button, Popconfirm, message, Input, Card, Row, Col, Tabs} from 'antd'
import {EditOutlined, DeleteOutlined, PlusOutlined} from '@ant-design/icons'
import {debounce} from 'lodash'

import handleAPI from '../apis/handleAPI'
import ProductForm from './ProductForm'
import Product from '../models/Product'

const {Search} = Input
const {TabPane} = Tabs

// Lấy danh sách category
const fetchCategories = async () => {
  try {
    return await handleAPI('/api/categories', 'get')
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

// Lấy product theo typeId + search
const fetchProductDatas = async (typeId = '', page = 1, limit = 5, search = '') => {
  let api = `/api/products?page=${page}&limit=${limit}`
  if (typeId) api += `&typeId=${typeId}`
  if (search) api += `&search=${search}`
  try {
    return await handleAPI(api, 'get')
  } catch (error) {
    console.error('Error fetching Products:', error)
    return null
  }
}

const ProductList: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([])
  const [activeTypeId, setActiveTypeId] = useState<string>('') // typeId active ('' = tất cả)
  const [activeSlug, setActiveSlug] = useState<string>('') // slug để check san-pham
  const [products, setProducts] = useState<Product[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [formMode, setFormMode] = useState<any>('add')
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  })
  const [searchValue, setSearchValue] = useState('')

  // Load categories lần đầu
  useEffect(() => {
    const loadCategories = async () => {
      const res: any = await fetchCategories()
      if (res && res.length > 0) {
        const filterCat = res.filter((cat: any) => cat.slug !== 'tin-tuc')
        setCategories(filterCat)
        // chọn category đầu tiên mặc định
        setActiveTypeId(res[0].slug === 'san-pham' ? '' : res[0].id)
        setActiveSlug(res[0].slug)
      }
    }
    loadCategories()
  }, [])

  // Khi đổi tab hoặc search thì load data
  const fetchData = async (typeId: string, page = 1, limit = 5, search = '') => {
    setLoading(true)
    const res: any = await fetchProductDatas(typeId, page, limit, search)
    if (res) {
      setProducts(res.data)
      setPagination({
        current: page,
        pageSize: limit,
        total: res.totalItems,
      })
    }
    setLoading(false)
  }

  useEffect(() => {
    if (activeSlug) {
      fetchData(activeTypeId, pagination.current, pagination.pageSize, searchValue)
    }
  }, [activeTypeId, activeSlug, searchValue])

  const handleTableChange = (pagination: any) => {
    fetchData(activeTypeId, pagination.current, pagination.pageSize, searchValue)
  }

  // Delete
  const handleDelete = async (id: string) => {
    try {
      await handleAPI(`/api/products/${id}`, 'delete')
      message.success('Product deleted successfully!')
      fetchData(activeTypeId, pagination.current, pagination.pageSize, searchValue)
    } catch (error) {
      message.error('Error deleting product')
    }
  }

  const handleAddSuccess = () => {
    setModalVisible(false)
    setEditingProduct(null)
    fetchData(activeTypeId, pagination.current, pagination.pageSize, searchValue)
  }

  const handleSearchChange = debounce((value: string) => {
    setSearchValue(value)
    fetchData(activeTypeId, 1, pagination.pageSize, value)
  }, 500)

  const columns = [
    {title: 'ID', dataIndex: 'id', key: 'id'},
    {title: 'Name', dataIndex: 'name', key: 'name'},
    {
      title: 'Type',
      dataIndex: 'typeId',
      key: 'typeId',
      render: (typeId: string) => {
        const cat = categories.find((c) => c.id === typeId)
        return cat ? cat.name : typeId
      },
    },
    {title: 'Price ($)', dataIndex: 'price', key: 'price'},
    {title: 'Stock', dataIndex: 'stock', key: 'stock'},
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (image: string) => (
        <img src={image || ''} alt='product' style={{width: '50px', height: '50px'}} />
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString('vi-VN', {hour12: false}),
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
              setFormMode('edit')
              setModalVisible(true)
            }}
          >
            Edit
          </Button>
          <Button
            type='link'
            onClick={() => {
              // copy product để prefill form
              const cloneProduct: any = {...record}
              delete cloneProduct.id
              cloneProduct.name = record.name
              setFormMode('duplicate')
              setEditingProduct(cloneProduct as Product)
              setModalVisible(true)
            }}
          >
            Duplicate
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
      <Tabs
        activeKey={activeSlug}
        onChange={(key) => {
          const cat = categories.find((c) => c.slug === key)
          setActiveSlug(key)
          setActiveTypeId(cat?.slug === 'san-pham' ? '' : cat?.id || '')
          setPagination({...pagination, current: 1})
          setSearchValue('')
        }}
      >
        {categories.map((cat) => (
          <TabPane tab={cat.name} key={cat.slug}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Search
                  placeholder='Search products...'
                  value={searchValue}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onSearch={(value) => {
                    setSearchValue(value)
                    fetchData(activeTypeId, 1, pagination.pageSize, value)
                  }}
                  allowClear
                  style={{marginBottom: '20px', width: '300px'}}
                />
              </Col>
              <Col span={24}>
                <Table<Product>
                  columns={columns}
                  dataSource={products}
                  loading={loading}
                  rowKey='id'
                  pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    showSizeChanger: true,
                    pageSizeOptions: ['5', '10', '20'],
                  }}
                  onChange={handleTableChange}
                />
              </Col>
            </Row>
          </TabPane>
        ))}
      </Tabs>

      <ProductForm
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false)
          setEditingProduct(null)
        }}
        onSuccess={handleAddSuccess}
        product={editingProduct}
        mode={formMode}
      />
    </Card>
  )
}

export default ProductList
