import React, {useState, useEffect} from 'react'
import {Table, Button, Popconfirm, message, Input, Card, Row, Col} from 'antd'
import {EditOutlined, DeleteOutlined, PlusOutlined} from '@ant-design/icons'

import handleAPI from '../apis/handleAPI'
import CategoryForm from './CategoryForm'
import Category from '../models/Category'

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

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  // Fetch data from the backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      const res: any = await fetchCategoryDatas() // Call the function

      if (res && res.length > 0) {
        setCategories(res)
      }

      setLoading(false)
    }

    fetchData() // Call the async function inside useEffect
  }, [])

  // Handle delete action
  const handleDelete = async (id: string) => {
    try {
      await handleAPI(`/api/categories/${id}`, 'delete')

      // Update UI by removing deleted item
      setCategories((prevCategories) => prevCategories.filter((category) => category.id !== id))

      message.success('Category deleted successfully!')
    } catch (error) {
      message.error('Error deleting category')
    }
  }

  const handleAddSuccess = (newCategory: Category) => {
    setCategories((prev) =>
      editingCategory
        ? prev.map((c) => (c.id === newCategory.id ? newCategory : c))
        : [...prev, newCategory]
    )
    setEditingCategory(null)
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
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
    },
    // {
    //   title: 'Image',
    //   dataIndex: 'image',
    //   key: 'image',
    //   render: (image: string) => (
    //     <img src={image || ''} alt='product' style={{width: '50px', height: '50px'}} />
    //   ),
    // },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: Category) => (
        <span>
          <Button
            type='link'
            icon={<EditOutlined />}
            onClick={() => {
              setEditingCategory(record)
              setModalVisible(true)
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title='Are you sure you want to delete this category?'
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
      title='Manage Gas Category'
      extra={
        <Button
          type='primary'
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingCategory(null)
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
          <Table<Category>
            columns={columns}
            dataSource={categories}
            loading={loading}
            rowKey='id'
            pagination={{pageSize: 5}}
          />
        </Col>
      </Row>

      <CategoryForm
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false)
          setEditingCategory(null)
        }}
        onSuccess={handleAddSuccess}
        category={editingCategory}
      />
    </Card>
  )
}

export default CategoryList
