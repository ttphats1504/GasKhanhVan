import React, {useEffect, useState} from 'react'
import {Card, Table, Button, Space, Popconfirm, Input, message, Switch} from 'antd'
import {PlusOutlined, EditOutlined, DeleteOutlined} from '@ant-design/icons'
import handleAPI from '../apis/handleAPI'
import Blog from '../models/Blog'
import BlogForm from './BlogForm'

const {Search} = Input

const BlogList: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [total, setTotal] = useState(0)
  const [editing, setEditing] = useState<Blog | null>(null)
  const [formVisible, setFormVisible] = useState(false)
  const [mode, setMode] = useState<'add' | 'edit'>('add') // 👈 thêm mode
  const [search, setSearch] = useState('')

  const fetchData = async () => {
    setLoading(true)
    try {
      const res: any = await handleAPI(
        `/api/blogs?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`,
        'get'
      )
      setBlogs(res?.data || [])
      setTotal(res?.totalItems || 0)
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
      await handleAPI(`/api/blogs/${id}`, 'delete')
      message.success('Deleted')
      fetchData()
    } catch (err) {
      message.error('Delete failed')
    }
  }

  const handleOpenCreate = () => {
    setEditing(null)
    setMode('add') // 👈 set mode add
    setFormVisible(true)
  }

  const handleEdit = (blog: Blog) => {
    setEditing(blog)
    setMode('edit') // 👈 set mode edit
    setFormVisible(true)
  }

  const handleSave = () => {
    fetchData()
  }

  const togglePublished = async (id: number, published: boolean) => {
    try {
      await handleAPI(`/api/blogs/${id}`, 'put', {published})
      message.success('Updated publish status')
      fetchData()
    } catch {
      message.error('Update failed')
    }
  }

  const columns = [
    {title: 'ID', dataIndex: 'id', key: 'id', width: 80},
    {
      title: 'Thumbnail',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      render: (src: string) =>
        src ? <img src={src} style={{height: 48, objectFit: 'cover'}} /> : '—',
    },
    {title: 'Title', dataIndex: 'title', key: 'title'},
    {title: 'Slug', dataIndex: 'slug', key: 'slug'},
    {
      title: 'Published',
      dataIndex: 'published',
      key: 'published',
      render: (val: boolean, record: Blog) => (
        <Switch checked={val} onChange={(checked) => togglePublished(record.id, checked)} />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Blog) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm title='Delete blog?' onConfirm={() => handleDelete(record.id)}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <Card
      title='Manage Blogs'
      extra={
        <Button type='primary' icon={<PlusOutlined />} onClick={handleOpenCreate}>
          Add Blog
        </Button>
      }
    >
      <Space style={{marginBottom: 12}}>
        <Search
          placeholder='Search blogs'
          onSearch={(v) => {
            setSearch(v)
            setPage(1)
          }}
          enterButton
        />
      </Space>

      <Table
        columns={columns}
        dataSource={blogs}
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

      <BlogForm
        visible={formVisible}
        onClose={() => setFormVisible(false)}
        onSuccess={handleSave}
        blog={editing}
        mode={mode} // 👈 truyền xuống form
      />
    </Card>
  )
}

export default BlogList
