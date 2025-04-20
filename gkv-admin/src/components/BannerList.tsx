import React, {useState, useEffect} from 'react'
import {Table, Button, Popconfirm, message, Input, Card, Row, Col} from 'antd'
import {EditOutlined, DeleteOutlined, PlusOutlined} from '@ant-design/icons'

import handleAPI from '../apis/handleAPI'
import BannerForm from './BannerForm'
import Banner from '../models/Banner'

const fetchBannerDatas = async () => {
  const api = '/api/banners'
  try {
    const res = await handleAPI(api, 'get')
    return res
  } catch (error) {
    console.error('Error fetching Banners:', error)
    return []
  }
}

const BannerList: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([])
  const [filteredBanners, setFilteredBanners] = useState<Banner[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>('')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const res: any = await fetchBannerDatas()
      if (res && res.length > 0) {
        setBanners(res)
        setFilteredBanners(res)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      await handleAPI(`/api/banners/${id}`, 'delete')
      const updated = banners.filter((banner) => banner.id !== id)
      setBanners(updated)
      setFilteredBanners(updated)
      message.success('Banner deleted successfully!')
    } catch (error) {
      message.error('Error deleting banner')
    }
  }

  const handleAddSuccess = (newBanner: Banner) => {
    const updated = editingBanner
      ? banners.map((b) => (b.id === newBanner.id ? newBanner : b))
      : [...banners, newBanner]
    setBanners(updated)
    setFilteredBanners(updated)
    setEditingBanner(null)
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    const filtered = banners.filter(
      (b) => b.id.toLowerCase().includes(value.toLowerCase()) || b.order.toString().includes(value)
    )
    setFilteredBanners(filtered)
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (image: string) => (
        <img src={image || ''} alt='banner' style={{width: '50px', height: '50px'}} />
      ),
    },
    {
      title: 'Order',
      dataIndex: 'order',
      key: 'order',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: Banner) => (
        <span>
          <Button
            type='link'
            icon={<EditOutlined />}
            onClick={() => {
              setEditingBanner(record)
              setModalVisible(true)
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title='Are you sure you want to delete this banner?'
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
      title='Manage Banner Items'
      extra={
        <Button
          type='primary'
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingBanner(null)
            setModalVisible(true)
          }}
        >
          Add New Banner
        </Button>
      }
      style={{margin: '20px'}}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Input.Search
            placeholder='Search by ID or Order...'
            style={{marginBottom: '20px', width: '300px'}}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </Col>
        <Col span={24}>
          <Table<Banner>
            columns={columns}
            dataSource={filteredBanners}
            loading={loading}
            rowKey='id'
            pagination={{pageSize: 5}}
          />
        </Col>
      </Row>

      <BannerForm
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false)
          setEditingBanner(null)
        }}
        onSuccess={handleAddSuccess}
        banner={editingBanner}
      />
    </Card>
  )
}

export default BannerList
