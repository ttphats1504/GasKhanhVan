import React, {useState, useEffect} from 'react'
import {Table, Button, Popconfirm, message, Input, Card, Row, Col} from 'antd'
import {EditOutlined, DeleteOutlined, PlusOutlined} from '@ant-design/icons'

import handleAPI from '../apis/handleAPI'
import IncentiveForm from './IncentiveForm'
import Incentive from '../models/Incentive'

const fetchIncentiveDatas = async () => {
  const api = '/api/incentives'
  try {
    const res = await handleAPI(api, 'get')
    return res
  } catch (error) {
    console.error('Error fetching Categories:', error)
    return []
  }
}

const IncentiveList: React.FC = () => {
  const [incentives, setIncentives] = useState<Incentive[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [editingIncentive, setEditingIncentive] = useState<Incentive | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  // Fetch data from the backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      const res: any = await fetchIncentiveDatas() // Call the function

      if (res && res.length > 0) {
        setIncentives(res)
      }

      setLoading(false)
    }

    fetchData() // Call the async function inside useEffect
  }, [])

  // Handle delete action
  const handleDelete = async (id: string) => {
    try {
      await handleAPI(`/api/incentives/${id}`, 'delete')

      // Update UI by removing deleted item
      setIncentives((prevIncentives) => prevIncentives.filter((incentive) => incentive.id !== id))

      message.success('Incentive deleted successfully!')
    } catch (error) {
      message.error('Error deleting incentive')
    }
  }

  const handleAddSuccess = (newIncentive: Incentive) => {
    setIncentives((prev) =>
      editingIncentive
        ? prev.map((c) => (c.id === newIncentive.id ? newIncentive : c))
        : [...prev, newIncentive]
    )
    setEditingIncentive(null)
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
      title: 'Order',
      dataIndex: 'order',
      key: 'order',
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
      title: 'Action',
      key: 'action',
      render: (_: any, record: Incentive) => (
        <span>
          <Button
            type='link'
            icon={<EditOutlined />}
            onClick={() => {
              setEditingIncentive(record)
              setModalVisible(true)
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title='Are you sure you want to delete this incentive?'
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
      title='Manage Incentive Items'
      extra={
        <Button
          type='primary'
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingIncentive(null)
            setModalVisible(true)
          }}
        >
          Add New Incentive
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
          <Table<Incentive>
            columns={columns}
            dataSource={incentives}
            loading={loading}
            rowKey='id'
            pagination={{pageSize: 5}}
          />
        </Col>
      </Row>

      <IncentiveForm
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false)
          setEditingIncentive(null)
        }}
        onSuccess={handleAddSuccess}
        incentive={editingIncentive}
      />
    </Card>
  )
}

export default IncentiveList
