'use client'

import {useEffect, useState} from 'react'
import {Table, Input, Button, Select, Pagination, Switch, message, Card} from 'antd'
import handleAPI from '../apis/handleAPI'

const {Search} = Input
const {Option} = Select

const FeaturesList: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null)

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res: any = await handleAPI('/api/categories', 'get')
      setCategories(res)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  // Fetch products
  const fetchProducts = async () => {
    try {
      let api = `/api/products?page=${page}&limit=${limit}`
      if (selectedTypeId) api += `&typeId=${selectedTypeId}`
      if (search) api += `&search=${encodeURIComponent(search)}`

      const res = await handleAPI(api, 'get')
      setProducts(res?.data || [])
      setTotal(res?.data?.count || 0)
    } catch (error) {
      console.error('Error fetching Products:', error)
    }
  }

  // Toggle featured
  const toggleFeatured = async (id: number, isFeatured: boolean) => {
    try {
      await handleAPI(`/api/products/${id}/featured`, 'patch', {isFeatured})
      message.success('Cập nhật Featured thành công!')
      fetchProducts()
    } catch (error) {
      console.error('Error updating featured:', error)
      message.error('Có lỗi xảy ra!')
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [page, limit, selectedTypeId, search])

  const columns = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Category',
      dataIndex: 'typeId',
      key: 'typeId',
      render: (val: number) => categories.find((c) => Number(c.id) === Number(val))?.name || 'N/A',
    },
    {
      title: 'Featured',
      dataIndex: 'isFeatured',
      key: 'isFeatured',
      render: (val: boolean, record: any) => (
        <Switch checked={!!val} onChange={(checked) => toggleFeatured(record.id, checked)} />
      ),
    },
  ]

  return (
    <div className='p-6'>
      <Card className='shadow-md rounded-xl'>
        <div className='flex flex-wrap gap-4 mb-4'>
          <Select
            placeholder='Chọn Category'
            allowClear
            style={{width: 200}}
            onChange={(val) => {
              setSelectedTypeId(val || null)
              setPage(1)
            }}
            value={selectedTypeId || undefined}
          >
            {categories.map((cat) => (
              <Option key={cat.id} value={cat.id}>
                {cat.name}
              </Option>
            ))}
          </Select>

          <Search
            placeholder='Tìm sản phẩm...'
            onSearch={(val) => {
              setSearch(val)
              setPage(1)
            }}
            style={{width: 250}}
            allowClear
          />
        </div>

        <Table dataSource={products} columns={columns} rowKey='id' pagination={false} />

        <Pagination
          className='mt-4'
          current={page}
          pageSize={limit}
          total={total}
          onChange={(p, l) => {
            setPage(p)
            setLimit(l)
          }}
          showSizeChanger
        />
      </Card>
    </div>
  )
}
export default FeaturesList
