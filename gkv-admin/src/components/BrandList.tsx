// pages/admin/brands.tsx
import React, {useEffect, useState} from 'react'
import {Card, Table, Button, Space, Popconfirm, Input, message} from 'antd'
import {PlusOutlined, EditOutlined, DeleteOutlined, SyncOutlined} from '@ant-design/icons'
import Brand from '../models/Brand'
import handleAPI from '../apis/handleAPI'
import BrandForm from './BrandForm'

const {Search} = Input

const BrandList: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(50)
  const [total, setTotal] = useState(0)
  const [editing, setEditing] = useState<Brand | null>(null)
  const [formVisible, setFormVisible] = useState(false)
  const [search, setSearch] = useState('')

  const fetchData = async () => {
    setLoading(true)
    try {
      const res: any = await handleAPI(
        `/api/brands?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`,
        'get'
      )
      setBrands(res?.data || res?.data || [])
      setTotal(res?.totalItems || res?.total || 0)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [page, limit, search])

  const handleDelete = async (id: number) => {
    try {
      await handleAPI(`/api/brands/${id}`, 'delete')
      message.success('Deleted')
      fetchData()
    } catch (err) {
      message.error('Delete failed')
    }
  }

  const handleOpenCreate = () => {
    setEditing(null)
    setFormVisible(true)
  }

  const handleEdit = (brand: Brand) => {
    setEditing(brand)
    setFormVisible(true)
  }

  const handleSave = () => {
    fetchData()
  }

  // simple reorder via up/down
  const updateOrder = async (id: number, delta: number) => {
    const item = brands.find((b) => b.id === id)
    if (!item) return
    const newOrder = (item.order || 0) + delta
    try {
      await handleAPI(`/api/brands/${id}`, 'put', {order: newOrder})
      message.success('Order updated')
      fetchData()
    } catch (err) {
      message.error('Order update failed')
    }
  }

  const columns = [
    {title: 'ID', dataIndex: 'id', key: 'id', width: 80},
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (src: string) =>
        src ? <img src={src} style={{height: 48, objectFit: 'contain'}} /> : '—',
    },
    {title: 'Name', dataIndex: 'name', key: 'name'},
    {title: 'Slug', dataIndex: 'slug', key: 'slug'},
    {title: 'Order', dataIndex: 'order', key: 'order', width: 120},
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Brand) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm title='Delete brand?' onConfirm={() => handleDelete(record.id)}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
          <Button icon={<SyncOutlined />} onClick={() => updateOrder(record.id, 1)}>
            +1
          </Button>
          <Button icon={<SyncOutlined />} onClick={() => updateOrder(record.id, -1)}>
            -1
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <Card
      title='Manage Brands'
      extra={
        <Button type='primary' icon={<PlusOutlined />} onClick={handleOpenCreate}>
          Add Brand
        </Button>
      }
    >
      <Space style={{marginBottom: 12}}>
        <Search
          placeholder='Search brands'
          onSearch={(v) => {
            setSearch(v)
            setPage(1)
          }}
          enterButton
        />
      </Space>

      <Table
        columns={columns}
        dataSource={brands}
        rowKey='id'
        loading={loading}
        pagination={{
          current: page,
          pageSize: limit,
          total,
          onChange: (p, ps) => {
            setPage(p)
            setLimit(ps || limit)
          },
        }}
      />

      <BrandForm
        visible={formVisible}
        onClose={() => setFormVisible(false)}
        onSaved={handleSave}
        brand={editing}
      />
    </Card>
  )
}

export default BrandList
